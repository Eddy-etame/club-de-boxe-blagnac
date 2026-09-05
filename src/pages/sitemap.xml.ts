import type { APIRoute } from 'astro';
import { PUBLIC_PAGES, SITE, absoluteUrl } from '@/data/site';
import { DISCIPLINES } from '@/data/club';

/**
 * Sitemap with the image extension.
 *
 * Google's image results are a separate, far less contested surface than web
 * results, and this site ships 12 original press-quality photographs that no
 * competitor has. Declaring them with captions and titles is the cheapest
 * distribution win available — and it keeps the photographer credited in a
 * machine-readable place.
 *
 * `priority` and `changefreq` are advisory: Google ignores them, Bing and
 * Yandex still read them. They cost two attributes.
 */

type PageMeta = {
  priority: string;
  changefreq: string;
  images: { loc: string; caption: string; title: string }[];
};

const CREDIT = 'Axel Derewiany';

const img = (file: string, caption: string, title: string) => ({
  loc: absoluteUrl(`/images/${file}`),
  caption: `${caption} — photo © ${CREDIT}`,
  title
});

const PAGE_META: Record<string, PageMeta> = {
  '/': {
    priority: '1.0',
    changefreq: 'weekly',
    images: [
      img('garde-boxeuse-1600.jpg', 'Boxeuse en garde pendant un entraînement de boxe anglaise', 'Boxe anglaise à Blagnac'),
      img('cours-collectif-sacs-1600.jpg', 'Cours collectif de boxe, travail au sac de frappe', 'Cours de boxe à Blagnac'),
      img('salle-de-boxe-1600.jpg', 'Intérieur d’une salle de boxe équipée', 'Salle de boxe, nord-ouest toulousain'),
      img('frappe-au-sac-1600.jpg', 'Entraînement au sac de frappe', 'Entraînement de boxe')
    ]
  },
  '/cours-de-boxe-blagnac/': {
    priority: '0.9',
    changefreq: 'monthly',
    images: [
      img('travail-aux-pattes-1400.jpg', 'Travail aux pattes d’ours pendant un cours de boxe', 'Cours de boxe anglaise')
    ]
  },
  '/premiere-seance/': {
    priority: '0.8',
    changefreq: 'monthly',
    images: [
      img('shadow-boxing-1400.jpg', 'Shadow boxing : garde et déplacement sans partenaire', 'Première séance de boxe')
    ]
  },
  '/faq/': { priority: '0.8', changefreq: 'monthly', images: [] },
  '/acces-contact/': {
    priority: '0.7',
    changefreq: 'monthly',
    images: [
      img('boxe-corner-1600.jpg', 'Échange technique entre deux boxeuses avec protections', 'Boxe féminine')
    ]
  },
  '/confidentialite/': { priority: '0.2', changefreq: 'yearly', images: [] },
  /* One entry per course page, each carrying its own photograph. */
  ...Object.fromEntries(
    DISCIPLINES.map((d) => [
      `/cours-de-boxe-blagnac/${d.slug}/`,
      {
        priority: '0.9',
        changefreq: 'monthly',
        images: [
          img(
            `${d.image.file}-${d.image.widths[d.image.widths.length - 1]}.jpg`,
            d.image.alt,
            `${d.name} — Club de Boxe Blagnac`
          )
        ]
      }
    ])
  )
};

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = () => {
  const entries = SITE.indexable
    ? PUBLIC_PAGES.map((path) => {
        const meta = PAGE_META[path] ?? { priority: '0.5', changefreq: 'monthly', images: [] };
        const images = meta.images
          .map(
            (image) =>
              `\n    <image:image>\n      <image:loc>${escape(image.loc)}</image:loc>`
              + `\n      <image:title>${escape(image.title)}</image:title>`
              + `\n      <image:caption>${escape(image.caption)}</image:caption>`
              + `\n    </image:image>`
          )
          .join('');
        return (
          `  <url>\n    <loc>${escape(absoluteUrl(path))}</loc>`
          + `\n    <lastmod>${SITE.lastModified}</lastmod>`
          + `\n    <changefreq>${meta.changefreq}</changefreq>`
          + `\n    <priority>${meta.priority}</priority>`
          + `${images}\n  </url>`
        );
      }).join('\n')
    : '';

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n`
    + `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`
    + `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`
    + `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`
    + `${entries}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
