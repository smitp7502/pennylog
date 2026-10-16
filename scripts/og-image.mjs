// Render public/og.png, the 1200×630 social card used for og:image / twitter:image (see docs/seo.md).
// Draws the app's coin icon (the Android `drawable/large_ic_launcher.png`, copied to src/assets/og-coin.png)
// centred on the site background, then screenshots it in Chrome.
//
//   npm i --no-save puppeteer-core
//   node scripts/og-image.mjs                      uses Chrome from the default Windows path
//   CHROME=/path/to/chrome node scripts/og-image.mjs
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import puppeteer from 'puppeteer-core';

const root = resolve(import.meta.dirname, '..');
const file = (p) => pathToFileURL(resolve(root, p)).href;
const chrome = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; display: grid; place-items: center;
    background: radial-gradient(34% 62% at 50% 50%, #f0d72424, transparent 70%), #0a0c0d; }
  /* The P in the drawable is a transparent cut-out: the white disc behind the coin shows through it. */
  .coin { position: relative; width: 420px; height: 420px; filter: drop-shadow(0 24px 48px #000000a0); }
  .coin::before { content: ''; position: absolute; inset: 15%; border-radius: 50%; background: #fff; }
  .coin img { position: relative; width: 100%; height: 100%; display: block; }
</style></head><body>
  <div class="coin"><img src="${file('src/assets/og-coin.png')}" alt=""></div>
</body></html>`;

const browser = await puppeteer.launch({ executablePath: chrome, args: ['--allow-file-access-from-files'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  // Loaded from a file so the file:// fonts and images are allowed.
  const tmp = resolve(tmpdir(), 'pennylog-og.html');
  writeFileSync(tmp, html);
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  rmSync(tmp);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(root, 'public/og.png'), type: 'png' });
  console.log('Wrote public/og.png');
} finally {
  await browser.close();
}
