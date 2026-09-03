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
  name: 'Club de Boxe Blagnac–Toulouse',
  shortName: 'CB / BT',
  url: (configuredUrl || fallbackUrl).replace(/\/$/, ''),
  indexable:
    import.meta.env.PUBLIC_SITE_INDEXABLE === 'true'
    && hasConfirmedUrl
    && releaseValidated,
  locale: 'fr_FR',
  lang: 'fr',
  lastModified: '2026-09-04',
  area: 'Blagnac, au nord-ouest de Toulouse',
  description:
    'Une préversion de site pour un projet de club de boxe à Blagnac, au nord-ouest de Toulouse. Les informations opérationnelles restent à valider.',
  socialImage: '/images/og-club-boxe-blagnac.jpg'
} as const;

export const NAV = [
  { href: '/', label: 'Le projet' },
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

export const PENDING_FACTS = [
  'nom public et identité légale',
  'lieu exact des entraînements',
  'disciplines et publics accueillis',
  'équipe et qualifications',
  'planning, tarifs et modalités d’essai',
  'coordonnées publiques et affiliations'
] as const;

export function absoluteUrl(pathname = '/') {
  return new URL(pathname, `${SITE.url}/`).toString();
}
