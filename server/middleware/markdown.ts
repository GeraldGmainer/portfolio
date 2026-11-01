import type { Locale } from '../../shared/types/localized'
import { caseStudies } from '../../app/data/projects'

// Clean markdown at the page's URL plus `.md` (the llms.txt convention):
// /blog/<slug>.md, /projects/<slug>.md, /resume.md, each also under /en.
// A middleware because the router can't match a suffix inside a path segment.
const PATTERN = /^(?:\/(en))?\/(?:(blog|projects)\/([^/]+)|(resume))\.md$/

export default defineEventHandler(async (event) => {
  const match = getRequestURL(event).pathname.match(PATTERN)
  if (!match) return

  const locale: Locale = match[1] === 'en' ? 'en' : 'de'
  const [, , section, slug, resume] = match
  const { siteUrl } = useRuntimeConfig(event).public

  let body: string | undefined
  if (resume) {
    body = resumeMarkdown(locale, siteUrl)
  } else if (section === 'projects') {
    const project = caseStudies.find(p => p.caseStudy.slug === slug)
    if (project) body = caseStudyMarkdown(project, locale, siteUrl)
  } else {
    const post = (await loadPosts(event)).find(p => p.locale === locale && p.slug === slug)
    if (post) body = postMarkdown(post, siteUrl)
  }

  if (!body) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  return body
})
