import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [sitemap()],
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    sessionKVBindingName: undefined,
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});