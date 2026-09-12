import type { APIRoute } from 'astro';
import { PUBLIC_PAGES, SITE, absoluteUrl } from '@/data/site';
import { DISCIPLINES } from '@/data/club';
import { pageLastModified } from '@/lib/lastmod';
import { ogId } from '@/data/routes';

/**
 * Sitemap with the image extension.
 *
 * lastmod is each page's real last-change date (src/lib/lastmod.ts), never a
 * site-wide constant: Bing prioritises recrawls on it, and Google stops
 * trusting it on sites where it is false. There is no changefreq or priority
 * (Google and Bing both ignore them), and no image:title or image:caption
 * (Google deprecated both in 2022; only image:loc is read).
 */

const PAGE_IMAGES: Record<string, string[]> = {
  '/': ['garde-boxeuse-1600.jpg', 'cours-collectif-sacs-1600.jpg', 'salle-de-boxe-1600.jpg', 'frappe-au-sac-1600.jpg'],
  '/cours-de-boxe-blagnac/': ['travail-aux-pattes-1400.jpg'],
  '/premiere-seance/': ['shadow-boxing-1400.jpg'],
  '/acces-contact/': ['boxe-corner-1600.jpg'],
  ...Object.fromEntries(
    DISCIPLINES.map((d) => [
      '/cours-de-boxe-blagnac/' + d.slug + '/',
      [d.image.file + '-' + d.image.widths[d.image.widths.length - 1] + '.jpg']
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
        /* The page's photos, then its own social card (src/pages/og). */
        const images = [...(PAGE_IMAGES[path] ?? []).map((file) => '/images/' + file), '/og/' + ogId(path) + '-carre.jpg']
          .map((src) => '\n    <image:image><image:loc>' + escape(absoluteUrl(src)) + '</image:loc></image:image>')
          .join('');
        return '  <url>\n    <loc>' + escape(absoluteUrl(path)) + '</loc>\n    <lastmod>' + pageLastModified(path) + '</lastmod>' + images + '\n  </url>';
      }).join('\n')
    : '';

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
    + entries
    + '\n</urlset>\n';

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
