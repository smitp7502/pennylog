# App screenshots and logo

The site shows **real app captures**, not mock-ups, wherever it shows "the app".

## Sources

| What | From | In the site |
| --- | --- | --- |
| Screens | `Desktop/Project/pennylog-screenshots/app-screens/{light,dark}/` | `src/assets/app/{light,dark}/<screen>.png` (1080×2400) |
| Logo | `pennylog-screenshots/play-store/screenshots/app-icon.png` (512, full-bleed) | `src/assets/brand/logo-mark.png` (rounded, 128), `logo-coin.png` (coin cut-out, 256), `public/favicon.png` (64), `public/apple-touch-icon.png` (180), `public/icon.png` (512, OG image) |

Two capture sessions, both on a Redmi (M2101K6P) with the seeded ₹ demo data (`tools/seed.py`: the Goa Trip
split, budgets, HDFC Bank) and the status bar repainted to read 9:41:

- **2026-10-10**, app `design-v1-1` (2.0.0, schema v11): the light set and the first dark set.
- **2026-11-01**, app `import-transactions` (schema v15): the dark versions of every screen that had only a light
  one, plus both themes of the new screens. The dark captures of existing screens use the same demo data as their
  light ones. The new screens (recurring, card bill, account groups, people, sub-groups, import) add
  `tools/seed_v15.py` on top: account groups, credit card bill settings and card spends, family people tags,
  recurring schedules and a Flat expenses sub-group. Sources: `app-screens/v15-{light,dark}/`.

## Which screen goes where

`<PhoneShot screen="…">` puts a capture in a phone frame. On the Features page the frame sits in a fixed-height stage, so only the top ~60% of the screen shows; keep the important UI near the top of any replacement capture. When a dark capture exists, the frame shows it in the
dark theme and the light one in the light theme. Astro serves resized WebP versions (300/450/600/900 wide), so
phones never download the full PNG.

Every screen now has a light and a dark capture, so the dark theme never shows a light screenshot.

| Screen | Used on |
| --- | --- |
| `dashboard` | Home hero |
| `add-record` | Home gallery · Features "Track" |
| `statistics` | Home gallery · Features "Understand" |
| `daily-calendar` | Home gallery |
| `budgets` | Home gallery · Features "Plan" |
| `recurring-list` | Home gallery |
| `card-bill` | Home gallery · Features "Pay on time" |
| `who-pays-whom` | Home gallery · Features "Share" |
| `upi-qr` | Home gallery · Split "In the app" |
| `account-groups` | Home gallery |
| `people` | Home gallery |
| `export` | Home gallery |
| `import` | Home gallery |
| `backup` | Home gallery · Features "Keep" |
| `split-group` | Split "In the app" |
| `split-summary` | Split "In the app" |
| `sub-groups` | Not used since 2026-11-18: the app no longer offers new sub-groups (schema v17). Still in `src/assets/app/` |

The light `export` capture is from 2026-11-01 too, because the screen became *Export & import* with an Import tab.
`accounts` was replaced by `account-groups`. Captured but not on the site yet: `card-settings`, `notifications`
and `recurring` (the repeat form), in `pennylog-screenshots/app-screens/v15-*`.

The home hero's floating cards quote the same demo data, so their numbers match the captures:

- the Shopping budget, "Almost used", ₹4,900 of ₹5,000;
- "Arjun pays You ₹2,750" from the Goa Trip.

The logo appears in the header, the footer, the favicon and touch icon, and as the spinning coin in the loading
intro.

## Refreshing captures

1. Re-capture with the workflow in `pennylog-screenshots`: `tools/seed.py` builds the demo database,
   `tools/seed_v15.py` adds the v15 data for the new screens, `tools/ui.py` drives the phone over adb, and
   `tools/clean.py` / `tools/clean_v15.py` repaint the status bar.
2. Copy the files over the ones in `src/assets/app/`, keeping the names. The source names are numbered
   (`01-dashboard.png`); the site names are not (`dashboard.png`).
3. Keep 1080×2400. The frame assumes that aspect ratio.
4. If the demo data changes, update the hero's floating cards and every `alt` text that quotes a number.

## Not on Google Play yet

Recurring records, people tags and split sub-groups shipped with schema v12–v14. Credit card bills, account groups,
import from Excel/CSV and the Notifications screen are on the app's `import-transactions` branch (schema v15) and
are **not released yet**. Don't deploy the site's claims about them before that version is live:

- `features.astro`: the "04 · Pay on time" section, "Accounts and groups", "Reminders you choose" and "Import from
  another app";
- the home gallery's `card-bill`, `account-groups` and `import` cards;
- `schema.ts`: the credit card, groups and import entries in `featureList`;
- `privacy.astro`: card settings, account groups, notification switches and imported files.

On the app's `feature/backup-cards-split-fixes` branch (schema v17), also **not released yet**, and kept on the site's
`app-v17-sync` branch until that version is live:

- an expense picks who it is split between ("Split between"), and new sub-groups aren't offered: the hike story's
  last chapter and how-to steps, `/split` "In the app" (the `sub-groups` capture is gone), the Features "Split
  between some people" card, the two FAQ answers, `schema.ts` `featureList`, and `privacy.astro` "Split groups";
- card bill reminders that come daily in the last three days, ease off once the minimum is paid and stop when the
  bill is paid: the Features "Reminders until it's paid" card.

No capture of the "Split between" list exists yet; add one to `/split` "In the app" when the screens are re-shot.
