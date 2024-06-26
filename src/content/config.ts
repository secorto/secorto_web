import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    author: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }).optional(),
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
    gallery: z.array(z.object({
      image: image(),
      alt: z.string()
    })),

  }),
});

export const collections = {
  'blog': blogCollection,
  'work': workCollection
};
