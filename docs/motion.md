# Motion

All motion is decoration: every page must read correctly with it switched off.

## Loading intro

[`src/components/BootScreen.astro`](../src/components/BootScreen.astro), included first in `<body>` by
`Base.astro`.

**The sequence:**

| Time | What happens |
| --- | --- |
| 0–0.9s | The PennyLog logo coin (the gold "P" coin from the app icon) drops in, spinning twice on its vertical axis, and bounces, with its shadow tracking it |
| 0.62s | It sends out a gold landing ripple |
| 0.25s on | "Penny" then "Log" (jade) rise in letter by letter |
| 0.62–1.12s | A jade "log line" draws under the wordmark, with a glowing dot writing it |
| 0.85–1.3s | "Every rupee, logged." fades in |
| exit | The screen fades out over 0.5s as the mark lifts slightly |

It uses theme tokens, so it matches dark and light.

**When it shows:**

- The inline head script in `Base.astro` adds `html.boot` on the **first page load in a browser tab**, tracked in
  `sessionStorage['pl-booted']`. Later navigations in that tab go straight to the page, with only the normal page
  transition.
- It never appears under reduced motion or without JS: the screen is `display: none` unless `html.boot` is set.
- Add `?intro` to any URL to force it, for testing.

**How long it stays:**

- It leaves when the page's `load` event has fired, but no sooner than 1.5s and no later than 3s.
- Both limits count from `window.plBootAt`, the moment the head script ran, so a slow first response doesn't cut
  the animation short.
- While it's up, the page doesn't scroll (`html.boot { overflow: hidden }`).

**What waits for it:**

- The hero's `.rise` entrance is paused while the intro is up, and resumes as it starts to leave.
- `initReveal()` (scroll reveals and count-ups) only starts on the `pl:booted` event, so the home mockup counts up
  in view rather than behind the intro.
- When the intro finishes, the element is removed from the DOM.

## Page transitions

Navigation between pages uses cross-document View Transitions (`@view-transition { navigation: auto; }` in
`global.css`). It needs no JS and simply does nothing in browsers without support.

- The old page fades up and out over 220ms; the new one rises in over 420ms.
- The header and footer have their own `view-transition-name`, so they stay put while the page changes.

## Hero entrance

- `.rise` plays a 0.9s blur-and-slide-up entrance on load.
- Stagger it with an inline `style="--i:n"`; each step adds 110ms of delay.
- The home hero's floating cards also loop gently (`animate-float`, `animate-float-slow`).

## Scroll reveals (`src/scripts/reveal.ts`)

`initReveal()` runs on every page from `Base.astro`. An IntersectionObserver adds `.is-in` to each `[data-reveal]`
element once it is about 12% in view, with the bottom 10% of the viewport excluded. The hidden starting state only
applies under `html.js`, so without JS everything is simply visible.

| Attribute | Starting state |
| --- | --- |
| `data-reveal` | faded, 24px lower |
| `data-reveal="left"` / `"right"` | faded, 32px to the side **from 768px up**; on phones it falls back to the vertical slide |
| `data-reveal="scale"` | faded, scaled to 94% |
| `style="--i:n"` | adds n × 90ms of delay, for staggering siblings |

Inside a revealed block, these follow automatically:

- `.bar > span` fills from left to right (budget bars).
- `.cal-d` cells pop in one by one, staggered by `--c` (the statistics calendar).
- `[data-row]` items slide up one by one, staggered by `--r` (list rows).

**Why sideways slides are desktop-only:** on phones, an element waiting 32px off to the side made the page wider than
the screen, so phones zoomed out or scrolled sideways. `html` and `body` also use `overflow-x: clip` as a backstop.
Never start an animation off-screen sideways on small screens.

## Count-ups

An element with `data-count="<paise>"` (and an optional `data-sign="+"` or `"−"`) counts up from zero when it scrolls
into view: ease-out-quart over 1.4s, formatted as `₹` in `en-IN`. The real value is already in the markup, so it
reads correctly without JS or with reduced motion.

## Other motion

| Where | What |
| --- | --- |
| Buttons | Lift slightly on hover; scale to 97% on press; arrow icons nudge right |
| Cards / feature tiles | Lift on hover; feature icon tiles scale and tilt |
| Play badge | Lifts on hover, with a shadow; the logo scales and tilts |
| FAQ | `<details>` opens smoothly where `::details-content` and `interpolate-size` are supported; the + rotates into an × |
| Theme switch | Cross-fades through `startViewTransition` |
| Mobile menu | Height reveal, ☰→✕ morph, backdrop fade (see [design-system.md](design-system.md#header-and-navigation)) |
| Split calculator | New people, expenses and payment rows slide in (see [split-calculator.md](split-calculator.md#rendering)) |
| Hike story | Scroll-driven scene (see [hike-story.md](hike-story.md)) |
| Record-type switcher | Sliding highlight, amount re-count in the type's colour, rows slide in (see [home-page.md](home-page.md)) |

## Reduced motion

Under `prefers-reduced-motion: reduce`:

- **CSS:** `global.css` cuts every animation and transition to almost nothing, shows all `[data-reveal]` content, and
  turns off view transitions.
- **JS-driven motion** has to check for itself:
  - `reveal.ts` skips count-ups.
  - The theme toggle skips `startViewTransition`.
  - The hike story walks hikers in 0ms.
  - The record-type switcher sets the new amount instantly instead of counting.

Any new JS animation must do the same.
