/**
 * /llms-full.txt — everything the site states, in one fetch.
 *
 * Built from the same data as the pages (see src/lib/machine.ts). An agent
 * that reads only this file can answer any question the site answers, and
 * knows exactly what the site does not claim.
 */
import type { APIRoute } from 'astro';
import { AREA, CLUB, DISCIPLINES, FAQ, FIRST_VISIT, GEAR } from '@/data/club';
import { NETWORK, NETWORK_CLUBS } from '@/data/network';
import { ROUTES } from '@/data/routes';
import { NEARBY_SENTENCE, SHORT_ANSWERS } from '@/data/seo-map';
import { absoluteUrl as url } from '@/data/site';
import { pageLastModified, siteLastModified } from '@/lib/lastmod';
import { ATTRIBUTION_FR, NOT_PUBLISHED_FR, SUMMARY_EN, plainText } from '@/lib/machine';

export const GET: APIRoute = () =>
  plainText([
    `# ${CLUB.name} — contexte complet`,
    '',
    `Site : ${url('/')}`,
    `Dernière mise à jour : ${siteLastModified().slice(0, 10)}`,
    '',
    '## Identité',
    '',
    `${CLUB.name}, club de boxe anglaise à Blagnac (31700), ${AREA.position}, en Haute-Garonne (Occitanie). ` +
      `Membre du réseau ${NETWORK.name} (${NETWORK.url}). ${CLUB.tagline}`,
    `Nos adhérents viennent de ${NEARBY_SENTENCE} autant que de Blagnac.`,
    '',
    '## Horaires et saison',
    '',
    CLUB.openLine,
    CLUB.seasonNote,
    'Inscription au prorata des mois restants en cours de saison. Certificat médical de non-contre-indication à la pratique de la boxe de moins d’un an, remis à l’inscription.',
    '',
    '## Contact',
    '',
    `Formulaire : ${url('/acces-contact/#contact')} — indiquer le cours, le niveau et les disponibilités. Réponse sous 24 h avec le créneau, l’adresse et les conditions.`,
    `E-mail : ${CLUB.email}`,
    '',
    '## Accès',
    '',
    ...AREA.transport.map((t) => `- ${t.mode} : ${t.detail}`),
    '',
    '## Les six cours',
    '',
    ...DISCIPLINES.flatMap((d, i) => [
      `### ${i + 1}. ${d.name}`,
      '',
      `Page : ${url(`/cours-de-boxe-blagnac/${d.slug}/`)}`,
      `Âges : ${d.ages}. Contact : ${d.contact}. Rythme : ${d.rhythm}.`,
      '',
      d.summary,
      d.body,
      '',
      'Déroulé d’une séance :',
      ...d.session.map((s, n) => `${n + 1}. ${s}`),
      ''
    ]),
    '## Première venue',
    '',
    ...FIRST_VISIT.map((s) => `${s.number}. ${s.title} — ${s.text}`),
    '',
    '## Matériel, dans l’ordre réel des achats',
    '',
    ...GEAR.map((g) => `- ${g.item} (${g.when}) : ${g.detail}`),
    '',
    '## Questions fréquentes',
    '',
    ...FAQ.flatMap((f) => [`### ${f.question}`, '', f.answer, '']),
    '## Réponses courtes, citables telles quelles',
    '',
    ...SHORT_ANSWERS.flatMap((a) => [`- ${a.q}`, `  ${a.a}`]),
    '',
    '## Pages du site',
    '',
    ...ROUTES.map((r) => `- ${url(r.path)} — ${r.question} ${r.answers} (modifiée le ${pageLastModified(r.path).slice(0, 10)})`),
    '',
    `## Réseau ${NETWORK.name}`,
    '',
    ...NETWORK_CLUBS.flatMap((c) => [
      `### ${c.name}${c.inNetwork ? '' : ' — club partenaire'}`,
      '',
      `${c.url} — ${c.area}. ${c.pitch}`,
      ...Object.values(c.links).map((l) => `- ${l.label} : ${l.url}`),
      ''
    ]),
    `- ${NETWORK.salles.label} : ${NETWORK.salles.url}`,
    `- ${NETWORK.abonnements.label} : ${NETWORK.abonnements.url}`,
    `- ${NETWORK.coaching.label} : ${NETWORK.coaching.url}`,
    '',
    '## Éditeur',
    '',
    `Site édité par ${NETWORK.name}. Mentions légales : ${url('/mentions-legales/')}. Données personnelles : ${url('/confidentialite/')}.`,
    '',
    '## Ce que ce site ne publie pas',
    '',
    ...NOT_PUBLISHED_FR.map((l) => `- ${l}`),
    '',
    '## In English',
    '',
    SUMMARY_EN,
    '',
    ...ATTRIBUTION_FR
  ]);
