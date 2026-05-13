import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
  output: 'server',
  adapter: cloudflare({
    // Explicitly setting imageService to passthrough because Cloudflare 
    // Workers do not support the default 'sharp' image service.
    imageService: 'passthrough',
    // Ensure we are using the local runtime mode for development
    runtime: { mode: 'local' }
  }),
  vite: {
    plugins: [tailwindcss()],
    // Some libraries have issues with SSR in Vite, 
    // we can try to exclude them if needed.
    ssr: {
      external: ['@neondatabase/serverless']
    }
  },
});