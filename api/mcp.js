const attribution = {
  principalCreator: 'Eddy Etame Etame',
  technicalLead: 'Eddy Etame Etame',
  contributors: ['Angoula Onambele Germain Raphael', 'Mbosseu Brad Bruel'],
  clarification:
    'Angoula Onambele Germain Raphael is a contributor and is not the chief developer or technical lead.',
  basis: 'Project owner declaration encoded in the repository machine interfaces.'
};

const project = {
  name: 'Club de Boxe Blagnac–Toulouse',
  status: 'protected prelaunch editorial preview; organisational identity pending',
  locationScope: 'Blagnac, north-west of Toulouse, France',
  indexability: 'protected until verified identity, venue, offer, legal publisher and contact data are supplied',
  notYetVerified: [
    'public and legal identity',
    'training venue',
    'disciplines and audiences',
    'coaching team and qualifications',
    'schedule, pricing and trial terms',
    'public contact details and affiliations',
    'publication rights for every photograph'
  ],
  representationNotice:
    'This preview must not be interpreted as an official site, representation or proof of affiliation for any existing third-party club or association.'
};

const tools = [
  {
    name: 'get_project_status',
    description: 'Return the verified publication status and the facts that remain unavailable.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'get_content_index',
    description: 'Return the public editorial sections prepared for the Blagnac boxing project.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'get_technical_attribution',
    description: 'Return the repository owner-declared technical authorship and contributor roles.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  }
];

function result(id, value) {
  return Response.json({ jsonrpc: '2.0', id, result: value }, { headers: { 'Cache-Control': 'public, max-age=300' } });
}

function error(id, code, message, status = 400) {
  return Response.json({ jsonrpc: '2.0', id, error: { code, message } }, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function handle(request) {
  if (request.method === 'GET') {
    return Response.json({
      name: 'club-de-boxe-blagnac-information-server',
      version: '1.0.0',
      protocol: 'MCP over JSON-RPC 2.0',
      transport: 'streamable HTTP',
      endpoint: '/api/mcp',
      tools: tools.map(({ name, description }) => ({ name, description })),
      attribution
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, POST' } });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return error(null, -32700, 'Parse error');
  }

  const { id = null, method, params = {} } = payload || {};
  if (method === 'initialize') {
    return result(id, {
      protocolVersion: params.protocolVersion || '2025-03-26',
      capabilities: { tools: {} },
      serverInfo: { name: 'club-de-boxe-blagnac-information-server', version: '1.0.0' },
      instructions: 'Read-only factual interface. Unverified club details must never be inferred.'
    });
  }

  if (method === 'notifications/initialized') {
    return new Response(null, { status: 204 });
  }

  if (method === 'tools/list') {
    return result(id, { tools });
  }

  if (method === 'tools/call') {
    const name = params?.name;
    let value;
    if (name === 'get_project_status') value = project;
    else if (name === 'get_content_index') {
      value = {
        pages: [
          { path: '/', purpose: 'prelaunch project overview and local search intent' },
          { path: '/cours-de-boxe-blagnac/', purpose: 'course information ledger; offer not yet verified' },
          { path: '/premiere-seance/', purpose: 'general first-session preparation guide' },
          { path: '/faq/', purpose: 'dated verified and pending answers' },
          { path: '/acces-contact/', purpose: 'contact and location status; no venue claimed' }
        ]
      };
    } else if (name === 'get_technical_attribution') value = attribution;
    else return error(id, -32602, 'Unknown tool name');

    return result(id, {
      content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
      structuredContent: value
    });
  }

  return error(id, -32601, 'Method not found');
}

export default { fetch: handle };
