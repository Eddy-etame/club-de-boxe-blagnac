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
  transport: [
    { mode: 'Tram T1', detail: 'dessert Blagnac depuis Arènes, avec correspondance métro A.' },
    { mode: 'Tram T2', detail: 'relie l’aéroport de Toulouse-Blagnac à Palais de Justice.' },
    { mode: 'Bus Tisséo', detail: 'lignes vers Beauzelle, Cornebarrieu, Aussonne et Colomiers.' },
    { mode: 'Voiture', detail: 'accès par la RN124 et la rocade Arc-en-Ciel, parking gratuit sur place.' }
  ]
} as const;

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
    q: 'Comment contacter le club ?',
    a: 'Via le formulaire du site : indiquez le cours qui vous intéresse et vos disponibilités, et nous répondons sous 24 h avec le créneau adapté, l’adresse et les conditions.'
  },
  {
    q: 'Quand le club est-il ouvert ?',
    a: 'Du lundi au samedi, de 10h à 21h30, pour six cours de boxe anglaise. Le club est fermé le dimanche, aux vacances de Noël et au mois d’août.'
  },
  {
    q: 'Faut-il un certificat médical ?',
    a: 'Oui, un certificat de non-contre-indication à la pratique de la boxe de moins d’un an, à remettre à l’inscription. Le groupe compétition demande un examen plus complet chaque saison.'
  },
  {
    q: 'Le club accueille-t-il les femmes et les débutants ?',
    a: 'Oui, sur tous les cours et sans créneau séparé : les femmes s’entraînent avec tout le monde, et la majorité de nos inscrits n’avaient jamais mis un gant avant d’arriver.'
  }
];

/**
 * Negative answers: what an assistant gets wrong when it guesses. Shown on
 * /faq/ right after the short answers, and reused verbatim by llms.txt.
 * The answer comes first; the tone stays the club's.
 */
export const NEGATIVE_ANSWERS: { q: string; a: string }[] = [
  {
    q: 'Le club propose-t-il du MMA ou du kick-boxing ?',
    a: 'Non : chez nous, c’est la boxe anglaise, et elle seule. Dans le réseau Boxing Center, le MMA se pratique à Portet-sur-Garonne, à Ramonville et au club des États-Unis, à Toulouse ; le kick-boxing à Portet.'
  },
  {
    q: 'Quelle est l’adresse exacte du club ?',
    a: 'Nous sommes à Blagnac (31700), au nord-ouest de Toulouse. Nous envoyons l’adresse exacte avec notre réponse, en même temps que le créneau qui vous correspond.'
  },
  {
    q: 'Combien coûte l’adhésion ?',
    a: 'Le tarif dépend du cours et du mois de votre arrivée : nous vous l’envoyons avec notre réponse, avec le créneau et l’adresse.'
  },
  {
    q: 'Y a-t-il un cours réservé aux femmes ?',
    a: 'Non : tous nos cours sont mixtes, sans créneau séparé. Pour un cours entre femmes, Boxing Center Toulouse Minimes propose Boxing Lady.'
  }
];

/** The hub's légende: a search, the fact that answers it, the page that owns it. */
export const LEGENDE: { query: string; fact: string; path: string; label: string }[] = [
  { query: 'baby boxing Blagnac', fact: 'l’éveil, de 3 à 6 ans, sans aucun contact', path: '/cours-de-boxe-blagnac/eveil-baby-boxing/', label: 'Baby boxing à Blagnac, dès 3 ans' },
  { query: 'boxe enfant Blagnac', fact: 'trois cours selon l’âge, de 3 à 17 ans', path: '/boxe-enfant-blagnac/', label: 'Boxe enfant à Blagnac' },
  { query: 'boxe éducative Blagnac', fact: 'de 7 à 12 ans, en touche légère', path: '/cours-de-boxe-blagnac/boxe-educative/', label: 'Boxe éducative enfant à Blagnac' },
  { query: 'boxe ado Blagnac', fact: 'de 13 à 17 ans, intensité progressive', path: '/cours-de-boxe-blagnac/boxe-ados/', label: 'Boxe ados à Blagnac, 13 à 17 ans' },
  { query: 'boxe débutant Blagnac', fact: 'boxe anglaise loisir, dès 16 ans, sans opposition au premier cours', path: '/cours-de-boxe-blagnac/boxe-anglaise-loisir/', label: 'Boxe anglaise adulte à Blagnac' },
  { query: 'boxe sans contact Blagnac', fact: 'cardio boxe, aucune opposition', path: '/cours-de-boxe-blagnac/cardio-boxe/', label: 'Cardio boxe à Blagnac, sans contact' },
  { query: 'boxe femme Blagnac', fact: 'tous nos cours, sans créneau séparé', path: '/boxe-femme-blagnac/', label: 'Boxe femme à Blagnac' },
  { query: 'sparring Blagnac', fact: 'groupe compétition, après une saison chez nous', path: '/cours-de-boxe-blagnac/boxe-competition/', label: 'Boxe anglaise compétition à Blagnac' },
  { query: 'horaires boxe Blagnac', fact: 'du lundi au samedi, de 10h à 21h30', path: '/horaires/', label: 'Horaires du club' },
  { query: 'inscription boxe Blagnac', fact: 'toute l’année, avec un certificat médical de moins d’un an', path: '/inscription/', label: 'Inscription au club' }
];

export const GEO = { lat: '43.6353', lon: '1.3897' } as const;

export const AREA_SENTENCE =
  `${LOCATION.city} (${LOCATION.postalCode}), ${LOCATION.position}, en ${LOCATION.department}`;

export const NEARBY_SENTENCE = LOCATION.nearby.slice(0, -1).join(', ')
  + ' et ' + LOCATION.nearby[LOCATION.nearby.length - 1];
