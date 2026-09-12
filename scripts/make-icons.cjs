/**
 * Rasterises public/favicon.svg into the raster set search engines and
 * browsers actually request: /favicon.ico (16/32/48, PNG-in-ICO), a 32px PNG,
 * 192 and 512 app icons, and the 180px Apple touch icon.
 *
 * The mark is flattened onto a solid ground so it stays visible on both the
 * white and the dark search-results page: bright strokes get the ink ground,
 * dark strokes get the paper ground.
 *
 *   node scripts/make-icons.cjs
 */
const fs = require('fs');
const sharp = require('sharp');

const INK = { r: 20, g: 20, b: 17, alpha: 1 };
const PAPER = { r: 232, g: 229, b: 220, alpha: 1 };

(async () => {
  const svg = fs.readFileSync('public/favicon.svg');

  const probe = await sharp(svg, { density: 384 }).resize(64, 64).ensureAlpha().raw().toBuffer();
  let lum = 0;
  let n = 0;
  for (let i = 0; i < probe.length; i += 4) {
    if (probe[i + 3] > 128) {
      lum += 0.2126 * probe[i] + 0.7152 * probe[i + 1] + 0.0722 * probe[i + 2];
      n += 1;
    }
  }
  const ground = n && lum / n > 128 ? INK : PAPER;

  /* Two passes, never one: sharp applies a single resize per pipeline, so a
     resize -> extend -> resize chain silently keeps the padded size. The mark
     is rendered at 80% into its own buffer, then composited centred onto a
     size x size ground. */
  const render = async (size) => {
    const inner = Math.round(size * 0.8);
    const mark = await sharp(svg, { density: 384 })
      .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    const inset = Math.floor((size - inner) / 2);
    return sharp({ create: { width: size, height: size, channels: 4, background: ground } })
      .composite([{ input: mark, top: inset, left: inset }])
      .png()
      .toBuffer();
  };

  const out = { 'favicon-32.png': 32, 'icon-192.png': 192, 'icon-512.png': 512, 'apple-touch-icon.png': 180 };
  for (const [file, size] of Object.entries(out)) fs.writeFileSync('public/' + file, await render(size));

  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map(render));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = sizes.map((size, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size, 0);
    e.writeUInt8(size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(pngs[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += pngs[i].length;
    return e;
  });
  fs.writeFileSync('public/favicon.ico', Buffer.concat([header, ...entries, ...pngs]));

  console.log('icons: ground ' + (ground === INK ? 'ink' : 'paper') + '; wrote favicon.ico (16/32/48), favicon-32.png, icon-192.png, icon-512.png, apple-touch-icon.png');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
