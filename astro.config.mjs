// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // The live domain. Drives canonical URLs, absolute OG links, sitemap.xml and robots.txt (docs/seo.md).
  site: 'https://pennylog-kohl.vercel.app',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
});
