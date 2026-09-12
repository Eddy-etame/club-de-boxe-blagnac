/**
 * Submits every URL in the live sitemap to IndexNow.
 *
 * One POST notifies Bing, Yandex, Seznam and Naver at once — and Bing's index
 * is what ChatGPT search and Microsoft Copilot answer from, so this is the
 * fastest route from "deployed" to "citable by an assistant".
 *
 * Reads the LIVE sitemap rather than dist/, so it submits exactly what is
 * served. Refuses to submit until the key file is reachable on the domain,
 * because an unverifiable key gets the whole batch rejected (403).
 *
 *   npm run indexnow
 */
import { readFileSync } from 'node:fs';

const HOST = 'www.club-boxe-blagnac.fr';
const ORIGIN = `https://${HOST}`;
const { key } = JSON.parse(readFileSync(new URL('../src/data/indexnow.json', import.meta.url), 'utf8'));

const keyLocation = `${ORIGIN}/${key}.txt`;
const served = await fetch(keyLocation).then((r) => (r.ok ? r.text() : ''));
if (served.trim() !== key) {
  console.error(`IndexNow aborted: ${keyLocation} does not serve the key yet. Deploy first.`);
  process.exit(1);
}

const sitemap = await fetch(`${ORIGIN}/sitemap.xml`).then((r) => r.text());
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) {
  console.error('IndexNow aborted: the live sitemap lists no URLs (is the site still in protected mode?).');
  process.exit(1);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation, urlList })
});

/* 200 = accepted, 202 = accepted, key validation pending. Anything else failed. */
const meaning = {
  200: 'accepted',
  202: 'accepted — key validation pending',
  400: 'bad request',
  403: 'key not valid for this host',
  422: 'URLs do not belong to this host',
  429: 'rate limited — retry later'
}[response.status] ?? 'unexpected response';

console.log(`IndexNow: ${urlList.length} URLs submitted → HTTP ${response.status} (${meaning}).`);
if (![200, 202].includes(response.status)) process.exit(1);
