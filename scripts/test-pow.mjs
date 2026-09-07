/**
 * Verifies the hand-written SHA-256 byte-for-byte against WebCrypto, then
 * measures the proof-of-work loop. A wrong digest silently fails every form
 * submission, and a slow one freezes the phone — so both run in the build.
 */
import { sha256Hex } from '../src/scripts/pow.ts';

const enc = new TextEncoder();
const ref = async (t) => {
  const b = await crypto.subtle.digest('SHA-256', enc.encode(t));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
};

const cases = [
  '', 'a', 'abc', 'The quick brown fox jumps over the lazy dog',
  'x'.repeat(55), 'x'.repeat(56), 'x'.repeat(63), 'x'.repeat(64), 'x'.repeat(65), 'x'.repeat(200),
  'accentué — é à ù ç', 'chal-1234:987654', '🥊 boxe'
];

let failures = 0;
for (const c of cases) {
  if (sha256Hex(c) !== (await ref(c))) {
    failures += 1;
    console.error(`  MISMATCH for ${JSON.stringify(c.slice(0, 30))}`);
  }
}

/* Random inputs, because fixed vectors hide off-by-one padding bugs. */
for (let i = 0; i < 400; i += 1) {
  const s = Math.random().toString(36).repeat(1 + (i % 9));
  if (sha256Hex(s) !== (await ref(s))) {
    failures += 1;
    console.error(`  MISMATCH on random input of length ${s.length}`);
  }
}

if (failures) {
  console.error(`SHA-256 verification failed (${failures} mismatches).`);
  process.exit(1);
}

const t0 = Date.now();
let n = 0;
while (!sha256Hex(`benchmark-challenge:${n}`).startsWith('0000')) n += 1;
const ms = Date.now() - t0;
console.log(`Proof-of-work: SHA-256 matches WebCrypto on ${cases.length + 400} inputs; difficulty 4 solved in ${n} hashes / ${ms}ms.`);
if (ms > 5000) {
  console.error(`Proof-of-work too slow for a phone (${ms}ms).`);
  process.exit(1);
}
