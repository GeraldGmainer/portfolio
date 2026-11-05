// Relative, not #shared: nuxt.config.ts imports this file and has no such alias.
import type { Localized } from '../../shared/types/localized'

// Every project on the site. The projects page lists them all, home shows
// `FEATURED`, and the ones with a `caseStudy` get their own page at
// /projects/<slug>.
//
// Client projects only state what is public or already approved for this
// site; numbers come from the project itself (MoneyKoi: its README, as of
// October 2026). Never round up and never invent results.
//
// Objectbay projects: naming the clients or their products is not approved,
// so keep titles, text and alt texts generic. Their images are designed
// screens with demo data, not captures (scripts/client-screens.mjs).

export type ProjectType = 'own' | 'work' | 'freelance'

export type CaseStudy = {
  slug: string
  // Shown instead of the project's year, e.g. "since 2024".
  period?: Localized
  lede: Localized
  context: Localized
  role: Localized<string[]>
  decisions: { title: Localized, text: Localized }[]
  // Values in each locale's number format where they differ (2.000 / 2,000).
  facts: { value: string | Localized, label: Localized }[]
  // Wide shots; transparent device mockups come from the project.
  images: { src: string, alt: Localized, width: number, height: number }[]
}

export type Project = {
  id: string
  title: Localized
  description: Localized
  image: string
  date: string
  stack: string[]
  type: ProjectType
  company: string | Localized
  role?: Localized
  // One-liner for cards and the home page; falls back to description.
  summary?: Localized
  // Short line under the title on home, e.g. "Budget book app".
  subtitle?: Localized
  // Transparent device shot, shown frameless on a glow instead of `image`.
  mockup?: string
  mockupKind?: 'phone' | 'wide'
  // Desktop screenshot; the featured card on /projects shows it behind `mockup`.
  webShot?: string
  // Brand colour for the glow behind `mockup`.
  glow?: string
  // Extra full-size images shown in the lightbox after the card image.
  gallery?: string[]
  website?: string
  playstore?: string
  github?: string
  caseStudy?: CaseStudy
}

const own = { de: 'Eigenes Produkt', en: 'Own product' }
const hobby = { de: 'Hobby', en: 'Side project' }

export const projects: Project[] = [
  {
    id: 'neuracharge',
    title: { de: 'NeuraCharge', en: 'NeuraCharge' },
    subtitle: { de: 'Plattform für Ladestationen', en: 'EV charging platform' },
    description: {
      de: 'NeuraCharge ist eine herstellerunabhängige Plattform (CPMS) zur Verwaltung und gesetzeskonformen Abrechnung von Ladestationen – für Firmen- und Heimladen, Standortbetreiber, Wohnbau und Hotellerie. '
        + 'Als Product Owner verantworte ich Roadmap und Backlog, entwickle die Flutter-App für E-Autofahrer (iOS/Android) sowie das Angular-Webportal für Betreiber, gestalte UX/UI von App, Portal und Website '
        + 'und habe die Marketing-Website neuracharge.com konzipiert, umgesetzt und für SEO optimiert.',
      en: 'NeuraCharge is a vendor-independent platform (CPMS) for managing charging stations and billing them in line with regulations – for workplace and home charging, site operators, residential buildings and hotels. '
        + 'As product owner I own the roadmap and backlog, develop the Flutter app for EV drivers (iOS/Android) and the Angular portal for operators, design the UX/UI of app, portal and website, '
        + 'and conceived, built and optimised the marketing website neuracharge.com for search.'
    },
    summary: {
      de: 'Herstellerunabhängige Plattform zur Verwaltung und Abrechnung von Ladestationen – als Product Owner verantworte ich Roadmap, App, Webportal und Website.',
      en: 'Vendor-independent platform for managing and billing charging stations – as product owner I am responsible for the roadmap, app, web portal and website.'
    },
    image: '/images/neuracharge.webp',
    mockup: '/images/neuracharge-mockup.webp',
    mockupKind: 'wide',
    glow: '#1EBDB5',
    date: '2026-04-01',
    stack: ['Flutter', 'Angular', 'Nuxt', 'SEO', 'UX/UI Design', 'Product Ownership', 'Scrum'],
    website: 'https://www.neuracharge.com/',
    type: 'work',
    company: 'Hakara GmbH',
    role: { de: 'Product Owner & Entwickler', en: 'Product owner & developer' },
    caseStudy: {
      slug: 'neuracharge',
      period: { de: 'seit 2026', en: 'since 2026' },
      lede: {
        de: 'Eine herstellerunabhängige Plattform, mit der Firmen, Wohnbauten und Hotels ihre Ladestationen verwalten und gesetzeskonform abrechnen – App, Betreiberportal und Website aus einer Produktverantwortung.',
        en: 'A vendor-independent platform that lets companies, residential buildings and hotels manage their charging stations and bill them in line with regulations – app, operator portal and website under one product owner.'
      },
      context: {
        de: 'Wer Ladestationen betreibt – im Betrieb, im Wohnbau, im Hotel oder als Standortbetreiber – braucht mehr als die Hardware: Ladevorgänge müssen erfasst, Tarife verwaltet und Kosten korrekt abgerechnet werden, egal von welchem Hersteller die Station ist. NeuraCharge bündelt das in einer Plattform für Betreiber und Fahrer.',
        en: 'Anyone running charging stations – at work, in residential buildings, in hotels or as a site operator – needs more than the hardware: charging sessions have to be recorded, tariffs managed and costs billed correctly, whoever made the station. NeuraCharge brings this together in one platform for operators and drivers.'
      },
      role: {
        de: [
          '**Product Owner** – Roadmap, Backlog und Anforderungen gemeinsam mit Kunden und Team',
          '**Flutter-App** für E-Autofahrer (iOS/Android) – Live-Ladevorgänge und Kostenübersicht',
          '**Angular-Portal** für Betreiber – Ladestationen, Nutzer, Tarife und automatische Abrechnung',
          '**UX/UI-Design** für App, Portal und Website',
          '**Website** neuracharge.com – Konzept, Umsetzung mit Nuxt und SEO'
        ],
        en: [
          '**Product owner** – roadmap, backlog and requirements together with customers and the team',
          '**Flutter app** for EV drivers (iOS/Android) – live charging sessions and cost overview',
          '**Angular portal** for operators – stations, users, tariffs and automatic billing',
          '**UX/UI design** for app, portal and website',
          '**Website** neuracharge.com – concept, build with Nuxt, and SEO'
        ]
      },
      decisions: [
        {
          title: { de: 'Ein Product Owner, der mitbaut', en: 'A product owner who also builds' },
          text: {
            de: 'Ich schreibe die Anforderungen und setze einen Teil davon selbst um. Tickets sind dadurch so geschnitten, dass sie sich bauen lassen, und technische Risiken liegen auf dem Tisch, bevor sie die Roadmap verschieben.',
            en: 'I write the requirements and implement part of them myself. That keeps tickets cut so they can actually be built, and technical risks surface before they move the roadmap.'
          }
        },
        {
          title: { de: 'Eine Designsprache für drei Oberflächen', en: 'One design language for three surfaces' },
          text: {
            de: 'Fahrer-App, Betreiberportal und Website gestalte ich selbst. So wirkt die Plattform wie ein Produkt – vom ersten Besuch auf der Website bis zur Abrechnung im Portal.',
            en: 'I design the driver app, the operator portal and the website myself. The platform reads as one product – from the first visit to the website to the invoice in the portal.'
          }
        },
        {
          title: { de: 'Eine Website, die gefunden wird', en: 'A website that gets found' },
          text: {
            de: 'neuracharge.com ist mit Nuxt umgesetzt und von Anfang an auf Suchmaschinen ausgelegt – Seitenstruktur, Texte und Meta-Daten entstehen zusammen mit dem Design, nicht danach.',
            en: 'neuracharge.com is built with Nuxt and designed for search from the start – page structure, copy and metadata are made together with the design, not after it.'
          }
        }
      ],
      facts: [
        { value: '3', label: { de: 'Oberflächen: App, Portal, Website', en: 'surfaces: app, portal, website' } },
        { value: 'iOS + Android', label: { de: 'Fahrer-App in Flutter', en: 'driver app in Flutter' } },
        { value: '04/2026', label: { de: 'Start als Product Owner', en: 'started as product owner' } }
      ],
      images: [
        { src: '/images/neuracharge.webp', alt: { de: 'NeuraCharge Betreiberportal und App', en: 'NeuraCharge operator portal and app' }, width: 1600, height: 1100 }
      ]
    }
  },
  {
    id: 'moneykoi',
    title: { de: 'MoneyKoi', en: 'MoneyKoi' },
    subtitle: { de: 'Haushaltsbuch-App', en: 'Budget book app' },
    description: {
      de: 'MoneyKoi ist mein eigenes Produkt: ein Offline-First-Haushaltsbuch für Android und Web (iOS in Arbeit), auf Deutsch, Englisch und Japanisch – entstanden aus über zehn Jahren eigener Finanzverwaltung. '
        + 'Die App liest und schreibt nur in eine lokale SQLite-Datenbank und synchronisiert über eine Outbox mit Supabase, deshalb kennt die UI keine Ladebalken. '
        + 'Der Beleg-Scanner liest Kassabons direkt am Handy, inklusive RKSV-QR-Code. Dazu kommen eine Next.js-Web-App, die Website mit Blog und ein Admin-Dashboard – Konzept, Design, Entwicklung und Vermarktung aus einer Hand.',
      en: 'MoneyKoi is my own product: an offline-first budget book for Android and the web (iOS in progress), in German, English and Japanese – born from more than ten years of managing my own finances. '
        + 'The app reads and writes only to a local SQLite database and syncs with Supabase through an outbox, which is why the UI never shows a loading spinner. '
        + 'The receipt scanner reads receipts on the phone, including the Austrian RKSV QR code. Around it sit a Next.js web app, the website with a blog and an admin dashboard – concept, design, development and marketing by one person.'
    },
    summary: {
      de: 'Eigenes Offline-First-Haushaltsbuch für Android und Web – mit Outbox-Sync über Supabase, Beleg-Scanner am Gerät und rund 10.000 Tests.',
      en: 'My own offline-first budget book for Android and the web – with outbox sync over Supabase, an on-device receipt scanner and around 10,000 tests.'
    },
    image: '/images/moneykoi-hero.webp',
    mockup: '/images/moneykoi.webp',
    mockupKind: 'phone',
    webShot: '/images/moneykoi-web.webp',
    glow: '#F2803A',
    gallery: ['/images/moneykoi-phone.webp', '/images/moneykoi-web.webp'],
    date: '2025-11-15',
    stack: ['Flutter', 'Supabase', 'PostgreSQL', 'Next.js', 'Nuxt', 'ML Kit', 'Offline-First'],
    website: 'https://www.moneykoi.com',
    playstore: 'https://play.google.com/store/apps/details?id=com.psyren.moneykoi',
    type: 'own',
    company: own,
    caseStudy: {
      slug: 'moneykoi',
      period: { de: 'seit 2024', en: 'since 2024' },
      lede: {
        de: 'Ein Haushaltsbuch, das ohne Internet vollständig funktioniert, Kassabons am Handy liest und einen ganzen Haushalt in Echtzeit synchronisiert – als eigenes Produkt von der Idee bis zum Store.',
        en: 'A budget book that works fully offline, reads receipts on the phone and syncs a whole household in real time – my own product, from the idea to the store.'
      },
      context: {
        de: 'Nach über zehn Jahren eigener Finanzverwaltung wollte ich ein Haushaltsbuch ohne Bank-Login, ohne Cloud-KI und ohne Werbung, das auch im Flugmodus alles kann. Heute gibt es MoneyKoi als Free-, Pro- und Cloud-Plan: Ohne Konto liegt das ganze Buch am Handy, mit Cloud teilt sich ein Haushalt ein Buch über Handys, Tablets und Browser.',
        en: 'After more than ten years of managing my own finances I wanted a budget book without a bank login, without cloud AI and without ads, that does everything in airplane mode. Today MoneyKoi comes as Free, Pro and Cloud plans: without an account the whole book lives on the phone; with Cloud a household shares one book across phones, tablets and the browser.'
      },
      role: {
        de: [
          '**Produkt** – Funktionsumfang, Pläne und Roadmap',
          '**Design** der App, der Web-App und der Website',
          '**Entwicklung** von Flutter-App, Next.js-Web-App, Supabase-Backend und Admin-Dashboard',
          '**Vermarktung** – Website mit Blog und SEO, Store-Auftritt und Releases'
        ],
        en: [
          '**Product** – scope, plans and roadmap',
          '**Design** of the app, the web app and the website',
          '**Development** of the Flutter app, the Next.js web app, the Supabase backend and the admin dashboard',
          '**Marketing** – website with blog and SEO, store listing and releases'
        ]
      },
      decisions: [
        {
          title: { de: 'Die lokale Datenbank ist die Quelle der Wahrheit', en: 'The local database is the source of truth' },
          text: {
            de: 'Die App liest und schreibt nur in SQLite. Änderungen landen in einer persistenten Outbox, die sie einzeln, zusammengefasst und mit Wiederholungen an Supabase schickt. Änderungen anderer Geräte kommen über einen einzigen Delta-Sync zurück; Realtime-Events lösen nur einen Abgleich aus, die Daten selbst kommen immer über denselben Weg.',
            en: 'The app reads and writes only to SQLite. Changes go into a persistent outbox that pushes them one at a time, coalesced and with retries. Changes from other devices come back through a single delta sync; realtime events only trigger a pull, and the data itself always arrives the same way.'
          }
        },
        {
          title: { de: 'Ein Haushaltsbuch ist ein Mandant', en: 'A budget book is a tenant' },
          text: {
            de: 'Vor jeder Anfrage prüft ein PostgREST-Hook, ob der Nutzer Mitglied des Buchs ist. Die Row-Level-Security ist bewusst asymmetrisch: Lesen nur im aktiven Buch, Schreiben gegen das Buch der jeweiligen Zeile. So gehen offline gesammelte Buchungen auch dann durch, wenn inzwischen ein anderes Buch offen ist.',
            en: 'Before every request a PostgREST hook checks that the user is a member of the book. Row-level security is deliberately asymmetric: reads are limited to the active book, writes are checked against the row\'s own book. Bookings queued offline still go through after the user has switched to another book.'
          }
        },
        {
          title: { de: 'Der Beleg-Scanner bleibt am Gerät', en: 'The receipt scanner stays on the device' },
          text: {
            de: 'ML Kit erkennt Text und QR-Codes am Handy, eigene Parser für SPAR, BILLA, Lidl und Co. lesen die Positionen aus, und ein Abgleich prüft, ob sie die Summe ergeben. Alles regelbasiert, ohne LLM – das Foto und sein Text gehen an keinen KI-Dienst.',
            en: 'ML Kit reads text and QR codes on the phone, shop-specific parsers for SPAR, BILLA, Lidl and others extract the line items, and a reconciler checks that they add up to the total. All rule-based, no LLM – the photo and its text are never sent to an AI service.'
          }
        },
        {
          title: { de: 'Kein Float für Geld', en: 'No floats for money' },
          text: {
            de: 'Beträge sind am Server NUMERIC und in Dart ein Decimal-Wertobjekt, Kontostände pflegen Trigger inkrementell. Prognose, Wiederholungsregeln und Kreditrechnung gibt es in Dart und TypeScript – gemeinsame Test-Fixtures sorgen dafür, dass App und Web exakt dieselben Zahlen liefern.',
            en: 'Amounts are NUMERIC on the server and a Decimal value object in Dart; triggers maintain balances incrementally. The forecast, recurrence rules and loan maths exist in both Dart and TypeScript – shared test fixtures make sure app and web return exactly the same numbers.'
          }
        }
      ],
      facts: [
        { value: '~210k', label: { de: 'Zeilen Dart in 40 Feature-Modulen', en: 'lines of Dart in 40 feature modules' } },
        { value: '~10k', label: { de: 'Tests in der App', en: 'tests in the app' } },
        { value: '100+', label: { de: 'Server-Migrationen', en: 'server migrations' } },
        { value: '3', label: { de: 'Sprachen: Deutsch, Englisch, Japanisch', en: 'languages: German, English, Japanese' } }
      ],
      images: [
        { src: '/images/moneykoi-hero.webp', alt: { de: 'MoneyKoi App-Screens', en: 'MoneyKoi app screens' }, width: 1600, height: 1207 }
      ]
    }
  },
  {
    id: 'claims',
    title: { de: 'Regelwerks- & Schadenmanagement', en: 'Rules engine & claims management' },
    description: {
      de: 'Modul zur automatischen Bearbeitung von Versicherungsschäden. Mitentwicklung des Regelwerks sowie UI-Komponenten zur effizienten Bewertung von Fällen. Unterstützt Sachbearbeiter dabei, Zeit zu sparen und jeden Schadenfall deutlich kosteneffizienter abzuwickeln.',
      en: 'Module for processing insurance claims automatically. I co-developed the rules engine and UI components for assessing cases efficiently, helping claims handlers save time and settle each claim at much lower cost.'
    },
    image: '/images/claims.webp',
    date: '2025-11-01',
    stack: ['Angular', 'Spring Boot', 'PostgreSQL', 'Lombok'],
    type: 'work',
    company: 'Objectbay GmbH'
  },
  {
    id: 'finance-tool',
    title: { de: 'Finanzmanagement-Tool', en: 'Financial management tool' },
    description: {
      de: 'Web- und App-gestütztes Finanzmanagement-Tool mit Beraterunterstützung. Meine Hauptverantwortung lag in der Entwicklung der Web- (Angular) und App- (Flutter) Komponenten.',
      en: 'Web and app-based financial management tool with adviser support. I was mainly responsible for the web (Angular) and app (Flutter) parts.'
    },
    image: '/images/finance.webp',
    date: '2025-02-01',
    stack: ['Angular', 'Flutter', 'Spring Boot'],
    type: 'work',
    company: 'Objectbay GmbH'
  },
  {
    id: 'rodelbahn',
    title: { de: 'Rodelbahn Admin & App', en: 'Alpine coaster admin & app' },
    subtitle: { de: 'Diagnose für Sommerrodelbahnen', en: 'Diagnostics for alpine coasters' },
    description: {
      de: 'Die Plattform besteht aus einem Web-Portal und einer Flutter-App zur Steuerung und Diagnose von ca. 10 Rodelbahnen weltweit. Meine Hauptverantwortung lag in der Entwicklung der Flutter-App und der komplexen Bluetooth-Kommunikation, die bis zu 40 Fahrzeuge gleichzeitig mit Priorisierung, Fehler-Handling und Offline-Fähigkeit synchronisiert. '
        + 'Über das Web-Portal (mit Keycloak zur rollenbasierten Rechteverwaltung) können Installateure den Status der Rodeln aus der Ferne beurteilen und manuelle Diagnosen durchführen, wodurch Vor-Ort-Einsätze reduziert werden.',
      en: 'The platform consists of a web portal and a Flutter app for controlling and diagnosing around 10 alpine coasters worldwide. I was mainly responsible for the Flutter app and the complex Bluetooth communication that syncs up to 40 vehicles at once, with prioritisation, error handling and offline support. '
        + 'Through the web portal (with Keycloak for role-based permissions) installers can check the state of the sleds remotely and run manual diagnostics, which cuts down on site visits.'
    },
    summary: {
      de: 'Flutter-App und Web-Portal zur Steuerung und Diagnose von rund 10 Rodelbahnen weltweit – Bluetooth-Sync mit bis zu 40 Fahrzeugen gleichzeitig.',
      en: 'Flutter app and web portal for controlling and diagnosing around 10 alpine coasters worldwide – Bluetooth sync with up to 40 vehicles at once.'
    },
    image: '/images/coaster.webp',
    mockup: '/images/coaster-mockup.webp',
    mockupKind: 'wide',
    glow: '#FAAD14',
    gallery: ['/images/screens/rodelbahn.jpg'],
    date: '2024-12-01',
    stack: ['Flutter', 'Bluetooth (BLE)', 'React Refine', 'Spring Boot', 'PostgreSQL', 'Keycloak'],
    type: 'work',
    company: 'Objectbay GmbH',
    caseStudy: {
      slug: 'rodelbahn',
      lede: {
        de: 'Flutter-App und Web-Portal zur Steuerung und Diagnose von rund zehn Sommerrodelbahnen weltweit – mit Bluetooth-Sync zu bis zu 40 Rodeln gleichzeitig.',
        en: 'A Flutter app and web portal for controlling and diagnosing around ten alpine coasters worldwide – with Bluetooth sync to up to 40 sleds at once.'
      },
      context: {
        de: 'Eine Rodelbahn besteht aus vielen einzelnen Fahrzeugen mit eigener Elektronik: Akku, Bremse, Gurtschloss, Sensoren. Techniker müssen den Zustand jeder Rodel sehen und Funktionen testen können – direkt am Fahrzeug und, wo möglich, aus der Ferne.',
        en: 'An alpine coaster is made up of many vehicles with their own electronics: battery, brake, belt lock, sensors. Technicians need to see the state of every sled and test its functions – right at the vehicle and, where possible, remotely.'
      },
      role: {
        de: [
          '**Flutter-App** für Techniker und Installateure – Diagnose, Funktionstests, Status',
          '**Bluetooth-Kommunikation** mit bis zu 40 Fahrzeugen gleichzeitig',
          '**Priorisierung, Fehlerbehandlung** und Offline-Fähigkeit',
          '**Web-Portal** – Mitarbeit an Admin-Web mit React Refine, Spring Boot und Keycloak'
        ],
        en: [
          '**Flutter app** for technicians and installers – diagnostics, function tests, status',
          '**Bluetooth communication** with up to 40 vehicles at once',
          '**Prioritisation, error handling** and offline support',
          '**Web portal** – work on the admin web with React Refine, Spring Boot and Keycloak'
        ]
      },
      decisions: [
        {
          title: { de: '40 Fahrzeuge über Bluetooth', en: '40 vehicles over Bluetooth' },
          text: {
            de: 'Ein Handy hält nur wenige Bluetooth-Verbindungen gleichzeitig. Die App entscheidet deshalb, welche Rodel gerade Vorrang hat, arbeitet die übrigen geordnet ab und fängt Verbindungsabbrüche ab, statt den Techniker damit allein zu lassen.',
            en: 'A phone holds only a few Bluetooth connections at a time. The app therefore decides which sled has priority right now, works through the rest in order and handles dropped connections instead of leaving the technician to deal with them.'
          }
        },
        {
          title: { de: 'Funktioniert auch ohne Netz', en: 'Works without a network' },
          text: {
            de: 'Die App ist offline-fähig: Diagnose und Tests laufen direkt über Bluetooth, und die Daten werden abgeglichen, sobald wieder eine Verbindung besteht.',
            en: 'The app works offline: diagnostics and tests run straight over Bluetooth, and the data is synced as soon as a connection is back.'
          }
        },
        {
          title: { de: 'Diagnose aus der Ferne', en: 'Remote diagnostics' },
          text: {
            de: 'Im Web-Portal sehen Installateure den Zustand der Rodeln aus der Ferne und starten Diagnosen – mit Rollen und Rechten über Keycloak. Das erspart Fahrten zur Bahn.',
            en: 'In the web portal installers see the state of the sleds remotely and start diagnostics – with roles and permissions through Keycloak. That saves trips to the site.'
          }
        }
      ],
      facts: [
        { value: '~10', label: { de: 'Rodelbahnen weltweit', en: 'coasters worldwide' } },
        { value: '40', label: { de: 'Fahrzeuge gleichzeitig per Bluetooth', en: 'vehicles at once over Bluetooth' } },
        { value: 'Offline', label: { de: 'Diagnose ohne Netz, Abgleich danach', en: 'diagnostics without network, sync after' } }
      ],
      images: [
        {
          src: '/images/coaster.webp',
          alt: {
            de: 'Admin-Web mit der Fahrzeugliste einer Bahn – Status, Akku und letzte Diagnose je Rodel –, daneben die Diagnose-App für eine einzelne Rodel',
            en: 'Admin web with the sled list of one coaster – status, battery and last diagnostics per sled – next to the diagnostics app for a single sled'
          },
          width: 1600,
          height: 1200
        }
      ]
    }
  },
  {
    id: 'security-backend',
    title: { de: 'Security-Software Backend Modernisierung', en: 'Security software backend modernisation' },
    description: {
      de: 'Dieses Projekt umfasste die umfassende Modernisierung des Backend-Systems einer bestehenden Security-Software. Durch Refactoring und die Umstellung auf eine Microservices-Architektur (unter Verwendung von Spring Boot, Java und Kotlin) wurde die Basis für höhere Skalierbarkeit und Zukunftssicherheit geschaffen. '
        + 'Die Einführung von Docker und Kubernetes optimierte zudem die Deployment-Prozesse und die Ressourcennutzung.',
      en: 'A thorough modernisation of the backend of an existing security product. Refactoring and a move to microservices (Spring Boot, Java and Kotlin) laid the groundwork for better scalability and a longer life. '
        + 'Introducing Docker and Kubernetes also improved deployments and resource usage.'
    },
    image: '/images/security.webp',
    date: '2024-07-01',
    stack: ['Spring Boot', 'Java', 'Kotlin', 'Docker', 'Kubernetes'],
    type: 'work',
    company: 'Objectbay GmbH'
  },
  {
    id: 'logistics',
    title: { de: 'Materialwirtschaft & Logistik', en: 'Materials management & logistics' },
    description: {
      de: 'Modernisierung einer bestehenden AngularJS-Lösung und Aufbau einer neuen, zukunftssicheren Angular-17-Codebasis.',
      en: 'Modernising an existing AngularJS application and building a new, future-proof Angular 17 codebase.'
    },
    image: '/images/cgm.webp',
    date: '2024-03-15',
    stack: ['Angular', 'Java', 'Spring Boot'],
    type: 'work',
    company: 'Aescudata GmbH'
  },
  {
    id: 'transit-driver',
    title: { de: 'Transit Driver RT', en: 'Transit Driver RT' },
    description: {
      de: 'Prototyp zur Erfassung von Echtzeit-Fahrtdaten und GTFS-RT-Generierung.',
      en: 'Prototype for capturing real-time trip data and generating GTFS-RT feeds.'
    },
    image: '/images/gtfs.webp',
    date: '2023-11-01',
    stack: ['Flutter', 'Maps', 'Background Tracking', 'GTFS-RT', 'Supabase'],
    type: 'work',
    company: 'Designium Inc.'
  },
  {
    id: 'raraya',
    title: { de: 'Raraya 3D Rucksack-Konfigurator', en: 'Raraya 3D backpack configurator' },
    subtitle: { de: '3D-Konfigurator im Browser', en: '3D configurator in the browser' },
    description: {
      de: 'Der interaktive 3D-Konfigurator für Schulrucksäcke wurde speziell für Schulanfänger entwickelt. Meine Verantwortlichkeiten umfassten die Modellierung und Animation der 3D-Inhalte sowie das Rendering. '
        + 'Auf der technischen Seite war ich für die Modellkonfiguration, die Implementierung des Webformulars und die Gestaltung der gesamten User Experience (UX) zuständig, um eine intuitive und spielerische Bedienung zu gewährleisten.',
      en: 'An interactive 3D configurator for school backpacks, made for children starting school. I modelled and animated the 3D content and handled the rendering. '
        + 'On the technical side I built the model configuration and the web form and designed the whole user experience, so that it feels intuitive and playful.'
    },
    summary: {
      de: 'Interaktiver 3D-Konfigurator für Schulrucksäcke – Modellierung, Rendering, Konfigurationslogik und UX aus einer Hand.',
      en: 'Interactive 3D configurator for school backpacks – modelling, rendering, configuration logic and UX by one person.'
    },
    image: '/images/raraya_desktop.webp',
    mockup: '/images/raraya.webp',
    mockupKind: 'phone',
    glow: '#E6307A',
    gallery: ['/images/raraya.webp'],
    date: '2023-05-01',
    stack: ['Three.js', 'Vue', 'PostProcessing', 'Node.js', 'Blender', 'Photoshop'],
    website: 'https://sim.raraya.co.jp/',
    type: 'work',
    company: 'Designium Inc.'
  },
  {
    id: 'd-drive',
    title: { de: 'D-Drive Fahrassistenz', en: 'D-Drive driver assistant' },
    subtitle: { de: 'Telematik für Lkw und Busse', en: 'Telematics for trucks and buses' },
    description: {
      de: 'Das Fleet-Management-System wird von ca. 80 Mandanten und rund 2.000 Nutzern pro Tag verwendet. Ich war vollumfänglich für die Entwicklung der gesamten Flutter-App verantwortlich, einschließlich kritischer Funktionen wie GPS-Tracking und der Bluetooth-Kommunikation mit externen Geräten. '
        + 'Des Weiteren gehörten die React Admin Webseite sowie die Sicherstellung eines performanten Backends (mit Supabase) zu meinen Hauptaufgaben.',
      en: 'The fleet management system is used by around 80 tenants and about 2,000 users a day. I was fully responsible for the whole Flutter app, including critical features such as GPS tracking and Bluetooth communication with external devices. '
        + 'My main tasks also included the React Admin website and keeping the Supabase backend fast.'
    },
    summary: {
      de: 'Fleet-Management-App mit GPS-Tracking und Bluetooth-Anbindung externer Geräte – im Einsatz bei rund 80 Mandanten mit etwa 2.000 Nutzern pro Tag.',
      en: 'Fleet management app with GPS tracking and Bluetooth-connected devices – used by around 80 tenants with about 2,000 users a day.'
    },
    image: '/images/ddrive-alcohol-check.webp',
    mockup: '/images/ddrive-composition.webp',
    mockupKind: 'wide',
    glow: '#22A7E8',
    gallery: ['/images/ddrive-composition.webp', '/images/ddrive.webp'],
    date: '2022-06-01',
    stack: ['Flutter', 'Bluetooth (BLE)', 'GPS', 'Supabase', 'React Admin'],
    website: 'https://www.ubiteq.co.jp/service_product/d-drive-1',
    type: 'work',
    company: 'Designium Inc.',
    caseStudy: {
      slug: 'd-drive',
      lede: {
        de: 'Eine Telematik-App für Lkw- und Busfahrer: Alkoholtest per Bluetooth-Messgerät, GPS-Fahrtenaufzeichnung und ein Admin-Dashboard – im Einsatz bei rund 80 Mandanten mit etwa 2.000 Nutzern pro Tag.',
        en: 'A telematics app for truck and bus drivers: alcohol tests with a Bluetooth breathalyser, GPS trip recording and an admin dashboard – used by around 80 tenants with about 2,000 users a day.'
      },
      context: {
        de: 'D-Drive ist ein Produkt für Transportunternehmen in Japan. Fahrer machen ihren Alkoholtest mit einem Bluetooth-Messgerät, die App zeichnet die Fahrt per GPS auf, und das Büro sieht beides in einem Admin-Dashboard. Ich habe die App bei Designium von Grund auf entwickelt.',
        en: 'D-Drive is a product for transport companies in Japan. Drivers take their alcohol test with a Bluetooth breathalyser, the app records the trip by GPS, and the office sees both in an admin dashboard. I built the app from scratch at Designium.'
      },
      role: {
        de: [
          '**Gesamte Flutter-App** – Architektur, UI und Umsetzung',
          '**Bluetooth-Kommunikation** mit externen Messgeräten',
          '**GPS-Tracking** der Fahrten mit Fahrzeit und Distanz',
          '**Admin-Website** mit React Admin',
          '**Supabase-Backend** – Performance bei rund 2.000 Nutzern pro Tag'
        ],
        en: [
          '**The whole Flutter app** – architecture, UI and implementation',
          '**Bluetooth communication** with external devices',
          '**GPS tracking** of trips with driving time and distance',
          '**Admin website** with React Admin',
          '**Supabase backend** – performance at around 2,000 users a day'
        ]
      },
      decisions: [
        {
          title: { de: 'Das Messgerät spricht direkt mit der App', en: 'The breathalyser talks straight to the app' },
          text: {
            de: 'Der Alkoholtester ist per Bluetooth angebunden, der Messwert wird direkt mit der Fahrt gespeichert – kein Abtippen, kein separates Formular.',
            en: 'The breathalyser is connected over Bluetooth, and the reading is stored with the trip – no retyping, no separate form.'
          }
        },
        {
          title: { de: 'Die Fahrt läuft live mit', en: 'The trip is tracked live' },
          text: {
            de: 'Während der Fahrt zeichnet die App die Strecke per GPS auf und zeigt Fahrzeit und Distanz auf der Karte – der Fahrer beendet die Aufzeichnung mit einem Tipp.',
            en: 'During the trip the app records the route by GPS and shows driving time and distance on the map – the driver ends the recording with one tap.'
          }
        },
        {
          title: { de: 'Ein Backend für alle Mandanten', en: 'One backend for all tenants' },
          text: {
            de: 'Rund 80 Unternehmen nutzen dasselbe Supabase-Backend, mit getrennten Daten pro Mandant. Dass es bei etwa 2.000 täglichen Nutzern schnell bleibt, gehörte zu meinen Hauptaufgaben.',
            en: 'Around 80 companies share the same Supabase backend, with separate data per tenant. Keeping it fast at about 2,000 daily users was one of my main tasks.'
          }
        }
      ],
      facts: [
        { value: '~80', label: { de: 'Mandanten', en: 'tenants' } },
        { value: { de: '~2.000', en: '~2,000' }, label: { de: 'Nutzer pro Tag', en: 'users a day' } },
        { value: 'BLE', label: { de: 'Anbindung des Alkoholtesters', en: 'breathalyser connection' } }
      ],
      images: [
        {
          src: '/images/ddrive-alcohol-check.webp',
          alt: {
            de: 'Bluetooth-Alkoholtester neben der D-Drive App, die den Messwert von 0,00 mg/L anzeigt',
            en: 'Bluetooth breathalyser next to the D-Drive app showing a reading of 0.00 mg/L'
          },
          width: 1600,
          height: 1200
        }
      ]
    }
  },
  {
    id: 'snowplow',
    title: { de: 'Schneepflugdienst Plattform', en: 'Snow plough service platform' },
    description: {
      de: 'Diese GPS-gestützte Plattform dient als Lösung für kommunale Winterdienste. '
        + 'Ich war für die gesamte Entwicklung verantwortlich, sowohl für die Flutter-App (welche die GPS-Daten erfasst und verarbeitet) als auch für das Vue-Frontend (das Web-Portal zur Verwaltung und Visualisierung der Daten).',
      en: 'A GPS-based platform for municipal winter road services. '
        + 'I was responsible for all of the development: the Flutter app that records and processes the GPS data, and the Vue web portal for managing and visualising it.'
    },
    image: '/images/snowplow.webp',
    gallery: ['/images/screens/schneepflug.jpg'],
    date: '2021-12-01',
    stack: ['Flutter', 'Vue', 'AWS Amplify'],
    type: 'work',
    company: 'Designium Inc.'
  },
  {
    id: 'arvr',
    title: { de: 'AR/VR Experimente & Prototypen', en: 'AR/VR experiments & prototypes' },
    description: {
      de: 'Sammlung leichter AR/VR-Prototypen mit HoloLens, Meta Quest und HTC Vive.',
      en: 'A collection of lightweight AR/VR prototypes for HoloLens, Meta Quest and HTC Vive.'
    },
    image: '/images/arvr.webp',
    date: '2020-08-01',
    stack: ['Unity', 'ARKit/ARCore'],
    type: 'work',
    company: 'Designium Inc.'
  },
  {
    id: 'stocksport',
    title: { de: 'Stocksport Mitgliederverwaltung', en: 'Ice stock sport membership system' },
    description: {
      de: 'Hierbei handelt es sich um eine webbasierte Verwaltungssoftware, die für über 15.000 Mitglieder in Oberösterreich konzipiert wurde. '
        + 'Die Software diente primär der Mitgliederverwaltung und sollte zukünftig auch bei Wettbewerben den Einsatz von Checkkarten (Chipkarten) zur Identifikation und Erfassung ermöglichen. Das Projekt musste jedoch während der Entwicklungsphase aufgrund der Corona-Pandemie beendet werden.',
      en: 'Web-based administration software for an ice stock sport association with more than 15,000 members in Upper Austria. '
        + 'It mainly handled membership and was later meant to support chip cards for identification at competitions. The project had to end during development because of the COVID-19 pandemic.'
    },
    image: '/images/stocksport.webp',
    date: '2019-11-01',
    stack: ['Angular', 'Spring', 'MySQL', 'Tomcat', 'Bootstrap'],
    type: 'freelance',
    company: 'Freelance'
  },
  {
    id: 'inventory',
    title: { de: 'Inventory System (Unity)', en: 'Inventory system (Unity)' },
    description: {
      de: 'Unity-Prototyp zur Demonstration eines flexiblen Inventarsystems.',
      en: 'Unity prototype demonstrating a flexible inventory system.'
    },
    image: '/images/inventory.webp',
    date: '2019-08-01',
    stack: ['Unity', 'C#', 'UI Toolkit', 'ScriptableObjects'],
    type: 'own',
    company: hobby,
    github: 'https://github.com/GeraldGmainer/InventorySystem'
  },
  {
    id: 'face-tracking',
    title: { de: 'Face-Tracking App (Unity)', en: 'Face-tracking app (Unity)' },
    description: {
      de: 'Prototyp für ein geplantes Spiel, das Echtzeit-Gesichts- und Kopftracking auf 3D-Charaktermodellen nutzt. '
        + 'Die Anwendung basiert auf DLIB und kombiniert Unity, C# und nativen C++-Code, um Bewegungen präzise zu erfassen und direkt auf ein 3D-Rig zu übertragen.',
      en: 'Prototype for a planned game that uses real-time face and head tracking on 3D character models. '
        + 'It is based on DLIB and combines Unity, C# and native C++ to capture movement precisely and map it straight onto a 3D rig.'
    },
    image: '/images/face.webp',
    date: '2019-05-01',
    stack: ['Unity', 'C#', 'C++', 'DLIB'],
    type: 'work',
    company: 'NeNe Corp.'
  },
  {
    id: 'tamping-vr',
    title: { de: 'Stopfmaschinen VR-Konfigurator', en: 'Tamping machine VR configurator' },
    description: {
      de: 'Für die Messepräsentation wurde ein interaktiver VR-Konfigurator entwickelt, mit dem sich verschiedene Varianten einer Gleisstopfmaschine in Echtzeit zusammenstellen und betrachten lassen.\n'
        + 'Die Maschinenmodelle wurden von mir in Blender anhand von CAD-Daten und Fotovorlagen detailliert nachgebaut.',
      en: 'An interactive VR configurator for trade fairs that lets visitors put together and inspect variants of a track tamping machine in real time.\n'
        + 'I rebuilt the machine models in detail in Blender from CAD data and reference photos.'
    },
    image: '/images/tampingConfigurator.webp',
    date: '2018-11-01',
    stack: ['Unity', 'Blender', 'Photoshop'],
    type: 'work',
    company: 'Enova GmbH'
  },
  {
    id: 'tamping-sim',
    title: { de: 'Simulator für Gleisstopfmaschinen', en: 'Track tamping machine simulator' },
    description: {
      de: 'Dieser realistische Trainings-Simulator wurde für Bediener von Gleisstopfmaschinen entwickelt. Für das visuelle Erlebnis wurden viele Maschinenteile in Blender modelliert. Der Simulator zeichnete sich durch ein naturgetreues Fahr- und Arbeitsverhalten aus, das dem in der Realität entsprach. '
        + 'Die physische Steuerung erfolgte über echte Maschinenteile als Hardware, wobei die Kommunikation zwischen Hardware und Simulationssoftware über UDP abgewickelt wurde.',
      en: 'A realistic training simulator for operators of track tamping machines. Many machine parts were modelled in Blender, and the simulator drove and worked like the real machine. '
        + 'It was controlled through real machine parts as hardware, talking to the simulation software over UDP.'
    },
    summary: {
      de: 'Realistischer Trainings-Simulator für Gleisstopfmaschinen, gesteuert über echte Maschinenteile – Hardware-Anbindung per UDP.',
      en: 'Realistic training simulator for track tamping machines, controlled through real machine parts – hardware connected over UDP.'
    },
    image: '/images/tampingsim.webp',
    date: '2018-06-01',
    stack: ['Unity', 'C#', 'Blender', 'Photoshop'],
    website: 'https://www.plassertheurer.com/de/fleet/support-and-training/3d-simulationstools/',
    type: 'work',
    company: 'Enova GmbH'
  },
  {
    id: 'tamping-game',
    title: { de: 'Tamping Game (3D Game)', en: 'Tamping Game (3D game)' },
    description: {
      de: 'Das Tamping Game wurde als mobile Marketing-App entwickelt und basiert auf eigenen 3D-Modellen und Gameplay-Mechaniken. '
        + 'Zu meinen Aufgaben gehörten das gesamte Game Design, die Modellierung der 3D-Assets in Blender sowie die Erstellung der Texturen in Photoshop. Technisch war ich für die Implementierung der Spiellogik verantwortlich, einschließlich der Funktion, die Highscore-Ergebnisse an das Backend zu senden. '
        + 'Die App wurde für Android und iOS veröffentlicht.',
      en: 'The Tamping Game is a mobile marketing app built on its own 3D models and game mechanics. '
        + 'I did the whole game design, modelled the 3D assets in Blender and painted the textures in Photoshop. On the technical side I implemented the game logic, including sending high scores to the backend. '
        + 'It was released for Android and iOS.'
    },
    summary: {
      de: 'Mobile Marketing-Game für Android und iOS – Game Design, 3D-Assets in Blender und die komplette Spiellogik inklusive Highscores.',
      en: 'Mobile marketing game for Android and iOS – game design, 3D assets in Blender and all of the game logic including high scores.'
    },
    image: '/images/tampinggame.webp',
    date: '2017-07-01',
    stack: ['Unity', 'C#', 'Blender', 'Photoshop', 'Android', 'iOS'],
    website: 'https://play.google.com/store/apps/details?id=com.plassertheurer.tampinggame&hl=de_AT',
    type: 'work',
    company: 'Enova GmbH'
  },
  {
    id: 'sentoarena',
    title: { de: 'SentoArena (3D Game)', en: 'SentoArena (3D game)' },
    description: {
      de: 'Eigenes 3D-Arena-Game mit Charakteren, Waffen und Abilities.',
      en: 'My own 3D arena game with characters, weapons and abilities.'
    },
    image: '/images/sentoarena.webp',
    date: '2016-07-01',
    stack: ['Unity', 'C#', 'Blend Shapes', 'Blender', 'MakeHuman', 'Photoshop', 'GIMP'],
    type: 'own',
    company: hobby,
    github: 'https://github.com/GeraldGmainer/SentoArena'
  },
  {
    id: 'dbz',
    title: { de: 'DBZ Prototype (3D Game)', en: 'DBZ prototype (3D game)' },
    description: {
      de: '3D-Kampfspiel-Prototyp basierend auf Unreal Engine und Unity.',
      en: '3D fighting game prototype in Unreal Engine and Unity.'
    },
    image: '/images/dbz.webp',
    date: '2015-12-01',
    stack: ['Unreal Engine 4', 'Unity', 'C#', 'Blueprints', 'Photoshop', 'GIMP', 'Blender', 'Maya'],
    type: 'own',
    company: hobby,
    github: 'https://github.com/GeraldGmainer/DBZ'
  },
  {
    id: 'crm',
    title: { de: 'CRM für eine Bank', en: 'CRM for a bank' },
    description: {
      de: 'Mitarbeit an der Neuentwicklung eines CRM-Systems für eine Bank im Scrum-Team.',
      en: 'Worked on a new CRM system for a bank in a Scrum team.'
    },
    image: '/images/crm.webp',
    date: '2015-06-01',
    stack: ['JSF', 'Java CDI', 'MySQL', 'Jenkins'],
    type: 'work',
    company: 'Objectbay GmbH'
  },
  {
    id: 'time-tracking',
    title: { de: 'Zeiterfassungstool', en: 'Time tracking tool' },
    description: {
      de: 'Interne Zeiterfassung mit Reporting-Funktionen.',
      en: 'Internal time tracking with reporting.'
    },
    image: '/images/time-tracking.webp',
    date: '2015-06-01',
    stack: ['AngularJS', 'Java CDI', 'PostgreSQL', 'Jenkins'],
    type: 'work',
    company: 'Objectbay GmbH'
  },
  {
    id: 'casetime',
    title: { de: 'CaseTIME Zeiterfassung', en: 'CaseTIME time tracking' },
    description: {
      de: 'Kundenspezifische Zeiterfassungslösung.',
      en: 'Customer-specific time tracking solution.'
    },
    image: '/images/casetime.webp',
    date: '2014-06-01',
    stack: ['jQuery', 'Python', 'PostgreSQL', 'Linux'],
    website: 'https://www.case.at/start/',
    type: 'work',
    company: 'Case Softwaretechnik GmbH'
  },
  {
    id: 'technobase',
    title: { de: 'Technobase.fm Android App', en: 'Technobase.fm Android app' },
    description: {
      de: 'Native Android-App für mehrere Internetradio-Stationen.',
      en: 'Native Android app for several internet radio stations.'
    },
    image: '/images/technobase.webp',
    date: '2012-06-01',
    stack: ['Android', 'Java', 'XML Layouts', 'MediaPlayer'],
    type: 'own',
    company: hobby,
    github: 'https://github.com/GeraldGmainer/gg-radio'
  }
]

/** Home page, in this order. Each one has a case study. */
export const FEATURED = ['moneykoi', 'neuracharge', 'd-drive', 'rodelbahn']

export const caseStudies = projects.filter((p): p is Project & { caseStudy: CaseStudy } => !!p.caseStudy)

export const projectById = (id: string) => projects.find(p => p.id === id)
