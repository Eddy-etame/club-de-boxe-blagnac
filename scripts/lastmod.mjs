/**
 * Writes src/data/lastmod.json: the real last-change date of every public page.
 *
 * Dates are computed here, where full git history exists, and committed.
 * Vercel builds from a shallow clone, where every file older than the clone
 * depth looks as if it was created in the boundary commit. Reading git there
 * would stamp unchanged pages as modified on every deploy: exactly the false
 * freshness that teaches engines to ignore lastmod. So in a shallow clone, or
 * with no git at all, the committed file is left untouched.
 *
 * A page's date is the newest of its own source file and the data files it
 * renders from. Uncommitted edits count as now, because they are about to ship.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const OUT = 'src/data/lastmod.json';
const DATA = ['src/data/club.ts', 'src/data/seo.ts', 'src/data/seo-map.ts'];

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

try {
  if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
    console.log('lastmod: shallow clone, keeping the committed ' + OUT + '.');
    process.exit(0);
  }
} catch {
  console.log('lastmod: git unavailable, keeping the committed ' + OUT + '.');
  process.exit(0);
}

const iso = (value) => new Date(value).toISOString().replace(/\.\d{3}Z$/, '+00:00');
const now = iso(Date.now());

function dateOf(file) {
  if (git(['status', '--porcelain', '--', file])) return now;
  const committed = git(['log', '-1', '--format=%cI', '--', file]);
  return committed ? iso(committed) : null;
}

const newest = (dates) => dates.filter(Boolean).sort().pop() || null;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const slugs = [...readFileSync('src/data/club.ts', 'utf8').matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
const dataDate = newest(DATA.map(dateOf));
const map = {};

for (const file of walk('src/pages')) {
  const rel = relative('src/pages', file).split(sep).join('/');
  if (!rel.endsWith('.astro') || rel === '404.astro') continue;
  const date = newest([dateOf(file.split(sep).join('/')), dataDate]);
  if (rel.includes('[slug]')) {
    const base = '/' + rel.replace('[slug].astro', '');
    for (const slug of slugs) map[base + slug + '/'] = date;
  } else {
    map['/' + rel.replace(/index\.astro$/, '').replace(/\.astro$/, '/')] = date;
  }
}

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n');
console.log('lastmod: ' + Object.keys(sorted).length + ' routes dated, newest ' + newest(Object.values(sorted)) + '.');
