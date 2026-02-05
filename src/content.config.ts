import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    // Header & identification
    title: z.string(),
    tagline: z.string(),
    role: z.string(),
    client: z.string(),
    timeline: z.string(),
    // Narrative sections
    challenge: z.string(),
    approach: z.string(),
    solution: z.string(),
    result: z.string(),
    // Technical details & links
    techStack: z.array(z.string()),
    projectLink: z.string().url().optional(),
    github: z.string().url().optional(),
    servicesProvided: z.array(z.string()),
    // Media assets
    heroImage: z.string(),
    logoIcon: z.string().optional(),
    // Meta
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  caseStudies,
};
