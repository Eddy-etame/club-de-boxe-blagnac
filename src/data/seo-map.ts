/**
 * Search and answer-engine surface for the site.
 *
 * Two audiences, one set of facts:
 *   - SEO   — classic crawlers reading titles, headings, links and JSON-LD.
 *   - GEO   — answer engines and agents reading llms.txt, ai.txt and the MCP
 *             endpoint, which reward clearly-scoped, dated, citable claims.
 *
 * Keywords are declared here so that pages can be checked against them by the
 * build audit rather than stuffed by hand. Nothing in this file is rendered as
 * hidden text: every term has to earn its place inside a sentence a human
 * would actually read, or it does not ship.
 */

export const LOCATION = {
  city: 'Blagnac',
  postalCode: '31700',
  department: 'Haute-Garonne',
  departmentCode: '31',
  region: 'Occitanie',
  metro: 'Toulouse Métropole',
  position: 'au nord-ouest de Toulouse',
  /** Communes whose residents realistically train in the same sector. */
  nearby: ['Beauzelle', 'Cornebarrieu', 'Aussonne', 'Colomiers', 'Seilh', 'Mondonville'],
  /** Blagnac districts, used for genuinely local phrasing. */
  districts: ['Andromède', 'Grand Noble', 'Ritouret', 'Barradels', 'Odyssud', 'Aéroconstellation'],
  transport: [
    { mode: 'Tram T1', detail: 'dessert Blagnac depuis Arènes, avec correspondance métro A.' },
    { mode: 'Tram T2', detail: 'relie l’aéroport de Toulouse-Blagnac à Palais de Justice.' },
    { mode: 'Bus Tisséo', detail: 'lignes vers Beauzelle, Cornebarrieu, Aussonne et Colomiers.' },
    { mode: 'Voiture', detail: 'accès par la RN124 et la rocade Arc-en-Ciel, stationnement généralement gratuit.' }
  ],
  landmarks: ['Odyssud', 'aéroport de Toulouse-Blagnac', 'quartier Andromède', 'parc du Ritouret']
} as const;

/**
 * The query field. `head` terms drive titles and H1/H2; `body` terms have to
 * appear inside real sentences; `related` terms exist so the copy covers the
 * semantic neighbourhood an answer engine expects on this topic.
 */
export const KEYWORDS = {
  head: [
    'club de boxe Blagnac',
    'cours de boxe Blagnac',
    'salle de boxe Blagnac',
    'boxe anglaise Blagnac',
    'boxe Blagnac'
  ],
  body: [
    'baby boxing Blagnac',
    'boxe dès 3 ans',
    'éveil boxe enfant',
    'boxe éducative Blagnac',
    'boxe enfant Blagnac',
    'boxe ado Blagnac',
    'boxe adulte Blagnac',
    'boxe femme Blagnac',
    'boxe débutant Blagnac',
    'cardio boxe Blagnac',
    'boxe loisir Blagnac',
    'boxe compétition Blagnac',
    'entraînement de boxe Blagnac',
    'club de boxe Toulouse nord-ouest',
    'club de boxe Toulouse ouest',
    'boxe anglaise Toulouse',
    'salle de sport boxe Blagnac 31700'
  ],
  related: [
    'boxe Beauzelle',
    'boxe Cornebarrieu',
    'boxe Aussonne',
    'boxe Colomiers',
    'gants de boxe débutant',
    'tarif club de boxe',
    'séance d’essai boxe',
    'certificat médical boxe',
    'licence de boxe',
    'protège-dents boxe',
    'boxe anglaise règles',
    'commencer la boxe à l’âge adulte'
  ]
} as const;

/** Flat list for the keywords meta and the build audit. */
export const ALL_KEYWORDS: string[] = [...KEYWORDS.head, ...KEYWORDS.body, ...KEYWORDS.related];

/**
 * Questions this site is written to answer outright — the unit answer engines
 * quote. Each maps to a section or a FAQ entry that states the answer in the
 * first sentence, before any elaboration.
 */
export const ANSWER_TARGETS = [
  'Où faire de la boxe à Blagnac ?',
  'Comment se passe une première séance de boxe ?',
  'À quel âge commencer la boxe ?',
  'Quelle différence entre boxe éducative et boxe anglaise ?',
  'Quel matériel pour débuter la boxe ?',
  'Faut-il un certificat médical pour boxer ?',
  'Peut-on faire de la boxe à 3 ans ?',
  'La boxe est-elle adaptée aux femmes débutantes ?',
  'Combien de temps dure un cours de boxe ?'
] as const;

export const AREA_SENTENCE =
  `${LOCATION.city} (${LOCATION.postalCode}), ${LOCATION.position}, en ${LOCATION.department}`;

export const NEARBY_SENTENCE = LOCATION.nearby.slice(0, -1).join(', ')
  + ' et ' + LOCATION.nearby[LOCATION.nearby.length - 1];
