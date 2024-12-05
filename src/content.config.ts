import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    gist: z.string().optional()
  }),
});

const talkCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    image: image(),
    comunidad: z.string(),
    video: z.string().optional(),
    slide: z.string(),
    gist: z.string().optional()
  }),
});

const workCollection = defineCollection({
  type: 'content',
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
  type: 'content',
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
  type: 'content',
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

const blocksCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string()
  }),
});

export const collections = {
  'blog': blogCollection,
  'work': workCollection,
  'projects': projectsCollection,
  'community': communityCollection,
  "talk": talkCollection,
  "blocks": blocksCollection
};
