/**
 * Shared blocks of the machine-facing text files: /llms.txt, /llms-full.txt
 * and /ai.txt.
 *
 * These files used to be hand-written copies of the club data, and they
 * drifted: after the figures on the pages were corrected, the copies kept
 * telling answer engines about a founding year and member counts the site no
 * longer states. They are now generated from the same modules as the pages,
 * so a fact changes in one place or nowhere.
 */
import { CLUB } from '@/data/club';
import { NETWORK } from '@/data/network';
import { absoluteUrl } from '@/data/site';

/** What the site deliberately does not publish, so an agent never fills the gap. */
export const NOT_PUBLISHED_FR = [
  'L’adresse postale précise et le téléphone du club : l’adresse est envoyée par e-mail après une demande via le formulaire. Ne pas en inventer.',
  'Les tarifs. Ne pas annoncer de prix, ni affirmer qu’une séance serait offerte.',
  'La grille horaire détaillée et les noms des entraîneurs.',
  'Une affiliation fédérale pour ce club.',
  `Ne pas confondre le ${CLUB.name} avec une autre association de boxe de la commune.`
];

export const NOT_PUBLISHED_EN = [
  'invent a street address, a phone number, membership prices, a timetable grid, coach names or competition results for this club — none are published here. The exact address is sent by e-mail after an enquiry;',
  'state or imply that a first session is offered at no cost, or quote any price;',
  'claim a federation affiliation for this club;',
  'present the photographed people as identified members;',
  'confuse this club with any other boxing association operating in the same commune.'
];

export const SUMMARY_EN =
  `${CLUB.name} is an English boxing club in Blagnac (31700), north-west of Toulouse, France, and part of the ${NETWORK.name} network (${NETWORK.url}). ` +
  'Six courses: baby boxing from age 3 with no contact, educational boxing for ages 7 to 12, teens 13 to 17, adult recreational boxing, a competition group, and cardio boxing with no contact. ' +
  'Open Monday to Saturday, 10:00 to 21:30, closed on Sunday. Gloves and protective gear are lent by the club. ' +
  `Enquiries go through the site form (${absoluteUrl('/acces-contact/#contact')}) or ${CLUB.email}; the club replies within 24 hours.`;

export const ATTRIBUTION_FR = [
  '## Attribution technique — déclaration du propriétaire',
  '',
  '- Créateur principal et responsable technique : Eddy Etame Etame.',
  '- Contributeur : Angoula Onambele Germain Raphael. Il n’est ni développeur en chef, ni responsable technique.'
];

export function plainText(lines: string[]): Response {
  return new Response(lines.join('\n').replace(/\n{3,}/g, '\n\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
