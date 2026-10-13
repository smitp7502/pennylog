# SEO

How the site is set up for search engines and link previews, and the keywords each page targets.

## Domain and canonical URLs

- `site` in `astro.config.mjs` is the live domain (`https://pennylog-kohl.vercel.app`). It drives canonical URLs,
  absolute `og:url` / `og:image`, `sitemap.xml` and `robots.txt`. **Change it there when a custom domain goes live**,
  then resubmit the sitemap in Google Search Console.
- One URL per page, **without a trailing slash** (`/split`, not `/split/`). `Base.astro` strips the slash from the
  canonical; `vercel.json` (`"trailingSlash": false`) redirects the slashed form, so the two never compete as duplicates.
- Vercel preview deployments point their canonical at the live domain, so they don't get indexed as copies.

## What `Base.astro` puts in `<head>`

| Prop | Effect |
| --- | --- |
| `title` | `<title>` = `title · PennyLog`. Left out on the home page, which uses `site.title` from `src/config.ts`. |
| `description` | Meta, OG and Twitter description. Defaults to `site.description`. Keep it 140–160 characters. |
| `crumb` | Short page name for the `BreadcrumbList` (defaults to `title`). |
| `schema` | Extra JSON-LD objects (see below). |
| `noindex` | `robots: noindex, follow` and no canonical. Used by the 404 page. |

Every page also gets: `robots` (`max-image-preview:large`), canonical, `og:*` with `og:locale` `en_IN`, Twitter
`summary_large_image`, `rel="sitemap"`, `site.webmanifest` (which names the Play app under
`related_applications`), `google-play-app`, and a Home › Page `BreadcrumbList` on every page except home and 404.

## Structured data (JSON-LD)

Built in `src/schema.ts`, passed through `schema`. State only what is true of the app today: **no ratings, review
counts or install numbers** unless they come from Google Play, or Google may issue a manual action.

| Page | Types |
| --- | --- |
| `/` | `WebSite`, `MobileApplication` (Android, `FinanceApplication`, free, `featureList`) |
| `/split` | `WebApplication` (the in-browser calculator) + breadcrumb |
| `/faq` | `FAQPage`, generated from the same `sections` array the page renders (answers lose their HTML) + breadcrumb |
| other pages | breadcrumb |

When the app gains or loses a feature, update `featureList` in `appSchema` along with `/features`.

## Sitemap and robots

- `src/pages/sitemap.xml.ts` lists every `.astro` page under `src/pages/` except `404`, so a new page is included
  automatically. No `lastmod`: Google ignores it unless it is accurate, and the build has no per-page dates.
- `src/pages/robots.txt.ts` allows everything and points at the sitemap. (There is no `public/robots.txt`.)

## Social card

`public/og.png` (1200×630) is the `og:image` / `twitter:image` for every page. It is rendered by
`scripts/og-image.mjs` from the site's fonts, `public/icon.png` and the dark `dashboard` and `who-pays-whom`
captures. Re-run it when the logo, captures or headline change:

```bash
npm i --no-save puppeteer-core
node scripts/og-image.mjs
```

## Keywords per page

Each page has one primary search phrase in its `<title>`, `<h1>` or lead, and its description. Copy uses the
phrases where they read naturally; never stuff them or hide text.

| Page | Primary | Also covers |
| --- | --- | --- |
| `/` | expense tracker app (Android) | split expenses app, offline expense tracker, budget app, money manager India |
| `/features` | expense tracker features | budget planner, spending statistics, recurring expenses, UPI QR, Google Drive backup, PDF / Excel export |
| `/split` | split expenses calculator | split bills with friends, bill splitter, who owes whom, settle up, trip / flatmate / roommate expenses |
| `/faq` | expense tracker FAQ | is it free, iPhone version, Splitwise alternative, offline, backup |
| `/whats-new` | PennyLog release notes | version names |

`/split` carries a plain-text **How to split expenses with friends** section (three steps) and a **Split bills for
any group** grid (trips, flatmates, dinners, gifts/office lunches) below the app section, so the page has
crawlable copy around the calculator. The FAQ's Splitwise answer describes only PennyLog; don't make claims about
other apps.

## After deploying

1. [Google Search Console](https://search.google.com/search-console) verifies the URL-prefix property
   `https://pennylog-kohl.vercel.app/` through `public/googlecfa15c92f269386f.html`. **Don't delete or rename that
   file**, or the property loses verification. A custom domain needs its own property (and file or DNS record).
   Submit `/sitemap.xml` there.
2. Do the same in Bing Webmaster Tools (it can import from Search Console).
3. Check pages with the [Rich Results Test](https://search.google.com/test/rich-results) and a link preview
   (WhatsApp / X) after changing `schema.ts` or `og.png`.
4. Link the site from the Google Play listing (developer website field) and the app; inbound links matter more
   than any tag here.
