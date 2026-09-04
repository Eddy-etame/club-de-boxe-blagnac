import { FAQ } from './club';

export type FaqItem = {
  question: string;
  answer: string;
};

/** The published FAQ. Single definition, shared by the page and the FAQPage graph. */
export const launchFaq: FaqItem[] = FAQ;

/**
 * What a first visit generally involves, in order. Written as guidance that
 * holds for any club in the sector — it prepares someone to walk in, without
 * standing in for the club's own instructions.
 */
export const firstSessionSteps = [
  {
    number: '01',
    title: 'Prévenez avant de venir',
    text: 'Un message ou un appel suffit. Les clubs préparent des gants et des protections à votre taille — c’est la seule raison pour laquelle ils demandent à être prévenus.'
  },
  {
    number: '02',
    title: 'Arrivez un quart d’heure avant',
    text: 'Le temps de faire le tour de la salle et de se faire expliquer le déroulé. On n’entre pas dans un cours en marche sans savoir ce qui attend.'
  },
  {
    number: '03',
    title: 'Venez en tenue de sport',
    text: 'Short ou legging, tee-shirt, chaussures propres réservées à l’intérieur, une bouteille d’eau. N’achetez pas de matériel avant cette séance : tout est prêté.'
  },
  {
    number: '04',
    title: 'Vous boxez dès le premier jour',
    text: 'Échauffement, technique, sac. Pas d’opposition à une première séance, quel que soit le niveau — on regarde d’abord comment vous vous déplacez.'
  },
  {
    number: '05',
    title: 'Vous décidez après, pas avant',
    text: 'La séance d’essai est presque toujours gratuite et n’engage à rien. L’adhésion se discute ensuite, une fois que vous savez si le lieu et le groupe vous conviennent.'
  }
];
