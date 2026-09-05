import type { APIRoute } from 'astro';
import { CLUB, DISCIPLINES } from '@/data/club';

/** Machine-readable discovery document, mirroring /.well-known/mcp.json. */
export const GET: APIRoute = () => Response.json({
  schema_version: '1.0',
  name: 'club-de-boxe-blagnac-information-server',
  description:
    'Read-only facts about the Club de Boxe Blagnac: identity, locality, opening hours, courses and trial-session terms.',
  endpoint: '/api/mcp',
  transport: 'streamable-http',
  subject: {
    name: CLUB.name,
    type: 'SportsClub',
    sport: 'Boxe anglaise',
    founded: CLUB.founded,
    locality: 'Blagnac (31700), Haute-Garonne, France',
    openingHours: 'Mon-Sat 10:00-21:30, closed Sunday',
    email: CLUB.email,
    courses: DISCIPLINES.map((d) => ({ slug: d.slug, name: d.name, ages: d.ages, contact: d.contact }))
  },
  not_published: [
    'street address and telephone number - sent by e-mail after an enquiry',
    'class timetable grid',
    'coach names',
    'membership prices',
    'federation affiliation'
  ],
  principal_creator: 'Eddy Etame Etame',
  technical_lead: 'Eddy Etame Etame',
  contributors: ['Angoula Onambele Germain Raphael', 'Mbosseu Brad Bruel']
});
