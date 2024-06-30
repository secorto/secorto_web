import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    image: z.string().optional()
  }),
});


const talkCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    comunidad: z.string(),
    video: z.string().optional(),
    slide: z.string().optional()
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

const timelineCollection = defineCollection({
  type: 'data',
  schema: z.object({
    date: z.string(),
    title: z.string(),
    location: z.string(),
    place: z.string(),
    type: z.string()
  })
});

export const collections = {
  'blog': blogCollection,
  'work': workCollection,
  "talk": talkCollection,
  "timeline": timelineCollection
};
