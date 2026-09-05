import { AREA, DISCIPLINES } from './club';

const fallbackUrl = 'https://club-de-boxe-blagnac.invalid';
const configuredUrl = import.meta.env.PUBLIC_SITE_URL?.trim();
const hasConfirmedUrl = Boolean(
  configuredUrl
  && /^https:\/\//i.test(configuredUrl)
  && !/\.(?:invalid|example)(?:\/|$)/i.test(configuredUrl)
  && !/localhost|127\.0\.0\.1/i.test(configuredUrl)
);
const releaseValidated =
  import.meta.env.PUBLIC_RELEASE_VALIDATED === 'identity-legal-photo-rights-confirmed';

export const SITE = {
  name: 'Club de Boxe Blagnac',
  shortName: 'CB / BLG',
  url: (configuredUrl || fallbackUrl).replace(/\/$/, ''),
  /* Indexing stays locked until the final domain is confirmed. Flip both
     env vars together; nothing else needs to change. */
  indexable:
    import.meta.env.PUBLIC_SITE_INDEXABLE === 'true'
    && hasConfirmedUrl
    && releaseValidated,
  locale: 'fr_FR',
  lang: 'fr',
  lastModified: '2026-09-04',
  area: `${AREA.city}, ${AREA.position}`,
  description:
    'Club de boxe anglaise à Blagnac (31700) depuis 2011. Six cours de l’éveil dès 3 ans au groupe compétition, 21 créneaux par semaine, séance d’essai gratuite.',
  socialImage: '/images/og-club-boxe-blagnac.jpg'
} as const;

export const NAV = [
  { href: '/', label: 'Le club' },
  { href: '/cours-de-boxe-blagnac/', label: 'Les cours' },
  { href: '/premiere-seance/', label: 'Séance d’essai' },
  { href: '/faq/', label: 'Questions' },
  { href: '/acces-contact/', label: 'Accès & contact' }
] as const;

export const COURSE_PAGES = DISCIPLINES.map((d) => `/cours-de-boxe-blagnac/${d.slug}/`);

export const PUBLIC_PAGES = [
  '/',
  '/cours-de-boxe-blagnac/',
  ...COURSE_PAGES,
  '/premiere-seance/',
  '/faq/',
  '/acces-contact/',
  '/confidentialite/'
] as const;

export function absoluteUrl(pathname = '/') {
  return new URL(pathname, `${SITE.url}/`).toString();
}
