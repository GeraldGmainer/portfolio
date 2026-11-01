/**
 * All blog posts for the current locale, newest first.
 *
 * Posts live in `content/blog/<locale>/<slug>.md`; every file there is shown.
 * When a locale has no posts yet the German ones are shown instead and
 * `fallback` says so.
 */
export async function useBlogPosts() {
  const { locale } = useI18n()

  const { data } = await useAsyncData(`blog-${locale.value}`, async () => {
    const forLocale = async (code: string) => {
      // Only what the list shows: whole bodies would ride along in the payload.
      const rows = await queryCollection('blog')
        .where('path', 'LIKE', `/blog/${code}/%`)
        .select('path', 'slug', 'key', 'title', 'description', 'date', 'tags', 'cover', 'rawbody')
        .order('date', 'DESC')
        .all()
      return rows.map(({ rawbody, ...p }) => ({ ...p, minutes: readingMinutes(rawbody) }))
    }

    const own = await forLocale(locale.value)
    if (own.length || locale.value === 'de') return { posts: own, fallback: false }
    const german = await forLocale('de')
    return { posts: german, fallback: german.length > 0 }
  })

  return {
    posts: computed(() => data.value?.posts ?? []),
    fallback: computed(() => data.value?.fallback ?? false)
  }
}

export function formatPostDate(date: string | Date, locale: string) {
  return new Date(date).toLocaleDateString(locale === 'de' ? 'de-AT' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

/** About 200 words per minute, from the raw markdown. */
export function readingMinutes(rawbody?: string) {
  return Math.max(1, Math.round((rawbody ?? '').split(/\s+/).length / 200))
}
