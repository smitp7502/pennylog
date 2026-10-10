# Release notes ("What's new", `/whats-new`)

Release notes live in **Cloud Firestore** and the page loads them live in the visitor's browser. A new note
shows up without rebuilding the site.

- Page: [`src/pages/whats-new.astro`](../src/pages/whats-new.astro); script:
  [`src/scripts/releases.ts`](../src/scripts/releases.ts)
- Firestore config: [`firebase.json`](../firebase.json), [`.firebaserc`](../.firebaserc),
  [`firestore.rules`](../firestore.rules), [`firestore.indexes.json`](../firestore.indexes.json)
- Content source: [`data/releases.json`](../data/releases.json); uploader:
  [`scripts/seed-releases.mjs`](../scripts/seed-releases.mjs)

## Where the data lives

Firebase project `penny-log-ae1c4`, database `(default)`: Standard edition, Native mode, location **asia-south1
(Mumbai)**. Standard is the edition with the free daily quota, which a short list of releases stays well inside.
`firebase.json` pins the database id and location, so a `firebase deploy` can never create it somewhere else.

**Location history:** the first `firebase deploy --dry-run` created `(default)` in `nam5`, because `firebase.json`
had no location yet. That empty database was deleted and recreated in asia-south1 the same day.

## Data model: collection `releases`

One document per release. The id is a version slug (`2-0-0`, `1-x`, `1-0-0`).

| Field | Type | Notes |
| --- | --- | --- |
| `version` | string | Shown as the badge, e.g. `2.0.0` |
| `title` | string | Headline |
| `summary` | string | Intro paragraph |
| `releasedAt` | timestamp | Sort key, newest first. Shown as a date in India time unless `dateLabel` is set |
| `dateLabel` | string, optional | Replaces the date, e.g. `Sep 2025 – Oct 2026` |
| `published` | bool | Only `true` documents are visible to the public; use `false` for drafts |
| `sections` | list of `{ title, items[] }` | Headed groups of bullet points |

## Security rules (prototype; review before relying on them)

- `releases`: **read** if `published == true`, which works without signing in. **No writes** from any client.
- Everything else is denied.
- The website runs exactly one query: `published == true`, ordered by `releasedAt` descending, limit 50. It needs
  the composite index in `firestore.indexes.json`, and the rules reject any query that doesn't filter on
  `published`, so drafts can't be listed.
- Writes go through admin credentials (the script below, or the Firebase console), which bypass the rules.

Deploy rules and indexes from this folder with `firebase deploy --only firestore`.

## Adding or changing a release

**Option A: through the repo (recommended, keeps history)**

1. Edit `data/releases.json`. Add the new release at the top, with a new `id`, the `releasedAt` date, and
   `published: true` (or `false` for a draft).
2. Run `node scripts/seed-releases.mjs --dry-run` to check it, then `node scripts/seed-releases.mjs` to upload.
   - It uses your `firebase login` on this machine. `scripts/firebase-token.mjs` exchanges that login for a
     short-lived token through the Firebase CLI's own OAuth client; no credentials are stored in the repo.
   - It replaces each document by id, so it's safe to re-run.
3. Reload `/whats-new`.

**Option B: Firebase console.** Add a document to `releases` with the fields above. `releasedAt` must be a
**timestamp**, not a string.

## How the page behaves

- **Loading:** shows a pulsing placeholder, then each release rises in, staggered.
- **Timeline:** from `md` up, a rail with one dot per release; the newest has a jade dot and a **Latest** badge.
- **Releases:** each one is a version badge, date, title, summary, then a grid of section cards with bullet lists.
- **Errors:** a network error, or no answer within 12s, shows "Couldn't load the release notes…" and a **Try
  again** button. An empty result shows "No release notes yet."
- **No JS:** a `<noscript>` line points to Google Play.
- **Safe rendering:** all text from Firestore is HTML-escaped before rendering.
- **Privacy:** this is the site's **only** request to a third party. Visitors' browsers contact
  `firestore.googleapis.com`. The privacy page's "This website" section says so; keep it accurate if this
  changes.

## How the history before 2.0 was written

The 1.0.x releases were never written up, and their version numbers were bumped automatically by CI, so they
aren't in the code. The notes were rebuilt from the app's git history on `master`:

- **1.0.0**, 24 Sep 2025: the "App live on the Play store" commit. Its features come from what the code contained
  at that commit: records including transfers, accounts, custom categories, a category chart, currency choice, a
  daily reminder, and dark/light themes. Closed testing started on 10 Sep 2025, and `pubspec.yaml` read
  `1.0.3+4` at that commit; 1.0.0 is used as the public name of the first release.
- **1.x**, "Updates to 1.0": dated by month from the commits that added each feature.
  - Sep 2025: charts.
  - Oct 2025: budgets, backup & restore, export, delete & reset.
  - Nov 2025: refreshed UI.
  - Feb 2026: split expenses.
  - May 2026: reusable people and UPI QR.
  - Sep 2026: budget templates.
  - Oct 2026: UPI pay links.
  - SMS import (Apr 2026) and voice entry (May 2026) are left out because they are switched off in the app.
- GitHub's `APP_VERSION_NAME` variable records 1.0.11 as the last CI production build (22 Feb 2026). For exact
  per-version dates, Play Console's release history is the authority. If you want exact 1.0.x entries, export
  them from there and add them to `data/releases.json`.
