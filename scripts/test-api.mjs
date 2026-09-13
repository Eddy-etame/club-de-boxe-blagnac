/**
 * MCP contract tests: the transport rules first (what a hostile or sloppy
 * client meets), then the six read-only tools and the data they return.
 */
import mcp from '../api/mcp.js';
import card from '../api/_card.js';

const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const BASE = 'https://example.test/api/mcp/';
const H = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
const post = (body, headers = H) =>
  mcp.fetch(new Request(BASE, { method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body) }));
const rpc = async (method, params = {}, id = 1) => (await post({ jsonrpc: '2.0', id, method, params })).json();
const PING = { jsonrpc: '2.0', id: 1, method: 'ping' };

/* Transport contract. */
expect((await mcp.fetch(new Request(BASE))).status === 405, 'GET must be 405: this server opens no SSE stream.');
expect((await post(PING, { 'Content-Type': 'text/plain', Accept: 'application/json' })).status === 415, 'a non-JSON Content-Type must be 415.');
expect((await post(PING, { 'Content-Type': 'application/json', Accept: 'text/html' })).status === 406, 'an Accept without JSON must be 406.');
expect((await post(PING, { ...H, Origin: 'https://evil.example' })).status === 403, 'a foreign Origin must be 403.');
expect((await post(PING, { ...H, Origin: card.site })).status === 200, 'the site origin must be accepted.');
expect((await post(PING, { ...H, 'MCP-Protocol-Version': '1999-01-01' })).status === 400, 'an unknown MCP-Protocol-Version must be 400.');
expect((await post('[{"jsonrpc":"2.0","id":1,"method":"ping"}]')).status === 400, 'batches must be refused.');
expect((await post('{')).status === 400, 'invalid JSON must be 400.');
expect((await post({ jsonrpc: '2.0', method: 'notifications/initialized' })).status === 202, 'a notification must be 202.');
expect((await post('x'.repeat(70 * 1024))).status === 413, 'a body over 64 KB must be 413.');

/* Handshake and version negotiation. */
const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '0' } });
expect(init.result?.protocolVersion === '2025-06-18', 'initialize must keep a supported requested version.');
expect(init.result?.serverInfo?.websiteUrl === card.site, 'serverInfo must name the site.');
const fallback = await rpc('initialize', { protocolVersion: '1999-01-01' });
expect(fallback.result?.protocolVersion === '2025-06-18', 'initialize must fall back to the latest supported version.');

/* Tools. */
const tools = (await rpc('tools/list')).result?.tools || [];
expect(tools.length === 6, 'tools/list must expose six tools, found ' + tools.length + '.');
expect(tools.every((t) => t.title && t.annotations?.readOnlyHint === true && t.inputSchema?.additionalProperties === false), 'every tool must be titled, read-only and argument-free.');

const call = async (name, args = {}) => (await rpc('tools/call', { name, arguments: args })).result?.structuredContent;
const info = await call('get_club_info');
expect(info?.name === 'Club de Boxe Blagnac' && info?.network?.name === 'Boxing Center', 'get_club_info must describe the club and its network.');
expect(!/prelaunch|not yet verified|pending|founded|2011|gratuit/i.test(JSON.stringify(info)), 'club info must carry no prelaunch language, invented founding year or free-session claim.');
expect((await call('get_courses'))?.items?.length === 6, 'get_courses must return the six courses.');
const network = (await call('get_network'))?.items || [];
expect(network.length === card.facts.network.length && network.length >= 6, 'get_network must return every club of the site data.');
expect(((await call('get_content_index'))?.items || []).length === card.facts.pages.length, 'get_content_index must list every route.');
expect(((await call('get_not_published'))?.items || []).length > 0, 'get_not_published must say what the site does not publish.');
expect((await call('get_technical_attribution'))?.technicalLead === 'Eddy Etame Etame', 'technical lead attribution mismatch.');

expect((await rpc('tools/call', { name: 'get_courses', arguments: { x: 1 } })).error?.code === -32602, 'arguments on an argument-less tool must be -32602.');
expect((await rpc('tools/call', { name: 'nope' })).error?.code === -32602, 'an unknown tool must be -32602.');
expect((await rpc('nope')).error?.code === -32601, 'an unknown method must be -32601.');

if (failures.length) {
  console.error(`MCP tests failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('MCP tests passed: transport contract (405/415/406/403/400/413/202), version negotiation, six read-only tools on site data.');
