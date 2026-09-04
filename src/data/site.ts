import { AREA } from './club';

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
  /* Both locks stay engaged until the owner confirms the domain and the
     outbound club links. See the header of club.ts for what this site is
     and, deliberately, is not. */
  indexable:
    import.meta.env.PUBLIC_SITE_INDEXABLE === 'true'
    && hasConfirmedUrl
    && releaseValidated,
  locale: 'fr_FR',
  lang: 'fr',
  lastModified: '2026-09-04',
  area: `${AREA.city}, ${AREA.position}`,
  description:
    'Guide de la boxe à Blagnac, au nord-ouest de Toulouse : disciplines, âges, déroulé d’une séance, budget et matériel pour débuter.',
  socialImage: '/images/og-club-boxe-blagnac.jpg'
} as const;

export const NAV = [
  { href: '/', label: 'Le club' },
  { href: '/cours-de-boxe-blagnac/', label: 'Les cours' },
  { href: '/premiere-seance/', label: 'Première séance' },
  { href: '/faq/', label: 'Questions' },
  { href: '/acces-contact/', label: 'Contact' }
] as const;

export const PUBLIC_PAGES = [
  '/',
  '/cours-de-boxe-blagnac/',
  '/premiere-seance/',
  '/faq/',
  '/acces-contact/',
  '/confidentialite/'
] as const;

export function absoluteUrl(pathname = '/') {
  return new URL(pathname, `${SITE.url}/`).toString();
}
