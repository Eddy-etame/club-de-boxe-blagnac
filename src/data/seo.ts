export type FaqItem = {
  question: string;
  answer: string;
};

export const launchFaq: FaqItem[] = [
  {
    question: 'Où sera situé le club de boxe à Blagnac ?',
    answer:
      'Le secteur visé est Blagnac, au nord-ouest de Toulouse. L’adresse exacte ne sera publiée qu’après validation du lieu.'
  },
  {
    question: 'Quels cours de boxe seront proposés ?',
    answer:
      'Le programme définitif, les disciplines, les niveaux et les catégories d’âge sont encore en validation. Ils seront annoncés ensemble pour éviter toute information contradictoire.'
  },
  {
    question: 'Quand auront lieu les inscriptions ?',
    answer:
      'La date d’ouverture des inscriptions n’est pas encore annoncée. Le formulaire permet uniquement de demander à être informé de la publication des informations officielles.'
  },
  {
    question: 'Le planning et les tarifs sont-ils disponibles ?',
    answer:
      'Pas encore. Les horaires, tarifs, conditions d’essai et pièces nécessaires seront publiés dès qu’ils seront confirmés.'
  },
  {
    question: 'Cette préversion représente-t-elle déjà une association identifiée ?',
    answer:
      'Pas à ce stade. L’identité de l’entité porteuse et ses éventuelles affiliations ne sont pas encore publiées. Cette préversion ne doit donc pas être interprétée comme le site officiel d’une association existante.'
  }
];

export const firstSessionSteps = [
  {
    number: '01',
    title: 'Choisir une pratique réelle',
    text: 'Boxe anglaise, loisir, éducative ou compétition ne désignent pas le même parcours. Vérifiez la discipline, le public accueilli et le niveau avant de vous déplacer.'
  },
  {
    number: '02',
    title: 'Demander le cadre',
    text: 'Un premier échange doit préciser l’encadrement, les règles de sécurité, le matériel nécessaire et le déroulé de la séance.'
  },
  {
    number: '03',
    title: 'Venir léger',
    text: 'Pour une séance confirmée, suivez uniquement la liste de matériel communiquée par le club. N’achetez pas tout avant d’avoir reçu les consignes exactes.'
  },
  {
    number: '04',
    title: 'Évaluer la méthode',
    text: 'La qualité se lit dans les explications, la progressivité, l’attention portée aux débutants et la cohérence entre intensité et sécurité.'
  }
];
