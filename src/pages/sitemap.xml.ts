import type { APIRoute } from 'astro';

// Every page in src/pages becomes a sitemap entry, except the noindex pages (404, /pay) and non-HTML endpoints.
const noindex = new Set(['/404', '/pay']);
const pages = Object.keys(import.meta.glob('./**/*.astro'))
  .map((f) => f.replace(/^\.\//, '/').replace(/\.astro$/, '').replace(/(^|\/)index$/, '') || '/')
  .filter((p) => !noindex.has(p))
  .sort();

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('sitemap.xml needs `site` in astro.config.mjs');
  const urls = pages.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
