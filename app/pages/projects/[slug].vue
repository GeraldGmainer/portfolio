<template>
  <div class="pb-24 md:pb-32">
    <header class="mx-auto max-w-6xl px-6 pt-32 md:pt-40">
      <NuxtLink
        :to="localePath('/projects')"
        class="rise group inline-flex items-center gap-2 font-mono text-xs text-ink-faint transition-colors hover:text-ink"
      >
        <Icon
          class="transition-transform duration-150 group-hover:-translate-x-0.5"
          name="lucide:arrow-left"
          size="14"
        />
        {{ $t('caseStudy.back') }}
      </NuxtLink>

      <div class="mt-10 grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
        <div class="md:col-span-8">
          <p class="eyebrow rise">
            {{ $t('caseStudy.eyebrow') }} · {{ company }} · {{ study.period ? l(study.period) : year }}
          </p>
          <h1 class="rise rise-delay-1 mt-5 font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">
            {{ l(project.title) }}
            <span
              v-if="project.subtitle"
              class="mt-3 block text-2xl italic text-ink-muted md:text-3xl"
            >{{ l(project.subtitle) }}</span>
          </h1>
          <p class="rise rise-delay-2 measure mt-8 text-lg leading-relaxed text-ink-muted">
            {{ l(study.lede) }}
          </p>
        </div>
        <div class="rise rise-delay-3 flex flex-wrap gap-x-6 gap-y-3 md:col-span-4 md:justify-end">
          <UiButtonLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
          >
            {{ link.label }}
          </UiButtonLink>
        </div>
      </div>
    </header>

    <!-- Device shot on the project's glow, or the wide image in a frame. -->
    <section class="mx-auto mt-16 max-w-6xl px-6 md:mt-20">
      <div
        v-if="project.mockup"
        :style="{ '--glow': project.glow }"
        class="glow-stage rise rise-delay-3 flex justify-center py-6 md:py-10"
      >
        <img
          :alt="l(project.title)"
          :class="project.mockupKind === 'phone' ? 'w-[56%] max-w-72' : 'w-full max-w-4xl'"
          :height="project.mockupKind === 'phone' ? 1200 : 1274"
          :src="project.mockup"
          :width="project.mockupKind === 'phone' ? 569 : 1800"
          class="relative drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)]"
          decoding="async"
          fetchpriority="high"
        >
      </div>
      <img
        v-else-if="study.images[0]"
        :alt="l(study.images[0].alt)"
        :height="study.images[0].height"
        :src="study.images[0].src"
        :width="study.images[0].width"
        class="rise rise-delay-3 w-full rounded-lg border border-line"
        decoding="async"
        fetchpriority="high"
      >

      <!-- Every cell carries its own top rule, so wrapped rows on phones get one too. -->
      <dl class="mt-12 grid grid-cols-2 gap-y-6 md:mt-16 md:grid-cols-4">
        <div
          v-for="(f, i) in study.facts"
          :key="i"
          :class="i % 2 ? 'border-l pl-4 md:pl-6' : 'md:border-l md:pl-6 md:first:border-l-0 md:first:pl-0'"
          class="flex flex-col-reverse justify-end gap-1 border-t border-line pt-5"
        >
          <dt class="text-sm leading-snug text-ink-muted">
            {{ l(f.label) }}
          </dt>
          <dd class="font-display text-3xl tabular-nums tracking-tight text-ink md:text-4xl">
            {{ typeof f.value === 'string' ? f.value : l(f.value) }}
          </dd>
        </div>
      </dl>
    </section>

    <!-- 01 Ausgangslage -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32">
      <div
        v-reveal
        class="grid gap-10 md:grid-cols-12 md:gap-8"
      >
        <UiSectionHead
          :title="$t('caseStudy.context')"
          number="01"
        />
        <p class="measure text-lg leading-relaxed text-ink-muted md:col-span-7 md:col-start-6">
          {{ l(study.context) }}
        </p>
      </div>
    </section>

    <!-- 02 Meine Rolle -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32">
      <div
        v-reveal
        class="grid gap-10 md:grid-cols-12 md:gap-8"
      >
        <UiSectionHead
          :title="$t('caseStudy.role')"
          number="02"
        />
        <div class="md:col-span-7 md:col-start-6">
          <UiBulletList
            :items="l(study.role)"
            class="!text-base"
          />
          <div class="mt-8 flex flex-wrap gap-1.5">
            <UiTag
              v-for="s in project.stack"
              :key="s"
            >
              {{ s }}
            </UiTag>
          </div>
        </div>
      </div>
    </section>

    <!-- 03 Entscheidungen -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32">
      <div class="grid gap-10 md:grid-cols-12 md:gap-8">
        <UiSectionHead
          :title="$t('caseStudy.decisions')"
          number="03"
          sticky
        />
        <ol class="border-t border-line md:col-span-7 md:col-start-6">
          <li
            v-for="(d, i) in study.decisions"
            :key="i"
            v-reveal
            class="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-8"
          >
            <span class="pt-1.5 font-mono text-xs tabular-nums text-accent">{{ String(i + 1).padStart(2, '0') }}</span>
            <div>
              <h3 class="font-display text-2xl leading-tight tracking-tight text-ink">
                {{ l(d.title) }}
              </h3>
              <p class="measure mt-3 leading-relaxed text-ink-muted">
                {{ l(d.text) }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Wide shots below the decisions, when the hero used the device mockup. -->
    <section
      v-if="project.mockup && study.images.length"
      class="mx-auto mt-24 max-w-6xl px-6 md:mt-32"
    >
      <figure
        v-for="img in study.images"
        :key="img.src"
        v-reveal
      >
        <img
          :alt="l(img.alt)"
          :height="img.height"
          :src="img.src"
          :width="img.width"
          class="w-full rounded-lg border border-line"
          decoding="async"
          loading="lazy"
        >
      </figure>
    </section>

    <!-- Blog posts that go deeper into this project -->
    <section
      v-if="posts.length"
      class="mx-auto mt-24 max-w-6xl px-6 md:mt-32"
    >
      <div
        v-reveal
        class="grid gap-10 md:grid-cols-12 md:gap-8"
      >
        <UiSectionHead
          :title="$t('caseStudy.posts')"
          number="04"
        />
        <ul class="border-t border-line md:col-span-7 md:col-start-6">
          <li
            v-for="a in posts"
            :key="a.path"
            class="border-b border-line"
          >
            <NuxtLink
              :to="localePath(`/blog/${a.slug}`)"
              class="group flex items-baseline justify-between gap-6 py-5"
            >
              <span class="font-display text-xl leading-snug tracking-tight text-ink transition-colors duration-150 group-hover:text-accent">{{ a.title }}</span>
              <Icon
                class="shrink-0 text-ink-faint transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                name="lucide:arrow-right"
                size="16"
              />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- Next case study + contact -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32">
      <div
        v-reveal
        class="grid gap-10 border-t border-line pt-12 md:grid-cols-12 md:gap-8"
      >
        <NuxtLink
          :to="localePath(`/projects/${next.caseStudy.slug}`)"
          class="group md:col-span-6"
        >
          <UiEyebrow>{{ $t('caseStudy.next') }}</UiEyebrow>
          <span class="mt-3 flex items-baseline gap-3 font-display text-3xl tracking-tight text-ink transition-colors duration-150 group-hover:text-accent md:text-4xl">
            {{ l(next.title) }}
            <Icon
              class="shrink-0 self-center transition-transform duration-150 group-hover:translate-x-1"
              name="lucide:arrow-right"
              size="24"
            />
          </span>
        </NuxtLink>
        <div class="md:col-span-5 md:col-start-8">
          <p class="font-display text-2xl leading-snug tracking-tight text-ink">
            {{ $t('blog.cta.title') }}
          </p>
          <p class="measure mt-2 text-sm leading-relaxed text-ink-muted">
            {{ $t('blog.cta.text') }}
          </p>
          <div class="mt-6">
            <UiButtonLink
              to="/contact"
              variant="primary"
            >
              {{ $t('common.requestProject') }}
            </UiButtonLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { caseStudies } from '~/data/projects'

const route = useRoute()
const l = useLocalized()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const index = caseStudies.findIndex(p => p.caseStudy.slug === route.params.slug)
if (index < 0) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const project = caseStudies[index]!
const study = project.caseStudy
const next = caseStudies[(index + 1) % caseStudies.length]!

const company = computed(() => (typeof project.company === 'string' ? project.company : l(project.company)))
const year = new Date(project.date).getFullYear()

const links = computed(() => [
  project.website && { label: t('common.website'), to: project.website },
  project.playstore && { label: t('common.android'), to: project.playstore },
  project.github && { label: t('common.github'), to: project.github }
].filter(link => !!link))

usePageSeo({
  title: {
    de: `${project.title.de} – ${project.subtitle?.de ?? 'Projekt im Detail'}`,
    en: `${project.title.en} – ${project.subtitle?.en ?? 'project in detail'}`
  },
  description: project.summary ?? study.lede,
  image: study.images[0] && { src: study.images[0].src, width: study.images[0].width, height: study.images[0].height },
  markdown: true,
  crumbs: [
    { name: { de: 'Projekte', en: 'Projects' }, to: '/projects' },
    { name: project.title }
  ],
  schema: ({ url, abs, personId }) => [{
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    'name': l(project.title),
    'headline': `${l(project.title)}${project.subtitle ? ` – ${l(project.subtitle)}` : ''}`,
    'description': l(study.lede),
    url,
    'mainEntityOfPage': { '@id': `${url}#webpage` },
    'image': study.images.map(img => abs(img.src)),
    'keywords': project.stack.join(', '),
    'dateCreated': project.date,
    'creator': { '@id': personId },
    ...(project.website ? { sameAs: project.website } : {})
  }]
})

// Blog posts in this language that name this case study.
const { data: posts } = await useAsyncData(`case-posts-${locale.value}-${study.slug}`, async () => {
  const rows = await queryCollection('blog')
    .where('path', 'LIKE', `/blog/${locale.value}/%`)
    .select('path', 'slug', 'title', 'date', 'projects')
    .order('date', 'DESC')
    .all()
  return rows.filter(a => a.projects?.includes(study.slug))
}, { default: () => [] })
</script>
