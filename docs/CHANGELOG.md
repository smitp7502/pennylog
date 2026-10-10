# Changelog

Behaviour changes to the site, newest first. Each entry names the docs it touched.

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
