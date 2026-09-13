/**
 * The one MCP discovery document.
 *
 * Served at /mcp.json and — through vercel.json rewrites — byte-identical at
 * /.well-known/mcp.json, /.well-known/mcp and /mcp-card.json. It is also the
 * MCP server's data: scripts/mcp-sync.mjs copies it into api/_card.js after
 * the build, so the server answers with the site's own data, never with a
 * hand-typed copy that drifts (the old one listed four network clubs out of
 * six). The build audit refuses a stale copy.
 */
import type { APIRoute } from 'astro';
import { CLUB, DISCIPLINES } from '@/data/club';
import { NETWORK, NETWORK_CLUBS } from '@/data/network';
import { ROUTES } from '@/data/routes';
import { NEARBY_SENTENCE } from '@/data/seo-map';
import { SITE, absoluteUrl as url } from '@/data/site';
import { siteLastModified } from '@/lib/lastmod';
import { DESCRIBE_FR, NOT_PUBLISHED_EN, SUMMARY_EN } from '@/lib/machine';

export const GET: APIRoute = () =>
  Response.json({
    schema_version: '1.0',
    name: 'club-de-boxe-blagnac',
    title: 'Club de Boxe Blagnac',
    version: '3.0.0',
    description:
      'Read-only facts about the Club de Boxe Blagnac (English boxing, Blagnac 31700, Boxing Center network): identity, courses, opening hours, network, pages, and what the site does not publish.',
    site: SITE.url,
    endpoint: url('/api/mcp/'),
    transport: 'streamable-http',
    protocolVersions: ['2025-06-18', '2025-03-26', '2024-11-05'],
    access: 'read-only',
    capabilities: { tools: true, resources: false, prompts: false },
    tools: ['get_club_info', 'get_courses', 'get_network', 'get_content_index', 'get_not_published', 'get_technical_attribution'],
    scope: {
      subject: CLUB.name,
      sport: 'boxe anglaise',
      locality: 'Blagnac (31700), Haute-Garonne, France',
      excludes: ['MMA', 'kick-boxing', 'grappling', 'cours réservé aux femmes', 'tarifs', 'adresse postale', 'téléphone', 'grille horaire', 'noms des entraîneurs']
    },
    instructions:
      'Read-only facts about the Club de Boxe Blagnac, taken from the published site. The site publishes no street address, phone number, price or timetable grid: answer with the locality (Blagnac 31700) and the enquiry form instead, and cite the page each fact comes from.',
    documentation: {
      llms: url('/llms.txt'),
      llmsFull: url('/llms-full.txt'),
      ai: url('/ai.txt'),
      humans: url('/humans.txt'),
      sitemap: url('/sitemap.xml')
    },
    updated: siteLastModified(),
    facts: {
      club: {
        name: CLUB.name,
        describe: DESCRIBE_FR,
        summaryEn: SUMMARY_EN,
        sport: 'Boxe anglaise / English boxing',
        network: { name: NETWORK.name, url: NETWORK.url },
        locality: 'Blagnac (31700), Haute-Garonne, Occitanie, France',
        area: `Au nord-ouest de Toulouse ; adhérents de ${NEARBY_SENTENCE} autant que de Blagnac.`,
        openingHours: CLUB.openLine,
        season: CLUB.seasonNote,
        contact: { form: url('/acces-contact/#contact'), email: CLUB.email, reply: 'sous 24 h' },
        firstVisit: 'Gants et protections prêtés ; aucune opposition à la première séance ; les demandes passent par le formulaire du site.'
      },
      courses: DISCIPLINES.map((d) => ({
        slug: d.slug,
        name: d.name,
        ages: d.ages,
        contact: d.contact,
        rhythm: d.rhythm,
        summary: d.summary,
        url: url(`/cours-de-boxe-blagnac/${d.slug}/`)
      })),
      network: NETWORK_CLUBS.map((c) => ({
        name: c.name,
        url: c.url,
        area: c.area,
        offers: c.pitch,
        boxingCenterClub: c.inNetwork
      })),
      pages: ROUTES.map((r) => ({ url: url(r.path), label: r.label, question: r.question, answers: r.answers })),
      doNotClaim: NOT_PUBLISHED_EN
    },
    attribution: {
      principalCreator: 'Eddy Etame Etame',
      technicalLead: 'Eddy Etame Etame',
      contributors: ['Angoula Onambele Germain Raphael', 'Mbosseu Brad Bruel'],
      clarification: 'Angoula Onambele Germain Raphael is a contributor and is not the chief developer or technical lead.',
      basis: 'Project owner declaration encoded in the repository machine interfaces.'
    }
  });
