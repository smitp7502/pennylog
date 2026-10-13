# PennyLog website

Marketing site for the PennyLog Android app. Astro + Tailwind CSS v4, fully static.

## Commands

```bash
npm install
npm run dev       # http://localhost:4321, plus http://<this-PC-IP>:4321 for phones on the same Wi-Fi
npm run typecheck # tsc over the TS scripts
npm run build     # static build to dist/
npm run preview   # serve dist/ (also on the local network)
```

## Routes

| Route       | File                     | Notes                                              |
| ----------- | ------------------------ | -------------------------------------------------- |
| `/`         | `src/pages/index.astro`  | Hero with app mockup, three habits, split teaser   |
| `/features` | `src/pages/features.astro` | Full feature list in five groups                 |
| `/split`    | `src/pages/split.astro`  | Working split calculator + hike story explaining the app's sub-groups ([docs](docs/split-calculator.md)) |
| `/faq`      | `src/pages/faq.astro`    | Animated `<details>` questions                     |
| `/privacy`  | `src/pages/privacy.astro` | Privacy policy, written from what the app actually does |
| `404`       | `src/pages/404.astro`    |                                                    |

## Before going live

1. Fill in the privacy policy effective date (`privacyEffective`) in `src/config.ts`.
2. `site` in `astro.config.mjs` is the live domain; change it if a custom domain replaces the Vercel one, and submit `/sitemap.xml` in Google Search Console ([docs/seo.md](docs/seo.md)).
3. Point the app's privacy link (`_privacyPolicyUrl` in the app's `custom_drawer.dart`) and the Play Console privacy URL at `/privacy`.
4. Re-read `/privacy` whenever the app adds an SDK, permission or data flow.

## Docs

- [`CLAUDE.md`](CLAUDE.md): conventions, rules, and the requirement to keep docs current.
- [`docs/`](docs/README.md): how things work (split calculator maths, hike story, design system, motion, SEO, privacy-policy sources) and a [changelog](docs/CHANGELOG.md).
