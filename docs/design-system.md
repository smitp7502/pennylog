# Design system, theming and layout

The site uses the PennyLog app's design system: jade brand, coral expense, dark by default with a mirrored light
theme, Bricolage Grotesque for display type and Geist for text. The source design lives in the claude.ai design
canvas "PennyLog — Marketing website" (artboards Main, Features, Split, FAQ, Privacy).

## Tokens → Tailwind

[`src/styles/global.css`](../src/styles/global.css) defines the tokens as CSS variables in two places:

- `:root` holds the dark values.
- `:root[data-theme='light']` overrides them with the light values.

`@theme inline` then exposes them to Tailwind:

| Token | Tailwind name | Use |
| --- | --- | --- |
| `--bg` / `--surface` / `--surface-raised` / `--surface-overlay` | `bg-bg`, `bg-surface`, `bg-raised`, `bg-overlay` | page, cards, nested blocks, sheets/popovers |
| `--line` / `--line-strong` | `border-line`, `border-line-strong` | hairlines / meaningful borders |
| `--ink` / `--ink-muted` / `--ink-subtle` | `text-ink`, `text-muted`, `text-subtle` | text levels |
| `--brand`, `-strong`, `-soft`, `--on-brand` | `bg-brand`, `text-brand-strong`, `bg-brand-soft`, `text-on-brand` | jade; income |
| `--expense`, `--transfer`, `--warning` (+ `-soft`) | `text-expense`, `bg-transfer-soft`, … | money out, info, warnings |
| `--cat-orange/sky/violet/pink/lime/yellow/slate` | `text-cat-pink`, `bg-cat-pink/16` | category / person hues; tiles use the hue at 16% |

Other theme values:

- **Radii:** `rounded-xl` = 12px (buttons, inputs), `rounded-card` = 20px, `rounded-sheet` = 28px.
- **Fonts:** `font-sans` (Geist) and `font-display` (Bricolage Grotesque). Both are self-hosted through
  `@fontsource-variable`.

**Fixed-palette exceptions** (they don't follow the theme):

- the split summary card, which mirrors the image the app shares;
- the hike scene;
- the Google Play badge, which is always black.

## Theme switching

- An inline script in `Base.astro` runs before paint. It picks the saved choice (`localStorage['pl-theme']`), else
  the system preference, else dark, and sets `<html data-theme>` and the `js` class.
- `@custom-variant light` lets markup style light-only details, e.g. `light:block`. The header uses it to swap the
  sun and moon icons.
- The header's theme button flips `data-theme`, wrapped in `document.startViewTransition` for a cross-fade where
  supported, and saves the choice. Storage access is wrapped in try/catch, so private mode still works.

## Shared component classes (`@layer components`)

| Class | Meaning |
| --- | --- |
| `wrap` | centred 1200px container, 16px side gutter (24px from `sm`) |
| `btn`, `btn-p`, `btn-o`, `btn-lg`, `btn-sm` | buttons: primary jade, outline; 52px tall (56 lg, 44 sm); press-scale, hover lift; `.arrow` icons nudge right on hover |
| `ov`, `lead`, `h1`, `h2` | overline, lead paragraph, page title, section title |
| `card`, `tile`, `av`, `bar`, `num`, `ic` | card with hover lift, 40px icon tile, avatar, progress bar, tabular numbers, stroke icon |

## Components

| Component | Notes |
| --- | --- |
| `Header` | See below |
| `Footer` | Brand blurb, Play badge, Product and Legal links; `aria-current` on the current page |
| `PageHero` | Overline + `<h1>` (slot) + lead + optional `after` slot; staggered rise-in |
| `CtaBand` | "Every rupee, logged." jade band with Play badge |
| `PhoneMockup` | Home hero: the real dashboard capture (`PhoneShot`), with floating budget and payment cards taken from the same demo data (≥1000px only) |
| `PlayButton` | Black "GET IT ON / Google Play" store badge with the four-colour logo; `size="md"`, 52px tall, or `"lg"`, 56px. Pass `class="max-sm:w-full"` where it should fill phone width |
| `PlayLogo` | The four-colour Google Play triangle (SVG) |
| `Icon` | Inline stroke icons (24px grid, `currentColor`) by name; add new ones to its `paths` map |
| `HikeStory` | See [hike-story.md](hike-story.md) |
| `BootScreen` | First-load intro (coin, wordmark, log line); see [motion.md](motion.md#loading-intro) |
| `PhoneShot` | A real app capture in a phone frame; shows the dark capture in the dark theme when one exists; responsive WebP. See [screenshots.md](screenshots.md) |
| `AppGallery` | Home "A look inside": scroll-snap row of nine captures with captions, plus prev/next buttons from `md` up |
| `RecordTypeDemo` | Working Expense / Income / Transfer switcher on the home page; see [home-page.md](home-page.md) |

Google's brand rules prefer their official badge artwork to a recreation. Swap `PlayButton` for the official image
if the Play listing review requires it.

## Header and navigation

Routes are separate pages: `/`, `/features`, `/split`, `/faq`, `/privacy`, plus a 404. The nav items come from `nav`
in `src/config.ts`.

| | Phones (< 768px) | Tablet / desktop (≥ 768px) |
| --- | --- | --- |
| Bar | Logo · theme button · hamburger; one row, **69px**, sticky | Logo · inline links · theme button · black "Get the app" (Play logo); **84px**, sticky |
| Links | In the hamburger menu: Features, Split expenses, FAQ, Privacy policy, then a full-width Play badge. The theme button stays outside the menu | Inline pills; the current page is highlighted in jade |

Header behaviour:

- **On scroll:** after 8px the header gets `data-scrolled`, which adds a translucent background, blur and a
  bottom border.
- **Mobile menu:** it drops over the page; it doesn't push content down. It animates height with
  `grid-template-rows: 0fr → 1fr`, and the ☰ morphs into an ✕. A separate fixed backdrop sits *outside* the header,
  because the header's `backdrop-filter` would trap a fixed child; it dims the page, and tapping it closes the menu.
- **Closing the menu:** Escape (focus returns to the menu button), tapping the backdrop, following a link, or
  widening the window past 768px. While it's closed, its links have `tabIndex=-1`.

Anything that scrolls to an element must allow for the sticky header: use `scroll-mt-20` on phones and
`scroll-mt-24` from `md` up.

## Layout rules

- **Phones first:** no horizontal overflow from 320px up.
- **Wide rows:** use `flex-wrap` with `flex-[1_1_<basis>] min-w-0`, so columns stack on small screens without
  breakpoints.
- **Inputs** use 16px text, so iOS doesn't zoom in on focus.
- **Touch targets** are at least 44px.
- **Sticky side columns** (Features groups, FAQ section titles, the Privacy table of contents) only stick from `md`
  up.
