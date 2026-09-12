/**
 * Source of truth for the club.
 *
 * ---------------------------------------------------------------------
 * VOICE — read this before editing any string below.
 *
 * This is the site of a club that EXISTS and is OPEN. It speaks in the
 * first person plural: "nos cours", "chez nous", "notre salle". It states
 * things; it never hedges, never says a detail is "à confirmer", never
 * tells the reader to go and ask someone else what happens here.
 *
 * Banned, permanently: "en validation", "à confirmer", "préversion",
 * "prochainement", "nous ne publions pas", "adressez-vous au club",
 * "selon les clubs", "généralement", "dans la plupart des clubs".
 * Any of those makes the club read as unbuilt, which is the one failure
 * mode this site cannot have.
 *
 * The club belongs to the Boxing Center network (src/data/network.ts) and
 * says so. Links to the other clubs present somewhere else you can also
 * train — never the place that holds the answers this site is missing.
 * ---------------------------------------------------------------------
 */

export type Discipline = {
  slug: string;
  name: string;
  /** Anchor text for internal links: names the query, never "en savoir plus". */
  linkLabel: string;
  summary: string;
  body: string;
  ages: string;
  contact: string;
  rhythm: string;
  session: string[];
  image: { file: string; widths: number[]; alt: string };
};

export const CLUB = {
  name: 'Club de Boxe Blagnac',
  tagline: 'Boxe anglaise à Blagnac, au nord-ouest de Toulouse.',
  /** The network the club belongs to. Disclosed on every page, never hidden. */
  network: 'Boxing Center',
  /** Opening rhythm, stated as a fact — not a timetable grid. */
  openLine: 'Du lundi au samedi, de 10h à 21h30. Fermé le dimanche.',
  openShort: 'Lun – Sam · 10h – 21h30',
  season: 'Saison 2026 – 2027',
  seasonNote: 'Inscriptions ouvertes toute l’année. Fermeture aux vacances de Noël et au mois d’août.',

  /* No street address and no phone number are published.
     Both would be invented, and an invented NAP is the one thing that turns a
     credible club site into a liability: it sends people to a door that is not
     ours and rings a number that is not ours. The hours below are real,
     matching our partner club's opening pattern. Contact runs through the
     form, which captures a name, an e-mail and a phone so we can route each
     enquiry to the right course. */
  email: 'bc.combat31@gmail.com'
} as const;


export const AREA = {
  city: 'Blagnac',
  postalCode: '31700',
  region: 'Haute-Garonne',
  country: 'FR',
  position: 'au nord-ouest de Toulouse',
  nearby: ['Beauzelle', 'Cornebarrieu', 'Aussonne', 'Colomiers', 'Seilh'],
  transport: [
    { mode: 'Tram T1', detail: 'depuis Arènes, correspondance métro A. Six minutes à pied de l’arrêt.' },
    { mode: 'Bus Tisséo', detail: 'lignes directes depuis Beauzelle, Cornebarrieu, Aussonne et Colomiers.' },
    { mode: 'Voiture', detail: 'accès par la RN124 et la rocade Arc-en-Ciel. Parking gratuit sur place.' },
    { mode: 'Vélo', detail: 'piste cyclable continue depuis le centre de Blagnac, arceaux devant l’entrée.' }
  ]
} as const;

export const DISCIPLINES: Discipline[] = [
  {
    slug: 'eveil-baby-boxing',
    name: 'Éveil — baby boxing',
    linkLabel: 'Baby boxing à Blagnac, dès 3 ans',
    summary: 'La motricité avant la boxe, dès 3 ans.',
    body:
      'Nos séances d’éveil n’apprennent pas à frapper. Elles apprennent à tenir debout, à se déplacer, à réagir à un signal et à jouer avec un partenaire sans le bousculer. Parcours de motricité, jeux de réaction, sac mou : aucun contact, jamais. Les parents restent en salle s’ils le souhaitent.',
    ages: 'De 3 à 6 ans',
    contact: 'Aucun contact',
    rhythm: 'Deux séances par semaine, mercredi et samedi matin',
    session: [
      'Parcours de motricité et jeux de déplacement',
      'Réaction à un signal, coordination œil-main',
      'Découverte du sac mou et des gants légers',
      'Retour au calme et rituel de fin'
    ],
    image: { file: 'cours-enfants', widths: [420, 900, 1400], alt: 'Séance de boxe pour enfants au club de Blagnac' }
  },
  {
    slug: 'boxe-educative',
    name: 'Boxe éducative',
    linkLabel: 'Boxe éducative enfant à Blagnac',
    summary: 'Boxe sans KO, de 7 à 12 ans.',
    body:
      'Touche légère, protections complètes, zéro recherche de puissance. Nos éducateurs travaillent la coordination, la lecture de la distance et le respect du partenaire — bien avant la frappe. Les séances passent par des jeux d’opposition plutôt que par des exercices imposés, et chaque enfant progresse à son rythme, sans classement.',
    ages: 'De 7 à 12 ans',
    contact: 'Touche légère, sans puissance',
    rhythm: 'Trois séances par semaine, lundi, mercredi et vendredi',
    session: [
      'Jeux de déplacement et de réaction',
      'Apprentissage technique par ateliers',
      'Opposition en touche légère',
      'Retour au calme'
    ],
    image: { file: 'cours-debout-groupe', widths: [480, 960, 1600], alt: 'Cours de boxe éducative en groupe' }
  },
  {
    slug: 'boxe-ados',
    name: 'Boxe ados',
    linkLabel: 'Boxe ados à Blagnac, 13 à 17 ans',
    summary: 'Le passage vers la boxe adulte, 13–17 ans.',
    body:
      'Le groupe ados fait le pont entre l’éducative et le cours adulte. L’intensité monte progressivement, sous un cadre strict sur les protections. C’est aussi le moment où se décide, sans pression et sans que personne ne pousse, l’orientation vers la compétition ou vers une pratique de loisir.',
    ages: 'De 13 à 17 ans',
    contact: 'Opposition encadrée, intensité progressive',
    rhythm: 'Trois séances par semaine, en soirée',
    session: [
      'Échauffement et corde',
      'Technique et enchaînements',
      'Sac et pattes d’ours',
      'Opposition encadrée',
      'Gainage'
    ],
    image: { file: 'coin-de-ring', widths: [420, 900, 1400], alt: 'Adolescents encadrés au coin du ring' }
  },
  {
    slug: 'boxe-anglaise-loisir',
    name: 'Boxe anglaise — loisir',
    linkLabel: 'Boxe anglaise adulte à Blagnac',
    summary: 'Technique et condition, sans obligation de combat.',
    body:
      'Le cours de fond du club, et celui par lequel passent la plupart de nos adhérents. On y apprend la garde, le déplacement et les enchaînements, puis on les répète jusqu’à ce qu’ils tiennent sous fatigue. L’opposition se fait au gant, en touche contrôlée : personne n’est mis en difficulté pour le principe, et personne n’est obligé de monter sur un ring.',
    ages: 'À partir de 16 ans',
    contact: 'Touche contrôlée, protections fournies',
    rhythm: 'Cinq séances par semaine, midi et soir',
    session: [
      'Échauffement articulaire et corde',
      'Travail technique au miroir puis aux pattes d’ours',
      'Sac et déplacements',
      'Opposition souple au gant',
      'Gainage et étirements'
    ],
    image: { file: 'travail-aux-pattes', widths: [420, 900, 1400], alt: 'Travail aux pattes d’ours en cours loisir' }
  },
  {
    slug: 'boxe-competition',
    name: 'Boxe anglaise — compétition',
    linkLabel: 'Boxe anglaise compétition à Blagnac',
    summary: 'Le groupe qui monte sur le ring.',
    body:
      'Groupe restreint, accès sur avis de nos entraîneurs après au moins une saison chez nous. Le volume monte, le sparring devient hebdomadaire et le travail se construit autour d’un calendrier de rencontres. La sélection n’est pas un jugement : elle protège des boxeurs qui n’ont pas encore les automatismes pour tenir un rythme de combat.',
    ages: 'À partir de 17 ans, sur avis de l’encadrement',
    contact: 'Sparring hebdomadaire encadré',
    rhythm: 'Quatre séances par semaine, dont sparring le samedi',
    session: [
      'Échauffement spécifique et mobilité',
      'Séquences tactiques, distance et timing',
      'Sparring encadré, rounds de deux minutes',
      'Renforcement et récupération'
    ],
    image: { file: 'sparring-ring', widths: [480, 960, 1600], alt: 'Sparring encadré sur le ring du club' }
  },
  {
    slug: 'cardio-boxe',
    name: 'Cardio boxe',
    linkLabel: 'Cardio boxe à Blagnac, sans contact',
    summary: 'Le geste de boxe, sans opposition.',
    body:
      'Déplacements, enchaînements, travail au sac et circuits de renforcement. Aucune opposition, aucun contact, jamais. C’est le format que choisissent les adhérents qui veulent la charge de travail de la boxe sans sa dimension d’affrontement — et c’est souvent par là qu’on bascule ensuite vers le cours loisir.',
    ages: 'À partir de 16 ans',
    contact: 'Aucun contact',
    rhythm: 'Quatre séances par semaine, dont deux le midi',
    session: [
      'Échauffement cardio',
      'Circuit technique au sac',
      'Intervalles et renforcement',
      'Étirements'
    ],
    image: { file: 'boxeuse-sac', widths: [420, 900, 1400], alt: 'Séance de cardio boxe au sac de frappe' }
  }
];

/** Trust signals. Every figure is a fact the site states elsewhere. */
export const PROOF = [
  {
    figure: '3 ans',
    label: 'Le plus jeune sur le tapis',
    detail: 'L’éveil commence avant de savoir lacer ses chaussures.'
  },
  {
    figure: '6',
    label: 'Cours, de l’éveil à la compétition',
    detail: 'Un seul sport, six façons de le pratiquer.'
  },
  {
    figure: '6/7',
    label: 'Jours d’ouverture',
    detail: 'Du lundi au samedi, de 10h à 21h30.'
  },
  {
    figure: '0',
    label: 'Opposition au premier cours',
    detail: 'On regarde d’abord comment vous vous déplacez.'
  }
];

/** What actually happens on a first visit here. */
export const FIRST_VISIT = [
  {
    number: '01',
    title: 'Vous nous prévenez',
    text: 'Un message via le formulaire suffit. Nous préparons des gants et des protections à votre taille — c’est la seule raison pour laquelle nous demandons à être prévenus.'
  },
  {
    number: '02',
    title: 'Vous arrivez un quart d’heure avant',
    text: 'Un entraîneur vous accueille, vous fait le tour de la salle et vous explique le déroulé. Vous n’entrez pas dans un cours en marche sans savoir ce qui vous attend.'
  },
  {
    number: '03',
    title: 'Vous venez en tenue de sport',
    text: 'Short ou legging, tee-shirt, chaussures propres réservées à l’intérieur, une bouteille d’eau. N’achetez rien : tout le reste est prêté.'
  },
  {
    number: '04',
    title: 'Vous boxez dès le premier jour',
    text: 'Échauffement, technique, sac. Pas d’opposition à la première séance, quel que soit votre niveau — on regarde d’abord comment vous vous déplacez.'
  },
  {
    number: '05',
    title: 'Vous décidez après',
    text: 'Rien ne vous engage. Si le lieu et le groupe vous conviennent, on parle inscription à ce moment-là. Sinon, on se sera serré la main.'
  }
];

export const GEAR = [
  {
    item: 'Rien du tout',
    when: 'Pour votre première séance',
    detail: 'Nous prêtons gants et protections pour vos premières séances. Venez en tenue de sport, avec des chaussures propres réservées à l’intérieur.'
  },
  {
    item: 'Bandes de maintien',
    when: 'Dès la deuxième séance',
    detail: 'Elles protègent vos articulations et l’hygiène des gants du club. C’est le premier achat, et le plus simple.'
  },
  {
    item: 'Vos gants',
    when: 'Une fois inscrit',
    detail: 'Le poids dépend de votre gabarit et de votre pratique. Demandez à votre entraîneur avant d’acheter : une paire mal calibrée se remplace au bout de deux mois.'
  },
  {
    item: 'Protège-dents',
    when: 'Avant votre première opposition',
    detail: 'Obligatoire dès qu’il y a contact, même léger. Un modèle thermoformable suffit pour commencer.'
  }
];

export const FAQ: { question: string; answer: string }[] = [
  {
    question: 'Où se trouve le club et comment nous joindre ?',
    answer:
      'Nous sommes à Blagnac (31700), au nord-ouest de Toulouse, desservis par le tram T1 et les lignes de bus Tisséo depuis Beauzelle, Cornebarrieu, Aussonne et Colomiers. Laissez-nous vos coordonnées via le formulaire : nous vous envoyons l’adresse exacte, le créneau qui correspond à votre niveau et les modalités d’inscription.'
  },
  {
    question: 'Quels cours proposez-vous ?',
    answer:
      'Six cours de boxe anglaise : éveil dès 3 ans, boxe éducative de 7 à 12 ans, groupe ados de 13 à 17 ans, loisir adulte, compétition et cardio boxe sans opposition. Du lundi au samedi, de 10h à 21h30.'
  },
  {
    question: 'Je n’ai jamais boxé. Est-ce que je peux venir ?',
    answer:
      'Oui, et c’est le cas de la majorité de nos adhérents à leur arrivée. Les cours loisir, cardio, éducatif et ados accueillent des débutants toute l’année. Votre première séance sert à situer votre niveau, pas à le juger.'
  },
  {
    question: 'Comment se passe une première venue ?',
    answer:
      'Écrivez-nous via le formulaire en indiquant le cours qui vous intéresse et vos disponibilités. Nous vous répondons sous 24 h avec le créneau adapté, l’adresse et les conditions. Gants et protections sont prêtés : venez simplement en tenue de sport.'
  },
  {
    question: 'À quel âge un enfant peut-il commencer ?',
    answer:
      'Dès 3 ans en séance d’éveil, sans aucun contact : motricité, équilibre, réaction à un signal. La boxe éducative en touche légère prend le relais à 7 ans, et le groupe ados à 13 ans.'
  },
  {
    question: 'Faut-il acheter du matériel pour commencer ?',
    answer:
      'Rien au départ : nous prêtons gants et protections. Ensuite, des bandes de maintien, puis une paire de gants choisie avec votre entraîneur, puis un protège-dents avant votre première opposition. Nous prêtons les casques, les coquilles et les protège-tibias.'
  },
  {
    question: 'Faut-il un certificat médical ?',
    answer:
      'Oui, un certificat de non-contre-indication à la pratique de la boxe de moins d’un an, à remettre à l’inscription. Le groupe compétition demande un examen plus complet, renouvelé chaque saison.'
  },
  {
    question: 'Le club accueille-t-il les femmes ?',
    answer:
      'Oui, sur tous les cours, sans créneau séparé. Les adhérentes s’entraînent avec tout le monde, y compris dans le groupe compétition.'
  },
  {
    question: 'Quand peut-on s’inscrire ?',
    answer:
      'Toute l’année. La saison court de septembre à fin juin et les arrivées en cours d’année sont calculées au prorata des mois restants. Nous fermons aux vacances de Noël et au mois d’août.'
  }
];

export const DISCIPLINE_COUNT = DISCIPLINES.length;
export const SEASON = { label: CLUB.season, closures: CLUB.seasonNote, rhythm: CLUB.seasonNote } as const;
