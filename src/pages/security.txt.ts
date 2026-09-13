/**
 * /security.txt (RFC 9116), also served at /.well-known/security.txt through
 * a vercel.json rewrite. Where to report a vulnerability — the site runs a
 * contact form and an MCP endpoint. Re-issued on every build, valid a year.
 */
import type { APIRoute } from 'astro';
import { CLUB } from '@/data/club';
import { absoluteUrl as url } from '@/data/site';
import { plainText } from '@/lib/machine';

export const GET: APIRoute = () => {
  const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');
  return plainText([
    `Contact: mailto:${CLUB.email}`,
    `Expires: ${expires}`,
    'Preferred-Languages: fr, en',
    `Canonical: ${url('/.well-known/security.txt')}`
  ]);
};
