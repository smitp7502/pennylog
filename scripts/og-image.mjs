// Render public/og.png, the 1200×630 social card used for og:image / twitter:image (see docs/seo.md).
// Draws an HTML card with the site's fonts, logo and two real app captures, then screenshots it in Chrome.
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
  @font-face { font-family: Bricolage; src: url(${file('node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2')}); font-weight: 200 800; }
  @font-face { font-family: Geist; src: url(${file('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2')}); font-weight: 100 900; }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: Geist, sans-serif; color: #f3f5f6;
    background: radial-gradient(60% 70% at 78% 30%, #34d3a62e, transparent 70%), radial-gradient(40% 50% at 0% 100%, #5cc8ff14, transparent 70%), #0a0c0d; }
  .copy { position: absolute; left: 72px; top: 64px; width: 610px; display: flex; flex-direction: column; gap: 26px; }
  .brand { display: flex; align-items: center; gap: 16px; font-family: Bricolage; font-weight: 700; font-size: 40px; letter-spacing: -0.02em; }
  .brand img { width: 60px; height: 60px; border-radius: 16px; }
  .brand b { color: #34d3a6; }
  h1 { font-family: Bricolage; font-weight: 700; font-size: 66px; line-height: 1.02; letter-spacing: -0.035em; }
  h1 span { color: #34d3a6; }
  ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; font-size: 25px; color: #a3acb4; }
  li { display: flex; align-items: center; gap: 14px; }
  li::before { content: ''; width: 10px; height: 10px; border-radius: 50%; background: #34d3a6; }
  .pill { align-self: flex-start; margin-top: 6px; padding: 12px 22px; border-radius: 14px; background: #34d3a6; color: #052a20; font-weight: 650; font-size: 22px; }
  .phone { position: absolute; width: 250px; aspect-ratio: 1080 / 2400; padding: 8px; border-radius: 34px; background: #0b0d0e;
    border: 1.5px solid #66717a99; box-shadow: 0 30px 70px #000000b0; }
  .phone img { width: 100%; height: 100%; object-fit: cover; border-radius: 27px; display: block; }
  .p1 { left: 720px; top: 70px; transform: rotate(-5deg); }
  .p2 { left: 920px; top: 120px; transform: rotate(5deg); }
</style></head><body>
  <div class="copy">
    <div class="brand"><img src="${file('public/icon.png')}" alt=""><span>Penny<b>Log</b></span></div>
    <h1>Expense tracker <span>&amp; bill splitter</span> for Android.</h1>
    <ul><li>Log spends offline in a few taps</li><li>Budgets that warn you early</li><li>Split expenses: who owes whom</li></ul>
    <span class="pill">Free on Google Play</span>
  </div>
  <div class="phone p1"><img src="${file('src/assets/app/dark/dashboard.png')}" alt=""></div>
  <div class="phone p2"><img src="${file('src/assets/app/dark/who-pays-whom.png')}" alt=""></div>
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
