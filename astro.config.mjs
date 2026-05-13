import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    runtime: { mode: 'local' }
  }),
  vite: {
    plugins: [tailwindcss()],
    // We removed the ssr.external setting because Cloudflare Workers 
    // requires all non-built-in dependencies to be bundled.
  },
});