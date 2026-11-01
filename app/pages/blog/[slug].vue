<template>
  <div
    v-if="post"
    class="pb-24 md:pb-32"
  >
    <article class="mx-auto max-w-6xl px-6 pt-32 md:pt-40">
      <NuxtLink
        :to="localePath('/blog')"
        class="rise group inline-flex items-center gap-2 font-mono text-xs text-ink-faint transition-colors hover:text-ink"
      >
        <Icon
          class="transition-transform duration-150 group-hover:-translate-x-0.5"
          name="lucide:arrow-left"
          size="14"
        />
        {{ $t('blog.back') }}
      </NuxtLink>

      <header class="mt-10 max-w-4xl">
        <p class="eyebrow rise flex flex-wrap items-center gap-x-3 gap-y-1">
          <NuxtLink
            :to="localePath('/about')"
            class="transition-colors hover:text-ink"
            rel="author"
          >{{ $t('blog.byline') }}</NuxtLink>
          <span aria-hidden="true">·</span>
          <time :datetime="published.slice(0, 10)">{{ formatPostDate(post.date, locale) }}</time>
          <span aria-hidden="true">·</span>
          <span>{{ $t('blog.minutes', { n: post.minutes }) }}</span>
        </p>
        <h1 class="rise rise-delay-1 mt-6 font-display text-4xl leading-[1.04] tracking-tight text-ink md:text-6xl">
          {{ post.title }}
        </h1>
        <p class="rise rise-delay-2 measure mt-6 text-lg leading-relaxed text-ink-muted">
          {{ post.description }}
        </p>
      </header>

      <!-- The title above names the post; the cover is decoration. -->
      <img
        :src="post.cover"
        alt=""
        class="rise rise-delay-3 mt-12 aspect-[1200/630] w-full rounded-lg border border-line object-cover"
        decoding="async"
        fetchpriority="high"
        height="630"
        width="1200"
      >

      <ContentRenderer
        :prose="false"
        :value="post"
        class="article mx-auto mt-14 max-w-[68ch] md:mt-20"
      />

      <!-- Same 68ch as the body text, measured at its font size. -->
      <div
        v-if="post.tags?.length"
        class="mx-auto mt-14 max-w-[68ch] border-t border-line pt-6 text-[1.0625rem]"
      >
        <p class="font-mono text-[11px] tracking-wide text-ink-faint">
          {{ post.tags.join(' · ') }}
        </p>
      </div>
    </article>

    <!-- The project behind the post, more posts, and a way to get in touch. -->
    <section class="mx-auto mt-24 max-w-6xl px-6">
      <div class="grid gap-12 border-t border-line pt-12 md:grid-cols-12 md:gap-8">
        <div
          v-if="projectLinks.length || related.length"
          class="md:col-span-6"
        >
          <template v-if="projectLinks.length">
            <UiEyebrow>{{ $t('blog.project') }}</UiEyebrow>
            <ul class="mt-4 border-t border-line">
              <li
                v-for="p in projectLinks"
                :key="p.to"
                class="border-b border-line"
              >
                <NuxtLink
                  :to="localePath(p.to)"
                  class="group flex items-baseline justify-between gap-6 py-5"
                >
                  <span class="font-display text-xl tracking-tight text-ink transition-colors duration-150 group-hover:text-accent">{{ p.title }}</span>
                  <Icon
                    class="shrink-0 text-ink-faint transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                    name="lucide:arrow-right"
                    size="16"
                  />
                </NuxtLink>
              </li>
            </ul>
          </template>

          <template v-if="related.length">
            <UiEyebrow
              :class="projectLinks.length && 'mt-12'"
              class="block"
            >
              {{ $t('blog.related') }}
            </UiEyebrow>
            <ul class="mt-4 border-t border-line">
              <li
                v-for="r in related"
                :key="r.slug"
                class="border-b border-line"
              >
                <NuxtLink
                  :to="localePath(`/blog/${r.slug}`)"
                  class="group flex items-baseline justify-between gap-6 py-5"
                >
                  <span class="font-display text-xl leading-snug tracking-tight text-ink transition-colors duration-150 group-hover:text-accent">{{ r.title }}</span>
                  <span class="shrink-0 font-mono text-[11px] text-ink-faint">{{ $t('blog.minutes', { n: r.minutes }) }}</span>
                </NuxtLink>
              </li>
            </ul>
          </template>
        </div>

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
              {{ $t('blog.cta.button') }}
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
const { locale } = useI18n()
const l = useLocalized()
const localePath = useLocalePath()
const slug = String(route.params.slug)

const { data } = await useAsyncData(`post-${locale.value}-${slug}`, async () => {
  const hit = await queryCollection('blog').where('path', 'LIKE', `/blog/%/${slug}`).first()
  if (!hit) return null

  // Every translation of this post, linked by `key`.
  const family = await queryCollection('blog').where('key', '=', hit.key).all()
  const own = family.find(a => a.path.startsWith(`/blog/${locale.value}/`))

  // More posts in this language: shared tags first, then the newest.
  const others = await queryCollection('blog')
    .where('path', 'LIKE', `/blog/${locale.value}/%`)
    .select('key', 'slug', 'title', 'date', 'tags', 'rawbody')
    .order('date', 'DESC')
    .all()
  const current = own ?? hit
  const shared = (tags?: string[]) => tags?.filter(tag => current.tags?.includes(tag)).length ?? 0
  const related = others
    .filter(a => a.key !== hit.key)
    .map((a, i) => ({ a, rank: shared(a.tags) * 100 - i }))
    .sort((x, y) => y.rank - x.rank)
    .slice(0, 3)
    .map(({ a }) => ({ slug: a.slug, title: a.title, minutes: readingMinutes(a.rawbody) }))

  // The raw markdown only feeds the reading time; no need to ship it.
  const { rawbody, ...post } = current
  return {
    post: { ...post, minutes: readingMinutes(rawbody), words: rawbody.split(/\s+/).length },
    translated: !!own,
    related,
    translations: family.map(a => ({ code: a.path.split('/')[2]!, slug: a.slug }))
  }
})

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const post = computed(() => data.value!.post)
const related = computed(() => data.value!.related)
const postLocale = post.value.path.split('/')[2]!

// Not translated into this language: send readers to the original instead of
// serving the same text under a second URL.
if (!data.value.translated) {
  await navigateTo(postLocale === 'de' ? `/blog/${post.value.slug}` : `/${postLocale}/blog/${post.value.slug}`, { redirectCode: 302, replace: true })
} else if (post.value.slug !== slug) {
  // /en/blog/<german-slug> → the English translation's own URL.
  await navigateTo(localePath(`/blog/${post.value.slug}`), { redirectCode: 301, replace: true })
}

// The language switch lands on the matching translation.
const setI18nParams = useSetI18nParams()
setI18nParams(Object.fromEntries(
  ['de', 'en'].map(code => [code, { slug: data.value!.translations.find(t => t.code === code)?.slug ?? post.value.slug }])
))

const projectLinks = computed(() => (post.value.projects ?? [])
  .map(s => caseStudies.find(p => p.caseStudy.slug === s))
  .filter(p => !!p)
  .map(p => ({ to: `/projects/${p.caseStudy.slug}`, title: l(p.title) })))

const published = new Date(post.value.date).toISOString()
const modified = new Date(post.value.updated ?? post.value.date).toISOString()

usePageSeo({
  title: post.value.title,
  description: post.value.description,
  image: { src: post.value.cover, width: 1200, height: 630 },
  markdown: true,
  crumbs: [{ name: 'Blog', to: '/blog' }, { name: post.value.title }],
  schema: ({ url, abs, personId, websiteId }) => {
    const person = { '@type': 'Person', '@id': personId, 'name': 'Gerald Gmainer', 'url': abs(localePath('/about')) }
    return [{
      '@type': 'BlogPosting',
      '@id': `${url}#post`,
      'headline': post.value.title,
      'description': post.value.description,
      'datePublished': published,
      'dateModified': modified,
      'inLanguage': postLocale,
      'keywords': post.value.keywords?.join(', '),
      'articleSection': post.value.tags?.[0],
      'wordCount': post.value.words,
      'image': { '@type': 'ImageObject', 'url': abs(post.value.cover), 'width': 1200, 'height': 630 },
      url,
      'mainEntityOfPage': { '@id': `${url}#webpage` },
      'isPartOf': { '@id': websiteId },
      'author': person,
      'publisher': person,
      'workTranslation': data.value!.translations
        .filter(t => t.code !== postLocale)
        .map(t => ({ '@type': 'BlogPosting', 'inLanguage': t.code, 'url': abs(`${t.code === 'de' ? '' : `/${t.code}`}/blog/${t.slug}`) }))
    }]
  }
})

useSeoMeta({
  ogType: 'article',
  articlePublishedTime: published,
  articleModifiedTime: modified,
  articleAuthor: ['Gerald Gmainer'],
  articleTag: post.value.tags,
  keywords: post.value.keywords?.join(', ')
})
</script>
