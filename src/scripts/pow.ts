/**
 * Synchronous SHA-256, for the form's proof-of-work.
 *
 * WHY NOT crypto.subtle: it is promise-based, and the challenge needs roughly
 * 145 000 hashes at difficulty 4. Awaiting a WebCrypto call per iteration costs
 * more in promise scheduling than in hashing — measured at 15.3 seconds, which
 * is a frozen phone and a failed submission. The same loop with a synchronous
 * implementation runs in well under a second.
 *
 * The digest is standard FIPS 180-4 SHA-256, verified byte-for-byte against
 * crypto.subtle in scripts/test-pow.mjs.
 */

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);

const HEX = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));

/* Reused across calls so the hot loop allocates nothing. */
const w = new Uint32Array(64);

export function sha256Hex(input: string): string {
  /* UTF-8 encode. The challenge and nonce are ASCII, but encode properly
     anyway so the digest matches WebCrypto for any input. */
  const bytes = new TextEncoder().encode(input);
  const bitLen = bytes.length * 8;
  const blocks = (((bytes.length + 8) >> 6) + 1) * 64;
  const buf = new Uint8Array(blocks);
  buf.set(bytes);
  buf[bytes.length] = 0x80;
  /* Length is 64-bit big-endian; inputs here are far below 2^32 bytes. */
  const dv = new DataView(buf.buffer);
  dv.setUint32(blocks - 4, bitLen >>> 0, false);
  dv.setUint32(blocks - 8, Math.floor(bitLen / 4294967296), false);

  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  for (let offset = 0; offset < blocks; offset += 64) {
    for (let i = 0; i < 16; i += 1) w[i] = dv.getUint32(offset + i * 4, false);
    for (let i = 16; i < 64; i += 1) {
      const a = w[i - 15];
      const b = w[i - 2];
      const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3);
      const s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

    for (let i = 0; i < 64; i += 1) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0;
      d = c; c = b; b = a; a = (t1 + t2) | 0;
    }

    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + h) | 0;
  }

  let out = '';
  for (const v of [h0, h1, h2, h3, h4, h5, h6, h7]) {
    out += HEX[(v >>> 24) & 255] + HEX[(v >>> 16) & 255] + HEX[(v >>> 8) & 255] + HEX[v & 255];
  }
  return out;
}

/**
 * Yields a turn to the event loop WITHOUT setTimeout.
 *
 * setTimeout(0) is clamped to ~4ms in a foreground tab and up to a full second
 * in a background one. With a yield every few thousand hashes that clamping
 * dominated everything: a challenge that hashes in 0.4s took 15.5s end to end
 * when the tab was not focused. A MessageChannel message is not throttled.
 */
function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof MessageChannel === 'undefined') {
      setTimeout(resolve, 0);
      return;
    }
    const channel = new MessageChannel();
    channel.port1.onmessage = () => {
      channel.port1.close();
      resolve();
    };
    channel.port2.postMessage(null);
  });
}

/**
 * Finds a nonce whose SHA-256 of `challenge:nonce` starts with `difficulty`
 * zeros. Yields to the event loop periodically so the page keeps painting,
 * and gives up rather than spinning forever if the difficulty is raised.
 */
export async function solveChallenge(
  challenge: string,
  difficulty: number,
  { budgetMs = 20000, onProgress }: { budgetMs?: number; onProgress?: (n: number) => void } = {}
): Promise<string> {
  const prefix = '0'.repeat(difficulty);
  const deadline = Date.now() + budgetMs;
  let nonce = 0;

  for (;;) {
    /* Work in slices, then hand a turn back to the browser. 25k hashes is
       about 100ms — long enough to keep yields rare, short enough that the
       page never feels locked. */
    for (let i = 0; i < 25000; i += 1) {
      if (sha256Hex(`${challenge}:${nonce}`).startsWith(prefix)) return String(nonce);
      nonce += 1;
    }
    if (Date.now() > deadline) {
      throw new Error('La vérification a pris trop de temps. Réessayez.');
    }
    onProgress?.(nonce);
    await yieldToBrowser();
  }
}
