import { FAQ, FIRST_VISIT } from './club';

export type FaqItem = { question: string; answer: string };

/** The club's published FAQ. Shared by the page and the FAQPage graph. */
export const launchFaq: FaqItem[] = FAQ;

/** What happens on a first visit here. */
export const firstSessionSteps = FIRST_VISIT;
