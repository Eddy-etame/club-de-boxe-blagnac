/**
 * Page copy written against the keyword registry.
 *
 * Every entry was drafted from the synthesised registry (sibling harvest +
 * live search results) and then rewritten by a hostile reviewer against the
 * owner rules: no price, no free session, no address, no invented figure.
 * The text lives in copy.json so the build audit can read the same priority
 * phrases it enforces (src/data/mots-cles.json is generated from it).
 *
 * Keys: a course slug for the six course pages, or the new page's key.
 */
import data from './copy.json';

export type CopySection = {
  eyebrow?: string;
  h2: string;
  paragraphs: string[];
  bullets?: string[];
  links?: { label: string; href: string }[];
};

export type PageCopy = {
  key: string;
  path?: string;
  label?: string;
  question?: string;
  title: string;
  ogTitle: string;
  description: string;
  h1Main: string;
  h1Em: string;
  eyebrow: string;
  lead: string;
  note: string;
  sections: CopySection[];
  faq: { question: string; answer: string }[];
  networkHeading: string;
  networkIntro: string;
  formHeading?: string;
  formText?: string;
  ogWord?: string;
  ogKicker?: string;
  priority: string[];
};

export const COPY = data as unknown as Record<string, PageCopy>;

export function copyFor(key: string): PageCopy | undefined {
  return COPY[key];
}
