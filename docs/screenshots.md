# App screenshots and logo

The site shows **real app captures**, not mock-ups, wherever it shows "the app".

## Sources

| What | From | In the site |
| --- | --- | --- |
| Screens | `Desktop/Project/pennylog-screenshots/app-screens/{light,dark}/` | `src/assets/app/{light,dark}/<screen>.png` (1080×2400) |
| Logo | `pennylog-screenshots/play-store/screenshots/app-icon.png` (512, full-bleed) | `src/assets/brand/logo-mark.png` (rounded, 128), `logo-coin.png` (coin cut-out, 256), `public/favicon.png` (64), `public/apple-touch-icon.png` (180), `public/icon.png` (512, OG image) |

The captures were taken from a Redmi (M2101K6P) running the app's `design-v1-1` build (versionName 2.0.0, schema v11),
with the seeded demo data: ₹ amounts, the Goa Trip split and budgets. The status bar is repainted to read 9:41.

## Which screen goes where

`<PhoneShot screen="…">` puts a capture in a phone frame. On the Features page the frame sits in a fixed-height stage, so only the top ~60% of the screen shows; keep the important UI near the top of any replacement capture. When a dark capture exists, the frame shows it in the
dark theme and the light one in the light theme. Astro serves resized WebP versions (300/450/600/900 wide), so
phones never download the full PNG.

| Screen | Light | Dark | Used on |
| --- | --- | --- | --- |
| `dashboard` | ✓ | ✓ | Home hero |
| `add-record` | ✓ | | Home gallery · Features "Track" |
| `statistics` | ✓ | ✓ | Home gallery · Features "Understand" |
| `daily-calendar` | ✓ | | Home gallery |
| `budgets` | ✓ | ✓ | Home gallery · Features "Plan" |
| `who-pays-whom` | ✓ | ✓ | Home gallery · Features "Share" |
| `upi-qr` | ✓ | | Home gallery · Split "In the app" |
| `accounts` | ✓ | ✓ | Home gallery |
| `export` | ✓ | | Home gallery |
| `backup` | ✓ | | Home gallery · Features "Keep" |
| `split-group` | ✓ | ✓ | Split "In the app" |
| `split-summary` | ✓ | | Split "In the app" |

The home hero's floating cards quote the same demo data, so their numbers match the captures:

- the Shopping budget, "Almost used", ₹4,900 of ₹5,000;
- "Arjun pays You ₹2,750" from the Goa Trip.

The logo appears in the header, the footer, the favicon and touch icon, and as the spinning coin in the loading
intro.

## Refreshing captures

1. Re-capture with the workflow in `pennylog-screenshots`: `tools/seed.py` builds the demo database and
   `tools/clean.py` repaints the status bar.
2. Copy the files over the ones in `src/assets/app/`, keeping the names. The source names are numbered
   (`01-dashboard.png`); the site names are not (`dashboard.png`).
3. Keep 1080×2400. The frame assumes that aspect ratio.
4. If the demo data changes, update the hero's floating cards and every `alt` text that quotes a number.

## Known gap: features the captured build doesn't have

The website also describes **recurring records**, **people tags** and **split sub-groups**, including the whole
[hike story](hike-story.md). Those are on the app's `design-v1` branch (schema v12). The captured build
(`design-v1-1`, schema v11) doesn't have them, so there are no screenshots of them.

Before release, either ship those features or remove the claims:

- `features.astro`: the Recurring records and People tags cards, and the Sub-groups card
- the home "Also in the app" cards
- the home "Log it" switcher's Repeat rows (`RecordTypeDemo`)
- the FAQ answers about recurring records and sub-groups
- the split page "In the app" Sub-groups card, and the hike story
- `privacy.astro`: "person tags" and "recurring schedules"
