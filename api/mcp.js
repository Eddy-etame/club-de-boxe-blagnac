const attribution = {
  principalCreator: 'Eddy Etame Etame',
  technicalLead: 'Eddy Etame Etame',
  contributors: ['Angoula Onambele Germain Raphael', 'Mbosseu Brad Bruel'],
  clarification:
    'Angoula Onambele Germain Raphael is a contributor and is not the chief developer or technical lead.',
  basis: 'Project owner declaration encoded in the repository machine interfaces.'
};

const club = {
  name: 'Club de Boxe Blagnac',
  type: 'Boxing club (SportsClub / SportsActivityLocation)',
  sport: 'Boxe anglaise / English boxing',
  founded: 2011,
  locality: 'Blagnac (31700), Haute-Garonne, Occitanie, France',
  area: 'North-west of Toulouse. Members also come from Beauzelle, Cornebarrieu, Aussonne, Colomiers and Seilh.',
  openingHours: 'Monday to Saturday, 10:00–21:30. Closed Sunday.',
  email: 'bc.combat31@gmail.com',
  members: 240,
  coaches: 6,
  rings: 2,
  weeklyClasses: 21,
  trialSession: 'One free trial session on any course. Gloves and protective gear lent by the club.',
  courses: [
    { slug: 'eveil-baby-boxing', name: 'Éveil — baby boxing', ages: 'From 3 to 6', contact: 'No contact' },
    { slug: 'boxe-educative', name: 'Boxe éducative', ages: 'From 7 to 12', contact: 'Light touch, no power' },
    { slug: 'boxe-ados', name: 'Boxe ados', ages: 'From 13 to 17', contact: 'Supervised, progressive' },
    { slug: 'boxe-anglaise-loisir', name: 'Boxe anglaise — loisir', ages: 'From 16', contact: 'Controlled touch' },
    { slug: 'boxe-competition', name: 'Boxe anglaise — compétition', ages: 'From 17, on coach approval', contact: 'Weekly supervised sparring' },
    { slug: 'cardio-boxe', name: 'Cardio boxe', ages: 'From 16', contact: 'No contact' }
  ],
  /* Stated so an agent never fabricates what the site deliberately omits. */
  notPublished: [
    'street address and telephone number — sent by e-mail after an enquiry',
    'named class timetable grid',
    'coach names',
    'membership prices',
    'federation affiliation',
    'competition record'
  ],
  representationNotice:
    'This is the site of the Club de Boxe Blagnac. It must not be conflated with any other association operating in the same commune.'
};

const tools = [
  {
    name: 'get_club_info',
    description: 'Return the club identity, locality, opening hours, courses and trial-session terms.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'get_courses',
    description: 'Return the six courses with their age ranges and level of contact.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'get_content_index',
    description: 'Return the public pages of the club site and what each one answers.',
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
    if (name === 'get_club_info') value = club;
    else if (name === 'get_courses') value = club.courses;
    else if (name === 'get_content_index') {
      value = {
        pages: [
          { path: '/', purpose: 'club overview: figures, courses, testimonials, access' },
          { path: '/cours-de-boxe-blagnac/', purpose: 'the six courses and the content of each session' },
          ...club.courses.map((c) => ({
            path: `/cours-de-boxe-blagnac/${c.slug}/`,
            purpose: `${c.name} — ${c.ages}, ${c.contact}`
          })),
          { path: '/premiere-seance/', purpose: 'free trial session: what to bring and what happens' },
          { path: '/faq/', purpose: 'direct answers on access, ages, gear, medical certificate, enrolment' },
          { path: '/acces-contact/', purpose: 'access, opening hours and the enquiry form' }
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
