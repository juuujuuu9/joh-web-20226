// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
const siteUrl = process.env.SITE_URL?.trim();
const validSite = siteUrl?.startsWith('http') ? siteUrl : 'https://julianhardee.com';

export default defineConfig({
  site: validSite,
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});