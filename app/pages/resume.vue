<template>
  <div class="min-h-screen">
    <header class="mx-auto max-w-6xl px-6 pt-32 md:pt-40">
      <div class="grid gap-10 md:grid-cols-12 md:items-end">
        <div class="md:col-span-8">
          <div class="rise">
            <UiEyebrow>{{ $t('nav.resume') }}</UiEyebrow>
          </div>
          <h1 class="rise rise-delay-1 mt-5 max-w-4xl font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">
            <template v-if="locale === 'de'">
              {{ careerYears }} Jahre Software – von Zeiterfassung <em>bis</em> Ladestation.
            </template>
            <template v-else>
              {{ careerYears }} years of software – from time tracking <em>to</em> EV charging.
            </template>
          </h1>
          <p class="rise rise-delay-2 mt-6 text-lg text-ink-muted">
            {{ l(copy.tagline) }}
          </p>
          <p class="rise rise-delay-3 mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs leading-6 text-ink-faint">
            <span
              v-for="(m, i) in l(meta)"
              :key="m"
            >
              <span
                v-if="i"
                aria-hidden="true"
                class="mr-3 text-line-strong"
              >—</span>{{ m }}
            </span>
          </p>
        </div>
        <div class="rise rise-delay-3 md:col-span-4 md:justify-self-end">
          <UiButtonLink
            external
            to="/downloads/Lebenslauf_Gmainer_public.pdf"
            variant="primary"
          >
            {{ l(copy.pdf) }}
          </UiButtonLink>
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
      <!-- 01 Berufserfahrung -->
      <section
        v-reveal
        class="grid gap-10 pt-20 md:grid-cols-12 md:gap-12 md:pt-28"
      >
        <UiSectionHead
          :eyebrow="expEyebrow"
          :title="l(copy.expTitle)"
          number="01"
          sticky
        >
          {{ expIntro }}
        </UiSectionHead>

        <div class="md:col-span-8">
          <ol>
            <li
              v-for="job in experience"
              :key="job.time"
              class="grid gap-x-8 gap-y-3 border-t border-line py-8 last:border-b sm:grid-cols-12"
            >
              <div class="font-mono text-xs leading-6 sm:col-span-3">
                <p class="tabular-nums text-ink">
                  {{ timeLabel(job.time) }}
                </p>
                <p
                  v-if="formatExperienceDuration(job.time)"
                  class="text-ink-faint"
                >
                  {{ formatExperienceDuration(job.time) }}
                </p>
              </div>

              <div class="sm:col-span-9">
                <h3 class="text-lg font-semibold leading-snug text-ink">
                  {{ l(job.role) }}
                </h3>
                <p class="mt-1 text-sm font-medium text-ink-muted">
                  {{ typeof job.company === 'string' ? job.company : l(job.company) }}
                </p>
                <p
                  v-if="job.about"
                  class="measure mt-1 text-sm leading-relaxed text-pretty text-ink-muted/75"
                >
                  {{ l(job.about) }}
                </p>

                <UiBulletList
                  :items="l(job.bullets)"
                  class="mt-5"
                />

                <div
                  v-if="job.stack.length"
                  class="mt-5 flex flex-wrap gap-1.5"
                >
                  <UiTag
                    v-for="s in job.stack"
                    :key="s"
                  >
                    {{ s }}
                  </UiTag>
                </div>

                <div
                  v-if="job.links?.length"
                  class="mt-5 flex flex-wrap gap-x-6 gap-y-2"
                >
                  <UiButtonLink
                    v-for="link in job.links"
                    :key="link.href"
                    :icon="link.icon"
                    :to="link.href"
                  >
                    {{ l(link.label) }}
                  </UiButtonLink>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- 02 Eigene Projekte -->
      <section
        v-reveal
        class="grid gap-10 pt-20 md:grid-cols-12 md:gap-12 md:pt-28"
      >
        <UiSectionHead
          :eyebrow="l(copy.ownEyebrow)"
          :title="l(copy.ownTitle)"
          number="02"
          sticky
        />

        <div class="md:col-span-8">
          <article class="grid gap-x-8 gap-y-3 border-y border-line py-8 sm:grid-cols-12">
            <div class="font-mono text-xs leading-6 sm:col-span-3">
              <p class="text-ink">
                {{ l(moneykoi.time) }}
              </p>
              <p class="text-ink-faint">
                {{ l(moneykoi.platforms) }}
              </p>
            </div>

            <div class="sm:col-span-9">
              <h3 class="text-lg font-semibold leading-snug text-ink">
                {{ moneykoi.title }}
              </h3>
              <p class="mt-1 text-sm text-ink-muted">
                {{ l(moneykoi.subtitle) }}
              </p>
              <p class="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted">
                {{ l(moneykoi.description) }}
              </p>

              <UiBulletList
                :items="l(moneykoi.bullets)"
                class="mt-5"
              />

              <div class="mt-5 flex flex-wrap gap-1.5">
                <UiTag
                  v-for="s in moneykoi.stack"
                  :key="s"
                >
                  {{ s }}
                </UiTag>
              </div>

              <div class="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                <UiButtonLink
                  v-for="link in moneykoi.links"
                  :key="link.href"
                  :icon="link.icon"
                  :to="link.href"
                >
                  {{ l(link.label) }}
                </UiButtonLink>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- 03 Ausbildung -->
      <section
        v-reveal
        class="grid gap-10 pt-20 md:grid-cols-12 md:gap-12 md:pt-28"
      >
        <UiSectionHead
          :title="l(copy.eduTitle)"
          eyebrow="Steyr"
          number="03"
          sticky
        />

        <div class="md:col-span-8">
          <ol>
            <li
              v-for="e in education"
              :key="e.time"
              class="grid gap-x-8 gap-y-3 border-t border-line py-8 last:border-b sm:grid-cols-12"
            >
              <div class="font-mono text-xs leading-6 sm:col-span-3">
                <p class="tabular-nums text-ink">
                  {{ e.time }}
                </p>
                <p
                  v-if="formatExperienceDuration(e.time)"
                  class="text-ink-faint"
                >
                  {{ formatExperienceDuration(e.time) }}
                </p>
              </div>
              <div class="sm:col-span-9">
                <h3 class="text-lg font-semibold leading-snug text-ink">
                  {{ l(e.title) }}
                </h3>
                <p class="mt-1 text-sm text-ink-muted">
                  {{ l(e.school) }}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- 04 Zertifikate & Sonstiges -->
      <section
        v-reveal
        class="grid gap-10 pt-20 md:grid-cols-12 md:gap-12 md:pt-28"
      >
        <UiSectionHead
          :eyebrow="l(copy.miscEyebrow)"
          :title="l(copy.miscTitle)"
          number="04"
          sticky
        />

        <div class="md:col-span-8">
          <ul>
            <li
              v-for="m in misc"
              :key="m.label.de"
              class="grid gap-x-8 gap-y-1 border-t border-line py-4 last:border-b sm:grid-cols-12"
            >
              <p class="font-mono text-xs leading-6 tabular-nums text-ink-faint sm:col-span-3">
                {{ m.year ?? '—' }}
              </p>
              <p class="text-sm leading-6 sm:col-span-9">
                <span class="text-ink">{{ l(m.label) }}</span>
                <template v-if="m.detail">
                  <span class="text-ink-faint"> · </span>
                  <UiButtonLink
                    v-if="m.href"
                    :to="m.href"
                    class="align-baseline"
                  >
                    {{ m.detail }}
                  </UiButtonLink>
                  <span
                    v-else
                    class="text-ink-muted"
                  >{{ m.detail }}</span>
                </template>
              </p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { education, experience, misc, moneykoi } from '~/data/resume'

const l = useLocalized()
const { locale } = useI18n()

usePageSeo({
  title: { de: 'Lebenslauf – Product Owner & Entwickler', en: 'Résumé – product owner & developer' },
  description: {
    de: 'Lebenslauf von Gerald Gmainer: über zehn Jahre Softwareentwicklung in Österreich und Japan – Product Owner, Teamlead, Flutter- und Angular-Entwickler.',
    en: 'Résumé of Gerald Gmainer: more than ten years of software development in Austria and Japan – product owner, team lead, Flutter and Angular developer.'
  },
  markdown: true,
  crumbs: [{ name: { de: 'Lebenslauf', en: 'Résumé' } }]
})

const copy = {
  tagline: { de: 'Produkt, Mobile, Web & 3D · Österreich', en: 'Product, mobile, web & 3D · Austria' },
  pdf: { de: 'PDF öffnen', en: 'Open PDF (German)' },
  expTitle: { de: 'Berufserfahrung', en: 'Experience' },
  ownEyebrow: { de: 'Seit 2024', en: 'Since 2024' },
  ownTitle: { de: 'Eigene Projekte', en: 'Own projects' },
  eduTitle: { de: 'Ausbildung', en: 'Education' },
  miscEyebrow: { de: 'Außerdem', en: 'Also' },
  miscTitle: { de: 'Zertifikate & Sonstiges', en: 'Certificates & more' }
}

const meta = {
  de: [
    'Garsten bei Steyr, Österreich · Remote/Hybrid',
    'Deutsch · Englisch · Japanisch',
    'Produkt · App · Web',
    'Offen für Freelance-Projekte'
  ],
  en: [
    'Garsten near Steyr, Austria · remote/hybrid',
    'German · English · Japanese',
    'Product · app · web',
    'Open to freelance projects'
  ]
}

const expEyebrow = computed(() => (locale.value === 'de' ? `Seit 2013 · ${careerYears.value} Jahre` : `Since 2013 · ${careerYears.value} years`))
const expIntro = computed(() => (locale.value === 'de'
  ? `${experience.length} Stationen in Österreich und Japan – angestellt, freiberuflich und seit 2024 mit eigenem Produkt.`
  : `${experience.length} positions in Austria and Japan – employed, freelance and, since 2024, with my own product.`))

// Periods are written as "MM/YYYY – MM/YYYY" or "MM/YYYY – heute".
const timeLabel = (time: string) => (locale.value === 'de' ? time : time.replace('heute', 'today'))

const formatYearsMonths = (years: number, months: number): string => {
  const de = locale.value === 'de'
  const parts: string[] = []
  if (years > 0) parts.push(de ? (years === 1 ? '1 Jahr' : `${years} Jahre`) : (years === 1 ? '1 year' : `${years} years`))
  if (months > 0) parts.push(de ? (months === 1 ? '1 Monat' : `${months} Monate`) : (months === 1 ? '1 month' : `${months} months`))
  return parts.join(' ')
}

const formatExperienceDuration = (time: string): string | null => {
  const parts = time.split('–').map(p => p.trim())
  const [startStr, rawEndStr] = parts
  if (parts.length !== 2 || !startStr || !rawEndStr) return null

  const monthYearRegex = /^(\d{2})\/(\d{4})$/
  const yearRegex = /^(\d{4})$/

  const startMonthYearMatch = startStr.match(monthYearRegex)
  if (startMonthYearMatch) {
    const [, sm, sy] = startMonthYearMatch
    const startMonth = Number(sm)
    const startYear = Number(sy)

    let endMonth: number
    let endYear: number
    if (rawEndStr.toLowerCase() === 'heute') {
      const now = new Date()
      endMonth = now.getMonth() + 1
      endYear = now.getFullYear()
    } else {
      const endMonthYearMatch = rawEndStr.match(monthYearRegex)
      if (!endMonthYearMatch) return null
      const [, em, ey] = endMonthYearMatch
      endMonth = Number(em)
      endYear = Number(ey)
    }

    const startTotal = startYear * 12 + (startMonth - 1)
    const endTotal = endYear * 12 + (endMonth - 1)
    const diffMonths = (endTotal - startTotal) + 1
    if (diffMonths <= 0) return null

    const years = Math.floor(diffMonths / 12)
    const months = diffMonths % 12
    return formatYearsMonths(years, months)
  }

  const startYearMatch = startStr.match(yearRegex)
  const endYearMatch = rawEndStr.match(yearRegex)
  if (startYearMatch && endYearMatch) {
    const startYear = Number(startYearMatch[1])
    const endYear = Number(endYearMatch[1])
    const diffYears = endYear - startYear
    if (diffYears <= 0) return null
    return formatYearsMonths(diffYears, 0)
  }

  return null
}

const monthIndex = (monthYear: string): number | null => {
  const m = monthYear.trim().match(/^(\d{2})\/(\d{4})$/)
  return m ? Number(m[2]) * 12 + (Number(m[1]) - 1) : null
}

const careerYears = computed(() => {
  const starts = experience
    .filter(job => job.stack.length > 0)
    .map(job => monthIndex(job.time.split('–')[0] ?? ''))
    .filter((n): n is number => n !== null)
  const now = new Date()
  const end = now.getFullYear() * 12 + now.getMonth()
  return Math.floor((end - Math.min(...starts) + 1) / 12)
})
</script>
