import type { Localized } from '#shared/types/localized'

// The résumé as data: /resume shows it, llms-full.txt and resume.md repeat it.

export type Link = { label: Localized, href: string, icon?: string }

export const education = [
  {
    title: { de: 'HTL Steyr · Elektronik mit Computer- und Leittechnik', en: 'HTL Steyr · Electronics with computer and control engineering' },
    school: { de: 'Höhere Abteilung', en: 'Higher technical college (Matura)' },
    time: '2004–2011'
  }
]

export const experience: { role: Localized, company: string | Localized, about?: Localized, time: string, bullets: Localized<string[]>, stack: string[], links?: Link[] }[] = [
  {
    role: { de: 'Product Owner · Flutter & Web Entwicklung · UX/UI', en: 'Product owner · Flutter & web development · UX/UI' },
    company: 'Hakara GmbH',
    about: {
      de: 'NeuraCharge – herstellerunabhängige Plattform zur Verwaltung & Abrechnung von Ladestationen',
      en: 'NeuraCharge – vendor-independent platform for managing and billing EV charging stations'
    },
    time: '04/2026 – heute',
    bullets: {
      de: [
        '**Roadmap, Backlog und Anforderungen** als Product Owner – gemeinsam mit Kunden und Team',
        '**Flutter-App** (iOS/Android) für E-Autofahrer – Live-Ladevorgänge und Kostenübersicht',
        '**Angular-Webportal** für Betreiber – Ladestationen, Nutzer, Tarife und automatische Abrechnung',
        '**UI/UX-Design** für App, Portal und Website',
        '**Marketing-Website** neuracharge.com – Konzeption, Umsetzung und SEO-Optimierung'
      ],
      en: [
        '**Roadmap, backlog and requirements** as product owner – together with customers and the team',
        '**Flutter app** (iOS/Android) for EV drivers – live charging sessions and cost overview',
        '**Angular web portal** for operators – stations, users, tariffs and automatic billing',
        '**UI/UX design** for app, portal and website',
        '**Marketing website** neuracharge.com – concept, build and SEO'
      ]
    },
    stack: ['Flutter', 'Angular', 'Nuxt', 'SEO', 'UX/UI Design', 'Product Ownership', 'Scrum'],
    links: [
      { label: { de: 'Zum Projekt', en: 'See the project' }, href: '/projects/neuracharge', icon: 'lucide:arrow-right' },
      { label: { de: 'neuracharge.com', en: 'neuracharge.com' }, href: 'https://www.neuracharge.com/' }
    ]
  },
  {
    role: { de: 'Teamlead & Software Entwickler', en: 'Team lead & software developer' },
    company: 'Objectbay GmbH',
    time: '06/2024 – 01/2026',
    bullets: {
      de: [
        '**Backend-Modernisierung** für Security-Software',
        '**Mobile App und Admin-Web** für Sommerrodelbahnen',
        '**Regelwerks- und Schadenmanagement** für Versicherungsverbund',
        '**Finanzmanagement-Tool** (Web & App) mit Beraterunterstützung',
        '**Interne Tools** weiterentwickelt'
      ],
      en: [
        '**Backend modernisation** for security software',
        '**Mobile app and admin web** for alpine coasters',
        '**Rules engine and claims management** for an insurance group',
        '**Financial management tool** (web & app) with adviser support',
        '**Internal tools** developed further'
      ]
    },
    stack: ['Spring Boot', 'Angular', 'React', 'Flutter', 'Supabase', 'Docker', 'Keycloak', 'Scrum'],
    links: [{ label: { de: 'Projekt Rodelbahn', en: 'Coaster project' }, href: '/projects/rodelbahn', icon: 'lucide:arrow-right' }]
  },
  {
    role: { de: 'Software Entwickler', en: 'Software developer' },
    company: 'Aescudata GmbH',
    time: '03/2024 – 05/2024',
    bullets: {
      de: [
        '**Neuentwicklung** der bestehenden AngularJS-Software auf moderner Angular-17-Architektur',
        '**State-Management** mit NgRx/RxJS'
      ],
      en: [
        '**Rebuilt** the existing AngularJS software on a modern Angular 17 architecture',
        '**State management** with NgRx/RxJS'
      ]
    },
    stack: ['Angular', 'Java', 'Spring Boot', 'Scrum']
  },
  {
    role: { de: 'Senior Software Entwickler', en: 'Senior software developer' },
    company: { de: 'Designium Inc. (Japan)', en: 'Designium Inc. (Japan)' },
    time: '02/2020 – 12/2023',
    bullets: {
      de: [
        '**Programming-Dojos** vorbereitet und durchgeführt',
        '**3D-Konfigurator** für Schulrucksäcke',
        '**AR & VR** – Experimente mit ARKit/ARCore und Unity',
        '**Apps & Admin-Web** für D-Drive und Schneepflugdienst',
        '**Reiseführer-App** für Aizuwakamatsu',
        '**Fahrassistent** für D-Drive',
        '**Fahrer-App** (Prototyp) zur Generierung von GTFS-RT-Feeds'
      ],
      en: [
        '**Programming dojos** prepared and run',
        '**3D configurator** for school backpacks',
        '**AR & VR** – experiments with ARKit/ARCore and Unity',
        '**Apps & admin web** for D-Drive and a snow plough service',
        '**Travel guide app** for Aizuwakamatsu',
        '**Driver assistant** for D-Drive',
        '**Driver app** (prototype) generating GTFS-RT feeds'
      ]
    },
    stack: ['Vue', 'Nuxt', 'React', 'Flutter', 'React Native', 'Supabase', 'AWS Amplify', 'Node.js', 'Three.js', 'PostgreSQL', 'Unity', 'ARKit/ARCore', 'Photoshop'],
    links: [{ label: { de: 'Projekt D-Drive', en: 'D-Drive project' }, href: '/projects/d-drive', icon: 'lucide:arrow-right' }]
  },
  {
    role: { de: 'Full-Stack Entwickler', en: 'Full-stack developer' },
    company: 'Freelance',
    time: '11/2019 – 02/2020',
    bullets: {
      de: [
        '**Mitgliedsverwaltung** für Stocksportverein OÖ',
        '**Scheckkarten-System** für 15.000 Mitglieder',
        '**Projektende** in der Entwicklungsphase aufgrund der Corona-Pandemie'
      ],
      en: [
        '**Membership system** for an Upper Austrian ice stock sport association',
        '**Chip card system** for 15,000 members',
        '**Project ended** during development because of the COVID-19 pandemic'
      ]
    },
    stack: ['Angular', 'Spring Boot', 'Bootstrap', 'MySQL']
  },
  {
    role: { de: 'Unity Entwickler', en: 'Unity developer' },
    company: { de: 'NeNe Corp. (Japan)', en: 'NeNe Corp. (Japan)' },
    time: '04/2019 – 07/2019',
    bullets: {
      de: ['**Face-Tracking** in Echtzeit auf 3D-Modell'],
      en: ['**Face tracking** in real time on a 3D model']
    },
    stack: ['Unity', 'C#', 'C++']
  },
  {
    role: { de: 'Unity Entwickler & 3D Artist', en: 'Unity developer & 3D artist' },
    company: 'Enova GmbH · Plasser & Theurer',
    time: '08/2016 – 11/2018',
    bullets: {
      de: [
        '**Trainings-Simulator** für Stopfmaschinen',
        '**Mobile Game** „Tamping Game“ (Android/iOS)',
        '**VR-Konfigurator** für Stopfmaschinen'
      ],
      en: [
        '**Training simulator** for tamping machines',
        '**Mobile game** “Tamping Game” (Android/iOS)',
        '**VR configurator** for tamping machines'
      ]
    },
    stack: ['Unity', 'C#', 'Blender', 'Photoshop']
  },
  {
    role: { de: 'Software Entwickler', en: 'Software developer' },
    company: 'Objectbay GmbH',
    time: '11/2014 – 11/2015',
    bullets: {
      de: [
        '**CRM-Neuentwicklung** für eine Bank',
        '**CI/CD und Layout** verantwortet',
        '**Zeitmanagementsystem** für den internen Einsatz'
      ],
      en: [
        '**New CRM** for a bank',
        '**CI/CD and layout** owned',
        '**Time management system** for internal use'
      ]
    },
    stack: ['AngularJS', 'JSF', 'Java', 'MySQL', 'Jenkins', 'Scrum']
  },
  {
    role: { de: 'Software Entwickler', en: 'Software developer' },
    company: 'Case Softwaretechnik GmbH',
    time: '04/2013 – 10/2014',
    bullets: {
      de: ['**Zeiterfassungssysteme** – Entwicklung, Installation, Support und Wartung'],
      en: ['**Time tracking systems** – development, installation, support and maintenance']
    },
    stack: ['jQuery', 'Python', 'PostgreSQL', 'Linux']
  },
  {
    role: { de: 'Zivildienst & Übergangsjobs', en: 'Civilian service & interim jobs' },
    company: { de: 'Diverse Arbeitgeber · Oberösterreich', en: 'Various employers · Upper Austria' },
    time: '07/2011 – 03/2013',
    bullets: {
      de: [
        '**Zivildienst** im Landeskrankenhaus Steyr (02/2012 – 10/2012)',
        '**Übergangstätigkeiten** in Produktion, Elektroinstallation, Logistik und Maschinenbedienung',
        '**Arbeitgeber** u. a. Biodiesel Enns, VÖST Linz, Agru Bad Hall, BMW Steyr'
      ],
      en: [
        '**Civilian service** at Steyr regional hospital (02/2012 – 10/2012)',
        '**Interim work** in production, electrical installation, logistics and machine operation',
        '**Employers** included Biodiesel Enns, VÖST Linz, Agru Bad Hall, BMW Steyr'
      ]
    },
    stack: []
  }
]

// Years in software: from the earliest job with a tech stack (04/2013,
// Case Softwaretechnik) until today. Zivildienst/Übergangsjobs do not count.
// Facts as in the MoneyKoi README (October 2026): Android and web live, iOS in progress.
export const moneykoi: { title: string, subtitle: Localized, time: Localized, platforms: Localized, description: Localized, bullets: Localized<string[]>, stack: string[], links: Link[] } = {
  title: 'MoneyKoi',
  subtitle: { de: 'Eigenes Produkt · Android, Web, iOS in Arbeit', en: 'Own product · Android, web, iOS in progress' },
  time: { de: 'seit 2024', en: 'since 2024' },
  platforms: { de: 'Android · Web · iOS bald', en: 'Android · web · iOS soon' },
  description: {
    de: 'Offline-First-Haushaltsbuch auf Deutsch, Englisch und Japanisch – lokale SQLite-Datenbank mit Outbox-Sync über Supabase, dazu eine Next.js-Web-App, die Website mit Blog und ein Admin-Dashboard. Konzept, Design, Umsetzung und Vermarktung aus einer Hand.',
    en: 'Offline-first budget book in German, English and Japanese – a local SQLite database with outbox sync over Supabase, plus a Next.js web app, the website with a blog and an admin dashboard. Concept, design, build and marketing by one person.'
  },
  bullets: {
    de: [
      '**Beleg-Scanner** direkt am Handy: Texterkennung mit eigenen Parsern für SPAR, BILLA, LIDL u. a., österreichischer Beleg-QR-Code und optionaler On-Device-KI-Scan',
      '**Schnelles Buchen** per Freitext („12 Mittagessen gestern“), Rechner-Tastatur und acht Android-Homescreen-Widgets',
      '**Budgets, Sparziele, Kredite** mit Tilgungsplan und wiederkehrende Buchungen – inkl. Auswertungen mit Trends, Heatmap und Vermögensverlauf',
      '**Investment-Tracking** mit echter Rendite (XIRR), Zielmix sowie Edelmetallen und Krypto zu Tagespreisen',
      '**Gemeinsame Haushaltsbücher** mit Rollen und Einladung per Link; App-Sperre per PIN/Biometrie und Export als CSV, PDF oder ZIP'
    ],
    en: [
      '**Receipt scanner** on the phone: text recognition with custom parsers for SPAR, BILLA, LIDL and others, the Austrian receipt QR code and an optional on-device AI scan',
      '**Fast booking** by free text (“12 lunch yesterday”), a calculator keypad and eight Android home-screen widgets',
      '**Budgets, savings goals, loans** with repayment plans and recurring bookings – including reports with trends, a heatmap and net worth over time',
      '**Investment tracking** with real returns (XIRR), target mix, and precious metals and crypto at daily prices',
      '**Shared budget books** with roles and invite links; app lock by PIN/biometrics and export as CSV, PDF or ZIP'
    ]
  },
  stack: ['Flutter', 'Supabase', 'Next.js', 'PostgreSQL', 'Sentry', 'Offline-First'],
  links: [
    { label: { de: 'Zum Projekt', en: 'See the project' }, href: '/projects/moneykoi', icon: 'lucide:arrow-right' },
    { label: { de: 'Website', en: 'Website' }, href: 'https://www.moneykoi.com' },
    { label: { de: 'Android', en: 'Android' }, href: 'https://play.google.com/store/apps/details?id=com.psyren.moneykoi' }
  ]
}

export const misc: { label: Localized, year?: string, detail?: string, href?: string }[] = [
  { year: '2024', label: { de: 'Certified Scrum Master', en: 'Certified Scrum Master' } },
  { year: '2024', label: { de: 'Kommunikationstraining', en: 'Communication training' }, detail: 'Zuhörakademie (Jürgen Melmuka)', href: 'https://zuhoerakademie.at/' },
  { label: { de: 'A & B Führerschein', en: 'Driving licence A & B' } },
  { label: { de: 'Working Holiday & Berufserfahrung in Japan', en: 'Working holiday & work experience in Japan' } }
]
