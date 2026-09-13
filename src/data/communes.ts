/**
 * The communes this site owns in the network's split (owner's decision,
 * 2026-09-13): Blagnac's north-west corridor. Colomiers, Mondonville, Pibrac
 * and Brax belong to the Boxing Center Colomiers site, which stopped
 * targeting these four the same day.
 *
 * Every figure is fetched, not typed from memory: INSEE code, postcode,
 * municipal population, surface and centre from geo.api.gouv.fr
 * (2026-09-13), Wikidata ids resolved the same day. The distance is computed
 * from the API's centre of each commune to the API's centre of Blagnac and
 * rounded to the kilometre — the pages never claim a precision the centres do
 * not have, and never measure to "the club", whose address is not published.
 *
 * Each commune page borrows a photo no other page uses as its social card;
 * the alt describes the scene, the caption says where it was taken.
 */
export type Commune = {
  slug: string;
  name: string;
  insee: string;
  postalCode: string;
  population: number;
  surfaceHa: number;
  qid: string;
  centre: { lat: number; lon: number };
  /** Where the commune lies from Blagnac, from the bearing between the two centres. */
  direction: string;
  photo: { file: string; widths: number[]; width: number; height: number; alt: string };
};

/** Centre of Blagnac (INSEE 31069) as geo.api.gouv.fr gives it. */
const BLAGNAC = { lat: 43.641, lon: 1.377 };

export const COMMUNES: Commune[] = [
  {
    slug: 'beauzelle',
    name: 'Beauzelle',
    insee: '31056',
    postalCode: '31700',
    population: 8713,
    surfaceHa: 465,
    qid: 'Q770307',
    centre: { lat: 43.668, lon: 1.3753 },
    direction: 'au nord',
    photo: {
      file: 'ring-encadrement',
      widths: [480, 960, 1600],
      width: 1600,
      height: 1048,
      alt: 'Sur un ring, un entraîneur explique un enchaînement à un boxeur en garde'
    }
  },
  {
    slug: 'seilh',
    name: 'Seilh',
    insee: '31541',
    postalCode: '31840',
    population: 3356,
    surfaceHa: 616,
    qid: 'Q1429166',
    centre: { lat: 43.692, lon: 1.3574 },
    direction: 'au nord',
    photo: {
      file: 'boxe-detail',
      widths: [480, 700, 1000],
      width: 1000,
      height: 606,
      alt: 'Un jeune boxeur, bandes rouges aux mains, travaille sa garde sur un ring'
    }
  },
  {
    slug: 'cornebarrieu',
    name: 'Cornebarrieu',
    insee: '31150',
    postalCode: '31700',
    population: 8978,
    surfaceHa: 1881,
    qid: 'Q1344709',
    centre: { lat: 43.649, lon: 1.3197 },
    direction: 'à l’ouest',
    photo: {
      file: 'coin-de-ring',
      widths: [420, 900, 1400],
      width: 1400,
      height: 933,
      alt: 'Un entraîneur donne une consigne sur le ring, trois boxeurs gantés l’écoutent'
    }
  },
  {
    slug: 'aussonne',
    name: 'Aussonne',
    insee: '31032',
    postalCode: '31840',
    population: 7997,
    surfaceHa: 1396,
    qid: 'Q634738',
    centre: { lat: 43.6841, lon: 1.3278 },
    direction: 'au nord-ouest',
    photo: {
      file: 'boxe-corner',
      widths: [480, 960, 1600],
      width: 1600,
      height: 984,
      alt: 'Deux boxeuses casquées travaillent un échange technique, gants levés'
    }
  }
];

export const communePath = (c: Pick<Commune, 'slug'>) => `/club-de-boxe-${c.slug}/`;
export const communeKey = (c: Pick<Commune, 'slug'>) => `club-de-boxe-${c.slug}`;
export const COMMUNE_PAGES = COMMUNES.map(communePath);

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Distance between the two centres, rounded to the kilometre. */
export function kmFromBlagnac(c: Commune): number {
  const dLat = rad(c.centre.lat - BLAGNAC.lat);
  const dLon = rad(c.centre.lon - BLAGNAC.lon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(BLAGNAC.lat)) * Math.cos(rad(c.centre.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(a)));
}

export function commune(slug: string): Commune {
  const found = COMMUNES.find((c) => c.slug === slug);
  if (!found) throw new Error(`communes.ts: unknown commune "${slug}"`);
  return found;
}
