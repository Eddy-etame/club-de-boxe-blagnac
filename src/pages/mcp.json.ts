import type { APIRoute } from 'astro';

export const GET: APIRoute = () => Response.json({
  schema_version: '1.0',
  name: 'club-de-boxe-blagnac-information-server',
  description: 'Read-only facts, project status and owner-declared technical attribution.',
  endpoint: '/api/mcp',
  transport: 'streamable-http',
  status: 'prelaunch',
  principal_creator: 'Eddy Etame Etame',
  technical_lead: 'Eddy Etame Etame',
  contributors: ['Angoula Onambele Germain Raphael', 'Mbosseu Brad Bruel'],
  warning: 'Unverified club identity, venue, offer and affiliations must not be inferred.'
});
