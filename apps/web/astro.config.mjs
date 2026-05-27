import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// GitHub Pages 배포 시 base path = repo 이름. 정식 도메인 배포 시 '/' 로 복귀.
const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages';

// https://astro.build/config
export default defineConfig({
  site: isGhPages
    ? 'https://vdirectors00-blip.github.io'
    : (process.env.PUBLIC_SITE_URL || 'http://localhost:4321'),
  base: isGhPages ? '/cmk-image-korea' : '/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
