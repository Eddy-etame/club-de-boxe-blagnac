/**
 * Per-page social cards — the image beside a Google result, in a WhatsApp or
 * Facebook share, and in the answer engines that show one.
 *
 * Mechanism (studied on the Colomiers sibling, then made Blagnac's own):
 *  - Google crops the card to a centred square and shows it near 100 px.
 *    So the card is composed from the centre, around one enormous word — the
 *    page's subject — that stays legible when everything else is cropped.
 *  - The photo is THIS page's photo, pushed down into the site's ink so the
 *    word reads and the room stays.
 *  - Two formats per page: 1200×630 (og:image) and 1200×1200 (announced in
 *    the page's JSON-LD — the ratio Google prefers for thumbnails).
 *
 * Look: the site's own system, not the sibling's. Ink, paper, the orange
 * signal and the lime flight colour; Archivo Narrow for the word, IBM Plex
 * Mono for the coordinates; and the second line steps right, like the second
 * line of the homepage hero.
 *
 * Everything comes from ROUTES. A page that changes subject or photo changes
 * card, and the build audit refuses two identical cards.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { ROUTES, ogId } from '@/data/routes';
import { SITE } from '@/data/site';

export const prerender = true;

const INK = '#141411';
const PAPER = '#e8e5dc';
const SIGNAL = '#ff633e';
const FLIGHT = '#b9ff4b';

const FORMATS: Record<string, readonly [number, number]> = { '': [1200, 630], '-carre': [1200, 1200] };

export const getStaticPaths: GetStaticPaths = () =>
  ROUTES.flatMap((r) => Object.keys(FORMATS).map((f) => ({ params: { page: `${ogId(r.path)}${f}` } })));

const font = (pkg: string, file: string) =>
  readFileSync(resolve(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));

const FONTS = [
  { name: 'Archivo Narrow', data: font('archivo-narrow', 'archivo-narrow-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
  { name: 'Plex Mono', data: font('ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff'), weight: 500 as const, style: 'normal' as const },
  { name: 'Plex Mono', data: font('ibm-plex-mono', 'ibm-plex-mono-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const }
];

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, props: Record<string, unknown>, ...children: unknown[]): Node => ({
  type,
  props: { ...props, children: children.length === 1 ? children[0] : children }
});

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/** A long subject breaks at the space closest to its middle. */
function linesOf(word: string): string[] {
  const W = word.toUpperCase();
  if (W.length <= 10 || !W.includes(' ')) return [W];
  const spaces = [...W.matchAll(/ /g)].map((m) => m.index ?? 0);
  const cut = spaces.reduce((a, b) => (Math.abs(b - W.length / 2) < Math.abs(a - W.length / 2) ? b : a));
  return [W.slice(0, cut), W.slice(cut + 1)];
}

async function photo(file: string, w: number, hgt: number) {
  const buf = await sharp(resolve(process.cwd(), 'public/images', file))
    .resize(w, hgt, { fit: 'cover', position: sharp.strategy.attention })
    .modulate({ saturation: 0.82 })
    .jpeg({ quality: 86 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

const layer = (W: number, H: number, style: Record<string, unknown>) =>
  h('div', { style: { position: 'absolute', left: 0, top: 0, width: W, height: H, display: 'flex', ...style } });

export const GET: APIRoute = async ({ params }) => {
  const raw = String(params.page);
  const suffix = raw.endsWith('-carre') ? '-carre' : '';
  const id = suffix ? raw.slice(0, -suffix.length) : raw;
  const route = ROUTES.find((r) => ogId(r.path) === id);
  if (!route) return new Response('Unknown card', { status: 404 });

  const [W, H] = FORMATS[suffix];
  const square = W === H;
  const lines = linesOf(route.og.word);
  const longest = Math.max(...lines.map((l) => l.length));
  const usable = square ? 1000 : 960;
  const size = Math.min(square ? 250 : 176, Math.floor(usable / (longest * 0.56)));
  const step = Math.round(size * 0.42);
  const mono = square ? 28 : 22;
  const host = SITE.url.replace(/^https?:\/\/(www\.)?/, '');

  const tree = h(
    'div',
    { style: { width: W, height: H, display: 'flex', position: 'relative', background: INK, fontFamily: 'Plex Mono' } },
    h('img', { src: await photo(route.og.photo, W, H), width: W, height: H, style: { position: 'absolute', left: 0, top: 0 } }),
    /* The ink comes down over the room: the word reads, the room stays. */
    layer(W, H, {
      backgroundImage: `linear-gradient(180deg, ${rgba(INK, 0.5)} 0%, ${rgba(INK, 0.42)} 38%, ${rgba(INK, 0.86)} 82%, ${rgba(INK, 0.96)} 100%)`
    }),
    layer(W, H, { backgroundImage: `radial-gradient(ellipse at center, ${rgba(INK, 0.5)} 0%, ${rgba(INK, 0)} 64%)` }),

    /* Top: coordinates, like the hero's first line. */
    h(
      'div',
      {
        style: {
          position: 'absolute', left: 0, top: 0, width: W, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: square ? '52px 60px' : '38px 52px', fontSize: mono, fontWeight: 600,
          letterSpacing: 3, color: PAPER
        }
      },
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 14 } },
        h('div', { style: { width: 12, height: 12, borderRadius: 6, background: SIGNAL, display: 'flex' } }),
        'BLAGNAC 31700'
      ),
      h('div', { style: { display: 'flex', opacity: 0.86 } }, host)
    ),

    /* Centre: what the square crop keeps. */
    h(
      'div',
      {
        style: {
          position: 'absolute', left: 0, top: 0, width: W, height: H, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: square ? 30 : 20
        }
      },
      h(
        'div',
        { style: { display: 'flex', fontSize: mono, fontWeight: 600, letterSpacing: 4, color: FLIGHT } },
        route.og.kicker.toUpperCase()
      ),
      h(
        'div',
        {
          style: {
            display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Archivo Narrow',
            /* No text-shadow: resvg draws it unblurred, as a hard offset copy.
               The ink gradient and the radial carry the contrast instead. */
            fontWeight: 700, fontSize: size, lineHeight: 0.9, letterSpacing: -size * 0.012, color: PAPER
          }
        },
        ...lines.map((l, i) =>
          h('div', { style: { display: 'flex', marginLeft: i === 1 ? step : 0, marginRight: i === 0 && lines.length > 1 ? step : 0 } }, l)
        )
      ),
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 12 } },
        h('div', { style: { width: square ? 160 : 120, height: square ? 7 : 5, background: FLIGHT, display: 'flex' } }),
        h('div', { style: { width: square ? 16 : 12, height: square ? 16 : 12, borderRadius: 8, background: SIGNAL, display: 'flex' } })
      )
    ),

    /* Bottom: the club and the network, legible at full size, cropped harmlessly. */
    h(
      'div',
      {
        style: {
          position: 'absolute', left: 0, bottom: 0, width: W, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: square ? '52px 60px' : '38px 52px', fontSize: mono, fontWeight: 600,
          letterSpacing: 3, color: PAPER
        }
      },
      h('div', { style: { display: 'flex' } }, 'CLUB DE BOXE BLAGNAC'),
      h('div', { style: { display: 'flex', color: SIGNAL } }, 'RÉSEAU BOXING CENTER')
    )
  );

  const svg = await satori(tree as never, { width: W, height: H, fonts: FONTS });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: false } }).render().asPng();
  const jpg = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toBuffer();

  return new Response(new Uint8Array(jpg), {
    headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=86400' }
  });
};
