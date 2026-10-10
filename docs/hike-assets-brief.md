# Hike story: illustration asset brief

The [hike story](hike-story.md) is currently drawn with simple inline SVG shapes. This brief describes the artwork
that will replace them. It has two parts:

1. **[One-shot prompt](#1-one-shot-prompt-everything-in-one-zip):** paste it into an assistant that can both make
   images and run code (for example ChatGPT with image generation). It produces every asset and returns one zip.
2. **[Per-asset prompts](#2-per-asset-prompts-for-any-image-tool):** for tools that make one image at a time
   (Midjourney, Ideogram, Firefly, …). Prepend the style block to each prompt and save the result under the given
   file name.

**Why separate layers:** the scene is animated in code. Hikers walk along the trail, the cab drives in and out, and
clouds drift. Price cards, badges and sub-group rings are drawn on top. So every moving thing must be its own image
with a transparent background, and the scene must leave empty sky where the overlays go.

**Exact placement doesn't need to be perfect.** Once the files arrive, the hikers' trail waypoints and prop
positions are recalibrated to whatever the art shows. Getting the *style and consistency* right matters more.

---

## 1. One-shot prompt (everything in one zip)

Copy everything inside the box.

````text
You are producing a complete illustration asset pack for an animated, scroll-driven story on a fintech website
(PennyLog, an Indian expense-tracker app). Generate every image listed below, process them with code so they match
the exact specs, verify them, and give me ONE zip file named `pennylog-hike-assets.zip`.

## The story (for context)
Four Indian friends in their twenties go on a day hike in the Western Ghats on a sunny morning. They share a cab to the
trailhead. On the trail, Aarav and Diya race ahead to the summit and eat a meal at a tiny summit café. Kabir and Meera
take it slow and stop for chai and biscuits at a little roadside chai stall halfway up. Later they split the costs.

## Global style (apply to EVERY image)
- Flat vector illustration with soft gradients and a very subtle grain texture. Rounded, friendly shapes. No black
  outlines. Clean modern fintech-app illustration look; warm and optimistic.
- Time of day: a clear sunny late morning. Sun in the upper-left; light comes from the upper-left, so shadows fall down-right.
- Palette: sky blue #4A9FD8 → #96CEEC → pale haze #DEF0F4; far mountains hazy blue #92B8C8; near hills #68A080;
  main mountain green #52925E with lighter ridges #78B470; snow #F8FCFC; ground #4A884E; dirt trail #EED6A0;
  accents: gold sun #F5B942, coral #FF8070, jade #34D3A6.
- NO text, letters, numbers, logos or watermarks anywhere, including on signs, the café and the cab. Signs are
  blank boards.
- Characters and props are seen from the side, in a slight 3/4 view, facing RIGHT (the trail climbs left to right).
- All characters share exactly the same scale, proportions and rendering style.

## Characters (keep identical across every pose; design a reference sheet for each first, then reuse it)
- AARAV: man, 25, light-brown skin, short black hair with a sky-blue cap, sky-blue windcheater #5CC8FF, dark-navy
  trekking pants, navy backpack #2B7FB0, grey trekking shoes, a wooden trekking pole in his right hand.
- DIYA: woman, 24, medium-brown skin, long black hair in a high ponytail, pink windcheater #FF85B3, black leggings,
  maroon backpack #B04A72, white trekking shoes, a small water bottle clipped to her bag.
- KABIR: man, 26, warm-brown skin, curly black hair, short beard, round glasses, lime-green t-shirt #B5E26A over a
  white long-sleeve, khaki pants, olive backpack #6E9A2E, a bandana around his neck.
- MEERA: woman, 25, deep-brown skin, black hair in a bun, orange windcheater #FF9F5A, dark-teal pants, rust
  backpack #B4602A, small silver earrings, a sun hat hanging on her back.

## Exact file list (folder / file name, then canvas size in px, then background)
All PNG, sRGB, 8-bit RGBA. "transparent" = real alpha transparency, nothing outside the subject.

scene/ (all five layers share ONE 1600×1200 canvas and must line up exactly when stacked in this order)
1. scene/hike-sky.png 1600×1200 OPAQUE: clear daytime sky gradient only. Soft warm glow upper-left around
   (280,300) but draw no sun disc (the sun is a separate layer). No stars, no clouds, no birds.
2. scene/hike-mountains-far.png 1600×1200 transparent: a distant jagged range across the full width, peaks between
   y=480 and y=720, colour #1C3442 with slight atmospheric haze.
3. scene/hike-hills-near.png 1600×1200 transparent: rolling nearer hills across the full width, tops between
   y=820 and y=960, colour #24474F, a few tiny pine silhouettes.
4. scene/hike-mountain-main.png 1600×1200 transparent: the hero mountain, rising from the lower left to the upper
   right. Its foot starts around x=340 at y=1090. It climbs to a FLAT summit plateau from x=1140 to x=1380 at y≈296,
   lightly snow-capped at the edges, then falls away to the right edge. Halfway up, at about (700–840, 730–760),
   there is a small FLAT grassy ledge, wide enough for two people and a tiny stall just to its right around
   (880–960, 640–700). A visible light dirt trail (#F3E3B5) zig-zags from the foot (x≈350, y≈1095) through the ledge
   to the plateau. Keep the sky area from x=380 to 900, y=380 to 540 clear of mountain detail (text overlays go
   there).
5. scene/hike-ground.png 1600×1200 transparent: only a foreground strip from y=1080 to y=1200 across the full
   width: grass, a few small rocks and wildflowers, the trailhead clearing on the left (x 0–340). Nothing above
   y=1060.

ambient/
6. ambient/hike-sun.png 240×240 transparent: a soft golden sun disc #F5B942 with a gentle glow, centred.
7. ambient/hike-cloud-1.png 480×200 transparent: fluffy flat cloud, white, slightly translucent.
8. ambient/hike-cloud-2.png 360×160 transparent: smaller cloud, same style.
9. ambient/hike-cloud-3.png 280×120 transparent: wispy small cloud.
10. ambient/hike-bird-up.png 96×64 transparent: a small dark bird silhouette #2C3E4A, wings UP, flying right.
11. ambient/hike-bird-down.png 96×64 transparent: the same bird, wings DOWN (second frame of a flap).

props/ (each sits on the bottom edge of its canvas: lowest point 8px above the bottom, centred horizontally)
12. props/hike-cab.png 400×200 transparent: a compact Indian hatchback taxi, yellow #F5B942 body with a black lower
    stripe, side view facing right, windows dark navy, a roof carrier with two small bags. No text, no plate number.
13. props/hike-trail-sign.png 160×220 transparent: a wooden trailhead signpost with two blank arrow boards
    pointing right and up-right.
14. props/hike-summit-cafe.png 320×280 transparent: a tiny mountain café hut, stone base, timber walls, terracotta
    roof, a small chimney, a bench and a little table with two steel thali plates outside, prayer flags on a string.
    No text on any sign.
15. props/hike-chai-stall.png 300×260 transparent: a small roadside Indian chai tapri: a wooden cart with a
    yellow-and-white striped canopy, a steaming kettle on a small stove, glass chai cups, a jar of biscuits, a small
    bench. No text.
16. props/hike-summit-flag.png 120×220 transparent: a thin pole with a small coral #FF8070 triangular pennant
    flying right, planted in a little cairn of stones.

hikers/ (every pose canvas is 256×384 transparent. FEET touch a ground line at y=372, body centred at x=128,
character facing right. Head-to-toe height: men 330px, women 316px. Same scale in every file.)
For EACH character (aarav, diya, kabir, meera) make these six poses:
17–40. hikers/hike-<name>-<pose>.png where <pose> is:
  - idle: standing relaxed, holding backpack straps, looking ahead.
  - walk-1: mid-stride, LEFT leg forward, arms swinging naturally.
  - walk-2: mid-stride, RIGHT leg forward (the second frame of the walk cycle; same framing as walk-1).
  - eat: aarav and diya are seated on a low stool eating from a steel thali plate. kabir and meera are standing,
    holding a small glass of steaming chai and a biscuit.
  - react: aarav and diya look slightly sheepish (hand behind the head, awkward smile). kabir and meera look
    surprised and unimpressed (raised eyebrows, palm up, "really?").
  - happy: big smile, thumbs up, relaxed stance.


## Processing (do this with code after generating)
1. For every transparent asset, remove any background so it has real alpha transparency. Trim, then place the
   subject on the exact canvas using the placement rules above (props: bottom-centred with 8px padding; hikers: feet
   on y=372, centred at x=128).
2. Resize every file to its exact pixel size without distorting the aspect ratio (scale to fit, then pad with
   transparency).
3. Make the four hikers' poses consistent: within each character, all six poses at the same scale; across
   characters, the heights stated above.
4. Check that the five scene/ layers line up when composited in order (sky, mountains-far, hills-near,
   mountain-main, ground). Save the composite as preview/hike-scene-composite.png (1600×1200), plus a contact sheet
   of all hiker poses as preview/hike-hikers-sheet.png.
5. Write manifest.json at the zip root. It lists every file with: path, width, height, hasAlpha, and for hikers and
   props, the anchor point (the feet or base) in px. For hike-mountain-main.png, also give the pixel coordinates you
   actually used for: trail start, halfway ledge centre, chai stall spot, plateau left end, plateau right end, café
   spot, and 6–10 points along the painted trail from bottom to top.
6. Verify: correct sizes, alpha where required, no text anywhere, all 40 files plus 2 previews and the manifest
   present. Fix anything that fails, then zip.

## Output
One zip, `pennylog-hike-assets.zip`, containing the folder `pennylog-hike-assets/` with the subfolders scene/,
ambient/, props/, hikers/, preview/ and manifest.json, using the file names above exactly (lowercase,
hyphens). Then show me the composite preview and the hiker contact sheet.
````

---

## 2. Per-asset prompts (for any image tool)

Prepend this **style block** to every prompt below:

> Flat vector illustration with soft gradients and very subtle grain, rounded friendly shapes, no black outlines,
> modern fintech-app illustration style, sunny daylight from the upper-left. Palette: sky #4A9FD8 #96CEEC #DEF0F4,
> hazy far hills #92B8C8, greens #68A080 #52925E #78B470, snow #F8FCFC, dirt #EED6A0, gold #F5B942,
> coral #FF8070, jade #34D3A6. No text, letters, numbers, logos or watermarks.

For transparent assets, add "isolated on a transparent background" (or "on a plain flat #FF00FF magenta
background" if the tool can't do transparency; it can be keyed out later).

### Scene layers (1600×1200, must line up)

| File | Prompt |
| --- | --- |
| `scene/hike-sky.png` | Wide clear daytime sky, smooth gradient from bright blue at the top to pale haze at the horizon, soft warm glow on the upper-left, no stars, no clouds, no sun disc, no land. |
| `scene/hike-mountains-far.png` | A distant jagged mountain range spanning the full width, peaks in the middle third of the image, deep blue-green with atmospheric haze, nothing else, transparent background. |
| `scene/hike-hills-near.png` | Rolling nearer hills across the full width in the lower third, darker teal-green, a few tiny pine silhouettes, transparent background. |
| `scene/hike-mountain-main.png` | A single hero mountain rising from the lower-left foot to a flat snow-edged summit plateau in the upper right, falling away to the right edge. A small flat grassy ledge halfway up the slope, with room for a tiny stall just to its right. A light dirt trail zig-zags from the foot through the ledge to the plateau. Empty sky above the left half. Transparent background. |
| `scene/hike-ground.png` | Only a foreground strip along the bottom tenth: grass, small rocks, wildflowers, a trailhead clearing on the left. Everything above it transparent. |

### Ambient

| File | Size | Prompt |
| --- | --- | --- |
| `ambient/hike-sun.png` | 240×240 | Soft golden sun disc with a gentle glow, centred. |
| `ambient/hike-cloud-1.png` | 480×200 | Fluffy flat stylised cloud, off-white, slightly translucent. |
| `ambient/hike-cloud-2.png` | 360×160 | Smaller fluffy cloud, same style. |
| `ambient/hike-cloud-3.png` | 280×120 | Small wispy cloud, same style. |
| `ambient/hike-bird-up.png` | 96×64 | Small dark bird silhouette, wings raised, flying right. |
| `ambient/hike-bird-down.png` | 96×64 | The same bird, wings lowered (second flap frame). |

### Props (subject bottom-centred, 8px above the bottom edge)

| File | Size | Prompt |
| --- | --- | --- |
| `props/hike-cab.png` | 400×200 | Compact Indian hatchback taxi, yellow body with a black lower stripe, side view facing right, dark windows, a roof carrier with two small bags, no text or number plate. |
| `props/hike-trail-sign.png` | 160×220 | Wooden trailhead signpost with two blank arrow boards pointing right and up-right. |
| `props/hike-summit-cafe.png` | 320×280 | Tiny mountain café hut, stone base, timber walls, terracotta roof, small chimney, bench and little table with two steel thali plates outside, prayer flags; no text. |
| `props/hike-chai-stall.png` | 300×260 | Small Indian roadside chai tapri: wooden cart, yellow-and-white striped canopy, steaming kettle on a small stove, glass chai cups, a jar of biscuits, a small bench; no text. |
| `props/hike-summit-flag.png` | 120×220 | Thin pole with a small coral triangular pennant flying right, planted in a little cairn of stones. |

### Hikers (256×384 each, feet on y=372, centred, facing right)

Generate a **reference sheet** for each character first, then reuse it for every pose so the faces and clothes stay
identical. Character descriptions:

- **Aarav**: man, 25, light-brown skin, short black hair, sky-blue cap, sky-blue windcheater #5CC8FF, dark-navy pants, navy backpack, wooden trekking pole.
- **Diya**: woman, 24, medium-brown skin, long black hair in a high ponytail, pink windcheater #FF85B3, black leggings, maroon backpack, water bottle on the bag.
- **Kabir**: man, 26, warm-brown skin, curly black hair, short beard, round glasses, lime-green t-shirt #B5E26A over a white long-sleeve, khaki pants, olive backpack, neck bandana.
- **Meera**: woman, 25, deep-brown skin, black hair in a bun, orange windcheater #FF9F5A, dark-teal pants, rust backpack, sun hat hanging on her back.

| File (`<name>` = aarav, diya, kabir, meera) | Pose |
| --- | --- |
| `hikers/hike-<name>-idle.png` | Standing relaxed, holding the backpack straps, looking ahead. |
| `hikers/hike-<name>-walk-1.png` | Mid-stride, left leg forward, arms swinging. |
| `hikers/hike-<name>-walk-2.png` | Mid-stride, right leg forward (second walk frame, same framing). |
| `hikers/hike-<name>-eat.png` | Aarav and Diya: seated on a low stool eating from a steel thali. Kabir and Meera: standing with a glass of steaming chai and a biscuit. |
| `hikers/hike-<name>-react.png` | Aarav and Diya: sheepish, hand behind the head, awkward smile. Kabir and Meera: surprised and unimpressed, eyebrows raised, palm up. |
| `hikers/hike-<name>-happy.png` | Big smile, thumbs up, relaxed stance. |

That's 24 files: 4 characters × 6 poses.


---

## Status

The pack was delivered on 2026-10-09 and is in use, recoloured to daytime. The chapter vignettes that were originally part of
this brief were dropped from it. What was used, fixed and left out is recorded in
[hike-story.md → Artwork](hike-story.md#artwork). To regenerate or extend the art, keep the file names and canvas
sizes above; the scene code depends on them.
