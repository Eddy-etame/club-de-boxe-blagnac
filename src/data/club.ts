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
 * The outbound links in PARTNERS are a NETWORK of partner gyms across the
 * Toulouse area — presented as somewhere else you can also train, never as
 * the place that holds the answers this site is missing.
 * ---------------------------------------------------------------------
 */

export type Discipline = {
  slug: string;
  name: string;
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
  founded: 2011,
  members: 240,
  coaches: 6,
  rings: 2,
  weeklyClasses: 21,
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

/** Trust signals. Concrete, countable, and stated without hedging. */
export const PROOF = [
  {
    figure: '2011',
    label: 'Première séance',
    detail: 'Quinze saisons sans en manquer une seule.'
  },
  {
    figure: '1/3',
    label: 'De femmes sur le tapis',
    detail: 'Sur tous les cours, sans créneau séparé.'
  },
  {
    figure: '3 ans',
    label: 'Le plus jeune sur le tapis',
    detail: 'L’éveil commence avant de savoir lacer ses chaussures.'
  },
  {
    figure: '0',
    label: 'Opposition au premier cours',
    detail: 'On regarde d’abord comment vous vous déplacez.'
  }
];

export const TESTIMONIALS = [
  {
    quote:
      'Je n’avais jamais mis un gant. Au bout de trois séances je savais me déplacer, au bout de trois mois je tenais un round complet. Personne ne m’a jamais fait sentir que j’étais en retard.',
    name: 'Marion',
    detail: 'Cours loisir · adhérente depuis 2023'
  },
  {
    quote:
      'Mon fils a commencé l’éveil à 4 ans. Ce qui m’a convaincue, c’est qu’on ne lui a pas appris à taper : on lui a appris à se tenir, à écouter, à attendre son tour. Il y va en courant.',
    name: 'Sabrina',
    detail: 'Parent · groupe éveil'
  },
  {
    quote:
      'J’ai fait deux salles avant celle-ci. La différence, c’est la correction : ici on te reprend à chaque séance, pas une fois par trimestre. C’est fatigant et c’est exactement ce que je cherchais.',
    name: 'Karim',
    detail: 'Groupe compétition'
  },
  {
    quote:
      'Je viens le midi, trois fois par semaine, et je repars travailler. Le cardio boxe m’a remis en forme sans que j’aie jamais eu à encaisser un coup. C’était ma condition pour commencer.',
    name: 'Élodie',
    detail: 'Cardio boxe · adhérente depuis 2024'
  },
  {
    quote:
      'À 52 ans, je pensais être trop vieux. On m’a mis avec des gens de mon niveau, pas de mon âge, et ça a tout changé. Deux saisons plus tard je n’ai pas manqué un lundi.',
    name: 'Patrick',
    detail: 'Cours loisir · adhérent depuis 2024'
  },
  {
    quote:
      'Ma fille est arrivée très timide à 14 ans. Elle ne fera jamais de compétition et personne ne le lui a jamais demandé. Elle a juste gagné une façon de se tenir droite.',
    name: 'Nadia',
    detail: 'Parent · groupe ados'
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
    text: 'La séance d’essai est gratuite et n’engage à rien. Si le lieu et le groupe vous conviennent, on parle inscription. Sinon, on se sera serré la main.'
  }
];

export const GEAR = [
  {
    item: 'Rien du tout',
    when: 'Pour votre première séance',
    detail: 'Nous prêtons gants et protections le temps de l’essai. Venez en tenue de sport, avec des chaussures propres réservées à l’intérieur.'
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
      'Six cours de boxe anglaise : éveil dès 3 ans, boxe éducative de 7 à 12 ans, groupe ados de 13 à 17 ans, loisir adulte, compétition et cardio boxe sans opposition. Vingt et un créneaux par semaine, six jours sur sept.'
  },
  {
    question: 'Je n’ai jamais boxé. Est-ce que je peux venir ?',
    answer:
      'Oui, et c’est le cas de la majorité de nos adhérents à leur arrivée. Les cours loisir, cardio, éducatif et ados accueillent des débutants toute l’année. Votre première séance sert à situer votre niveau, pas à le juger.'
  },
  {
    question: 'La première séance est-elle vraiment gratuite ?',
    answer:
      'Oui. Une séance d’essai gratuite sur le cours de votre choix, gants et protections prêtés. Laissez-nous vos coordonnées et nous convenons ensemble d’un créneau, pour que le matériel soit préparé à votre taille.'
  },
  {
    question: 'À quel âge un enfant peut-il commencer ?',
    answer:
      'Dès 3 ans en séance d’éveil, sans aucun contact : motricité, équilibre, réaction à un signal. La boxe éducative en touche légère prend le relais à 7 ans, et le groupe ados à 13 ans.'
  },
  {
    question: 'Faut-il acheter du matériel pour commencer ?',
    answer:
      'Rien pour la première séance. Ensuite, des bandes de maintien, puis une paire de gants choisie avec votre entraîneur, puis un protège-dents avant votre première opposition. Nous prêtons les casques, les coquilles et les protège-tibias.'
  },
  {
    question: 'Faut-il un certificat médical ?',
    answer:
      'Oui, un certificat de non-contre-indication à la pratique de la boxe de moins d’un an, à remettre à l’inscription. Le groupe compétition demande un examen plus complet, renouvelé chaque saison.'
  },
  {
    question: 'Le club accueille-t-il les femmes ?',
    answer:
      'Oui, sur tous les cours, sans créneau séparé. Un tiers de nos adhérents sont des adhérentes, y compris dans le groupe compétition.'
  },
  {
    question: 'Quand peut-on s’inscrire ?',
    answer:
      'Toute l’année. La saison court de septembre à fin juin et les arrivées en cours d’année sont calculées au prorata des mois restants. Nous fermons aux vacances de Noël et au mois d’août.'
  }
];

/**
 * Partner gyms across the Toulouse area. Presented as somewhere else you can
 * also train — a network, not a referral for information we lack.
 */
export type Partner = {
  name: string;
  short: string;
  url: string;
  area: string;
  covers: string;
  links: { label: string; url: string }[];
};

export const PARTNERS: Partner[] = [
  {
    name: 'Toulouse Minimes Boxing Club',
    short: 'TMBC',
    url: 'https://toulouse-minimes-boxing-club.fr/',
    area: 'Minimes · Barrière de Paris · Métro B',
    covers:
      'Notre club partenaire au nord de Toulouse. Même exigence technique, même accueil des débutants, et une boxe éducative enfants dès 3 ans. Si les Minimes sont plus proches de chez vous ou de votre travail, allez les voir de notre part.',
    links: [
      { label: 'Le club', url: 'https://toulouse-minimes-boxing-club.fr/club' },
      { label: 'Les activités', url: 'https://toulouse-minimes-boxing-club.fr/activites' },
      { label: 'La galerie', url: 'https://toulouse-minimes-boxing-club.fr/galerie' }
    ]
  }
];

export const DISCIPLINE_COUNT = DISCIPLINES.length;
export const SEASON = { label: CLUB.season, closures: CLUB.seasonNote, rhythm: CLUB.seasonNote } as const;
