import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL is set by CI per target environment.
// Default to production for local `npm run dev` / `npm run build`.
const site = process.env.SITE_URL || 'https://tutelare.ai';

export default defineConfig({
  site,
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
