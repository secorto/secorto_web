import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/blog" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    image: image().optional()
  }),
});

const talkCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/talk" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    image: image(),
    comunidad: z.string(),
    video: z.string().optional(),
    slide: z.string()
  }),
});

const workCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/work" }),
    schema: ({ image }) => z.object({
    title: z.string(),
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

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    title: z.string(),
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

const communityCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/community" }),
  schema: ({ image }) => z.object({
    title: z.string(),
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
