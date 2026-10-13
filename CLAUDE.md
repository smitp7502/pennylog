# CLAUDE.md

Guidance for Claude Code (and people) working in this repository.

**PennyLog website**: the static marketing site for the PennyLog Android app (package `com.timsved.pennylog`).
Astro 7 + Tailwind CSS v4, no UI framework, no backend. The app itself lives in a separate Flutter repo
(`../../Flutter/app`).

## Keep the docs current (required)

Behaviour and logic are documented in [`docs/`](docs/README.md), one file per area. **Any change that adds or
alters logic, UI behaviour, animation, routing, or a fact the site states about the app must update the matching
doc in the same change.**

- Changed something already documented → edit that doc so it describes the new behaviour (don't append "update:" notes; rewrite the section).
- Added a new feature, page, script or component with behaviour → add a section to the closest doc, or a new `docs/<topic>.md` and list it in `docs/README.md`.
- Every change of this kind also gets a dated entry at the top of [`docs/CHANGELOG.md`](docs/CHANGELOG.md).
- Pure copy edits or styling tweaks with no behavioural effect don't need a doc change.

| Area | Doc |
| --- | --- |
| Home page: hero mockup, Expense / Income / Transfer switcher | [docs/home-page.md](docs/home-page.md) |
| Split calculator on `/split` (money maths, settle-up, input rules, mobile result bar) | [docs/split-calculator.md](docs/split-calculator.md) |
| Hike scroll story on `/split` (sub-groups example, scene state machine) | [docs/hike-story.md](docs/hike-story.md) |
| Illustration assets for the hike story: prompts, names, sizes | [docs/hike-assets-brief.md](docs/hike-assets-brief.md) |
| App screenshots and logo: sources, placement, refreshing | [docs/screenshots.md](docs/screenshots.md) |
| Release notes (`/whats-new`): Firestore model, rules, adding a release, 1.0 history | [docs/releases.md](docs/releases.md) |
| Tokens, theming, components, header/menu, layout rules | [docs/design-system.md](docs/design-system.md) |
| Page transitions, scroll reveals, count-ups, reduced motion | [docs/motion.md](docs/motion.md) |
| Where each privacy-policy claim comes from in the app | [docs/privacy-policy.md](docs/privacy-policy.md) |
| SEO: titles, descriptions, JSON-LD, sitemap, robots, social card, target keywords | [docs/seo.md](docs/seo.md) |

## Commands

```bash
npm install
npm run dev        # http://localhost:4321, also on the local network (--host): http://<this-PC-IP>:4321
npm run typecheck  # tsc --noEmit over the TS scripts
npm run build      # static build to dist/
npm run preview    # serve dist/, also on the local network
```

`astro check` does not work here: under Astro 7 it fails to detect `@astrojs/check` 0.9 and blocks on an install
prompt. Use `npm run typecheck` + `npm run build` instead. Run both before finishing any change.

## Structure

```
src/
├── config.ts            # site facts: home title/description, Play URL, support email, developer, policy date, nav items
├── schema.ts            # JSON-LD objects (app, website, split tool, FAQ); see docs/seo.md
├── layouts/Base.astro   # <head>, theme-before-paint script, header, footer, reveal init
├── pages/               # one file per route: / /features /split /faq /privacy /whats-new + 404, plus sitemap.xml.ts and robots.txt.ts
├── components/          # Header, Footer, PageHero, CtaBand, PhoneMockup, HikeStory, PlayButton, PlayLogo, Icon
├── scripts/             # reveal.ts (scroll reveals, count-ups), split.ts (split calculator)
└── styles/global.css    # design tokens, Tailwind theme, component classes, motion
public/                  # icon.png (app launcher icon), og.png (social card), site.webmanifest
docs/                    # behaviour docs, see above
```

## Rules

- **Routes are real pages**, not `#section` anchors on one page. Add a page under `src/pages/` and, if it belongs in the nav, to `nav` in `src/config.ts`.
- **Colours come from tokens.** Use the Tailwind names mapped in `global.css` (`bg-surface`, `text-muted`, `bg-cat-pink/16`, …). Never hard-code theme colours in markup. Exceptions: the split summary card and the hike scene, which are fixed-palette "images", and the Google Play badge, which is always black.
- **Both themes.** Every UI change must work in dark (default) and light. Check both.
- **Phones first.** No horizontal overflow from 320px up. Inputs use 16px text (iOS zooms on smaller). Touch targets ≥ 44px. Nothing may sit off-screen sideways, even before an animation runs (see docs/motion.md).
- **Motion must respect `prefers-reduced-motion`.** Global CSS already zeroes transitions/animations; JS-driven motion (Web Animations, count-ups) must check the media query itself.
- **No tracking on the site.** No analytics, cookies or third-party requests; fonts are self-hosted via Fontsource. The one exception is `/whats-new`, which reads release notes from Cloud Firestore in the browser; the privacy page says so. Adding any other third-party request means changing `/privacy` too.
- **The privacy policy describes the real app.** When the app adds an SDK, permission or data flow, update `src/pages/privacy.astro` and `docs/privacy-policy.md`.
- Contact details live in `src/config.ts` (support email, developer, location). Still to fill before launch: `privacyEffective` (`[EFFECTIVE DATE]`) there.
- **Every page passes a keyword-aware `title` and `description` to `Base`** and new pages show up in `sitemap.xml` on their own. Facts in JSON-LD (`src/schema.ts`) must stay true; never add ratings or download counts. See [docs/seo.md](docs/seo.md).

## Testing

There is no test suite. Verify changes in a real browser at phone (390px, 320px) and desktop widths, in both themes.
For scripted checks, `puppeteer-core` pointed at the installed Chrome works well: emulate a phone viewport,
scroll the page to trigger reveals, and assert `document.documentElement.scrollWidth <= innerWidth`.
