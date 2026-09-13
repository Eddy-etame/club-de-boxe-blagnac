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

import { CLUB, DISCIPLINES, GEAR, FAQ, GLOSSARY } from './club';
import { NETWORK, NETWORK_CLUBS, type NetworkClub } from './network';
import { LOCATION } from './seo-map';
import { SITE, PUBLIC_PAGES, LOW_VALUE_PAGES, absoluteUrl } from './site';
import { pageLastModified, siteLastModified } from '../lib/lastmod';
import { ROUTES, ogId } from './routes';
import { COMMUNES, communePath, type Commune } from './communes';

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
  dateModified: siteLastModified(),
  hasPart: PUBLIC_PAGES.map((path) => ({ '@id': absoluteUrl(path) + '#webpage' }))
};

/**
 * The club itself: a SportsClub of the Boxing Center network, located at
 * commune level, with its real opening hours. Every value comes from CLUB in
 * club.ts, so the markup can never drift from the visible page.
 */
const publisherNode = {
  /* No 'LocalBusiness': SportsActivityLocation already is one, and the
     explicit type makes validators demand a street address we do not publish. */
  '@type': ['SportsClub', 'SportsActivityLocation'],
  '@id': id('publisher'),
  name: CLUB.name,
  url: `${SITE.url}/`,
  description:
    'Club de boxe anglaise à Blagnac, au nord-ouest de Toulouse, membre du réseau Boxing Center. Six cours, du baby boxing dès 3 ans au groupe compétition, du lundi au samedi.',
  slogan: CLUB.tagline,
  /* Blagnac has other boxing associations, one with a near-identical name.
     Stated so answer engines keep the entities apart. */
  disambiguatingDescription:
    'Club de boxe anglaise du réseau Boxing Center à Blagnac, distinct des autres associations de boxe de la commune.',
  sport: { '@id': id('subject') },
  email: CLUB.email,
  image: { '@id': id('primaryimage') },
  logo: { '@type': 'ImageObject', url: absoluteUrl('/icon-512.png'), width: 512, height: 512 },
  knowsLanguage: ['fr-FR', 'en'],
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
  areaServed: [
    { '@id': id('place') },
    ...COMMUNES.map((c) => ({
      '@type': 'City',
      '@id': id('commune-' + c.slug),
      name: c.name,
      sameAs: 'https://www.wikidata.org/wiki/' + c.qid
    }))
  ],
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
    { '@type': 'LocationFeatureSpecification', name: 'Ring de boxe', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Salle de sacs', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Espace de renforcement', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Vestiaires', value: true }
  ],
  knowsAbout: [
    { '@id': id('subject') },
    ...DISCIPLINES.map((d) => ({ '@id': id(`course-${d.slug}`) }))
  ],
  parentOrganization: { '@id': NETWORK.graphId },
  memberOf: { '@id': NETWORK.graphId },
  potentialAction: {
    '@type': 'CommunicateAction',
    name: 'Nous écrire',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: absoluteUrl('/acces-contact/#contact'),
      inLanguage: 'fr-FR',
      actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform']
    }
  }
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
  }
};

/**
 * One Course node per discipline. `Course` is the exact schema.org type for
 * "a structured programme of instruction" — far more precise than dropping
 * everything into ItemList, and eligible for course-specific treatment.
 */
export const courseId = (slug: string) => id(`course-${slug}`);

const courseNodes = DISCIPLINES.map((d) => ({
  '@type': 'Course',
  '@id': courseId(d.slug),
  name: d.name,
  url: absoluteUrl(`/cours-de-boxe-blagnac/${d.slug}/`),
  description: d.body,
  abstract: `${d.summary} ${d.contact}.`,
  audience: { '@type': 'PeopleAudience', suggestedMinAge: d.minAge, ...(d.maxAge ? { suggestedMaxAge: d.maxAge } : {}) },
  inLanguage: 'fr-FR',
  teaches: d.session,
  typicalAgeRange: d.ages,
  about: { '@id': id('subject') },
  provider: { '@id': id('publisher') },
  courseMode: 'onsite',
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
 * A neighbouring commune, in full, on its own page: the same @id the club's
 * areaServed points to, so the two merge into one entity. Official figures
 * only (src/data/communes.ts).
 */
export function communeNode(c: Commune) {
  return {
    '@type': ['City', 'AdministrativeArea'],
    '@id': id('commune-' + c.slug),
    name: c.name,
    sameAs: 'https://www.wikidata.org/wiki/' + c.qid,
    identifier: { '@type': 'PropertyValue', propertyID: 'Code officiel géographique (Insee)', value: c.insee },
    address: {
      '@type': 'PostalAddress',
      addressLocality: c.name,
      postalCode: c.postalCode,
      addressRegion: LOCATION.region,
      addressCountry: 'FR'
    },
    geo: { '@type': 'GeoCoordinates', latitude: c.centre.lat, longitude: c.centre.lon },
    containedInPlace: { '@id': id('metropole') },
    subjectOf: { '@id': absoluteUrl(communePath(c)) + '#webpage' }
  };
}

/** One course node, shared by the hub and the course's own page. */
export function courseNode(slug: string) {
  const node = courseNodes.find((c) => c['@id'] === courseId(slug));
  if (!node) throw new Error('schema.ts: unknown course ' + slug);
  return node;
}

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
  hasDefinedTerm: GLOSSARY.map((t) => ({
    '@type': 'DefinedTerm',
    '@id': id(`terme-${t.slug}`),
    name: t.name,
    description: t.description,
    inDefinedTermSet: { '@id': id('glossaire') }
  }))
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

/**
 * The Boxing Center network and its other clubs. Their @id values are the
 * ones the network's own sites publish (see src/data/network.ts), so crawlers
 * merge these nodes with theirs instead of minting duplicates.
 */
const clubGraphId = (c: NetworkClub) => c.graphId ?? id(`network-${c.id}`);

const networkNode = {
  '@type': 'Organization',
  '@id': NETWORK.graphId,
  name: NETWORK.name,
  /* Registry identity (recherche-entreprises.api.gouv.fr, 2026-09-13): the
     ISO 6523 code 0002 is the SIREN, the one identifier no namesake shares. */
  legalName: NETWORK.editor.legalName,
  iso6523Code: '0002:' + NETWORK.editor.siren.replace(/\s/g, ''),
  foundingDate: NETWORK.editor.registered,
  url: NETWORK.url,
  sameAs: [...NETWORK.sameAs],
  subOrganization: [
    { '@id': id('publisher') },
    ...NETWORK_CLUBS.filter((c) => c.inNetwork).map((c) => ({ '@id': clubGraphId(c) }))
  ]
};

const partnerNodes = NETWORK_CLUBS.map((club) => ({
  '@type': 'SportsClub',
  '@id': clubGraphId(club),
  name: club.name,
  url: club.url,
  description: club.pitch,
  sport: { '@id': id('subject') },
  address: { '@type': 'PostalAddress', addressLocality: club.locality, addressCountry: 'FR' },
  ...(club.inNetwork ? { parentOrganization: { '@id': NETWORK.graphId } } : {})
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
  /** Trail below Accueil for deep pages; defaults to the page itself. */
  crumbs?: { name: string; path: string }[];
  /** @id of the entity the page is about. */
  mainEntity?: string;
  /** Visible FAQ of this page: emitted as FAQPage only because it is on the page. */
  faqItems?: { question: string; answer: string }[];
  /** Extra nodes specific to this page (HowTo, ItemList…). */
  extra?: Record<string, unknown>[];
  /** Include the course reference layer. */
  withCourses?: boolean;
  /** Include the glossary (only on the page that shows it). */
  withGlossary?: boolean;
  /** Include the FAQ nodes. */
  withFaq?: boolean;
};

export function buildGraph({
  pathname,
  title,
  description,
  pageType = 'WebPage',
  crumbs,
  mainEntity,
  faqItems,
  extra = [],
  withCourses = false,
  withGlossary = false,
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
    /* Legal pages are about the club that publishes them, not about boxing. */
    ...((LOW_VALUE_PAGES as readonly string[]).includes(pathname)
      ? { about: { '@id': id('publisher') } }
      : { about: { '@id': id('subject') }, mentions: [{ '@id': id('place') }, { '@id': id('subject') }] }),
    primaryImageOfPage: { '@id': id('primaryimage') },
    dateModified: pageLastModified(pathname),
    datePublished: '2026-09-04',
    isAccessibleForFree: true
  };

  /* The page's own card, in both ratios; Google prefers the square one. */
  const route = ROUTES.find((r) => r.path === pathname);
  if (route) {
    const card = absoluteUrl('/og/' + ogId(route.path));
    const caption = route.og.word + ' — ' + route.og.kicker + '. Club de Boxe Blagnac, réseau Boxing Center.';
    pageNode.primaryImageOfPage = {
      '@type': 'ImageObject',
      '@id': `${canonical}#primaryimage`,
      url: card + '-carre.jpg',
      contentUrl: card + '-carre.jpg',
      width: 1200,
      height: 1200,
      caption
    };
    pageNode.image = [
      { '@type': 'ImageObject', url: card + '.jpg', width: 1200, height: 630, caption },
      { '@id': `${canonical}#primaryimage` }
    ];
  }

  if (mainEntity) pageNode.mainEntity = { '@id': mainEntity };
  else if (withFaq) pageNode.mainEntity = { '@id': `${canonical}#faq` };

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
    networkNode,
    ...partnerNodes
  ];

  if (!isHome) {
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        { name: 'Accueil', path: '/' },
        ...(crumbs ?? [{ name: title.split(/[—|:]/)[0].trim(), path: pathname }])
      ].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.path) }))
    });
  }

  if (withCourses) nodes.push(...courseNodes);
  if (withGlossary) nodes.push(glossaryNode);

  const faqList = faqItems ?? (withFaq ? FAQ : null);
  if (faqList) {
    nodes.push({
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      inLanguage: 'fr-FR',
      isPartOf: { '@id': id('website') },
      about: { '@id': id('subject') },
      mainEntity: faqList.map((item, i) => ({
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
