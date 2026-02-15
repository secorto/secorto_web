import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Schema base para todos los posts
 * Contiene campos comunes: título, imagen, traducción, cambios
 */
const createBasePostSchema = (imageHelper: () => z.ZodTypeAny) => z.object({
  title: z.string(),
  image: imageHelper().optional(),
  excerpt: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  translation_status: z.enum(['translated', 'draft', 'partial', 'pending', 'original']).optional(),
  draft: z.boolean().optional(),
  translation_origin: z.object({ locale: z.string(), id: z.string() }).optional(),
  change_log: z.array(z.object({
    date: z.date().optional(),
    author: z.string().optional(),
    summary: z.string(),
    details: z.string().optional(),
    type: z.enum(['typo', 'minor', 'rewrite', 'translation', 'meta']).optional(),
    locale: z.string().optional()
  })).optional(),
  canonical: z.string().optional()
})

/**
 * Blog: Posts con tags y fecha
 */
const blogCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/blog" }),
  schema: ({ image }) => createBasePostSchema(image).extend({
    date: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

/**
 * Talk: Presentaciones con comunidad, enlaces y fecha
 */
const talkCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/talk" }),
  schema: ({ image }) => createBasePostSchema(image).extend({
    date: z.date(),
    tags: z.array(z.string()).optional(),
    image: image(),
    comunidad: z.string(),
    video: z.string().optional(),
    slide: z.string()
  }),
});

/**
 * Work: Experiencia laboral con galería
 */
const workCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/work" }),
  schema: ({ image }) => createBasePostSchema(image).extend({
    excerpt: z.string(),
    image: image(),
    role: z.string(),
    responsibilities: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    website: z.string().url(),
    gallery: z.array(z.object({
      image: image(),
      alt: z.string()
    })).optional(),
  }),
});

/**
 * Projects: Proyectos personales con galería
 */
const projectsCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/projects" }),
  schema: ({ image }) => createBasePostSchema(image).extend({
    excerpt: z.string(),
    image: image(),
    role: z.string(),
    responsibilities: z.string(),
    website: z.string().url().optional(),
    gallery: z.array(z.object({
      image: image(),
      alt: z.string()
    })).optional(),
  }),
});

/**
 * Community: Participación en comunidades con galería
 */
const communityCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/community" }),
  schema: ({ image }) => createBasePostSchema(image).extend({
    excerpt: z.string(),
    image: image(),
    role: z.string(),
    responsibilities: z.string(),
    website: z.string().url().optional(),
    gallery: z.array(z.object({
      image: image(),
      alt: z.string()
    })).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
  'work': workCollection,
  'projects': projectsCollection,
  'community': communityCollection,
  "talk": talkCollection
};
