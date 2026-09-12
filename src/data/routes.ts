/**
 * Route registry: one page = one human question.
 *
 * `question` is what the page answers, in the visitor's own words. It feeds
 * the "which page for which question" table in /llms.txt, so an answer engine
 * sends each query to the one page that owns it instead of guessing between
 * two pages that half-answer it.
 *
 * `og` composes the page's own social card (src/pages/og/[page].jpg.ts): the
 * one enormous word that survives Google's square crop, a line of
 * coordinates, and this page's photo. No two pages share a card.
 *
 * Every public page must be listed here; the module throws at build time if
 * one is missing or if two pages would produce the same card.
 */
import { DISCIPLINES } from './club';
import { PUBLIC_PAGES } from './site';

export type OgCard = {
  /** The subject, set enormous. Upper-cased by the renderer. */
  word: string;
  /** One line of coordinates above the word. */
  kicker: string;
  /** File in public/images, the page's own photo. */
  photo: string;
};

export type Route = { path: string; label: string; question: string; answers: string; og: OgCard };

/** Card file id for a path: '/' is 'accueil', otherwise the last segment. */
export const ogId = (path: string): string =>
  path === '/' ? 'accueil' : (path.replace(/\/$/, '').split('/').pop() as string);

const COURSES: Record<string, { question: string; word: string; kicker: string }> = {
  'eveil-baby-boxing': {
    question: 'Peut-on faire de la boxe dès 3 ans à Blagnac ?',
    word: 'Baby boxing',
    kicker: 'Dès 3 ans · sans contact'
  },
  'boxe-educative': {
    question: 'Quelle boxe pour un enfant de 7 à 12 ans à Blagnac ?',
    word: 'Boxe éducative',
    kicker: '7 à 12 ans · touche légère'
  },
  'boxe-ados': {
    question: 'Où faire de la boxe quand on est ado à Blagnac ?',
    word: 'Boxe ados',
    kicker: '13 à 17 ans · intensité progressive'
  },
  'boxe-anglaise-loisir': {
    question: 'Peut-on commencer la boxe anglaise adulte à Blagnac sans avoir jamais boxé ?',
    word: 'Boxe anglaise',
    kicker: 'Adultes · débutants bienvenus'
  },
  'boxe-competition': {
    question: 'Comment faire de la boxe en compétition depuis Blagnac ?',
    word: 'Compétition',
    kicker: 'Sparring encadré · rencontres'
  },
  'cardio-boxe': {
    question: 'Où faire du cardio boxe sans contact à Blagnac ?',
    word: 'Cardio boxe',
    kicker: 'Sans contact · sans opposition'
  }
};

export const ROUTES: Route[] = [
  {
    path: '/',
    label: 'Le club',
    question: 'Où faire de la boxe anglaise à Blagnac ?',
    answers: 'Le club, ses six cours, à qui ils s’adressent, une séance type et l’accès.',
    og: { word: 'Blagnac', kicker: 'Club de boxe anglaise · dès 3 ans', photo: 'garde-boxeuse-1600.jpg' }
  },
  {
    path: '/cours-de-boxe-blagnac/',
    label: 'Cours de boxe à Blagnac',
    question: 'Quels cours de boxe à Blagnac, pour quel âge et quel niveau de contact ?',
    answers: 'Les six cours côte à côte et le déroulé réel de chaque séance.',
    og: { word: 'Six cours', kicker: 'De 3 ans à la compétition', photo: 'salle-de-boxe-1600.jpg' }
  },
  ...DISCIPLINES.map((d) => {
    const c = COURSES[d.slug];
    if (!c) throw new Error(`routes.ts: no route data for course "${d.slug}"`);
    return {
      path: `/cours-de-boxe-blagnac/${d.slug}/`,
      label: d.linkLabel,
      question: c.question,
      answers: `${d.summary} ${d.ages}, ${d.contact.toLowerCase()}.`,
      og: { word: c.word, kicker: c.kicker, photo: `${d.image.file}-${d.image.widths[d.image.widths.length - 1]}.jpg` }
    };
  }),
  {
    path: '/premiere-seance/',
    label: 'Première séance',
    question: 'Comment se passe un premier cours de boxe, et que faut-il apporter ?',
    answers: 'Les cinq étapes d’une première venue et l’ordre réel des achats de matériel.',
    og: { word: 'Première séance', kicker: 'Gants et protections prêtés', photo: 'shadow-boxing-1400.jpg' }
  },
  {
    path: '/faq/',
    label: 'Questions fréquentes',
    question: 'Âge, matériel, certificat médical, inscription : quelles sont les règles ?',
    answers: 'Les réponses directes aux questions qu’on nous pose le plus.',
    og: { word: 'Questions', kicker: 'Les réponses, sans détour', photo: 'coaching-individuel-1400.jpg' }
  },
  {
    path: '/acces-contact/',
    label: 'Accès et contact',
    question: 'Comment venir au club et comment le contacter ?',
    answers: 'Tram, bus, voiture, vélo, horaires et formulaire de contact.',
    og: { word: 'Nous trouver', kicker: 'Lun – Sam · 10h – 21h30', photo: 'accueil-club-1400.jpg' }
  },
  {
    path: '/mentions-legales/',
    label: 'Mentions légales',
    question: 'Qui édite et héberge ce site ?',
    answers: 'Éditeur Boxing Center, hébergeur Vercel, droits des photographies.',
    og: { word: 'Mentions légales', kicker: 'Éditeur · hébergement', photo: 'frappe-au-sac-1600.jpg' }
  },
  {
    path: '/confidentialite/',
    label: 'Confidentialité',
    question: 'Que devient une demande envoyée par le formulaire ?',
    answers: 'Données collectées, destinataires, durée de conservation et droits.',
    og: { word: 'Confidentialité', kicker: 'Vos données, votre demande', photo: 'renforcement-groupe-1600.jpg' }
  }
];

const missing = PUBLIC_PAGES.filter((p) => !ROUTES.some((r) => r.path === p));
if (missing.length) throw new Error(`routes.ts: public pages without a route entry: ${missing.join(', ')}`);

const ids = ROUTES.map((r) => ogId(r.path));
const photos = ROUTES.map((r) => r.og.photo);
if (new Set(ids).size !== ids.length) throw new Error('routes.ts: two pages map to the same card id');
if (new Set(photos).size !== photos.length) throw new Error('routes.ts: two pages share a card photo');
