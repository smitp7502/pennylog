// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Set this to the live domain before deploying; it enables canonical URLs and absolute OG links.
  // site: 'https://example.com',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
});
