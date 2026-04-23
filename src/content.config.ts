import { defineCollection, type ImageFunction } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

/**
 * Schema base para todos los posts
 * Contiene campos comunes: título, imagen, traducción, cambios
 */
const createBasePostSchema = (imageHelper: ImageFunction) => z.object({
  title: z.string(),
  image: imageHelper().optional(),
  excerpt: z.string().optional(),
  description: z.string().optional(),
  postId: z.string().optional(),
  canonical: z.boolean().optional(),
  draft: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  gallery: z.array(z.object({
    image: imageHelper(),
    alt: z.string()
  })).optional(),
  change_log: z.array(z.object({
    date: z.date().optional(),
    author: z.string().optional(),
    summary: z.string(),
    details: z.string().optional(),
    type: z.enum(['typo', 'minor', 'rewrite', 'translation', 'meta']).optional(),
    locale: z.string().optional()
  })).optional()
})

/**
 * Blog: Posts con tags y fecha
 */
const blogCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/blog" }),
  schema: ({ image }) => createBasePostSchema(image).extend({
    date: z.date(),
  }),
})

/**
 * Talk: Presentaciones con comunidad, enlaces y fecha
 */
const talkCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/talk" }),
  schema: ({ image }) => createBasePostSchema(image).extend({
    date: z.date(),
    comunidad: z.string(),
    video: z.string().optional(),
    slide: z.string()
  }),
})

/**
 * Work: Experiencia laboral con galería
 */
const workCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/work" }),
  schema: ({ image }) => createBasePostSchema(image).extend({
    role: z.string(),
    responsibilities: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    website: z.url(),
  }),
})

/**
 * Projects: Proyectos personales con galería
 */
const projectsCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/projects" }),
  schema: ({ image }) => createBasePostSchema(image).extend({
    role: z.string(),
    responsibilities: z.string(),
    website: z.url().optional(),
  }),
})

/**
 * Community: Participación en comunidades con galería
 */
const communityCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/community" }),
  schema: ({ image }) => createBasePostSchema(image).extend({
    role: z.string(),
    responsibilities: z.string(),
    website: z.url().optional(),
  }),
})

export const collections = {
  'blog': blogCollection,
  'work': workCollection,
  'projects': projectsCollection,
  'community': communityCollection,
  "talk": talkCollection
}
