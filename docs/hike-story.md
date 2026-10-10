# Hike story: sub-groups explained (`/split`)

A scroll-driven, illustrated story below the split calculator. It shows why an equal split is unfair when only some
people share a cost, and how the app's **sub-groups** fix it.

- Component: [`src/components/HikeStory.astro`](../src/components/HikeStory.astro): data, SVG scene, chapters, scoped CSS and script in one file.
- Used in: `src/pages/split.astro`, between the calculator and the "In the app" section.
- Artwork: [`src/assets/hike/`](../src/assets/hike/), generated from [hike-assets-brief.md](hike-assets-brief.md). See [Artwork](#artwork) below.

## The scenario and its numbers

Four friends, each with a fixed hue: Aarav (sky), Diya (pink), Kabir (lime), Meera (orange).

| Cost | Amount | Paid by | Shared by |
| --- | --- | --- | --- |
| Cab to the trail | ₹1,200 | Aarav | all four |
| Summit café meal | ₹640 | Diya | Aarav, Diya (sub-group "Summit") |
| Chai and biscuits | ₹120 | Meera | Kabir, Meera (sub-group "Halfway") |

| | Aarav | Diya | Kabir | Meera |
| --- | --- | --- | --- | --- |
| Split equally (₹1,960 ÷ 4) | ₹490 | ₹490 | ₹490 | ₹490 |
| With sub-groups | ₹620 | ₹620 | ₹360 | ₹360 |

With an equal split, Kabir and Meera each pay **₹130** towards a café meal they never ate. With sub-groups, the same
greedy settle-up as the calculator gives **3 payments**: Kabir → Aarav ₹360, Meera → Aarav ₹220, Meera → Diya ₹20.

**If you change any amount, recompute everything**: the table rows, chapter text, the scene's badges (`eq` / `fair`
on each hiker), the verdict pills, `fairPays` and the "+₹130" tags. Use the algorithm in
[split-calculator.md](split-calculator.md#settle-up-who-pays-whom). The comment at the top of the component lists
the current results.

The app's real wording is used for the how-to steps: "New sub-group", "Add sub-group expense", and "Shared and
sub-group costs are combined so each person pays once." Check the Flutter app's `features/split_expense` before
changing them.

## Chapters

| # | Caption | What the scene does | Poses |
| --- | --- | --- | --- |
| 1 | 6:30 am · Trailhead | Hikers stand by the trail sign; the cab drives in the first time the scene is on screen; the cab cost card pops up | all `idle` |
| 2 | 8:00 am · On the trail | The cab drives off, then the hikers walk the trail in single file (stride frames). Aarav and Diya go to the summit, by the café; Kabir and Meera stop on the halfway ledge by the chai stall | `walk-1`/`walk-2` while moving, then `idle` |
| 3 | 10:15 am · Summit café | The café pulses, steam rises, and the ₹640 card pops up | Aarav and Diya `eat` (thali) |
| 4 | 10:40 am · Halfway | The chai stall pulses and steams, and the ₹120 card pops up | all four `eat` (thali / chai) |
| 5 | Evening · Back home | A "₹1,960 ÷ 4 = ₹490 each" pill appears; ₹490 badges show over each hiker, coral for the two who overpay, who also shake their heads | all `react` |
| 6 | In the PennyLog app | Dashed "Summit" and "Halfway" rings mark each pair, the badges switch to ₹620 / ₹360 in jade, a "3 payments settle everyone" pill appears, and everyone hops | all `happy` |

After the chapters comes the "Split it the way the day actually went" box: three steps for the app, plus the Play
badge.

## Artwork

All art is flat-colour PNG in [`src/assets/hike/`](../src/assets/hike/), set on a **sunny day**. In the frontmatter, `getImage()` turns each
file into an optimised WebP URL, which the SVG uses through `<image href>`. The 40 files come to about 300 KB as WebP.

| Folder | Files | How it's used |
| --- | --- | --- |
| `scene/` | `hike-sky`, `-mountains-far`, `-hills-near`, `-mountain-main`, `-ground` (1600×1200) | Stacked full-size in that order; the 400×300 viewBox is the art at 1/4 scale |
| `ambient/` | `hike-sun`, `hike-cloud-1..3`, `hike-bird-up`, `hike-bird-down` | Sun glows, clouds drift, two birds glide while their wing frames alternate |
| `props/` | `hike-summit-flag`, `hike-summit-cafe`, `hike-chai-stall`, `hike-trail-sign`, `hike-cab` | Placed by base anchor and scale in `propDefs` / `cab` |
| `hikers/` | `hike-<name>-<pose>` for aarav, diya, kabir, meera × idle, walk-1, walk-2, eat, react, happy (256×384, feet at 128,372) | Drawn 48 units tall; all six poses are stacked and only the current one is visible |

**Fixed after delivery:** the delivered `hike-mountain-main.png` had a stray hut and a green bracket glitch halfway up.
Both were removed with a script that rebuilt the ridge line and repainted the trail; the version in `src/assets` is
the cleaned one. `hike-aarav-eat` and `hike-diya-eat` were broken (a detached leg and a floating plate), so they were
rebuilt from the idle pose with a thali added. The six chapter vignettes, the previews and the manifest were not
used and have been deleted; the site needs only the 40 files in `src/assets/hike/`.

**Daytime:** the pack was delivered as a dawn/night scene and recoloured to daytime with a script. The sky was
repainted; every other layer had each flat colour mapped to a day colour, with edge pixels shifted by the same amount.

| Layer | Day colours |
| --- | --- |
| Sky | gradient `#4A9FD8` → `#96CEEC` → `#DEF0F4`, warm glow `#FFECB3` around the sun at (280, 300) |
| Far mountains | `#92B8C8`, shade `#7AA3B8` |
| Near hills | `#68A080`, pines `#386E52` |
| Main mountain | slope `#52925E`, ridge `#78B470`, trail `#EED6A0`, snow `#F8FCFC` |
| Ground | `#4A884E` / `#5C9856`, rocks `#B0B6AC` |
| Birds / clouds | birds dark `#2C3E4A` (to show on a light sky), clouds white |

On top of the art, the white cost cards, badges and verdict pills get a soft drop-shadow so they stand out against
the sky. The steam is grey, and the card behind the scene is sky blue `#96CEEC` while images load.

**Key positions** (viewBox units, from `manifest.json` ÷ 4):

| Spot | Position |
| --- | --- |
| Trail | `TRAIL` in the script, 10 points from (87.5, 272.5) to (292.5, 87.5) |
| Hikers' start | x = 30, 44, 58, 72 on y = 273 |
| Summit pair | Aarav (295, 75), Diya (307, 75), in front of the café at (328, 75.5) |
| Halfway pair | Kabir (190, 189.5), Meera (205, 187), on the flat stretch of trail; chai stall at (226, 178) |

## How it works

### State on the `<svg class="scene">`

The script drives everything through attributes and classes on the SVG; all visuals are CSS that reacts to them:

| Hook | Meaning |
| --- | --- |
| `.armed` | JS is running. Without it, chips, badges and rings stay at their defaults (no-JS fallback) |
| `.inview` | The scene has been on screen once (IntersectionObserver, 35%). Triggers the cab drive-in and the cab chip |
| `data-step="n"` | Current chapter, 1–6. Used for things that appear in **one** chapter only (place pulses, the verdict pills, coral badges in step 5) |
| `.ge1` … `.ge6` | "Step ≥ n". Used for things that appear from a chapter **onward** (chips accumulate, cab gone from ≥2, rings from 6) |

### Picking the active chapter

On scroll (throttled with `requestAnimationFrame`) and on resize, the active chapter is the **last one whose card
top has passed a reading line**:

- Desktop (≥1024px): the line is at 55% of the viewport height, beside the sticky scene.
- Below that: it is at 78%, because the scene is pinned at the top of the screen and the text is read below it.

The active chapter gets `data-active` (full opacity; others are 40%). The progress dots and the caption under the
scene update to match.

### Walking the hikers

Hikers are SVG groups positioned with a CSS `transform: translate(x, y)` in viewBox units (400 × 300; feet at the
given point). `routes` in the script holds each hiker's waypoints, built from the shared `TRAIL` plus their start
and end spots.

The scene only has two positions: `base` for step 1 and `split` for steps 2 and up. When that changes, every hiker is
animated along its route, or the reverse route, with the Web Animations API:

- Keyframe offsets are proportional to segment length, so the pace stays even.
- Duration is `max(900ms, length / 130 units per second)`, eased in-out.
- They set off in **single file**: uphill, 450ms after the cab starts pulling away, then Aarav, Diya, Kabir and Meera
  320ms apart. Downhill, the order reverses.
- While moving, a hiker has `.walking`, which alternates the `walk-1` and `walk-2` sprites every 190ms. On the way
  back down it also has `.downhill`, which mirrors the sprite so they face the way they walk.
- On finish, the final transform is written to `style`, the walking classes are removed, and the animation is
  dropped. If the direction flips mid-walk, the running walk is finished instantly and its pending start timer is
  cancelled.

### Poses

`poseFor(id, step)` decides each hiker's `data-pose` (idle, eat, react, happy). CSS shows only the matching sprite,
with a 0.25s cross-fade. Walking overrides the pose, and the frames switch instantly with no fade. Chapter 5 adds a
head-shake for the two who overpay (`.over`); chapter 6 adds a staggered hop for everyone.

Scrolling back up to chapter 1 walks everyone back down.

### Layout

- **Desktop:** two columns. The scene sticks at `top-24`; each chapter is at least 78vh tall to give it scroll room.
- **Below 1024px:** the scene is sticky under the header (`top-[69px]`, or `md:top-[84px]`) on an opaque strip, so
  the chapters scroll beneath it. Its width is capped at `calc(44vh * 4 / 3)` so it never takes more than about
  half the screen. Chapters are at least 62vh.

### Motion and accessibility

- Ambient loops: sun glow, three drifting clouds, two gliding birds with flapping wings, a swaying flag, and the
  "marching ants" on the sub-group rings.
- With reduced motion: hikers jump instead of walking (duration 0), the ambient loops, head-shake and hop stop, and
  every chapter stays at full opacity.
- The SVG has `role="img"` with a `<title>`. All the facts are also in the chapter text, so nothing depends on the
  picture.

## Editing the scene

- Coordinates are in the 400 × 300 viewBox. Keep cost chips and badges clear of each other at the hikers' end
  positions. Each hiker's `bx` offsets its badge sideways for exactly this; Aarav and Diya stand close at the summit.
- To add a chapter: add an entry to `chapters`, add any new scene elements with `ge<n>` / `data-step` rules in the
  component's `<style>`, set the poses in `poseFor`, and give a new location its own waypoints in `routes`. Then
  update the chapter table above.
- To replace art: keep the file names and canvas sizes (or update the sizes and anchors in the frontmatter), drop
  the files into `src/assets/hike/`, and re-check the positions table above against the new art.
- To add a pose: add it to `poses` in the frontmatter, add a file per hiker, and add a
  `.hiker[data-pose='<pose>'] .p-<pose>` rule.
