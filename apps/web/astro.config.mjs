import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// Netlify / Cafe24 / 정식 도메인 모두 root URL — base path 불필요.
// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
