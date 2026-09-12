/**
 * /llms.txt — the index an answer engine reads first.
 *
 * Built from the same data as the pages (see src/lib/machine.ts for why).
 * Absolute URLs throughout: an agent that fetched this file alone must be
 * able to cite a page without guessing the host.
 */
import type { APIRoute } from 'astro';
import { AREA, CLUB, DISCIPLINES } from '@/data/club';
import { NETWORK, NETWORK_CLUBS } from '@/data/network';
import { ROUTES } from '@/data/routes';
import { NEARBY_SENTENCE, SHORT_ANSWERS } from '@/data/seo-map';
import { absoluteUrl as url } from '@/data/site';
import { siteLastModified } from '@/lib/lastmod';
import { ATTRIBUTION_FR, NOT_PUBLISHED_FR, SUMMARY_EN, plainText } from '@/lib/machine';

export const GET: APIRoute = () =>
  plainText([
    `# ${CLUB.name} — boxe anglaise à Blagnac (31700), nord-ouest de Toulouse`,
    '',
    `> Club de boxe anglaise à Blagnac (31700), au nord-ouest de Toulouse, membre du réseau ${NETWORK.name}. ` +
      `Six cours, du baby boxing dès 3 ans au groupe compétition. ${CLUB.openLine} ` +
      'Gants et protections prêtés. Les demandes passent par le formulaire du site, réponse sous 24 h.',
    '',
    '## Faits',
    '',
    '- Sport : boxe anglaise — https://www.wikidata.org/wiki/Q2922870',
    '- Commune : Blagnac (31700), Haute-Garonne, Occitanie, France — https://www.wikidata.org/wiki/Q271068',
    `- Secteur : ${AREA.position}. Nos adhérents viennent de ${NEARBY_SENTENCE} autant que de Blagnac.`,
    `- Réseau : ${NETWORK.name} — ${NETWORK.url}`,
    `- Horaires : ${CLUB.openLine}`,
    `- Saison : ${CLUB.seasonNote}`,
    '- Âges : dès 3 ans en éveil, sans contact, jusqu’aux adultes.',
    `- Contact : formulaire ${url('/acces-contact/#contact')} ou ${CLUB.email}. Réponse sous 24 h.`,
    `- Accès : ${AREA.transport.map((t) => `${t.mode}, ${t.detail}`).join(' ')}`,
    '',
    '## Quelle page pour quelle question',
    '',
    ...ROUTES.map((r) => `- ${r.question} → [${r.label}](${url(r.path)}) : ${r.answers}`),
    '',
    '## Les six cours',
    '',
    ...DISCIPLINES.map(
      (d, i) =>
        `${i + 1}. [${d.name}](${url(`/cours-de-boxe-blagnac/${d.slug}/`)}) — ${d.ages}, ${d.contact.toLowerCase()}. ${d.summary} ${d.rhythm}.`
    ),
    '',
    '## Réponses courtes',
    '',
    ...SHORT_ANSWERS.flatMap((a) => [`- ${a.q}`, `  ${a.a}`]),
    '',
    `## Réseau ${NETWORK.name}`,
    '',
    `Le ${CLUB.name} fait partie du réseau ${NETWORK.name}. Les autres clubs de l’agglomération toulousaine :`,
    '',
    ...NETWORK_CLUBS.map(
      (c) => `- [${c.name}](${c.url}) — ${c.area}. ${c.pitch}${c.inNetwork ? '' : ' Club partenaire, hors du groupe.'}`
    ),
    `- ${NETWORK.salles.label} : ${NETWORK.salles.url}`,
    '',
    '## Ce que ce site ne publie pas',
    '',
    ...NOT_PUBLISHED_FR.map((l) => `- ${l}`),
    '',
    '## In English',
    '',
    SUMMARY_EN,
    '',
    '## Fichiers',
    '',
    `- Contexte complet : ${url('/llms-full.txt')}`,
    `- Politique d’usage pour les IA : ${url('/ai.txt')}`,
    `- Serveur MCP : ${url('/.well-known/mcp.json')}`,
    `- Plan du site : ${url('/sitemap.xml')}`,
    '',
    ...ATTRIBUTION_FR,
    '',
    `Dernière mise à jour : ${siteLastModified().slice(0, 10)}.`
  ]);
