import { defineCollection, z } from '@nuxt/content'

export const collections = {
  // Blog posts live in content/blog/<locale>/<slug>.md; every file there is shown.
  // Translations share `key`; the writing guide is .claude/skills/write-blog-post/SKILL.md.
  blog: defineCollection({
    source: 'blog/**/*.md',
    type: 'page',
    schema: z.object({
      date: z.date(),
      // Set when a post changes in substance; feeds dateModified and the sitemap.
      updated: z.date().optional(),
      slug: z.string().nonempty(),
      // Shared by all translations of a post (the German slug).
      key: z.string().nonempty(),
      tags: z.array(z.string()).optional(),
      keywords: z.array(z.string()).optional(),
      // Case study slugs (app/data/projects.ts) this post belongs to.
      projects: z.array(z.string()).optional(),
      // 1200 × 630 thumbnail, post header and share image, made by
      // scripts/blog-covers.mjs: /images/blog/<key>/cover.<locale>.webp
      cover: z.string().nonempty(),
      // Raw markdown, only used for the reading-time estimate.
      rawbody: z.string()
    })
  })
}
