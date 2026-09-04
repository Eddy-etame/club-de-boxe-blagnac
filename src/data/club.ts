/**
 * Source of truth for the site's editorial content.
 *
 * ---------------------------------------------------------------------
 * WHAT THIS SITE IS
 *
 * A general information resource on boxing in Blagnac and the north-west
 * of Toulouse. It explains the disciplines, what a session contains, from
 * what age one can start and what to bring — the things someone searching
 * "club de boxe Blagnac" actually needs to know before they contact anyone.
 *
 * It is deliberately NOT the site of a specific club. It carries no
 * timetable, no coach names, no club address, no phone number and no
 * price — not even an indicative range — because those are exactly the
 * details a visitor should get from a club directly. Club-level answers
 * live behind the outbound links in PARTNERS.
 *
 * Everything here is general, verifiable domain knowledge. Pages, structured
 * data and the machine surfaces (ai.txt / llms.txt / MCP) all read from this
 * file, so a change lands everywhere at once.
 * ---------------------------------------------------------------------
 */

export type Discipline = {
  slug: string;
  name: string;
  /** One line, used on cards and in lists. */
  summary: string;
  /** The paragraph that earns the click. Concrete, not promotional. */
  body: string;
  ages: string;
  contact: string;
  /** What a session of this kind generally contains, in order. */
  session: string[];
};

export const AREA = {
  city: 'Blagnac',
  postalCode: '31700',
  region: 'Haute-Garonne',
  country: 'FR',
  position: 'au nord-ouest de Toulouse',
  /** Communes whose residents realistically train in or around Blagnac. */
  nearby: ['Beauzelle', 'Cornebarrieu', 'Aussonne', 'Colomiers', 'Toulouse nord-ouest'],
  transport: [
    'Tram T1, qui dessert Blagnac depuis Arènes et Toulouse centre.',
    'Lignes de bus Tisséo vers Beauzelle, Cornebarrieu et Colomiers.',
    'Stationnement généralement gratuit autour des équipements sportifs municipaux.'
  ]
} as const;

export const SEASON = {
  label: 'Saison 2026 – 2027',
  /** Typical French club calendar, not a specific club's dates. */
  rhythm:
    'La saison sportive française court de début septembre à fin juin. Les inscriptions se concentrent en septembre, souvent lors du forum des associations, mais la plupart des clubs acceptent des arrivées en cours d’année au prorata.',
  closures:
    'Les clubs ferment en général pendant les vacances de Noël et au mois d’août.'
} as const;

export const DISCIPLINES: Discipline[] = [
  {
    slug: 'eveil-baby-boxing',
    name: 'Éveil — baby boxing',
    summary: 'La motricité avant la boxe, dès 3 ans.',
    body:
      'Le baby boxing n’apprend pas à frapper : il apprend à se tenir, à se déplacer, à réagir à un signal et à jouer avec un partenaire sans le bousculer. Les séances passent par des parcours, des jeux de réaction et du travail au sac mou, sans aucune opposition. C’est de la motricité générale déguisée en boxe, et c’est la porte d’entrée la plus précoce du sport.',
    ages: 'Dès 3 ans, jusqu’à 6 ans environ',
    contact: 'Aucun contact',
    session: [
      'Parcours de motricité et jeux de déplacement',
      'Réaction à un signal, coordination œil-main',
      'Découverte du sac mou et des gants légers',
      'Retour au calme et rituel de fin'
    ]
  },
  {
    slug: 'boxe-anglaise-loisir',
    name: 'Boxe anglaise — loisir',
    summary: 'Technique et condition, sans obligation de combat.',
    body:
      'C’est le format le plus répandu et, dans la plupart des clubs, celui par lequel on commence. On y apprend la garde, le déplacement et les enchaînements de base, puis on les répète jusqu’à ce qu’ils tiennent sous fatigue. L’opposition, quand elle existe, se fait au gant en touche contrôlée : le but est d’apprendre à lire un adversaire, pas de le mettre en difficulté. Aucune obligation de monter sur un ring en compétition.',
    ages: 'Généralement à partir de 15 ou 16 ans',
    contact: 'Opposition en touche contrôlée, protections obligatoires',
    session: [
      'Échauffement articulaire et corde',
      'Travail technique au miroir puis aux pattes d’ours',
      'Sac et déplacements',
      'Opposition souple au gant, selon le club',
      'Gainage et étirements'
    ]
  },
  {
    slug: 'boxe-educative',
    name: 'Boxe éducative',
    summary: 'Boxe sans KO, pour les plus jeunes.',
    body:
      'La boxe éducative — parfois appelée boxe assaut chez les enfants — se pratique en touche légère, protections complètes, sans recherche de puissance. Elle vise la coordination, la lecture de la distance et le respect du partenaire. Les séances passent le plus souvent par des jeux d’opposition plutôt que par des exercices imposés. Elle prend le relais de l’éveil et court jusqu’à l’entrée dans le groupe ados.',
    ages: 'Généralement de 7 à 12 ans',
    contact: 'Touche légère, sans puissance',
    session: [
      'Jeux de déplacement et de réaction',
      'Apprentissage technique par ateliers',
      'Opposition en touche légère',
      'Retour au calme'
    ]
  },
  {
    slug: 'boxe-ados',
    name: 'Boxe ados',
    summary: 'Le passage vers la boxe adulte.',
    body:
      'Le groupe adolescent fait le pont entre la boxe éducative et le cours adulte. La puissance y est introduite progressivement, avec un cadre strict sur les protections et l’intensité. C’est aussi le moment où se décide, sans pression, l’orientation vers la compétition ou vers une pratique de loisir.',
    ages: 'Généralement de 13 à 17 ans',
    contact: 'Opposition encadrée, intensité progressive',
    session: [
      'Échauffement et corde',
      'Technique et enchaînements',
      'Sac et pattes d’ours',
      'Opposition encadrée',
      'Gainage'
    ]
  },
  {
    slug: 'boxe-competition',
    name: 'Boxe anglaise — compétition',
    summary: 'Préparation aux rencontres officielles.',
    body:
      'La compétition suppose un volume d’entraînement plus élevé, du sparring régulier et un suivi médical spécifique. L’accès se fait presque toujours sur avis de l’encadrement, après au moins une saison de pratique : ce n’est pas un jugement de valeur, c’est une protection pour des boxeurs qui n’ont pas encore les automatismes nécessaires pour tenir un rythme de combat.',
    ages: 'Selon les catégories, à partir de l’adolescence',
    contact: 'Sparring régulier, licence compétition requise',
    session: [
      'Échauffement spécifique et mobilité',
      'Séquences tactiques, distance et timing',
      'Sparring encadré',
      'Renforcement et récupération'
    ]
  },
  {
    slug: 'cardio-boxe',
    name: 'Cardio boxe',
    summary: 'Le geste de boxe, sans opposition.',
    body:
      'Séance de condition physique construite sur les mouvements de boxe : déplacements, enchaînements, travail au sac, circuits. Aucune opposition, aucun contact. C’est le format choisi par les pratiquants qui veulent la charge de travail de la boxe sans sa dimension d’affrontement, et il sert souvent de transition vers le cours loisir.',
    ages: 'Généralement à partir de 16 ans',
    contact: 'Aucun contact',
    session: [
      'Échauffement cardio',
      'Circuit technique au sac',
      'Intervalles et renforcement',
      'Étirements'
    ]
  }
];

export const GEAR = [
  {
    item: 'Rien du tout',
    when: 'Pour une première séance',
    detail: 'Les clubs prêtent gants et protections le temps d’un essai. Venez en tenue de sport avec une paire de chaussures propres réservées à l’intérieur.'
  },
  {
    item: 'Bandes de maintien',
    when: 'Dès la deuxième ou troisième séance',
    detail: 'Elles protègent les articulations et l’hygiène des gants prêtés. C’est le premier achat, et le moins cher.'
  },
  {
    item: 'Gants',
    when: 'Une fois le club choisi',
    detail: 'Le poids dépend de votre gabarit et de l’usage. Demandez conseil avant d’acheter : une paire mal calibrée se remplace au bout de deux mois.'
  },
  {
    item: 'Protège-dents',
    when: 'Avant toute opposition',
    detail: 'Obligatoire dès qu’il y a contact, même léger. Un modèle thermoformable suffit pour commencer.'
  }
];

export const FAQ: { question: string; answer: string }[] = [
  {
    question: 'Où pratiquer la boxe à Blagnac ?',
    answer:
      'Blagnac se trouve au nord-ouest de Toulouse et dispose d’équipements sportifs municipaux accessibles en tram T1 et en bus Tisséo. Les pratiquants de Beauzelle, Cornebarrieu, Aussonne et Colomiers s’entraînent souvent dans le même secteur. Cette page recense les informations générales ; les coordonnées de chaque structure sont à demander directement auprès d’elle.'
  },
  {
    question: 'Quelles formes de boxe trouve-t-on dans le secteur ?',
    answer:
      'Principalement la boxe anglaise, sous cinq formats : l’éveil ou baby boxing dès 3 ans, la boxe éducative pour les enfants, un groupe adolescent, un cours loisir adulte et un groupe compétition. Le cardio boxe, sans opposition, complète souvent l’offre. Les disciplines pieds-poings — savate, kickboxing, boxe thaï — relèvent d’autres fédérations et ne sont pas traitées ici.'
  },
  {
    question: 'Faut-il déjà savoir boxer pour commencer ?',
    answer:
      'Non. Les cours loisir, éducatif, ados et cardio accueillent des débutants toute l’année. La première séance sert à situer votre niveau, pas à le juger. Seuls les groupes compétition demandent une expérience préalable, généralement au moins une saison.'
  },
  {
    question: 'À quel âge peut-on commencer la boxe ?',
    answer:
      'Dès 3 ans. Les séances d’éveil, souvent appelées baby boxing, n’apprennent pas à frapper : elles travaillent la motricité, l’équilibre et la réaction à un signal, sans aucun contact. La boxe éducative prend le relais vers 7 ans en touche légère, le groupe ados vers 13 ans, et la compétition suppose ensuite une licence spécifique et un suivi médical.'
  },
  {
    question: 'Quel matériel faut-il acheter pour débuter ?',
    answer:
      'Rien pour une première séance : les clubs prêtent gants et protections. Ensuite, une paire de gants, des bandes et un protège-dents suffisent. N’achetez pas avant d’avoir vu un cours — le poids de gants dépend de votre gabarit et de l’usage, et le club vous dira quoi prendre.'
  },
  {
    question: 'Faut-il un certificat médical ?',
    answer:
      'Pour une pratique en loisir, un certificat de non-contre-indication à la pratique de la boxe est habituellement demandé à l’inscription. La compétition impose des exigences supplémentaires, notamment un examen plus complet et un renouvellement annuel.'
  },
  {
    question: 'Quand a lieu la saison et quand s’inscrire ?',
    answer: `${SEASON.rhythm} ${SEASON.closures}`
  },
  {
    question: 'La boxe est-elle ouverte aux femmes ?',
    answer:
      'Oui, sur tous les formats, y compris la compétition. La pratique féminine a fortement progressé en France depuis les années 2000 et la plupart des clubs accueillent hommes et femmes sur les mêmes créneaux, sans cours séparé.'
  }
];

/**
 * Outbound links to the clubs that hold the club-level answers this site
 * deliberately does not publish — timetable, coaching, pricing, enrolment.
 * Every entry must point at a structure that genuinely exists and genuinely
 * offers what the `covers` line claims.
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
    area: 'Quartier des Minimes, Barrière de Paris, Toulouse — métro B',
    covers:
      'Boxe anglaise pour débutants, loisir et compétiteurs, et boxe éducative pour les enfants dès 3 ans. C’est la structure vers laquelle nous orientons pour les horaires, l’encadrement et les modalités d’inscription.',
    links: [
      { label: 'Le club', url: 'https://toulouse-minimes-boxing-club.fr/club' },
      { label: 'Les activités', url: 'https://toulouse-minimes-boxing-club.fr/activites' },
      { label: 'La galerie', url: 'https://toulouse-minimes-boxing-club.fr/galerie' }
    ]
  }
];

export const AREA_LABEL = `${AREA.city}, ${AREA.position}`;
export const DISCIPLINE_COUNT = DISCIPLINES.length;
