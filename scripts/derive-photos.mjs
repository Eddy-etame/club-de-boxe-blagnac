/**
 * Derives responsive web assets from the curated source photographs.
 *
 * Sources are 6720x4480 originals from the audited archive. Derivatives are
 * resized only — never cropped — so the photographer watermark survives, and
 * metadata is stripped so no GPS or camera identity ships to the public.
 */
import { createReadStream, existsSync, mkdirSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { join } from 'node:path';
import sharp from 'sharp';

const CSV = '.research/photo-curation/inventory.csv';
const OUT = 'public/images';

/* id -> [output basename, widths, alt-driving role] */
const WANTED = {
  'BC-078': ['garde-boxeuse', [480, 960, 1600]],
  'BC-063': ['cours-collectif-sacs', [480, 960, 1600]],
  'BC-023': ['sacs-de-frappe', [420, 900, 1400]],
  'BC-070': ['preparation-physique', [480, 960, 1600]],
  'BC-079': ['shadow-boxing', [420, 900, 1400]],
  'BC-075': ['travail-aux-pattes', [420, 900, 1400]],
  'BC-028': ['salle-de-boxe', [480, 960, 1600]],
  'BC-064': ['frappe-au-sac', [480, 960, 1600]],
  'BC-062': ['boxeuse-sac', [420, 900, 1400]],
  'BC-067': ['renforcement-groupe', [480, 960, 1600]],
  'BC-072': ['cours-debout-groupe', [480, 960, 1600]],
  'BC-071': ['coaching-individuel', [420, 900, 1400]],
  'BC-076': ['coin-de-ring', [420, 900, 1400]],
  'BC-077': ['ring-encadrement', [480, 960, 1600]],
  'BC-030': ['accueil-club', [420, 900, 1400]],
  'BC-069': ['espace-renforcement', [420, 900, 1400]],
  'BC-034': ['sparring-ring', [480, 960, 1600]],
  'BC-021': ['cours-enfants', [420, 900, 1400]],
  'BC-032': ['sparring-technique', [480, 960, 1600]],
  'BC-080': ['conseil-coach', [420, 900, 1400]]
};

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { cur += '"'; i += 1; }
      else quoted = !quoted;
    } else if (ch === ',' && !quoted) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const rows = [];
let header = null;
const rl = createInterface({ input: createReadStream(CSV, 'utf8'), crlfDelay: Infinity });
for await (const line of rl) {
  if (!line.trim()) continue;
  const cells = parseCsvLine(line);
  if (!header) { header = cells.map((c) => c.replace(/^\uFEFF/, '')); continue; }
  rows.push(Object.fromEntries(header.map((h, i) => [h, cells[i]])));
}

mkdirSync(OUT, { recursive: true });
let made = 0;

for (const [id, [name, widths]] of Object.entries(WANTED)) {
  const row = rows.find((r) => r.id === id);
  if (!row) { console.error(`  ! ${id}: not in inventory`); continue; }
  if (!existsSync(row.path)) { console.error(`  ! ${id}: source missing — ${row.path}`); continue; }

  const largest = Math.max(...widths);
  const meta = await sharp(row.path).metadata();
  const height = Math.round((meta.height / meta.width) * largest);

  for (const width of widths) {
    await sharp(row.path)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(OUT, `${name}-${width}.webp`));
    made += 1;
  }

  await sharp(row.path)
    .resize({ width: largest, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(join(OUT, `${name}-${largest}.jpg`));
  made += 1;

  console.log(`  ${id} -> ${name} (${largest}x${height}) ${widths.join('/')} webp + jpg`);
}

console.log(`\nDerived ${made} files into ${OUT}.`);
