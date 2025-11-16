<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">
    <PageHeader
        subtitle="Chronologisch sortiert, inklusive älterer Projekte, Freelance- und Hobby-Arbeiten."
        title="Alle Projekte"
    />

    <section class="mx-auto max-w-6xl px-6 pb-20">
      <div class="mt-6 flex justify-center">
        <div class="inline-flex flex-wrap justify-center gap-2 rounded-full bg-white/5 p-1 text-xs sm:text-sm">
          <button
              v-for="tab in projectTabs"
              :key="tab.key"
              :class="activeProjectTab === tab.key
              ? 'bg-white text-slate-900 shadow-sm shadow-sky-500/40'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'"
              class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 transition"
              type="button"
              @click="activeProjectTab = tab.key"
          >
            <span class="text-base">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <div class="mt-6 grid gap-8 md:grid-cols-2">
        <article
            v-for="p in filteredProjects"
            :key="p.title"
            class="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:ring-white/20"
        >
          <div class="aspect-[16/9] w-full overflow-hidden">
            <img
                :alt="p.title"
                :src="p.image"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          <div class="flex flex-1 flex-col p-5">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span class="tabular-nums">{{ fmt(p.date) }}</span>
              <div class="flex flex-wrap gap-2">
                <span
                    v-if="p.type"
                    class="rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-200 ring-1 ring-sky-400/40"
                >
                  {{ p.company }}
                </span>
              </div>
            </div>

            <h3 class="mt-2 text-lg font-semibold text-white">
              {{ p.title }}
            </h3>

            <div class="mt-2 flex-1">
              <p class="line-clamp-3 text-sm leading-relaxed text-slate-300">
                {{ p.description }}
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                    v-for="t in p.stack"
                    :key="t"
                    class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-300 ring-1 ring-white/10"
                >
                  {{ t }}
                </span>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <a
                  v-if="p.website"
                  :href="p.website"
                  class="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
                  rel="noopener"
                  target="_blank"
              >
                Website
                <Icon name="lucide:arrow-up-right" size="16"/>
              </a>

              <a
                  v-if="p.github"
                  :href="p.github"
                  class="inline-flex items-center gap-1 rounded-xl bg-white/5 px-3.5 py-2 text-sm font-semibold text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
                  rel="noopener"
                  target="_blank"
              >
                GitHub
                <Icon name="simple-icons:github" size="16"/>
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
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
    description: 'Haushaltsbuch-App mit Offline-First Sync, polierter UX und Supabase-Backend.',
    image: '/images/moneykoi2.png',
    date: '2025-11-15',
    stack: ['Flutter', 'Supabase', 'PostgreSQL', 'Edge Functions', 'Sentry', 'Offline-First'],
    website: 'https://moneykoi.app',
    github: 'https://github.com/GeraldGmainer/moneykoi',
    type: 'Privat',
    company: 'Hobby',
  },
  {
    title: 'Regelwerks- & Schadenmanagement',
    description: 'Module für einen Versicherungsverbund: Regelwerke, Prozesse, Auswertungen.',
    image: '/images/ww.png',
    date: '2025-11-01',
    stack: ['Angular', 'Spring Boot', 'PostgreSQL', 'Lombok'],
    type: 'Beruf',
    company: 'Objectbay GmbH'
  },
  {
    title: 'Rodelbahn Admin & App',
    description: 'App und Admin-Portal für Sommerrodelbahnen: Scans und Echtzeit-Monitoring der Rodeln, Bluetooth-gestützte Fehlersuche, Firmware-Updates sowie Auswertungen und synchronisierte Log-Daten für den Betrieb.',
    image: '/images/sunkid.png',
    date: '2024-08-20',
    stack: ['React Refine', 'Spring Boot', 'PostgreSQL', 'Keycloak'],
    website: 'https://www.bruckschloegl.at/produkte/rodelbahn/',
    type: 'Beruf',
    company: 'Objectbay GmbH',
  },
  {
    title: 'Security-Software Backend Modernisierung',
    description: 'Refactoring und Architektur-Update für einen Security-Software-Anbieter.',
    image: '/images/seqify.png',
    date: '2024-07-01',
    stack: ['Spring Boot', 'Java', 'Kotlin', 'Docker', 'Kubernetes'],
    website: 'https://www.seqify.net/en/',
    type: 'Beruf',
    company: 'Objectbay GmbH'
  },
  {
    title: 'Materialwirtschaft & Logistik',
    description: 'Neuentwicklung der bestehenden AngularJS Software auf moderne Angular-17-Architektur.',
    image: '/images/cgm.png',
    date: '2024-03-15',
    stack: ['Angular', 'Java', 'Spring Boot'],
    type: 'Beruf',
    company: 'Aescudata GmbH'
  },
  {
    title: 'Transit Driver RT',
    description: 'Prototyp einer Transit-App zur Generierung von GTFS-RT Feeds inkl. Routenwahl und Hintergrund-Tracking.',
    image: '/images/gtfs.png',
    date: '2023-11-01',
    stack: ['Flutter', 'Maps', 'Background Tracking', 'GTFS-RT', 'Supabase'],
    type: 'Beruf',
    company: 'Designium Inc.'
  },
  {
    title: 'Raraya 3D Rucksack-Konfigurator',
    description: 'Web-3D Konfigurator für japanische Schulrucksäcke.',
    image: '/images/raraya_desktop.png',
    date: '2023-05-01',
    stack: ['Three.js', 'Vue', 'PostProcessing', 'Node.js', 'Blender', 'Photoshop'],
    website: 'https://sim.raraya.co.jp/',
    type: 'Beruf',
    company: 'Designium Inc.'
  },
  {
    title: 'D-Drive Fahrassistenz',
    description: 'Flutter-App und Web-Portal für einen Fahrassistenzdienst: Alkoholtests vor Fahrtantritt, GPS-Hintergrundtracking, Tagesreporting für Fahrer sowie Admin-Auswertungen und Monitoring über eine Weboberfläche.',
    image: '/images/ddrive2.png',
    date: '2022-06-01',
    stack: ['Flutter', 'Vue', 'Supabase', 'React Admin'],
    type: 'Beruf',
    website: 'https://www.ubiteq.co.jp/service_product/d-drive-1',
    company: 'Designium Inc.'
  },
  {
    title: 'Schneepflugdienst Plattform',
    description: 'Flutter-App und Webplattform für den kommunalen Winterdienst: GPS-Tracking der Fahrzeuge, Hinderniswarnungen während der Fahrt sowie automatische Berichtserstellung für Einsätze.',
    image: '/images/snowplow.png',
    date: '2021-12-01',
    stack: ['Flutter', 'Vue', 'AWS Amplify'],
    type: 'Beruf',
    company: 'Designium Inc.'
  },
  {
    title: 'Aizuwakamatsu Reiseführer',
    description: 'Tourismus-App für Sehenswürdigkeiten und Routen.',
    image: '/images/kokontabicho.png',
    date: '2021-06-01',
    stack: ['Flutter'],
    website: 'https://apps.apple.com/us/app/%E4%BC%9A%E6%B4%A5%E5%8F%A4%E4%BB%8A%E6%97%85%E5%B8%B3/id612672378',
    type: 'Beruf',
    company: 'Designium Inc.'
  },
  {
    title: 'AR/VR Experimente',
    description: 'Kleine AR/VR Demos und Prototypen mit HoloLens, Meta Quest & HTC Vive.',
    image: '/images/arvr.png',
    date: '2020-08-01',
    stack: ['Unity', 'ARKit/ARCore'],
    type: 'Beruf',
    company: 'Designium Inc.'
  },
  {
    title: 'Stocksport Mitgliederverwaltung',
    description: 'Freelance-Projekt für 15.000 Mitglieder, Scheckkarten-System.',
    image: '/images/stocksport.png',
    date: '2019-11-01',
    stack: ['Angular', 'Spring', 'MySQL', 'Tomcat', 'Bootstrap'],
    type: 'Freelance',
    company: 'Freelance'
  },
  {
    title: 'PÄM Band-Website',
    description: 'WordPress-Webseite für die Austropop-Band PÄM mit News, Musik, Tourdaten und Medienbereich.',
    image: '/images/paem.png',
    date: '2019-09-01',
    stack: ['WordPress', 'PHP', 'CSS', 'Photoshop'],
    type: 'Freelance',
    company: 'Freelance',
  },
  {
    title: 'Inventory System (Unity)',
    description: 'Ein kleiner Unity-Prototyp aus 2019, der ein simples Inventarsystem demonstriert.',
    image: '/images/inventory.png',
    date: '2019-08-01',
    stack: ['Unity', 'C#', 'UI Toolkit', 'ScriptableObjects'],
    type: 'Privat',
    company: 'Hobby',
    github: 'https://github.com/GeraldGmainer/InventorySystem'
  },
  {
    title: 'Face-Tracking App',
    description: 'Gesichts- und Kopftracking auf 3D-Modell in Echtzeit.',
    image: '/images/face.png',
    date: '2019-05-01',
    stack: ['Unity', 'C#', 'C++', 'DLIB'],
    type: 'Beruf',
    company: 'NeNe Corp.'
  },
  {
    title: 'Stopfmaschinen VR-Konfigurator',
    description: 'Modellierung und Echtzeit-Visualisierung von Gleisstopfmaschinen in VR.',
    image: '/images/tampingConfigurator.png',
    date: '2018-11-01',
    stack: ['Unity', 'Photoshop', 'Blender'],
    type: 'Beruf',
    company: 'Enova GmbH'
  },
  {
    title: 'Tamping Game',
    description: 'Mobile Game rund um Stopfmaschinen, Veröffentlichung',
    image: '/images/tampinggame.png',
    date: '2017-07-01',
    stack: ['Unity', 'C#', 'Photoshop', 'Blender', 'Android', 'iOS'],
    website: 'https://play.google.com/store/apps/details?id=com.plassertheurer.tampinggame&hl=de_AT',
    type: 'Beruf',
    company: 'Enova GmbH'
  },
  {
    title: 'Simulator für Gleisstopfmaschinen',
    description: 'Trainings-Simulator zur Wartung von Gleisstrecken, inklusive Echtzeit-SPS-Kommunikation mit echter Hardware in einem Container-Setup. 3D-Simulation, Maschinensteuerung und praxisnahe Übungsszenarien.',
    image: '/images/tampingsim.png',
    date: '2018-06-01',
    stack: ['Unity', 'C#', 'Blender', 'Photoshop'],
    website: 'https://www.plassertheurer.com/de/fleet/support-and-training/3d-simulationstools/',
    type: 'Beruf',
    company: 'Enova GmbH'
  },
  {
    title: 'SentoArena (3D Arena Game)',
    description: 'Eigenes 3D-Arena-Kampfspiel ähnlich wie Overwatch. Unterstützt Charakter-Customization, verschiedene Waffen mit wechselnden Fähigkeiten sowie Multiplayer. Enthält eigene Modelle, Animationen und ein flexibles Ability-System.',
    image: '/images/sentoarena.png',
    date: '2016-07-01',
    stack: ['Unity', 'C#', 'Blend Shapes', 'Blender', 'MakeHuman', 'Photoshop', 'GIMP'],
    type: 'Privat',
    company: 'Hobby',
    github: 'https://github.com/GeraldGmainer/SentoArena'
  },
  {
    title: 'DBZ Prototype (3D)',
    description: 'Prototypisches 3D-Kampfspiel mit 2 Charakteren, inklusive Flugsystem, Nahkampf und Attacken. Ursprünglich in Unreal Engine 4 gestartet und später in Unity weiterentwickelt.',
    image: '/images/dbz.png',
    date: '2015-12-01',
    stack: ['Unreal Engine 4', 'Unity', 'C#', 'Blueprints', 'Photoshop', 'GIMP', 'Blender', 'Maya'],
    type: 'Privat',
    company: 'Hobby',
    github: 'https://github.com/GeraldGmainer/DBZ'
  },
  {
    title: 'CRM Raiffeisenbank Salzburg',
    description: 'Neuentwicklung eines CRM im Scrum-Team, CI/CD und Layout-Verantwortung.',
    image: 'images/crm.png',
    date: '2015-06-01',
    stack: ['JSF', 'Java CDI', 'MySQL', 'Jenkins'],
    type: 'Beruf',
    company: 'Objectbay GmbH'
  },
  {
    title: 'Zeiterfassungstool',
    description: 'Interne Zeiterfassung mit Berichten.',
    image: 'images/timerecording.png',
    date: '2015-06-01',
    stack: ['AngularJS', 'Java CDI', 'PostgreSQL', 'Jenkins'],
    type: 'Beruf',
    company: 'Objectbay GmbH'
  },
  {
    title: 'CaseTIME Zeiterfassung',
    description: 'Features, Installation, Support und Wartung kundenspezifischer Zeiterfassung.',
    image: '/images/casetime.png',
    date: '2014-06-01',
    stack: ['jQuery', 'Python', 'PostgreSQL', 'Linux'],
    website: 'https://www.case.at/start/',
    type: 'Beruf',
    company: 'Case Softwaretechnik GmbH'
  },
  {
    title: 'Technobase.fm Android App',
    description: 'Native Android-App für mehrere Internetradio-Stationen mit einfachem UI, Stream-Player und klickbaren Sender-Logos.',
    image: '/images/technobase.png',
    date: '2012-06-01',
    stack: ['Android', 'Java', 'XML Layouts', 'MediaPlayer'],
    type: 'Privat',
    company: 'Hobby',
    github: 'https://github.com/GeraldGmainer/gg-radio'
  }
]

const projectTabs = [
  {key: 'highlight', label: 'Highlights', icon: '⭐'},
  {key: 'beruf', label: 'Beruf', icon: '💼'},
  {key: 'hobby', label: 'Hobby/Freelance', icon: '🎯'}
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
  return sorted.value.filter(p => p.type === 'Privat' || p.type === 'Freelance' || p.type === 'Prototyp')
})

function fmt(d: string) {
  return new Date(d).toLocaleDateString('de-AT', {year: 'numeric', month: 'short'})
}
</script>
