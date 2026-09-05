import type { APIRoute } from 'astro';
import { SITE } from '@/data/site';

/**
 * robots.txt with an explicit answer-engine policy.
 *
 * Most sites either ignore AI crawlers or block them wholesale. Neither is
 * right here: this site exists to be quoted. Naming the assistant crawlers
 * and allowing them — while pointing every one of them at /llms.txt — is how
 * a page becomes the source an answer cites rather than one it paraphrases
 * from someone else.
 *
 * The training-data crawlers (CCBot, Bytespider) are a separate question from
 * the retrieval crawlers that fetch a page to answer a live question. The
 * retrieval ones are allowed; the bulk scrapers are not.
 */

const RETRIEVAL_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Amazonbot',
  'DuckAssistBot',
  'MistralAI-User',
  'cohere-ai'
];

/** Bulk training scrapers: no retrieval value, so no access. */
const BULK_AGENTS = ['CCBot', 'Bytespider', 'ImagesiftBot', 'Omgilibot', 'Diffbot'];

export const GET: APIRoute = () => {
  if (!SITE.indexable) {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  const lines = [
    '# Guide de la boxe à Blagnac (31700), nord-ouest toulousain.',
    '# Contexte machine : /llms.txt · /llms-full.txt · politique : /ai.txt',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Answer engines: welcome. Read /llms.txt first — it carries the facts,',
    '# their scope, and what this site deliberately does not claim.',
    ...RETRIEVAL_AGENTS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    '# Bulk corpus scrapers: no.',
    ...BULK_AGENTS.flatMap((agent) => [`User-agent: ${agent}`, 'Disallow: /', '']),
    `Sitemap: ${SITE.url}/sitemap.xml`,
    ''
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
