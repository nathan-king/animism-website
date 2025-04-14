import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  schema: z.object({
    title: z.string(),
  }),
});

const wiki = defineCollection({
  schema: z.object({
    title: z.string(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    related: z.array(z.string()).optional(),
    summary: z.string().optional(),
  }),
});

export const collections = {
  pages,
  wiki,
};
