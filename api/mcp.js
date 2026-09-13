/**
 * MCP server for the Club de Boxe Blagnac — streamable HTTP, JSON responses.
 *
 * Read-only. No fact is typed in this file: they come from api/_card.js,
 * which scripts/mcp-sync.mjs copies from the built /mcp.json (itself
 * generated from src/data). The server cannot drift from the site.
 *
 * Transport contract (MCP 2025-06-18, streamable HTTP):
 *  - POST only; GET → 405, because this server opens no SSE stream;
 *  - Content-Type must be application/json (415), Accept must allow JSON (406);
 *  - a foreign Origin is refused (403): DNS-rebinding protection;
 *  - MCP-Protocol-Version, when sent, must be a version we speak (400);
 *  - batches are refused (removed in 2025-06-18); notifications → 202;
 *  - bodies over 64 KB → 413.
 */
import card from './_card.js';

const SUPPORTED = ['2025-06-18', '2025-03-26', '2024-11-05'];
const ORIGINS = new Set([card.site, card.site.replace('://www.', '://')]);
const MAX_BODY = 64 * 1024;
const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex'
};

const NO_ARGS = { type: 'object', properties: {}, additionalProperties: false };
const READ_ONLY = { readOnlyHint: true, idempotentHint: true, destructiveHint: false, openWorldHint: false };

const TOOLS = [
  {
    name: 'get_club_info',
    title: 'Le club',
    description: 'Identity, locality, network, opening hours, contact route and first-visit terms of the Club de Boxe Blagnac.',
    value: () => card.facts.club
  },
  {
    name: 'get_courses',
    title: 'Les six cours',
    description: 'The six courses with age range, level of contact, weekly rhythm and page URL.',
    value: () => card.facts.courses
  },
  {
    name: 'get_network',
    title: 'Le réseau Boxing Center',
    description: 'The other Boxing Center clubs and the partner club, with what each offers and its URL — where to send MMA, kick-boxing or women-only questions.',
    value: () => card.facts.network
  },
  {
    name: 'get_content_index',
    title: 'Les pages du site',
    description: 'Every public page of the site with the question it answers and its URL.',
    value: () => card.facts.pages
  },
  {
    name: 'get_not_published',
    title: 'Ce que le site ne publie pas',
    description: 'What the site deliberately does not publish (street address, phone, prices, timetable grid, coach names), so an agent never invents it.',
    value: () => card.facts.doNotClaim
  },
  {
    name: 'get_technical_attribution',
    title: 'Attribution technique',
    description: 'Owner-declared technical authorship and contributor roles of the site.',
    value: () => card.attribution
  }
].map((tool) => ({ ...tool, inputSchema: NO_ARGS, annotations: READ_ONLY }));

const send = (body, status = 200, extra = {}) =>
  new Response(body === null ? null : JSON.stringify(body), { status, headers: { ...HEADERS, ...extra } });
const ok = (id, result) => send({ jsonrpc: '2.0', id, result });
const fail = (id, code, message, status = 200) => send({ jsonrpc: '2.0', id, error: { code, message } }, status);

async function handle(request) {
  if (request.method !== 'POST') {
    return send({ error: 'POST only. Discovery document: ' + card.site + '/.well-known/mcp.json' }, 405, { Allow: 'POST' });
  }

  const origin = request.headers.get('origin');
  if (origin && !ORIGINS.has(origin)) return fail(null, -32600, 'Origin not allowed', 403);

  const type = (request.headers.get('content-type') || '').toLowerCase();
  if (!type.includes('application/json')) return fail(null, -32600, 'Content-Type must be application/json', 415);

  const accept = (request.headers.get('accept') || '*/*').toLowerCase();
  if (!/application\/json|application\/\*|\*\/\*/.test(accept)) return fail(null, -32600, 'Accept must allow application/json', 406);

  const version = request.headers.get('mcp-protocol-version');
  if (version && !SUPPORTED.includes(version)) return fail(null, -32600, 'Unsupported MCP-Protocol-Version: ' + version, 400);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return fail(null, -32600, 'Request too large', 413);

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return fail(null, -32700, 'Parse error', 400);
  }
  if (Array.isArray(payload)) return fail(null, -32600, 'Batch requests are not supported', 400);
  if (!payload || payload.jsonrpc !== '2.0' || typeof payload.method !== 'string') {
    return fail(payload?.id ?? null, -32600, 'Invalid request', 400);
  }

  const { id, method, params = {} } = payload;
  if (id === undefined || id === null) return new Response(null, { status: 202, headers: { 'Cache-Control': 'no-store' } });

  if (method === 'initialize') {
    const asked = params?.protocolVersion;
    return ok(id, {
      protocolVersion: SUPPORTED.includes(asked) ? asked : SUPPORTED[0],
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: card.name, title: card.title, version: card.version, websiteUrl: card.site },
      instructions: card.instructions
    });
  }
  if (method === 'ping') return ok(id, {});
  if (method === 'tools/list') return ok(id, { tools: TOOLS.map(({ value, ...tool }) => tool) });
  if (method === 'tools/call') {
    const tool = TOOLS.find((t) => t.name === params?.name);
    if (!tool) return fail(id, -32602, 'Unknown tool: ' + params?.name);
    const args = params?.arguments ?? {};
    if (typeof args !== 'object' || Array.isArray(args) || Object.keys(args).length > 0) {
      return fail(id, -32602, 'This tool takes no arguments');
    }
    const value = tool.value();
    return ok(id, {
      content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
      structuredContent: Array.isArray(value) ? { items: value } : value,
      isError: false
    });
  }
  return fail(id, -32601, 'Method not found: ' + method);
}

export default { fetch: handle };
