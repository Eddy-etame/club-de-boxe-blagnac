import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function stripNonVisible(html) {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<template[\s\S]*?<\/template>/gi, '');
}

function outputForUrl(url) {
  const pathname = url.split('#')[0].split('?')[0];
  if (!pathname || pathname.startsWith('/api/')) return null;
  const clean = pathname.replace(/^\//, '');
  if (!clean) return join(dist, 'index.html');
  if (pathname.endsWith('/')) return join(dist, clean, 'index.html');
  return join(dist, clean);
}

assert(existsSync(dist), 'dist/ is missing; run astro build first.');
if (!existsSync(dist)) {
  console.error('Build audit failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}

const files = walk(dist);
const htmlFiles = files.filter((file) => extname(file) === '.html');
const textFiles = files.filter((file) => ['.html', '.css', '.js', '.json', '.txt', '.xml', '.svg'].includes(extname(file)));

assert(htmlFiles.length >= 7, `Expected at least 7 HTML pages, found ${htmlFiles.length}.`);

for (const file of textFiles) {
  const content = readFileSync(file, 'utf8');
  assert(!/boxing\s+center/i.test(content), `Forbidden network reference in ${relative(dist, file)}.`);
}

for (const file of htmlFiles) {
  const rel = relative(dist, file);
  const html = readFileSync(file, 'utf8');
  const visible = stripNonVisible(html);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim();
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  const images = [...html.matchAll(/<img\s+[^>]*>/gi)].map((match) => match[0]);
  const srcsets = [...html.matchAll(/\ssrcset="([^"]+)"/gi)].map((match) => match[1]);
  const links = [...html.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>/gi)].map((match) => match[1]);

  assert(h1Count === 1, `${rel}: expected one h1, found ${h1Count}.`);
  assert(Boolean(title && title.length <= 68), `${rel}: missing or oversized title (${title?.length || 0}).`);
  assert(Boolean(description && description.length >= 80 && description.length <= 180), `${rel}: description should be 80–180 chars (${description?.length || 0}).`);
  assert(Boolean(canonical?.startsWith('https://')), `${rel}: canonical must be absolute HTTPS.`);
  assert(!/Eddy Etame Etame|Angoula Onambele|Mbosseu Brad/i.test(visible), `${rel}: technical attribution leaked into visible body.`);

  for (const link of links) {
    if (!link.startsWith('/')) continue;
    const output = outputForUrl(link);
    if (output) assert(existsSync(output), `${rel}: broken internal link ${link}.`);
  }

  for (const image of images) {
    assert(/\salt="[^"]*"/i.test(image), `${rel}: img without alt.`);
    assert(/\swidth="\d+"/i.test(image) && /\sheight="\d+"/i.test(image), `${rel}: img without intrinsic dimensions.`);
    const source = image.match(/\ssrc="([^"]+)"/i)?.[1];
    const output = source?.startsWith('/') ? outputForUrl(source) : null;
    if (output) assert(existsSync(output), `${rel}: missing image ${source}.`);
  }

  for (const srcset of srcsets) {
    for (const candidate of srcset.split(',')) {
      const source = candidate.trim().split(/\s+/)[0];
      const output = source?.startsWith('/') ? outputForUrl(source) : null;
      if (output) assert(existsSync(output), `${rel}: missing srcset image ${source}.`);
    }
  }

  for (const match of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch {
      failures.push(`${rel}: invalid JSON-LD.`);
    }
  }
}

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const indexRequested = process.env.PUBLIC_SITE_INDEXABLE === 'true';
const releaseValidated =
  process.env.PUBLIC_RELEASE_VALIDATED === 'identity-legal-photo-rights-confirmed';
const configuredUrl = process.env.PUBLIC_SITE_URL?.trim() || '';
const hasConfirmedUrl =
  /^https:\/\//i.test(configuredUrl)
  && !/\.(?:invalid|example)(?:\/|$)/i.test(configuredUrl)
  && !/localhost|127\.0\.0\.1/i.test(configuredUrl);
const productionIndexing = indexRequested && releaseValidated && hasConfirmedUrl;

if (indexRequested) {
  assert(releaseValidated, 'Indexing request rejected: PUBLIC_RELEASE_VALIDATED does not confirm identity, legal publisher and photo rights.');
  assert(hasConfirmedUrl, 'Indexing request rejected: PUBLIC_SITE_URL must be a confirmed public HTTPS domain.');
}

if (productionIndexing) {
  assert(/Allow:\s*\//i.test(robots), 'Indexable build must allow crawling.');
  assert(/<url>/i.test(sitemap), 'Indexable build must contain sitemap URLs.');
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    if (relative(dist, file) === '404.html') {
      assert(/name="robots"\s+content="noindex,nofollow,noarchive,nosnippet"/i.test(html), '404.html must remain noindex.');
    } else {
      assert(/name="robots"\s+content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"/i.test(html), `${relative(dist, file)}: indexable build lacks index,follow.`);
    }
  }
} else {
  assert(/Disallow:\s*\//i.test(robots), 'Protected build must disallow crawling.');
  assert(!/<url>/i.test(sitemap), 'Protected build must expose an empty sitemap.');
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    assert(/name="robots"\s+content="noindex,nofollow,noarchive,nosnippet"/i.test(html), `${relative(dist, file)}: protected build lacks noindex.`);
  }
}

for (const required of ['ai.txt', 'llms.txt', 'llms-full.txt', 'humans.txt', 'mcp-card.json', '.well-known/mcp.json']) {
  assert(existsSync(join(dist, required)), `Missing machine surface: ${required}.`);
}

for (const file of files.filter((item) => statSync(item).isFile())) {
  const size = statSync(file).size;
  if (/\.(jpe?g|webp|avif|png)$/i.test(file)) {
    assert(size <= 500_000, `${relative(dist, file)} exceeds 500 KB (${size} bytes).`);
  }
}

/* ------------------------------------------------------------------ *
 * Blank-page regression guards.
 *
 * Two defects shipped together and made the homepage render as a solid
 * black rectangle:
 *   1. an opaque hero curtain whose resting state covered the viewport,
 *      opened only by an animation gated on a second readiness class that
 *      a throttled requestAnimationFrame never added;
 *   2. mix-blend-mode: difference on position: fixed chrome, which forces
 *      the whole document into one composited group.
 * Both are invisible to a static HTML audit and to `astro check`, so they
 * are asserted against the CSS the build actually emitted.
 * ------------------------------------------------------------------ */
const cssText = files
  .filter((file) => extname(file) === '.css')
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');
const inlineStyles = htmlFiles
  .map((file) => (readFileSync(file, 'utf8').match(/<style[\s\S]*?<\/style>/gi) || []).join('\n'))
  .join('\n');
const allCss = `${cssText}\n${inlineStyles}`;

assert(
  !/\.page-ready/.test(allCss),
  'A .page-ready gate is back in the emitted CSS. Entry animations must rest on their FINAL state and use animation-fill-mode: both, so content is never invisible when the readiness class is late or never arrives.'
);

assert(
  !/mix-blend-mode\s*:\s*difference/.test(allCss),
  'mix-blend-mode: difference is back in the emitted CSS. It forces full-document compositing and blanks the page in some rasterizers; resolve header contrast with the html[data-tone] surface tracker instead.'
);

/* The hero headline must stay inside the narrowest supported viewport.
   "à BLAGNAC" measures ~4.87em wide; at 320px with 2×16px of page padding
   only 288px are available, so the mobile fluid ratio has to stay at or
   under 17vw. Read from source, not from the minified bundle, so the rule
   is matched by its selector rather than by whichever clamp comes first. */
const homeSource = readFileSync(join(root, 'src', 'pages', 'index.astro'), 'utf8');
const mobileHeroBlock = homeSource.match(
  /@media\s*\(max-width:\s*36rem\)[\s\S]*?\.home-hero h1\s*\{([\s\S]*?)\}/
);
assert(
  mobileHeroBlock !== null,
  'The mobile (36rem) .home-hero h1 rule is missing; it guards the headline against clipping at 320px.'
);
if (mobileHeroBlock) {
  const ratio = mobileHeroBlock[1].match(/font-size:\s*clamp\([^,]+,\s*([\d.]+)vw/);
  assert(ratio !== null, 'The mobile hero H1 must use a vw-based clamp so it can never exceed the viewport.');
  if (ratio) {
    assert(
      Number(ratio[1]) <= 17,
      `Mobile hero H1 is sized at ${ratio[1]}vw. Above 17vw the last letter of "BLAGNAC" is clipped at 320px.`
    );
  }
}


/* ------------------------------------------------------------------ *
 * Voice guard.
 *
 * The site is a club that exists and is open. Copy that hedges — "en
 * validation", "projet", "prochainement", "adressez-vous au club" — makes it
 * read as unbuilt, which destroys commercial trust. That wording shipped once;
 * it does not ship again.
 * ------------------------------------------------------------------ */
const HEDGES = [
  'en validation', 'à confirmer', 'préversion', 'prochainement',
  'nous ne publions pas', 'adressez-vous', 'selon les clubs',
  'dans la plupart des clubs', 'ordres de grandeur', 'à demander au club',
  'projet en préparation', 'porteur du projet', 'à valider', 'pas encore confirmé'
];

for (const file of htmlFiles) {
  const rel = relative(dist, file);
  const visible = stripNonVisible(readFileSync(file, 'utf8'))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  for (const hedge of HEDGES) {
    assert(
      !visible.toLowerCase().includes(hedge),
      `${rel}: visible copy contains "${hedge}". The club is open — state facts, never hedge.`
    );
  }
}

/* The same guard over the machine surfaces. The HTML-only version missed a
   .well-known/mcp.json that was still telling every AI agent the club's
   "identity, venue, offer and affiliations are not yet verified" — a leak that
   is invisible on the rendered site but is exactly what an answer engine
   reads. Machine files are checked in the languages they are written in. */
const MACHINE_HEDGES = [
  'prelaunch', 'pre-launch', 'not yet verified', 'must not be inferred',
  'organisational identity pending', 'project status', 'préversion',
  'en validation', 'projet en préparation'
];

for (const file of files) {
  if (!/\.(txt|json)$/i.test(file)) continue;
  const rel = relative(dist, file);
  if (rel === 'humans.txt') continue;
  const content = readFileSync(file, 'utf8').toLowerCase();
  for (const hedge of MACHINE_HEDGES) {
    assert(
      !content.includes(hedge),
      `${rel}: machine surface contains "${hedge}". Agents read these files directly — they must describe an open club.`
    );
  }
}

/* Every machine surface must actually be reachable in the build. */
for (const required of ['llms.txt', 'llms-full.txt', 'ai.txt', 'robots.txt', 'sitemap.xml', '.well-known/mcp.json']) {
  assert(existsSync(join(dist, required)), `Missing machine surface: ${required}.`);
}

if (failures.length) {
  console.error(`Build audit failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`Build audit passed: ${htmlFiles.length} HTML pages, ${files.length} output files, ${productionIndexing ? 'indexable' : 'protected'} mode.`);
