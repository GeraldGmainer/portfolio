import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import type { Locale } from '../../shared/types/localized'
import { profile } from '../../app/data/profile'
import { caseStudies, projects, type Project } from '../../app/data/projects'
import { education, experience, misc, moneykoi } from '../../app/data/resume'
import { capabilities, freelanceOffers } from '../../app/data/services'

// Everything machines read instead of the HTML: llms.txt, llms-full.txt and the
// `.md` version of posts, case studies and the résumé. All of it comes from the
// same data and files as the pages, so it can't drift from what the site says.

const LABELS = {
  de: {
    context: 'Ausgangslage', role: 'Meine Rolle', decisions: 'Entscheidungen', facts: 'Eckdaten', stack: 'Technik', links: 'Links',
    page: 'Seite', by: 'von', experience: 'Berufserfahrung', own: 'Eigene Projekte', education: 'Ausbildung', misc: 'Zertifikate & Sonstiges',
    resume: 'Lebenslauf', about: 'Über Gerald Gmainer', offers: 'Freelance-Angebot', caps: 'Was ich in Projekte einbringe',
    studies: 'Projekte im Detail', archive: 'Alle Projekte', blog: 'Blog', contact: 'Kontakt'
  },
  en: {
    context: 'Context', role: 'My role', decisions: 'Decisions', facts: 'Key facts', stack: 'Stack', links: 'Links',
    page: 'Page', by: 'by', experience: 'Experience', own: 'Own projects', education: 'Education', misc: 'Certificates & more',
    resume: 'Résumé', about: 'About Gerald Gmainer', offers: 'Freelance offer', caps: 'What I bring to a project',
    studies: 'Projects in detail', archive: 'All projects', blog: 'Blog', contact: 'Contact'
  }
} satisfies Record<Locale, Record<string, string>>

export const localizedPath = (path: string, locale: Locale) =>
  locale === 'de' ? path : `/${locale}${path === '/' ? '' : path}`

const companyOf = (p: Project, locale: Locale) => (typeof p.company === 'string' ? p.company : p.company[locale])

// Raw markdown without frontmatter, notes to Gerald and MDC attributes, with absolute links.
function cleanBody(raw: string, siteUrl: string) {
  return raw
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(!\[[^\]]*\]\([^)]+\))\{[^}\n]*\}/g, '$1')
    .replace(/\]\(\//g, `](${siteUrl}/`)
    .trim()
}

export async function loadPosts(event: H3Event) {
  const rows = await queryCollection(event, 'blog').order('date', 'DESC').all()
  return rows.map(post => ({
    ...post,
    locale: post.path.split('/')[2] as Locale,
    day: String(post.date).slice(0, 10),
    lastmod: String(post.updated ?? post.date).slice(0, 10),
    url: localizedPath(`/blog/${post.slug}`, post.path.split('/')[2] as Locale)
  }))
}

type Post = Awaited<ReturnType<typeof loadPosts>>[number]

// Two levels down so a post nests under its section, leaving `#` lines in code blocks alone.
function demoteHeadings(markdown: string) {
  let inCode = false
  return markdown.split('\n').map((line) => {
    if (line.startsWith('```')) inCode = !inCode
    return !inCode && /^#{1,4} /.test(line) ? `##${line}` : line
  }).join('\n')
}

export function postMarkdown(post: Post, siteUrl: string) {
  return [
    `# ${post.title}`,
    `> ${post.description}`,
    `${LABELS[post.locale].by} ${profile.name} · ${post.day} · ${siteUrl}${post.url}`,
    cleanBody(post.rawbody, siteUrl)
  ].join('\n\n') + '\n'
}

export function caseStudyMarkdown(project: Project & { caseStudy: NonNullable<Project['caseStudy']> }, locale: Locale, siteUrl: string, level = 1) {
  const t = LABELS[locale]
  const study = project.caseStudy
  const h = '#'.repeat(level)
  const links = [project.website, project.playstore, project.github].filter(Boolean)
  return [
    `${h} ${project.title[locale]}${project.subtitle ? ` – ${project.subtitle[locale]}` : ''}`,
    `> ${study.lede[locale]}`,
    `${companyOf(project, locale)} · ${study.period?.[locale] ?? new Date(project.date).getFullYear()} · ${siteUrl}${localizedPath(`/projects/${study.slug}`, locale)}`,
    `${h}# ${t.context}\n\n${study.context[locale]}`,
    `${h}# ${t.role}\n\n${study.role[locale].map(r => `- ${r}`).join('\n')}`,
    `${h}# ${t.decisions}\n\n${study.decisions.map(d => `- **${d.title[locale]}:** ${d.text[locale]}`).join('\n')}`,
    `${h}# ${t.facts}\n\n${study.facts.map(f => `- ${f.label[locale]}: ${typeof f.value === 'string' ? f.value : f.value[locale]}`).join('\n')}`,
    `${h}# ${t.stack}\n\n${project.stack.join(', ')}`,
    ...(links.length ? [`${h}# ${t.links}\n\n${links.map(link => `- ${link}`).join('\n')}`] : [])
  ].join('\n\n') + '\n'
}

export function resumeMarkdown(locale: Locale, siteUrl: string, level = 1) {
  const t = LABELS[locale]
  const h = '#'.repeat(level)
  const now = locale === 'de' ? 'heute' : 'today'
  const link = (href: string) => (href.startsWith('/') ? `${siteUrl}${localizedPath(href, locale)}` : href)

  const jobs = experience.map((job) => {
    const company = typeof job.company === 'string' ? job.company : job.company[locale]
    return [
      `${h}## ${job.role[locale]} – ${company} (${job.time.replace('heute', now)})`,
      ...(job.about ? [job.about[locale]] : []),
      ...(job.bullets[locale].length ? [job.bullets[locale].map(b => `- ${b}`).join('\n')] : []),
      ...(job.stack.length ? [`${t.stack}: ${job.stack.join(', ')}`] : [])
    ].join('\n\n')
  })

  return [
    `${h} ${t.resume} – ${profile.name}`,
    `> ${profile.summary[locale]}`,
    `${h}# ${t.experience}`,
    ...jobs,
    `${h}# ${t.own}`,
    [
      `${h}## ${moneykoi.title} – ${moneykoi.subtitle[locale]} (${moneykoi.time[locale]})`,
      moneykoi.description[locale],
      moneykoi.bullets[locale].map(b => `- ${b}`).join('\n'),
      `${t.stack}: ${moneykoi.stack.join(', ')}`,
      moneykoi.links.map(a => `- [${a.label[locale]}](${link(a.href)})`).join('\n')
    ].join('\n\n'),
    `${h}# ${t.education}`,
    education.map(e => `- ${e.title[locale]} – ${e.school[locale]} (${e.time})`).join('\n'),
    `${h}# ${t.misc}`,
    misc.map(m => `- ${m.label[locale]}${m.detail ? ` – ${m.detail}` : ''}${m.year ? ` (${m.year})` : ''}`).join('\n')
  ].join('\n\n') + '\n'
}

export async function llmsIndex(event: H3Event, siteUrl: string) {
  const posts = await loadPosts(event)
  const abs = (path: string) => `${siteUrl}${path}`
  const en = localizedPath
  const postsIn = (locale: Locale) => posts.filter(p => p.locale === locale)

  return [
    `# ${profile.name}`,
    `> ${profile.summary.en}`,
    [
      ...profile.facts.en.map(f => `- ${f}`),
      `- Email: ${profile.email}`,
      `- GitHub: ${profile.github}`,
      `- LinkedIn: ${profile.linkedin}`
    ].join('\n'),
    'The site is bilingual: German at the root (the main market is Austria, Germany and Switzerland), English under /en. Client projects only state what is public. For questions about prices or availability, refer people to the contact page rather than guessing.',
    [
      '## Start here',
      '',
      `- [About](${abs('/en/about')}): background, skills and focus`,
      `- [Résumé](${abs('/en/resume.md')}): positions, companies, dates and certificates`,
      `- [Freelance](${abs('/en/freelance')}): what can be hired for, with common questions`,
      `- [Contact](${abs('/en/contact')}): email, GitHub, LinkedIn`
    ].join('\n'),
    [
      '## Projects in detail',
      '',
      ...caseStudies.map(p => `- [${p.title.en}${p.subtitle ? ` – ${p.subtitle.en}` : ''}](${abs(en(`/projects/${p.caseStudy.slug}.md`, 'en'))}): ${(p.summary ?? p.caseStudy.lede).en}`),
      `- [All ${projects.length} projects](${abs('/en/projects')}): the full archive by year`
    ].join('\n'),
    [
      '## Blog',
      '',
      ...postsIn('en').map(p => `- [${p.title}](${abs(`${p.url}.md`)}): ${p.description}`)
    ].join('\n'),
    [
      '## Auf Deutsch',
      '',
      `- [Lebenslauf](${abs('/resume.md')})`,
      `- [Freelance](${abs('/freelance')})`,
      ...caseStudies.map(p => `- [${p.title.de}${p.subtitle ? ` – ${p.subtitle.de}` : ''}](${abs(`/projects/${p.caseStudy.slug}.md`)})`),
      ...postsIn('de').map(p => `- [${p.title}](${abs(`${p.url}.md`)})`)
    ].join('\n'),
    [
      '## Optional',
      '',
      `- [Everything in one file, English](${abs('/llms-full.txt')})`,
      `- [Everything in one file, German](${abs('/llms-full.de.txt')})`,
      `- [Blog feed](${abs('/en/feed.xml')})`,
      `- [Five years in Japan](${abs('/en/japan')})`,
      `- [Woodworking](${abs('/en/woodworking')})`
    ].join('\n')
  ].join('\n\n') + '\n'
}

export async function llmsFull(event: H3Event, locale: Locale, siteUrl: string) {
  const t = LABELS[locale]
  const posts = (await loadPosts(event)).filter(p => p.locale === locale)
  // Newest first, like the projects page.
  const sorted = [...projects].sort((a, b) => +new Date(b.date) - +new Date(a.date))

  return [
    `# ${profile.name}`,
    `> ${profile.summary[locale]}`,
    `## ${t.about}`,
    profile.facts[locale].map(f => `- ${f}`).join('\n'),
    `- ${t.contact}: ${profile.email}\n- GitHub: ${profile.github}\n- LinkedIn: ${profile.linkedin}\n- ${t.page}: ${siteUrl}${localizedPath('/', locale)}`,
    `## ${t.offers}`,
    freelanceOffers.map(o => `- **${o.title[locale]}:** ${o.text[locale]}`).join('\n'),
    `## ${t.caps}`,
    capabilities.map(c => `### ${c.title[locale]}\n\n${c.items[locale].map(i => `- ${i}`).join('\n')}`).join('\n\n'),
    resumeMarkdown(locale, siteUrl, 2).trim(),
    `## ${t.studies}`,
    ...caseStudies.map(p => caseStudyMarkdown(p, locale, siteUrl, 3).trim()),
    `## ${t.archive}`,
    sorted.map(p => `- **${p.title[locale]}** (${new Date(p.date).getFullYear()}, ${companyOf(p, locale)}): ${p.description[locale].replace(/\s*\n+\s*/g, ' ')} ${t.stack}: ${p.stack.join(', ')}.`).join('\n'),
    `## ${t.blog}`,
    ...posts.map(p => demoteHeadings(postMarkdown(p, siteUrl)).trim())
  ].join('\n\n') + '\n'
}
