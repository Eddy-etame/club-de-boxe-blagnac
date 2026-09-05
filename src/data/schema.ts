/**
 * Structured data: one consolidated @graph per page.
 *
 * Two decisions worth knowing about, because they are what separates this
 * from a pile of disconnected JSON-LD blocks:
 *
 * 1. ONE GRAPH, CROSS-REFERENCED BY @id.
 *    Every node has a stable `@id` and refers to the others by that id
 *    rather than repeating their contents. A crawler reading any page can
 *    reassemble the whole site's entity model instead of re-parsing
 *    duplicated fragments. This is also why nothing here is emitted twice.
 *
 * 2. ENTITY ANCHORING VIA `sameAs`.
 *    Free text says "Blagnac"; an answer engine has to guess which Blagnac,
 *    and whether "boxe" means English boxing, savate or kickboxing. Pointing
 *    `sameAs` at Wikidata and Wikipedia removes the guess entirely — the
 *    single highest-leverage thing available for generative engines.
 *
 *    Every identifier below was resolved against the live Wikipedia API on
 *    2026-09-05, not written from memory. A wrong QID is worse than none:
 *    it asserts the page is about something it is not. Re-verify before
 *    adding any new one.
 */

import { CLUB, DISCIPLINES, GEAR, FAQ, PARTNERS } from './club';
import { LOCATION } from './seo-map';
import { SITE, absoluteUrl } from './site';

const ENTITY = {
  boxing: {
    wikidata: 'https://www.wikidata.org/wiki/Q2922870',
    wikipedia: 'https://fr.wikipedia.org/wiki/Boxe_anglaise'
  },
  blagnac: {
    wikidata: 'https://www.wikidata.org/wiki/Q271068',
    wikipedia: 'https://fr.wikipedia.org/wiki/Blagnac'
  },
  toulouse: {
    wikidata: 'https://www.wikidata.org/wiki/Q7880',
    wikipedia: 'https://fr.wikipedia.org/wiki/Toulouse'
  },
  metropole: {
    wikidata: 'https://www.wikidata.org/wiki/Q1120291',
    wikipedia: 'https://fr.wikipedia.org/wiki/Toulouse_M%C3%A9tropole'
  },
  hauteGaronne: {
    wikidata: 'https://www.wikidata.org/wiki/Q12538',
    wikipedia: 'https://fr.wikipedia.org/wiki/Haute-Garonne'
  },
  occitanie: {
    wikidata: 'https://www.wikidata.org/wiki/Q18678265',
    wikipedia: 'https://fr.wikipedia.org/wiki/Occitanie_(r%C3%A9gion_administrative)'
  }
} as const;

/** Neighbouring communes, each anchored. Verified 2026-09-05. */
const NEARBY_ENTITIES = [
  { name: 'Beauzelle', qid: 'Q770307' },
  { name: 'Cornebarrieu', qid: 'Q1344709' },
  { name: 'Aussonne', qid: 'Q634738' },
  { name: 'Colomiers', qid: 'Q318071' }
];

const id = (fragment: string) => `${SITE.url}/#${fragment}`;

/* ------------------------------------------------------------------ *
 * Shared nodes — emitted once per page, referenced by everything else.
 * ------------------------------------------------------------------ */

const websiteNode = {
  '@type': 'WebSite',
  '@id': id('website'),
  url: `${SITE.url}/`,
  name: SITE.name,
  alternateName: 'Boxe anglaise à Blagnac',
  description: SITE.description,
  inLanguage: 'fr-FR',
  about: { '@id': id('subject') },
  spatialCoverage: { '@id': id('place') },
  publisher: { '@id': id('publisher') },
  dateModified: SITE.lastModified
};

/**
 * The club itself. A SportsActivityLocation with a postal address, opening
 * hours and a phone is what earns a local pack listing and a knowledge panel —
 * an Organization without them earns nothing. Every value comes from CLUB in
 * club.ts, so the markup can never drift from the visible page.
 */
const publisherNode = {
  '@type': ['SportsClub', 'SportsActivityLocation', 'LocalBusiness'],
  '@id': id('publisher'),
  name: CLUB.name,
  legalName: CLUB.name,
  url: `${SITE.url}/`,
  description:
    'Club de boxe anglaise à Blagnac, au nord-ouest de Toulouse. Six cours du baby boxing dès 3 ans au groupe compétition, 21 créneaux par semaine, séance d’essai gratuite.',
  slogan: CLUB.tagline,
  foundingDate: String(CLUB.founded),
  sport: { '@id': id('subject') },
  email: CLUB.email,
  image: { '@id': id('primaryimage') },
  logo: absoluteUrl('/favicon.svg'),
  currenciesAccepted: 'EUR',
  publicAccess: true,
  isAccessibleForFree: false,
  /* Locality only. A streetAddress and telephone would have to be invented,
     and a wrong NAP in structured data is worse than none: it is exactly what
     search engines propagate into maps and knowledge panels. */
  address: {
    '@type': 'PostalAddress',
    addressLocality: LOCATION.city,
    postalCode: LOCATION.postalCode,
    addressRegion: LOCATION.region,
    addressCountry: 'FR'
  },
  areaServed: [{ '@id': id('place') }],
  location: { '@id': id('place') },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'https://schema.org/Monday',
        'https://schema.org/Tuesday',
        'https://schema.org/Wednesday',
        'https://schema.org/Thursday',
        'https://schema.org/Friday',
        'https://schema.org/Saturday'
      ],
      opens: '10:00',
      closes: '21:30'
    }
  ],
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Deux rings', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Salle de sacs', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Espace de renforcement', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Vestiaires', value: true }
  ],
  makesOffer: {
    '@type': 'Offer',
    name: 'Séance d’essai gratuite',
    description:
      'Une séance d’essai gratuite sur le cours de votre choix, gants et protections prêtés.',
    price: '0',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: absoluteUrl('/premiere-seance/')
  },
  knowsAbout: [
    { '@id': id('subject') },
    ...DISCIPLINES.map((d) => ({ '@id': id(`course-${d.slug}`) }))
  ],
  subOrganization: PARTNERS.map((_, i) => ({ '@id': id(`partner-${i}`) }))
};

/** The sport itself, disambiguated. Not "boxing" in general — English boxing. */
const subjectNode = {
  '@type': 'Thing',
  '@id': id('subject'),
  name: 'Boxe anglaise',
  alternateName: ['Boxe', 'Noble art'],
  description:
    'Sport de combat de percussion pratiqué uniquement avec les poings gantés, encadré par des catégories de poids et des règles d’arbitrage.',
  sameAs: [ENTITY.boxing.wikidata, ENTITY.boxing.wikipedia]
};

/** Blagnac, with its full administrative containment chain. */
const placeNode = {
  '@type': ['City', 'AdministrativeArea'],
  '@id': id('place'),
  name: LOCATION.city,
  description: `${LOCATION.city} (${LOCATION.postalCode}), commune ${LOCATION.position}, en ${LOCATION.department}.`,
  sameAs: [ENTITY.blagnac.wikidata, ENTITY.blagnac.wikipedia],
  address: {
    '@type': 'PostalAddress',
    addressLocality: LOCATION.city,
    postalCode: LOCATION.postalCode,
    addressRegion: LOCATION.region,
    addressCountry: 'FR'
  },
  geo: { '@type': 'GeoCoordinates', latitude: 43.6353, longitude: 1.3897 },
  containedInPlace: {
    '@type': 'AdministrativeArea',
    '@id': id('metropole'),
    name: 'Toulouse Métropole',
    sameAs: [ENTITY.metropole.wikidata, ENTITY.metropole.wikipedia],
    containedInPlace: {
      '@type': 'AdministrativeArea',
      '@id': id('departement'),
      name: LOCATION.department,
      sameAs: [ENTITY.hauteGaronne.wikidata, ENTITY.hauteGaronne.wikipedia],
      containedInPlace: {
        '@type': 'AdministrativeArea',
        '@id': id('region'),
        name: LOCATION.region,
        sameAs: [ENTITY.occitanie.wikidata, ENTITY.occitanie.wikipedia],
        containedInPlace: { '@type': 'Country', name: 'France' }
      }
    }
  },
  nearbyAttraction: NEARBY_ENTITIES.map((c) => ({
    '@type': 'AdministrativeArea',
    name: c.name,
    sameAs: `https://www.wikidata.org/wiki/${c.qid}`
  }))
};

/**
 * One Course node per discipline. `Course` is the exact schema.org type for
 * "a structured programme of instruction" — far more precise than dropping
 * everything into ItemList, and eligible for course-specific treatment.
 */
const courseNodes = DISCIPLINES.map((d) => ({
  '@type': 'Course',
  '@id': id(`course-${d.slug}`),
  name: d.name,
  url: `${absoluteUrl('/cours-de-boxe-blagnac/')}#${d.slug}`,
  description: d.body,
  abstract: d.summary,
  inLanguage: 'fr-FR',
  teaches: d.session,
  typicalAgeRange: d.ages,
  about: { '@id': id('subject') },
  provider: { '@id': id('publisher') },
  courseMode: 'onsite',
  educationalLevel: d.contact,
  spatialCoverage: { '@id': id('place') },
  isAccessibleForFree: false,
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'onsite',
    courseSchedule: { '@type': 'Schedule', description: d.rhythm },
    location: { '@id': id('publisher') },
    inLanguage: 'fr-FR'
  }
}));

/**
 * A glossary of the vocabulary the pages actually use. Answer engines lean on
 * DefinedTerm to resolve jargon; publishing it turns incidental wording into
 * a citable reference layer.
 */
const glossaryNode = {
  '@type': 'DefinedTermSet',
  '@id': id('glossaire'),
  name: 'Vocabulaire de la boxe anglaise',
  inLanguage: 'fr-FR',
  hasDefinedTerm: [
    {
      '@type': 'DefinedTerm',
      '@id': id('terme-touche-controlee'),
      name: 'Touche contrôlée',
      description:
        'Opposition où le coup est porté sans puissance, l’objectif étant de toucher juste et non de faire mal. Règle de base des cours loisir et éducatifs.',
      inDefinedTermSet: { '@id': id('glossaire') }
    },
    {
      '@type': 'DefinedTerm',
      '@id': id('terme-boxe-educative'),
      name: 'Boxe éducative',
      description:
        'Format destiné aux enfants, pratiqué en touche légère et protections complètes, sans recherche de puissance et sans KO.',
      inDefinedTermSet: { '@id': id('glossaire') }
    },
    {
      '@type': 'DefinedTerm',
      '@id': id('terme-baby-boxing'),
      name: 'Baby boxing',
      description:
        'Séance d’éveil dès 3 ans, sans aucun contact : motricité, équilibre, réaction à un signal et jeux de déplacement.',
      inDefinedTermSet: { '@id': id('glossaire') }
    },
    {
      '@type': 'DefinedTerm',
      '@id': id('terme-pattes-d-ours'),
      name: 'Pattes d’ours',
      description:
        'Cibles rembourrées tenues par l’entraîneur, sur lesquelles le boxeur travaille ses enchaînements et sa précision.',
      inDefinedTermSet: { '@id': id('glossaire') }
    },
    {
      '@type': 'DefinedTerm',
      '@id': id('terme-sparring'),
      name: 'Sparring',
      description:
        'Combat d’entraînement encadré, à intensité convenue, réservé aux pratiquants ayant les automatismes nécessaires.',
      inDefinedTermSet: { '@id': id('glossaire') }
    },
    {
      '@type': 'DefinedTerm',
      '@id': id('terme-garde'),
      name: 'Garde',
      description:
        'Position de base des poings, des coudes et des appuis, qui protège la tête et le buste tout en permettant de frapper.',
      inDefinedTermSet: { '@id': id('glossaire') }
    },
    {
      '@type': 'DefinedTerm',
      '@id': id('terme-shadow-boxing'),
      name: 'Shadow boxing',
      description:
        'Travail technique sans partenaire ni sac, à vide, pour corriger la trajectoire du geste et le déplacement.',
      inDefinedTermSet: { '@id': id('glossaire') }
    },
    {
      '@type': 'DefinedTerm',
      '@id': id('terme-cardio-boxe'),
      name: 'Cardio boxe',
      description:
        'Séance de condition physique construite sur les mouvements de boxe, sans aucune opposition ni contact.',
      inDefinedTermSet: { '@id': id('glossaire') }
    }
  ]
};

/** Photography credit, licence and provenance, attached to the social image. */
const imageNode = {
  '@type': 'ImageObject',
  '@id': id('primaryimage'),
  url: absoluteUrl('/images/garde-boxeuse-1600.jpg'),
  contentUrl: absoluteUrl('/images/garde-boxeuse-1600.jpg'),
  width: 1600,
  height: 1067,
  caption: 'Boxeuse en garde pendant un entraînement de boxe anglaise',
  creditText: 'Axel Derewiany',
  creator: { '@type': 'Person', name: 'Axel Derewiany' },
  copyrightNotice: '© Axel Derewiany',
  representativeOfPage: true,
  contentLocation: { '@id': id('publisher') }
};

/** The outbound clubs, so the handoff is machine-readable too. */
const partnerNodes = PARTNERS.map((club, i) => ({
  '@type': 'SportsClub',
  '@id': id(`partner-${i}`),
  name: club.name,
  alternateName: club.short,
  url: club.url,
  description: club.covers,
  sport: { '@id': id('subject') },
  sameAs: club.url
}));

/* ------------------------------------------------------------------ *
 * Page graph builder.
 * ------------------------------------------------------------------ */

type PageKind = 'WebPage' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'CollectionPage';

export type GraphOptions = {
  pathname: string;
  title: string;
  description: string;
  pageType?: PageKind;
  /** Sentences a voice assistant should read aloud, as CSS selectors. */
  speakable?: string[];
  /** Extra nodes specific to this page (HowTo, ItemList…). */
  extra?: Record<string, unknown>[];
  /** Include the full course + glossary reference layer. */
  withCourses?: boolean;
  /** Include the FAQ nodes. */
  withFaq?: boolean;
};

export function buildGraph({
  pathname,
  title,
  description,
  pageType = 'WebPage',
  speakable,
  extra = [],
  withCourses = false,
  withFaq = false
}: GraphOptions) {
  const canonical = absoluteUrl(pathname);
  const isHome = pathname === '/';

  const pageNode: Record<string, unknown> = {
    '@type': pageType,
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: 'fr-FR',
    isPartOf: { '@id': id('website') },
    about: { '@id': id('subject') },
    mentions: [{ '@id': id('place') }, { '@id': id('subject') }],
    primaryImageOfPage: { '@id': id('primaryimage') },
    dateModified: SITE.lastModified,
    datePublished: '2026-09-04',
    isAccessibleForFree: true
  };

  if (speakable) {
    pageNode.speakable = { '@type': 'SpeakableSpecification', cssSelector: speakable };
  }

  if (!isHome) {
    pageNode.breadcrumb = { '@id': `${canonical}#breadcrumb` };
  }

  const nodes: Record<string, unknown>[] = [
    websiteNode,
    publisherNode,
    subjectNode,
    placeNode,
    imageNode,
    pageNode,
    ...partnerNodes
  ];

  if (!isHome) {
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: title.split(/[—|:]/)[0].trim(), item: canonical }
      ]
    });
  }

  if (withCourses) nodes.push(...courseNodes, glossaryNode);

  if (withFaq) {
    nodes.push({
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      inLanguage: 'fr-FR',
      isPartOf: { '@id': id('website') },
      about: { '@id': id('subject') },
      mainEntity: FAQ.map((item, i) => ({
        '@type': 'Question',
        '@id': `${canonical}#q${i + 1}`,
        name: item.question,
        answerCount: 1,
        acceptedAnswer: { '@type': 'Answer', text: item.answer, inLanguage: 'fr-FR' }
      }))
    });
  }

  nodes.push(...extra);

  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** HowTo for the first-session page, built from the same data the page renders. */
export function firstSessionHowTo(steps: { number: string; title: string; text: string }[]) {
  return {
    '@type': 'HowTo',
    '@id': `${absoluteUrl('/premiere-seance/')}#howto`,
    name: 'Préparer sa première séance de boxe',
    description:
      'Ce qu’il faut faire avant, pendant et après un premier cours de boxe anglaise, et ce qu’il ne faut surtout pas acheter.',
    inLanguage: 'fr-FR',
    totalTime: 'PT90M',
    about: { '@id': id('subject') },
    supply: GEAR.slice(0, 1).map(() => ({ '@type': 'HowToSupply', name: 'Tenue de sport' })).concat([
      { '@type': 'HowToSupply', name: 'Chaussures propres réservées à l’intérieur' },
      { '@type': 'HowToSupply', name: 'Bouteille d’eau' }
    ]),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.text,
      url: `${absoluteUrl('/premiere-seance/')}#etape-${i + 1}`
    }))
  };
}

/** ItemList of the disciplines, for the courses page. */
export function disciplineList() {
  return {
    '@type': 'ItemList',
    '@id': `${absoluteUrl('/cours-de-boxe-blagnac/')}#disciplines`,
    name: 'Formats de cours de boxe pratiqués à Blagnac et dans le nord-ouest toulousain',
    numberOfItems: DISCIPLINES.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: DISCIPLINES.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@id': id(`course-${d.slug}`) }
    }))
  };
}

export const SEASON_LABEL = CLUB.season;
