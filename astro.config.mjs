// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  },
  server: {
    host: true, // or '0.0.0.0' — binds to all network interfaces
    port: 4321, // optional, only needed if you want a fixed port
  },
});