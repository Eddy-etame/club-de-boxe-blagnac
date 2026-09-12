/**
 * The Boxing Center network.
 *
 * The Club de Boxe Blagnac is one of the network's clubs, and says so on every
 * page. Every outbound URL below was fetched on 2026-09-12 and answered
 * HTTP 200 at the exact address written here — trailing slashes included, so
 * no link costs a redirect hop.
 *
 * `graphId` is the @id each club's own site publishes for itself. Reusing it
 * in our JSON-LD lets a crawler merge our node with theirs into one entity,
 * instead of meeting a stranger that happens to share the name.
 *
 * Which clubs and which of their pages a given page links to is decided in
 * PICKS (the in-page network block) and POPUPS (the slide-in card), so that a
 * parent reading about baby boxing is sent to the network's children pages,
 * and a visitor on the access page to the network's access pages.
 */

export type Topic =
  | 'club'
  | 'activites'
  | 'plannings'
  | 'tarifs'
  | 'premiere-seance'
  | 'coachs'
  | 'galerie'
  | 'contact'
  | 'salle';

export type NetworkLink = { label: string; url: string };

export type NetworkClub = {
  id: 'minimes' | 'tmbc' | 'saint-cyprien' | 'portet';
  name: string;
  short: string;
  url: string;
  /** True for Boxing Center clubs; false for a partner club outside the group. */
  inNetwork: boolean;
  /** The @id the club's own site publishes, when it publishes one. */
  graphId?: string;
  area: string;
  locality: string;
  pitch: string;
  links: Partial<Record<Topic, NetworkLink>>;
};

export const NETWORK = {
  name: 'Boxing Center',
  url: 'https://boxingcenter.fr/',
  graphId: 'https://boxingcenter.fr/#organization',
  sameAs: [
    'https://www.instagram.com/boxingcentertoulouse/',
    'https://www.facebook.com/BoxingCenterToulouse/'
  ],
  salles: { label: 'Toutes les salles Boxing Center', url: 'https://boxingcenter.fr/salle-de-sport-toulouse/' },
  abonnements: { label: 'Les abonnements du réseau', url: 'https://boutique.boxingcenter.fr/abonnements' },
  coaching: { label: 'Le coaching individuel du réseau', url: 'https://boutique.boxingcenter.fr/coachings' },
  /** Legal editor of the site, exactly as the other network sites publish it. */
  editor: {
    address: '12 rue de Fenouillet, 31200 Toulouse',
    phone: '09 39 03 67 48',
    phoneLink: '+33939036748',
    email: 'boxingcenter31@gmail.com'
  }
} as const;

export const NETWORK_CLUBS: NetworkClub[] = [
  {
    id: 'minimes',
    name: 'Boxing Center Toulouse Minimes',
    short: 'Minimes',
    url: 'https://boxe-toulouse.com/',
    inNetwork: true,
    graphId: 'https://boxe-toulouse.com/#salle',
    area: 'Toulouse · Minimes · 31200',
    locality: 'Toulouse',
    pitch:
      'La salle historique du réseau, au nord de Toulouse : boxe anglaise, pieds-poings, Boxing Lady et boxe éducative dès 3 ans.',
    links: {
      club: { label: 'La salle des Minimes', url: 'https://boxe-toulouse.com/le-club' },
      activites: { label: 'Les activités aux Minimes', url: 'https://boxe-toulouse.com/activites' },
      plannings: { label: 'Les horaires aux Minimes', url: 'https://boxe-toulouse.com/plannings' },
      tarifs: { label: 'Les formules aux Minimes', url: 'https://boxe-toulouse.com/tarifs' },
      'premiere-seance': { label: 'Une première séance aux Minimes', url: 'https://boxe-toulouse.com/premiere-seance' },
      coachs: { label: 'Les coachs des Minimes', url: 'https://boxe-toulouse.com/coachs' },
      galerie: { label: 'La galerie des Minimes', url: 'https://boxe-toulouse.com/galerie' },
      contact: { label: 'Venir aux Minimes', url: 'https://boxe-toulouse.com/contact' }
    }
  },
  {
    id: 'tmbc',
    name: 'Toulouse Minimes Boxing Club',
    short: 'TMBC · club partenaire',
    url: 'https://toulouse-minimes-boxing-club.fr/',
    inNetwork: false,
    area: 'Toulouse · Minimes · Métro B',
    locality: 'Toulouse',
    pitch:
      'Le club de boxe anglaise affilié à la FFBoxe aux Minimes : loisir, compétition et boxe éducative pour les enfants.',
    links: {
      club: { label: 'Le club TMBC', url: 'https://toulouse-minimes-boxing-club.fr/club' },
      activites: { label: 'Les cours du TMBC', url: 'https://toulouse-minimes-boxing-club.fr/activites' },
      galerie: { label: 'La galerie du TMBC', url: 'https://toulouse-minimes-boxing-club.fr/galerie' }
    }
  },
  {
    id: 'saint-cyprien',
    name: 'Boxing Center Saint-Cyprien',
    short: 'Saint-Cyprien',
    url: 'https://club-boxe-toulouse.com/',
    inNetwork: true,
    graphId: 'https://club-boxe-toulouse.com/#salle',
    area: 'Toulouse · Saint-Cyprien · rive gauche',
    locality: 'Toulouse',
    pitch: 'Le club rive gauche du réseau, au cœur de Saint-Cyprien : sports de combat et salle de sport.',
    links: {
      activites: { label: 'Les activités à Saint-Cyprien', url: 'https://club-boxe-toulouse.com/activites' },
      plannings: { label: 'Les horaires à Saint-Cyprien', url: 'https://club-boxe-toulouse.com/plannings' },
      salle: { label: 'La salle de Saint-Cyprien', url: 'https://club-boxe-toulouse.com/la-salle' }
    }
  },
  {
    id: 'portet',
    name: 'Boxing Center Portet',
    short: 'Portet-sur-Garonne',
    url: 'https://boxing-center-portet.fr/',
    inNetwork: true,
    graphId: 'https://boxing-center-portet.fr/#salle',
    area: 'Portet-sur-Garonne · sud de Toulouse',
    locality: 'Portet-sur-Garonne',
    pitch: 'Le club du sud de l’agglomération : boxe, MMA et kick-boxing.',
    links: {
      activites: { label: 'Les activités à Portet', url: 'https://boxing-center-portet.fr/activites/' },
      plannings: { label: 'Les horaires à Portet', url: 'https://boxing-center-portet.fr/plannings/' }
    }
  }
];

/** One network link, resolved at build time. A missing link fails the build. */
export function networkLink(id: NetworkClub['id'], topic: Topic): NetworkLink {
  const found = NETWORK_CLUBS.find((c) => c.id === id)?.links[topic];
  if (!found) throw new Error(`network.ts: no "${topic}" link for club "${id}"`);
  return found;
}

/* ------------------------------------------------------------------ *
 * In-page network block, per page.
 * ------------------------------------------------------------------ */

export type Pick = {
  clubs: { id: NetworkClub['id']; topics: Topic[] }[];
  extras: NetworkLink[];
};

const KIDS: Pick = {
  clubs: [
    { id: 'minimes', topics: ['activites', 'plannings'] },
    { id: 'tmbc', topics: ['activites', 'club'] }
  ],
  extras: [NETWORK.salles]
};

export const PICKS: Record<string, Pick> = {
  home: {
    clubs: [
      { id: 'minimes', topics: ['club', 'activites', 'plannings'] },
      { id: 'tmbc', topics: ['club', 'activites', 'galerie'] },
      { id: 'saint-cyprien', topics: ['activites', 'plannings', 'salle'] },
      { id: 'portet', topics: ['activites', 'plannings'] }
    ],
    extras: [NETWORK.salles, NETWORK.abonnements]
  },
  hub: {
    clubs: [
      { id: 'minimes', topics: ['activites', 'plannings'] },
      { id: 'tmbc', topics: ['activites'] },
      { id: 'saint-cyprien', topics: ['activites', 'plannings'] },
      { id: 'portet', topics: ['activites'] }
    ],
    extras: [NETWORK.abonnements]
  },
  'eveil-baby-boxing': KIDS,
  'boxe-educative': KIDS,
  'boxe-ados': {
    clubs: [
      { id: 'tmbc', topics: ['club', 'activites'] },
      { id: 'minimes', topics: ['activites', 'plannings'] },
      { id: 'saint-cyprien', topics: ['activites'] }
    ],
    extras: [NETWORK.salles]
  },
  'boxe-anglaise-loisir': {
    clubs: [
      { id: 'minimes', topics: ['activites', 'plannings'] },
      { id: 'tmbc', topics: ['activites'] },
      { id: 'saint-cyprien', topics: ['plannings'] },
      { id: 'portet', topics: ['plannings'] }
    ],
    extras: [NETWORK.abonnements]
  },
  'boxe-competition': {
    clubs: [
      { id: 'tmbc', topics: ['club', 'activites', 'galerie'] },
      { id: 'minimes', topics: ['coachs', 'activites'] }
    ],
    extras: [NETWORK.coaching]
  },
  'cardio-boxe': {
    clubs: [
      { id: 'minimes', topics: ['activites', 'plannings'] },
      { id: 'saint-cyprien', topics: ['salle', 'activites'] },
      { id: 'portet', topics: ['activites'] }
    ],
    extras: [NETWORK.abonnements]
  },
  first: {
    clubs: [
      { id: 'minimes', topics: ['premiere-seance', 'club'] },
      { id: 'tmbc', topics: ['club'] },
      { id: 'saint-cyprien', topics: ['salle'] }
    ],
    extras: [NETWORK.salles]
  },
  faq: {
    clubs: [
      { id: 'minimes', topics: ['plannings', 'tarifs'] },
      { id: 'tmbc', topics: ['club'] },
      { id: 'saint-cyprien', topics: ['activites'] },
      { id: 'portet', topics: ['activites'] }
    ],
    extras: [NETWORK.abonnements, NETWORK.coaching]
  },
  access: {
    clubs: [
      { id: 'minimes', topics: ['contact', 'club'] },
      { id: 'saint-cyprien', topics: ['salle'] },
      { id: 'portet', topics: ['activites'] },
      { id: 'tmbc', topics: ['club'] }
    ],
    extras: [NETWORK.salles]
  }
};

/* ------------------------------------------------------------------ *
 * Slide-in card, per page. Short: one heading, one sentence, 2–3 links.
 * ------------------------------------------------------------------ */

export type Popup = { heading: string; text: string; links: NetworkLink[] };

const KIDS_POPUP: Popup = {
  heading: 'Boxe enfant, aussi aux Minimes',
  text: 'Boxing Center Toulouse Minimes accueille aussi les enfants dès 3 ans, et le TMBC, notre club partenaire, a sa boxe éducative.',
  links: [networkLink('minimes', 'activites'), networkLink('tmbc', 'activites')]
};

export const POPUPS: Record<string, Popup> = {
  home: {
    heading: 'Plus près de Toulouse ?',
    text: 'Le Club de Boxe Blagnac fait partie du réseau Boxing Center. Aux Minimes, à Saint-Cyprien ou à Portet, un autre club du réseau vous accueille.',
    links: [networkLink('minimes', 'club'), networkLink('saint-cyprien', 'salle'), networkLink('portet', 'activites')]
  },
  hub: {
    heading: 'Les mêmes cours, en ville',
    text: 'Les clubs Boxing Center de l’agglomération publient leurs activités et leurs horaires en ligne.',
    links: [
      networkLink('minimes', 'activites'),
      networkLink('saint-cyprien', 'activites'),
      networkLink('portet', 'activites')
    ]
  },
  'eveil-baby-boxing': KIDS_POPUP,
  'boxe-educative': KIDS_POPUP,
  'boxe-ados': {
    heading: 'Toulouse, après les cours ?',
    text: 'Si le lycée ou le trajet passe par Toulouse, voyez les activités des clubs du réseau aux Minimes.',
    links: [networkLink('tmbc', 'activites'), networkLink('minimes', 'plannings')]
  },
  'boxe-anglaise-loisir': {
    heading: 'Vous travaillez à Toulouse ?',
    text: 'Aux Minimes et à Saint-Cyprien, les clubs Boxing Center publient leurs horaires : de quoi boxer près du bureau.',
    links: [
      networkLink('minimes', 'plannings'),
      networkLink('saint-cyprien', 'plannings'),
      networkLink('tmbc', 'activites')
    ]
  },
  'boxe-competition': {
    heading: 'Le ring, côté Minimes',
    text: 'Le TMBC, club de boxe anglaise affilié à la FFBoxe et partenaire du réseau, prépare lui aussi ses boxeurs aux rencontres.',
    links: [networkLink('tmbc', 'club'), networkLink('tmbc', 'galerie'), networkLink('minimes', 'coachs')]
  },
  'cardio-boxe': {
    heading: 'S’entraîner aussi en ville',
    text: 'Aux Minimes, à Saint-Cyprien et à Portet, les clubs du réseau Boxing Center proposent d’autres formats pour s’entraîner.',
    links: [
      networkLink('minimes', 'activites'),
      networkLink('saint-cyprien', 'salle'),
      networkLink('portet', 'activites')
    ]
  },
  first: {
    heading: 'Commencer plus près de chez vous ?',
    text: 'Les clubs du réseau Boxing Center expliquent eux aussi comment se passe une première venue.',
    links: [networkLink('minimes', 'premiere-seance'), networkLink('tmbc', 'club')]
  },
  faq: {
    heading: 'Horaires et formules du réseau',
    text: 'Les clubs Boxing Center de l’agglomération publient leurs horaires et leurs formules en ligne.',
    links: [networkLink('minimes', 'plannings'), NETWORK.abonnements, networkLink('tmbc', 'club')]
  },
  access: {
    heading: 'Trop loin de Blagnac ?',
    text: 'Le réseau Boxing Center a d’autres clubs aux Minimes, à Saint-Cyprien et à Portet-sur-Garonne.',
    links: [networkLink('minimes', 'contact'), networkLink('saint-cyprien', 'salle'), networkLink('portet', 'activites')]
  }
};
