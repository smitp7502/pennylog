# Changelog

Behaviour changes to the site, newest first. Each entry names the docs it touched.

## 2026-10-16

- **2.1.0 note published** on `/whats-new` now that 2.1.0 is live on Google Play (it was a draft, so the page still
  showed 2.0.0 as Latest). → [releases.md](releases.md#the-apps-update-check-app_configandroid)
- **Social card is now the app's coin icon only:** `public/og.png` shows the yellow coin with the white P (from the
  app's `drawable/large_ic_launcher.png`) on the dark background, replacing the headline and screenshot card;
  `og:image:alt` updated to match. → [seo.md](seo.md#social-card)

## 2026-10-14

- **Search Console:** added the Google verification file `public/googlecfa15c92f269386f.html`. → [seo.md](seo.md#after-deploying)
- **Domain moved to `https://pennylog-app.vercel.app`** (the old `pennylog-kohl` URL now redirects there):
  `site` updated, so canonicals, OG URLs, `sitemap.xml` and `robots.txt` use the new domain. → [seo.md](seo.md#domain-and-canonical-urls)
- **SEO:** `site` set to `https://pennylog-kohl.vercel.app`; canonical URLs without a trailing slash (`vercel.json`
  redirects the slashed form); generated `sitemap.xml` and `robots.txt` (replacing `public/robots.txt`); keyword-led
  titles and descriptions on every page; `robots`, full OG and `summary_large_image` Twitter tags with a new 1200×630
  `og.png` (`scripts/og-image.mjs`); JSON-LD (`WebSite`, `MobileApplication`, `WebApplication`, `FAQPage`,
  breadcrumbs) from `src/schema.ts`; `site.webmanifest`; 404 is `noindex`.
  - `/split`: H1 is now "Split expenses with friends, sorted in a minute."; new **How to split expenses with
    friends** steps and **Split bills for any group** use cases at the end of the page.
  - `/features`: lead names the app as an expense tracker, budget planner and bill splitter.
  - `/faq`: new questions "Is PennyLog free?", "Is there an iPhone version?" and "Is PennyLog a Splitwise
    alternative?".
  → [seo.md](seo.md)

- **App update check in Firestore:** new `app_config/android` document drives the app's "Update available" sheet,
  listing only releases up to the version code Google Play offers. `firestore.rules` now allows a public get of
  `app_config/{platform}` (no listing, no client writes); deployed. → [releases.md](releases.md#the-apps-update-check-app_configandroid)
- **2.1.0 release note** added to `data/releases.json` (sub-groups and the new + menu) as a **draft**
  (`published: false`): `/whats-new` shows up to 2.0.0 until 2.1.0 is live on Google Play. New two-step release
  flow (write ahead, publish the web note once live). → [releases.md](releases.md#the-apps-update-check-app_configandroid)
- **Restored the `releases` collection:** all four documents had disappeared from Firestore, leaving the page on
  "No release notes yet." Re-uploaded from `data/releases.json` with `scripts/seed-releases.mjs`.
- **Privacy:** the "Analytics and crash reports" section now says the app reads that public Firestore document and
  asks Google Play for updates at launch. → [privacy-policy.md](privacy-policy.md)

## 2026-10-13

- **Split calculator starts empty:** removed the built-in "Night out" example and the **Load example** and
  **Start fresh** buttons. The "Paid by" placeholder now reads "Add people". → [split-calculator.md](split-calculator.md#model)
- **Reduced-motion fix:** the reduced-motion rule forced full opacity on everything inside an animated block, so
  disabled buttons (like **Add expense**) looked active. It now resets only the reveal states, and the Features
  phones get their own reset. → [motion.md](motion.md#reduced-motion)

- **Features page layout:** each section is now a full-width heading, then a tinted stage panel beside a 2-column
  feature grid of matching height.
  - The stage shows the top of the real screen at a readable size, rising in on scroll and fading at the bottom.
    Before, the full-height phone took the whole screen on mobile and towered over the text on desktop.
  - The stage swaps sides each section on desktop and has an accent glow per section.
  → [design-system.md](design-system.md#layout-rules)

## 2026-10-10

- **What's new page:** a new `/whats-new` route, also in the nav, loads release notes live from Cloud Firestore
  (`penny-log-ae1c4`, `(default)` database in asia-south1). The first notes are 2.0.0 (the redesign), "Updates to 1.0"
  (dated milestones rebuilt from git) and 1.0.0 (24 Sep 2025). Visitors can read published notes only and no client
  can write. `data/releases.json` with `scripts/seed-releases.mjs` uploads them. The privacy page now mentions this
  Firestore request. → [releases.md](releases.md)

- **Real app screenshots and logo.**
  - The home hero now shows the real dashboard capture (light or dark), and its floating cards use the same demo data.
  - New home "A look inside" gallery with nine captures.
  - Each Features section shows a capture.
  - The split page's "In the app" section shows the group, UPI QR and summary-image captures.
  - The app logo is now in the header and footer, the favicon and touch icon, and the loading intro coin.
  - Export copy now says PDF **or Excel**, as the app does.
  - Added `docs/screenshots.md`, including the gap: recurring records, people tags and sub-groups have no captures
    because the captured build doesn't have them.
  → [screenshots.md](screenshots.md), [home-page.md](home-page.md)

- **Hide amounts copy:** in the app, the dashboard eye now masks only the balance card (balance, income, expense);
  the record list always shows its amounts. The Features card and FAQ answer now say so instead of "every amount".
  No doc covers these copy lines.

## 2026-10-09

- **Loading intro:** on the first load in a tab, a jade ₹ coin drops and spins, "PennyLog" writes itself, and a log
  line draws underneath. It shows for 1.5–3s, then the page lifts in with the hero entrance and count-ups playing in
  view. Skipped on later pages, under reduced motion and without JS; `?intro` forces it.
  → [motion.md](motion.md#loading-intro)
- **Home: record types are selectable.** The "Log it" mockup is now a working Expense / Income / Transfer switcher:
  a sliding highlight, the amount re-counted in the type's colour and sign, each type's own fields and an
  explanatory note, a "Save <type>" label, and keyboard radio-group controls. Added `docs/home-page.md`.
  → [home-page.md](home-page.md)
- **Hike story is now daytime:** the scene was recoloured from dawn/night to a sunny day (sky repainted, layers
  colour-mapped, dark birds), with drop-shadows on the white cards. The unused asset files (chapter vignettes,
  previews, manifest and the delivered pack) were deleted. The asset brief now specifies daylight and no vignettes.
  → [hike-story.md](hike-story.md#artwork), [hike-assets-brief.md](hike-assets-brief.md)
- **Hike story artwork:** the scene now uses the illustrated asset pack (`src/assets/hike/`, served as WebP).
  Hikers walk with stride frames in single file and face downhill on the way back. They change pose by chapter:
  thali and chai, then annoyed with a head-shake, then a thumbs-up hop. The flag sways and the birds flap. The
  mountain layer was cleaned and the two seated "eat" sprites rebuilt; the chapter vignettes weren't used.
  → [hike-story.md](hike-story.md#artwork)
- **Hike story assets brief:** added the prompts, file names and specs for illustrated scene layers, props, hiker sprites (6 poses × 4) and chapter vignettes. → [hike-assets-brief.md](hike-assets-brief.md)
- **Docs:** added `CLAUDE.md` and `docs/` (split calculator, hike story, design system, motion, privacy-policy
  sources) with a rule that behaviour changes update their doc.
- **Hike story:** added a scroll-driven illustrated story to `/split` explaining sub-groups: four friends on a hike,
  two race ahead, each pair buys its own food. → [hike-story.md](hike-story.md)
- **Split calculator:** the mobile result bar now only shows while the reader is in the tool, not over the story.
  → [split-calculator.md](split-calculator.md#mobile-result-bar)
- **Play badge:** all Play buttons became a black "GET IT ON / Google Play" badge with the four-colour logo;
  full-width on phones. The desktop header's "Get the app" uses a compact version.
  → [design-system.md](design-system.md#components)
- **Header:** sticky on all sizes; phones get a one-row bar with a hamburger menu (links, privacy, Play badge) that
  drops over the page with a backdrop. The theme button stays outside the menu.
  → [design-system.md](design-system.md#header-and-navigation)
- **Split calculator, simpler entry:** removed "Split equally among"; every expense is shared by everyone. Several
  names can be added at once with commas, and duplicates are skipped. Payer is now a dropdown and "what for" is
  optional. Added the mobile result bar.
  → [split-calculator.md](split-calculator.md)
- **Mobile layout fix:** sideways reveal slides are desktop-only, because they made the page wider than phones;
  `overflow-x: clip` on `html`; inputs at 16px to stop iOS zoom. → [motion.md](motion.md#scroll-reveals-srcscriptsrevealts)
- **Initial site:** Astro 7 + Tailwind v4 build of the design canvas, with pages `/`, `/features`, `/split`,
  `/faq`, `/privacy` and a 404, dark/light themes and page transitions.
