<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">
    <PageHeader
        subtitle="Chronologisch sortiert, inklusive älterer Projekte, Freelance- und Hobby-Arbeiten."
        title="Alle Projekte"
    />

    <section class="mx-auto max-w-6xl px-6 pb-20">
      <div class="mt-6 flex justify-center sm:justify-center">
        <div class="flex gap-2 overflow-x-auto rounded-full bg-white/5 p-2 text-xs sm:inline-flex sm:flex-wrap sm:justify-center sm:text-sm scrollbar-hide">
          <button
              v-for="tab in projectTabs"
              :key="tab.key"
              :class="activeProjectTab === tab.key
          ? 'bg-white text-slate-900 shadow-sm shadow-sky-500/40'
          : 'text-slate-300 hover:bg-white/5 hover:text-white'"
              class="whitespace-nowrap rounded-full px-4 py-1.5 transition inline-flex items-center gap-2"
              type="button"
              @click="activeProjectTab = tab.key"
          >
            <Icon :name="tab.icon" size="16"/>
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <div class="mt-6 grid gap-8 md:grid-cols-2">
        <article
            v-for="project in filteredProjects"
            :key="project.title"
            class="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:ring-white/20"
        >
          <div class="aspect-[16/9] w-full overflow-hidden">
            <img
                :alt="project.title"
                :src="project.image"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          <div class="flex flex-1 flex-col p-5">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span class="tabular-nums">{{ fmt(project.date) }}</span>
              <div class="flex flex-wrap gap-2">
            <span
                v-if="project.type"
                class="rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-200 ring-1 ring-sky-400/40"
            >
              {{ project.company }}
            </span>
              </div>
            </div>

            <h3 class="mt-2 text-lg font-semibold text-white">
              {{ project.title }}
            </h3>

            <div class="mt-2 flex-1 flex flex-col">
              <p class="text-sm leading-relaxed text-slate-300">
                {{ project.description }}
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                    v-for="t in project.stack"
                    :key="t"
                    class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-300 ring-1 ring-white/10"
                >
                  {{ t }}
                </span>
              </div>

              <div class="grow"></div>

              <div class="mt-auto flex flex-wrap gap-2 pt-4">
                <a
                    v-if="project.website"
                    :href="project.website"
                    class="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
                    rel="noopener"
                    target="_blank"
                >
                  Website
                  <Icon name="lucide:arrow-up-right" size="16"/>
                </a>

                <a
                    v-if="project.github"
                    :href="project.github"
                    class="inline-flex items-center gap-1 rounded-xl bg-white/5 px-3.5 py-2 text-sm font-semibold text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
                    rel="noopener"
                    target="_blank"
                >
                  GitHub
                  <Icon name="simple-icons:github" size="16"/>
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
useHead({title: "Projekte"})

import {computed, ref} from 'vue'

type ProjectType = 'Privat' | 'Beruf' | 'Freelance'

type Project = {
  title: string
  description: string
  image: string
  date: string
  stack: string[]
  type: ProjectType
  company?: string
  website?: string
  github?: string
}

const projects: Project[] = [
  {
    title: 'MoneyKoi',
    description:
        'MoneyKoi ist eine Eigenentwicklung, die aus über 10 Jahren persönlicher Erfahrung im Finanzmanagement entstanden ist. ' +
        'Im Fokus steht eine solide, performante Basis mit einer modernen, intuitiven UI, die keine Ladebalken kennt. Die gesamte App ist Offline-First konzipiert, wobei alle Funktionen auch ohne Internetverbindung verfügbar sind. ' +
        'Geplante Killer-Features, wie das Einscannen von Rechnungen zur automatisierten Kategorisierung, werden die App weiter ausbauen. ' +
        'Derzeit liegt der Schwerpunkt auf Performance und dem sicheren Supabase-Sync.',
    image: '/images/moneykoi2.png',
    date: '2025-11-15',
    stack: ['Flutter', 'Supabase', 'PostgreSQL', 'Sentry', 'Offline-First'],
    website: 'https://moneykoi.app',
    github: 'https://github.com/GeraldGmainer/moneykoi',
    type: 'Privat',
    company: 'Hobby'
  },
  {
    title: 'Regelwerks- & Schadenmanagement',
    description:
        'Modul zur automatischen Bearbeitung von Versicherungsschäden. Mitentwicklung des Regelwerks sowie UI-Komponenten zur effizienten Bewertung von Fällen. Unterstützt Sachbearbeiter dabei, Zeit zu sparen und jeden Schadenfall deutlich kosteneffizienter abzuwickeln.',
    image: '/images/ww.png',
    date: '2025-11-01',
    stack: ['Angular', 'Spring Boot', 'PostgreSQL', 'Lombok'],
    type: 'Beruf',
    company: 'Objectbay GmbH'
  },
  {
    title: 'Finanzmanagement-Tool',
    description: 'Web- und App-gestütztes Finanzmanagement-Tool mit Beraterunterstützung. Meine Hauptverantwortung lag in der Entwicklung der Web- (Angular) und App- (Flutter) Komponenten.',
    image: '/images/digifinance.png',
    date: '2025-02-01',
    stack: ['Angular', 'Flutter', 'Spring Boot'],
    type: 'Beruf',
    company: 'Objectbay GmbH'
  },
  {
    title: 'Rodelbahn Admin & App',
    description:
        'Die Plattform besteht aus einem Web-Portal und einer Flutter-App zur Steuerung und Diagnose von ca. 10 Rodelbahnen weltweit. Meine Hauptverantwortung lag in der Entwicklung der Flutter-App und der komplexen Bluetooth-Kommunikation, die bis zu 40 Fahrzeuge gleichzeitig mit Priorisierung, Fehler-Handling und Offline-Fähigkeit synchronisiert. ' +
        'Über das Web-Portal (mit Keycloak zur rollenbasierten Rechteverwaltung) können Installateure den Status der Rodeln aus der Ferne beurteilen und manuelle Diagnosen durchführen, wodurch Vor-Ort-Einsätze reduziert werden.',
    image: '/images/sunkid.png',
    date: '2024-12-01',
    stack: ['React Refine', 'Spring Boot', 'PostgreSQL', 'Keycloak'],
    type: 'Beruf',
    company: 'Objectbay GmbH'
  },
  {
    title: 'Security-Software Backend Modernisierung',
    description: 'Dieses Projekt umfasste die umfassende Modernisierung des Backend-Systems einer bestehenden Security-Software. Durch Refactoring und die Umstellung auf eine Microservices-Architektur (unter Verwendung von Spring Boot, Java und Kotlin) wurde die Basis für höhere Skalierbarkeit und Zukunftssicherheit geschaffen. ' +
        'Die Einführung von Docker und Kubernetes optimierte zudem die Deployment-Prozesse und die Ressourcennutzung.',
    image: '/images/seqify.png',
    date: '2024-07-01',
    stack: ['Spring Boot', 'Java', 'Kotlin', 'Docker', 'Kubernetes'],
    type: 'Beruf',
    company: 'Objectbay GmbH'
  },
  {
    title: 'Materialwirtschaft & Logistik',
    description:
        'Modernisierung einer bestehenden AngularJS-Lösung und Aufbau einer neuen, zukunftssicheren Angular-17-Codebasis.',
    image: '/images/cgm.png',
    date: '2024-03-15',
    stack: ['Angular', 'Java', 'Spring Boot'],
    type: 'Beruf',
    company: 'Aescudata GmbH'
  },

  {
    title: 'Transit Driver RT',
    description:
        'Prototyp zur Erfassung von Echtzeit-Fahrtdaten und GTFS-RT-Generierung.',
    image: '/images/gtfs.png',
    date: '2023-11-01',
    stack: ['Flutter', 'Maps', 'Background Tracking', 'GTFS-RT', 'Supabase'],
    type: 'Beruf',
    company: 'Designium Inc.'
  },
  {
    title: 'Raraya 3D Rucksack-Konfigurator',
    description:
        'Der interaktive 3D-Konfigurator für Schulrucksäcke wurde speziell für Schulanfänger entwickelt. Meine Verantwortlichkeiten umfassten die Modellierung und Animation der 3D-Inhalte sowie das Rendering. ' +
        'Auf der technischen Seite war ich für die Modellkonfiguration, die Implementierung des Webformulars und die Gestaltung der gesamten User Experience (UX) zuständig, um eine intuitive und spielerische Bedienung zu gewährleisten.',
    image: '/images/raraya_desktop.png',
    date: '2023-05-01',
    stack: ['Three.js', 'Vue', 'PostProcessing', 'Node.js', 'Blender', 'Photoshop'],
    website: 'https://sim.raraya.co.jp/',
    type: 'Beruf',
    company: 'Designium Inc.'
  },
  {
    title: 'D-Drive Fahrassistenz',
    description:
        'Das Fleet-Management-System wird von ca. 80 Mandanten und rund 2.000 Nutzern pro Tag verwendet. Ich war vollumfänglich für die Entwicklung der gesamten Flutter-App verantwortlich, einschließlich kritischer Funktionen wie GPS-Tracking und der Bluetooth-Kommunikation mit externen Geräten. ' +
        'Des Weiteren gehörten die React Admin Webseite sowie die Sicherstellung eines performanten Backends (mit Supabase) zu meinen Hauptaufgaben.',
    image: '/images/ddrive2.png',
    date: '2022-06-01',
    stack: ['Flutter', 'Vue', 'Supabase', 'React Admin'],
    website: 'https://www.ubiteq.co.jp/service_product/d-drive-1',
    type: 'Beruf',
    company: 'Designium Inc.'
  },

  {
    title: 'Schneepflugdienst Plattform',
    description:
        'Diese GPS-gestützte Plattform dient als Lösung für kommunale Winterdienste. ' +
        'Ich war für die gesamte Entwicklung verantwortlich, sowohl für die Flutter-App (welche die GPS-Daten erfasst und verarbeitet) als auch für das Vue-Frontend (das Web-Portal zur Verwaltung und Visualisierung der Daten).',
    image: '/images/snowplow.png',
    date: '2021-12-01',
    stack: ['Flutter', 'Vue', 'AWS Amplify'],
    type: 'Beruf',
    company: 'Designium Inc.'
  },

  {
    title: 'AR/VR Experimente & Prototypen',
    description:
        'Sammlung leichter AR/VR-Prototypen mit HoloLens, Meta Quest und HTC Vive.',
    image: '/images/arvr.png',
    date: '2020-08-01',
    stack: ['Unity', 'ARKit/ARCore'],
    type: 'Beruf',
    company: 'Designium Inc.'
  },

  {
    title: 'Stocksport Mitgliederverwaltung',
    description:
        'Hierbei handelt es sich um eine webbasierte Verwaltungssoftware, die für über 15.000 Mitglieder in Oberösterreich konzipiert wurde. ' +
        'Die Software diente primär der Mitgliederverwaltung und sollte zukünftig auch bei Wettbewerben den Einsatz von Checkkarten (Chipkarten) zur Identifikation und Erfassung ermöglichen. Das Projekt musste jedoch während der Entwicklungsphase aufgrund der Corona-Pandemie beendet werden.',
    image: '/images/stocksport.png',
    date: '2019-11-01',
    stack: ['Angular', 'Spring', 'MySQL', 'Tomcat', 'Bootstrap'],
    type: 'Freelance',
    company: 'Freelance'
  },

  {
    title: 'Inventory System (Unity)',
    description:
        'Unity-Prototyp zur Demonstration eines flexiblen Inventarsystems.',
    image: '/images/inventory.png',
    date: '2019-08-01',
    stack: ['Unity', 'C#', 'UI Toolkit', 'ScriptableObjects'],
    type: 'Privat',
    company: 'Hobby',
    github: 'https://github.com/GeraldGmainer/InventorySystem'
  },

  {
    title: 'Face-Tracking App',
    description:
        'Prototype für ein geplantes Spiel, das Echtzeit-Gesichts- und Kopftracking auf 3D-Charaktermodellen nutzt. ' +
        'Die Anwendung basiert auf DLIB und kombiniert Unity, C# und nativen C++-Code, um Bewegungen präzise zu erfassen und direkt auf ein 3D-Rig zu übertragen.',
    image: '/images/face.png',
    date: '2019-05-01',
    stack: ['Unity', 'C#', 'C++', 'DLIB'],
    type: 'Beruf',
    company: 'NeNe Corp.'
  },
  {
    title: 'Stopfmaschinen VR-Konfigurator',
    description:
        'Für die Messepräsentation wurde ein interaktiver VR-Konfigurator entwickelt, mit dem sich verschiedene Varianten einer Gleisstopfmaschine in Echtzeit zusammenstellen und betrachten lassen.\n' +
        'Die Maschinenmodelle wurden von mir in Blender anhand von CAD-Daten und Fotovorlagen detailliert nachgebaut.',
    image: '/images/tampingConfigurator.png',
    date: '2018-11-01',
    stack: ['Unity', 'Blender', 'Photoshop'],
    type: 'Beruf',
    company: 'Enova GmbH'
  },
  {
    title: 'Simulator für Gleisstopfmaschinen',
    description:
        'Dieser realistische Trainings-Simulator wurde für Bediener von Gleisstopfmaschinen entwickelt. Für das visuelle Erlebnis wurden viele Maschinenteile in Blender modelliert. Der Simulator zeichnete sich durch ein naturgetreues Fahr- und Arbeitsverhalten aus, das dem in der Realität entsprach. ' +
        'Die physische Steuerung erfolgte über echte Maschinenteile als Hardware, wobei die Kommunikation zwischen Hardware und Simulationssoftware über UDP abgewickelt wurde.',
    image: '/images/tampingsim.png',
    date: '2018-06-01',
    stack: ['Unity', 'C#', 'Blender', 'Photoshop'],
    website: 'https://www.plassertheurer.com/de/fleet/support-and-training/3d-simulationstools/',
    type: 'Beruf',
    company: 'Enova GmbH'
  },
  {
    title: 'Tamping Game',
    description:
        'Das Tamping Game wurde als mobile Marketing-App entwickelt und basiert auf eigenen 3D-Modellen und Gameplay-Mechaniken. ' +
        'Zu meinen Aufgaben gehörten das gesamte Game Design, die Modellierung der 3D-Assets in Blender sowie die Erstellung der Texturen in Photoshop. Technisch war ich für die Implementierung der Spiellogik verantwortlich, einschließlich der Funktion, die Highscore-Ergebnisse an das Backend zu senden. ' +
        'Die App wurde für Android und iOS veröffentlicht.',
    image: '/images/tampinggame.png',
    date: '2017-07-01',
    stack: ['Unity', 'C#', 'Blender', 'Photoshop', 'Android', 'iOS'],
    website: 'https://play.google.com/store/apps/details?id=com.plassertheurer.tampinggame&hl=de_AT',
    type: 'Beruf',
    company: 'Enova GmbH'
  },

  {
    title: 'SentoArena (3D Arena Game)',
    description:
        'Eigenes 3D-Arena-Game mit Charakteren, Waffen und Abilities.',
    image: '/images/sentoarena.png',
    date: '2016-07-01',
    stack: ['Unity', 'C#', 'Blend Shapes', 'Blender', 'MakeHuman', 'Photoshop', 'GIMP'],
    type: 'Privat',
    company: 'Hobby',
    github: 'https://github.com/GeraldGmainer/SentoArena'
  },

  {
    title: 'DBZ Prototype (3D)',
    description:
        '3D-Kampfspiel-Prototyp basierend auf Unreal Engine und Unity.',
    image: '/images/dbz.png',
    date: '2015-12-01',
    stack: ['Unreal Engine 4', 'Unity', 'C#', 'Blueprints', 'Photoshop', 'GIMP', 'Blender', 'Maya'],
    type: 'Privat',
    company: 'Hobby',
    github: 'https://github.com/GeraldGmainer/DBZ'
  },

  {
    title: 'CRM Raiffeisenbank Salzburg',
    description:
        'Mitarbeit an einem CRM-System im Scrum-Team.',
    image: 'images/crm.png',
    date: '2015-06-01',
    stack: ['JSF', 'Java CDI', 'MySQL', 'Jenkins'],
    type: 'Beruf',
    company: 'Objectbay GmbH'
  },

  {
    title: 'Zeiterfassungstool',
    description:
        'Interne Zeiterfassung mit Reporting-Funktionen.',
    image: 'images/timerecording.png',
    date: '2015-06-01',
    stack: ['AngularJS', 'Java CDI', 'PostgreSQL', 'Jenkins'],
    type: 'Beruf',
    company: 'Objectbay GmbH'
  },

  {
    title: 'CaseTIME Zeiterfassung',
    description:
        'Kundenspezifische Zeiterfassungslösung.',
    image: '/images/casetime.png',
    date: '2014-06-01',
    stack: ['jQuery', 'Python', 'PostgreSQL', 'Linux'],
    website: 'https://www.case.at/start/',
    type: 'Beruf',
    company: 'Case Softwaretechnik GmbH'
  },

  {
    title: 'Technobase.fm Android App',
    description:
        'Native Android-App für mehrere Internetradio-Stationen.',
    image: '/images/technobase.png',
    date: '2012-06-01',
    stack: ['Android', 'Java', 'XML Layouts', 'MediaPlayer'],
    type: 'Privat',
    company: 'Hobby',
    github: 'https://github.com/GeraldGmainer/gg-radio'
  }
]

const projectTabs = [
  {key: 'highlight', label: 'Highlights', icon: 'lucide:star'},
  {key: 'beruf', label: 'Beruf', icon: 'lucide:briefcase'},
  {key: 'hobby', label: 'Hobby/Freelance', icon: 'lucide:target'}
] as const

type ProjectTabKey = (typeof projectTabs)[number]['key']

const activeProjectTab = ref<ProjectTabKey>('highlight')

const highlightTitles = [
  'MoneyKoi',
  'Rodelbahn Admin & App',
  'Raraya 3D Rucksack-Konfigurator',
  'D-Drive Fahrassistenz',
  'Tamping Game',
  'Simulator für Gleisstopfmaschinen'
]

const sorted = computed(() =>
    [...projects].sort((a, b) => +new Date(b.date) - +new Date(a.date))
)

const filteredProjects = computed(() => {
  if (activeProjectTab.value === 'highlight') {
    return sorted.value.filter(p => highlightTitles.includes(p.title))
  }
  if (activeProjectTab.value === 'beruf') {
    return sorted.value.filter(p => p.type === 'Beruf')
  }
  return sorted.value.filter(p => p.type === 'Privat' || p.type === 'Freelance')
})

function fmt(d: string) {
  return new Date(d).toLocaleDateString('de-AT', {year: 'numeric', month: 'short'})
}
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
