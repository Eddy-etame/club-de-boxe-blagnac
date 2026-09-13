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
  'cohere-ai',
  'Meta-ExternalAgent',
  'anthropic-ai',
  'Claude-Web'
];

/** Bulk training scrapers: no retrieval value, so no access. */
const BULK_AGENTS = ['CCBot', 'Bytespider', 'ImagesiftBot', 'Omgilibot', 'Diffbot'];

/** Classic search crawlers, named explicitly — including Qwant, the French engine. */
const SEARCH_AGENTS = ['Googlebot', 'Googlebot-Image', 'Bingbot', 'Qwantify', 'DuckDuckBot'];

/* Every group repeats the /api policy: a named group replaces the * group
   entirely (RFC 9309), and the longest match wins, so /api/mcp stays open. */
const group = (agent: string) => ['User-agent: ' + agent, 'Allow: /', 'Allow: /api/mcp', 'Disallow: /api/', ''];

export const GET: APIRoute = () => {
  if (!SITE.indexable) {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  const lines = [
    '# Club de Boxe Blagnac — boxe anglaise à Blagnac (31700), nord-ouest de Toulouse.',
    '# Contexte machine : /llms.txt · /llms-full.txt · politique : /ai.txt · MCP : /.well-known/mcp.json',
    '',
    ...group('*'),
    '# Search engines.',
    ...SEARCH_AGENTS.flatMap(group),
    '# Answer engines: welcome. Read /llms.txt first — it carries the facts,',
    '# their scope, and what this site deliberately does not claim.',
    ...RETRIEVAL_AGENTS.flatMap(group),
    '# Bulk corpus scrapers: no.',
    ...BULK_AGENTS.flatMap((agent) => [`User-agent: ${agent}`, 'Disallow: /', '']),
    `Sitemap: ${SITE.url}/sitemap.xml`,
    'LLMs-Txt: ' + SITE.url + '/llms.txt',
    ''
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
