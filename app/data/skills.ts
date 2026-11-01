import type { Localized } from '#shared/types/localized'

// The one stack list of the site: home shows it as text (core skills set in
// ink), the about page with icons. Order by how much I want to be hired for
// it, not by how long I have used it; the last group is the long tail.
export type Skill = { label: string | Localized, icon: string, core?: boolean }
export type SkillGroup = { label: Localized, skills: Skill[] }

export const skillGroups: SkillGroup[] = [
  {
    label: { de: 'Produkt & UX', en: 'Product & UX' },
    skills: [
      { label: 'Product Ownership', icon: 'lucide:compass', core: true },
      { label: { de: 'UX/UI-Design', en: 'UX/UI design' }, icon: 'simple-icons:figma', core: true },
      { label: 'Scrum (CSM)', icon: 'lucide:repeat', core: true },
      { label: { de: 'Anforderungen & Backlog', en: 'Requirements & backlog' }, icon: 'lucide:list-checks' },
      { label: 'Prototyping', icon: 'lucide:pen-tool' },
      { label: { de: 'SEO & Marketing-Websites', en: 'SEO & marketing websites' }, icon: 'lucide:search' },
      { label: 'Jira', icon: 'simple-icons:jira' }
    ]
  },
  {
    label: { de: 'App', en: 'App' },
    skills: [
      { label: 'Flutter / Dart (BLoC)', icon: 'simple-icons:flutter', core: true },
      { label: { de: 'Offline-First & Sync', en: 'Offline-first & sync' }, icon: 'lucide:cloud-off', core: true },
      { label: 'Bluetooth (BLE)', icon: 'lucide:bluetooth', core: true },
      { label: { de: 'Karten & GPS-Tracking', en: 'Maps & GPS tracking' }, icon: 'lucide:map' },
      { label: { de: 'On-Device-OCR', en: 'On-device OCR' }, icon: 'lucide:scan-text' },
      { label: { de: 'Store-Releases (Fastlane)', en: 'Store releases (Fastlane)' }, icon: 'simple-icons:fastlane' },
      { label: 'Native Android (Kotlin)', icon: 'simple-icons:android' }
    ]
  },
  {
    label: { de: 'Web', en: 'Web' },
    skills: [
      { label: 'TypeScript', icon: 'simple-icons:typescript', core: true },
      { label: 'Angular', icon: 'simple-icons:angular', core: true },
      { label: 'Vue / Nuxt', icon: 'simple-icons:nuxt', core: true },
      { label: 'React / Next.js', icon: 'simple-icons:react' },
      { label: 'Tailwind CSS', icon: 'simple-icons:tailwindcss' },
      { label: 'Three.js / WebGL', icon: 'simple-icons:threedotjs' }
    ]
  },
  {
    label: { de: 'Backend & Betrieb', en: 'Backend & ops' },
    skills: [
      { label: 'Supabase', icon: 'simple-icons:supabase', core: true },
      { label: { de: 'PostgreSQL (RLS, Trigger, RPCs)', en: 'PostgreSQL (RLS, triggers, RPCs)' }, icon: 'simple-icons:postgresql', core: true },
      { label: 'Spring Boot (Java/Kotlin)', icon: 'simple-icons:spring', core: true },
      { label: 'Node.js', icon: 'simple-icons:nodedotjs' },
      { label: 'Keycloak / OIDC', icon: 'simple-icons:keycloak' },
      { label: 'Docker / Kubernetes', icon: 'simple-icons:docker' },
      { label: 'CI/CD (GitHub Actions, Jenkins)', icon: 'simple-icons:githubactions' },
      { label: 'Sentry', icon: 'simple-icons:sentry' }
    ]
  },
  {
    label: { de: 'Außerdem', en: 'Also' },
    skills: [
      { label: 'Unity / C#', icon: 'simple-icons:unity' },
      { label: 'Blender', icon: 'simple-icons:blender' },
      { label: 'React Native', icon: 'simple-icons:react' },
      { label: 'GraphQL', icon: 'simple-icons:graphql' },
      { label: 'AWS Amplify', icon: 'simple-icons:awsamplify' },
      { label: 'Playwright / Cypress', icon: 'lucide:test-tube' }
    ]
  }
]
