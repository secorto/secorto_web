import { z, defineCollection } from 'astro:content';

// 2. Define a `type` and `schema` for each collection
const blogCollection = defineCollection({
  type: 'content', // v2.5.0 and later
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
  type: 'content', // v2.5.0 and later
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

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  'blog': blogCollection,
  'work': workCollection
};
