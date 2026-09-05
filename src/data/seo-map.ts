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
  'Où se trouve le club de boxe de Blagnac ?',
  'La première séance de boxe est-elle gratuite ?',
  'À quel âge un enfant peut-il commencer la boxe ?',
  'Quels cours de boxe propose le club de Blagnac ?',
  'Quel matériel faut-il pour débuter la boxe ?',
  'Faut-il un certificat médical pour boxer ?',
  'Peut-on faire de la boxe à 3 ans ?',
  'Le club accueille-t-il les femmes débutantes ?',
  'Combien de temps dure un cours de boxe ?'
] as const;

/** Centroid of Blagnac. Describes the territory the content covers — it is
 *  not the location of a business. */
/**
 * Short answers, written to be lifted verbatim.
 *
 * An answer engine extracts a span, not a page. These are that span: each is
 * a complete, self-contained sentence that answers its question without
 * needing the surrounding paragraph, and every one is rendered visibly on the
 * site — nothing here is hidden text. The FAQ elaborates; this states.
 */
export const SHORT_ANSWERS: { q: string; a: string }[] = [
  {
    q: 'Où se trouve le Club de Boxe Blagnac ?',
    a: 'À Blagnac (31700), au nord-ouest de Toulouse, desservi par le tram T1 et les lignes de bus Tisséo depuis Beauzelle, Cornebarrieu, Aussonne et Colomiers.'
  },
  {
    q: 'À partir de quel âge peut-on s’inscrire ?',
    a: 'Dès 3 ans en séance d’éveil, dite baby boxing, qui se pratique sans aucun contact. La boxe éducative en touche légère prend le relais à 7 ans, et le groupe ados à 13 ans.'
  },
  {
    q: 'La première séance est-elle gratuite ?',
    a: 'Oui. Une séance d’essai gratuite sur le cours de votre choix, gants et protections prêtés par le club. Prévenez-nous avant de venir pour que le matériel soit préparé à votre taille.'
  },
  {
    q: 'Combien de cours par semaine propose le club ?',
    a: 'Vingt et un créneaux par semaine répartis sur six cours, du lundi au samedi de 10h à 21h30. Le club est fermé le dimanche.'
  },
  {
    q: 'Faut-il un certificat médical ?',
    a: 'Oui, un certificat de non-contre-indication à la pratique de la boxe de moins d’un an, à remettre à l’inscription. Le groupe compétition demande un examen plus complet chaque saison.'
  },
  {
    q: 'Le club accueille-t-il les femmes et les débutants ?',
    a: 'Oui, sur tous les cours et sans créneau séparé : un tiers de nos adhérents sont des adhérentes, et la majorité de nos inscrits n’avaient jamais mis un gant avant d’arriver.'
  }
];

export const GEO = { lat: '43.6353', lon: '1.3897' } as const;

export const AREA_SENTENCE =
  `${LOCATION.city} (${LOCATION.postalCode}), ${LOCATION.position}, en ${LOCATION.department}`;

export const NEARBY_SENTENCE = LOCATION.nearby.slice(0, -1).join(', ')
  + ' et ' + LOCATION.nearby[LOCATION.nearby.length - 1];
