<template>
  <div class="pb-24 md:pb-32">
    <header class="mx-auto max-w-6xl px-6 pt-32 md:pt-40">
      <UiEyebrow class="block rise">
        {{ $t('blog.eyebrow') }}
      </UiEyebrow>
      <h1 class="rise rise-delay-1 mt-5 font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">
        {{ $t('blog.title') }}
      </h1>
      <p class="rise rise-delay-2 measure mt-6 text-lg leading-relaxed text-ink-muted">
        {{ $t('blog.intro') }}
      </p>
      <p
        v-if="fallback"
        class="rise rise-delay-2 mt-4 font-mono text-xs text-ink-faint"
      >
        {{ $t('blog.fallback') }}
      </p>
    </header>

    <section class="mx-auto mt-16 max-w-6xl px-6 md:mt-24">
      <ol
        v-if="posts.length"
        class="border-t border-line"
      >
        <li
          v-for="p in posts"
          :key="p.path"
          v-reveal
          class="border-b border-line"
        >
          <NuxtLink
            :to="postLink(p)"
            class="group grid gap-x-8 gap-y-6 py-8 md:grid-cols-12 md:items-center md:py-10"
          >
            <!-- The title right next to it names the link; the thumbnail is decoration. -->
            <div class="overflow-hidden rounded-md border border-line bg-navy-800 transition-colors duration-300 group-hover:border-line-strong md:col-span-5">
              <img
                :src="p.cover"
                alt=""
                class="aspect-[1200/630] w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
                decoding="async"
                height="630"
                loading="lazy"
                width="1200"
              >
            </div>
            <div class="md:col-span-6">
              <p class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-faint">
                <time :datetime="String(p.date).slice(0, 10)">{{ formatPostDate(p.date, locale) }}</time>
                <span aria-hidden="true">·</span>
                <span>{{ $t('blog.minutes', { n: p.minutes }) }}</span>
              </p>
              <h2 class="mt-3 font-display text-2xl leading-tight tracking-tight text-ink transition-colors duration-150 group-hover:text-accent md:text-3xl">
                {{ p.title }}
              </h2>
              <p class="measure mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
                {{ p.description }}
              </p>
              <p
                v-if="p.tags?.length"
                class="mt-4 font-mono text-[11px] tracking-wide text-ink-faint"
              >
                {{ p.tags.join(' · ') }}
              </p>
            </div>
            <Icon
              class="hidden self-center justify-self-end text-ink-faint transition-transform duration-150 group-hover:translate-x-1 group-hover:text-accent md:col-span-1 md:block"
              name="lucide:arrow-right"
              size="20"
            />
          </NuxtLink>
        </li>
      </ol>

      <p
        v-else
        class="border-t border-line pt-8 text-ink-muted"
      >
        {{ $t('blog.empty') }}
      </p>
    </section>
  </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n()
const localePath = useLocalePath()

const { posts, fallback } = await useBlogPosts()

// German fallbacks keep their German URL.
const postLink = (p: { path: string, slug: string }) =>
  p.path.startsWith(`/blog/${locale.value}/`) ? localePath(`/blog/${p.slug}`) : `/blog/${p.slug}`

usePageSeo({
  title: { de: 'Blog über Flutter, Supabase und Offline-First', en: 'Blog on Flutter, Supabase and offline-first' },
  description: {
    de: 'Blog von Gerald Gmainer über Flutter, Offline-First, Supabase, Web-Plattformen und Product Ownership – aus echten Projekten.',
    en: 'Blog by Gerald Gmainer on Flutter, offline-first, Supabase, web platforms and product ownership – from real projects.'
  },
  pageType: 'CollectionPage',
  crumbs: [{ name: 'Blog' }],
  schema: ({ url, abs, personId }) => [{
    '@type': 'Blog',
    '@id': `${url}#blog`,
    url,
    'name': 'Gerald Gmainer – Blog',
    'inLanguage': locale.value,
    'author': { '@id': personId },
    'blogPost': posts.value.map(p => ({
      '@type': 'BlogPosting',
      'headline': p.title,
      'description': p.description,
      'datePublished': String(p.date).slice(0, 10),
      'image': abs(p.cover),
      'url': abs(postLink(p)),
      'author': { '@id': personId }
    }))
  }]
})
</script>
