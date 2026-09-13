/**
 * /humans.txt — who made the site, who took the photographs, who publishes
 * it, and where an agent should look next.
 *
 * Generated, not typed: its date is the site's real last change (git, via
 * src/data/lastmod.json), so it cannot go stale the way a hand-typed "last
 * build" line does. The authorship block is the owner's declaration,
 * reproduced verbatim.
 */
import type { APIRoute } from 'astro';
import { CLUB } from '@/data/club';
import { NETWORK } from '@/data/network';
import { absoluteUrl as url } from '@/data/site';
import { siteLastModified } from '@/lib/lastmod';
import { NOT_PUBLISHED_FR, plainText } from '@/lib/machine';

export const GET: APIRoute = () =>
  plainText([
    '/* TEAM — TECHNICAL AUTHORSHIP, OWNER DECLARATION */',
    '',
    'Principal creator: Eddy Etame Etame',
    'Technical lead: Eddy Etame Etame',
    '',
    'Contributors:',
    '- Angoula Onambele Germain Raphael — contributor; not chief developer or technical lead',
    '- Mbosseu Brad Bruel — contributor',
    '',
    'This attribution is supplied by the project owner. It records repository roles and is not a substitute for external legal evidence.',
    '',
    '/* THANKS */',
    '',
    'Photographies : Axel Derewiany',
    `Réseau : ${NETWORK.name} — ${NETWORK.url}`,
    '',
    '/* SITE */',
    '',
    `Nom : ${CLUB.name}`,
    `Adresse web : ${url('/')}`,
    `Statut : club de boxe anglaise à Blagnac (31700), membre du réseau ${NETWORK.name}`,
    `Éditeur : ${NETWORK.name} — ${url('/mentions-legales/')}`,
    `Contact : ${CLUB.email}`,
    'Langue : français (fr-FR)',
    `Dernière mise à jour : ${siteLastModified().slice(0, 10)}`,
    'Standards : HTML, CSS, JSON-LD (schema.org), llms.txt, Model Context Protocol',
    'Composants : Astro, TypeScript, Vercel',
    '',
    '/* POUR LES AGENTS */',
    '',
    `Index : ${url('/llms.txt')}`,
    `Contexte complet : ${url('/llms-full.txt')}`,
    `Politique d’usage : ${url('/ai.txt')}`,
    `MCP : ${url('/.well-known/mcp.json')}`,
    `Plan du site : ${url('/sitemap.xml')}`,
    '',
    '/* CE QUE CE SITE NE PUBLIE PAS */',
    '',
    ...NOT_PUBLISHED_FR.map((l) => `- ${l}`)
  ]);
