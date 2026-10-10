# Home page (`/`)

[`src/pages/index.astro`](../src/pages/index.astro): a hero with the app's dashboard mockup, three "habits" (Log
it, See it, Plan it), the split teaser, "Also in the app" cards and the closing CTA band. Most of it is static
mockup markup. This doc covers the parts with behaviour.

## Hero dashboard mockup

[`src/components/PhoneMockup.astro`](../src/components/PhoneMockup.astro) shows the **real dashboard capture**
(light or dark to match the theme) in a phone frame. It loads eagerly, since it's above the fold. The floating
Shopping budget card and the "Arjun pays You ₹2,750" card (≥1000px only) bob gently and quote the same demo data as
the capture. The screenshot has a descriptive `alt`; the floating cards are `aria-hidden`.

## "A look inside" gallery

[`src/components/AppGallery.astro`](../src/components/AppGallery.astro) sits after the split teaser. It shows nine real
captures (add record, statistics, daily calendar, budgets, who pays whom, UPI QR, accounts, export, backup), each
with a short title and line.

- It's a horizontal scroll-snap list: swipe on phones, trackpad or arrow buttons from `md` up.
- The arrow buttons scroll by about one view and disable themselves at the ends.
- Each card fades in on scroll and lifts slightly on hover.
- See [screenshots.md](screenshots.md) for which capture is which.

## "01 · Log it": record-type switcher

[`src/components/RecordTypeDemo.astro`](../src/components/RecordTypeDemo.astro) is a working Expense / Income /
Transfer selector, showing how the three record types differ in the app.

| Type | Amount | Colour | Fields | Note under the fields |
| --- | --- | --- | --- | --- |
| Expense (default) | −₹450.00 | coral `text-expense` | Category Food, Paid from Cash, Repeat Never | Counts towards this month's spending and the Food budget |
| Income | +₹30,000.00 | jade `text-brand` | Category Salary, Received in HDFC Bank, Repeat Every month | Adds to this month's income and repeats on its own every month |
| Transfer | ₹2,000.00 (no sign) | blue `text-transfer` | From HDFC Bank, To Cash, Repeat Never | Moves money between your own accounts; not counted as spending |

The signs and colours follow the app's rules: income is jade with +, expense is coral with −, and a transfer is
neutral blue.

**Behaviour**

- **Selecting a type:**
  - A highlight pill slides behind the selected segment (`translateX` by index).
  - The selected label takes the type's colour.
  - The amount counts up from zero in its new colour (700ms, ease-out).
  - That type's field rows are shown, and slide in one after another.
  - The note changes, and the button reads "Save expense", "Save income" or "Save transfer".
- **First view:** the opening amount counts up the first time the card is 40% on screen.
- **Accessibility:**
  - The segments are a real `role="radiogroup"` with `role="radio"` buttons and `aria-checked`, using roving
    `tabindex`.
  - The arrow keys move between types and select them (wrapping round at the ends); Home and End jump to the first
    and last.
  - The note is `aria-live="polite"`, so screen readers hear what changed. The Save button is decorative
    (`aria-hidden`).
- **Reduced motion:** the amount changes instantly; CSS already removes the slide and fade.

**Editing:** all content lives in the `types` array in the component's frontmatter. The script reads the parts it
needs (`id`, `label`, `paise`, `sign`, `text`, `note`) from the root's `data-types` attribute. **Don't** move that data
into a `<script type="application/json">` tag: Astro rendered its contents as visible page text. Any colour class
used in `text` must appear literally in the source so Tailwind generates it.

## Other sections

- **"02 · See it":** the June calendar cells pop in and the total counts up.
- **"03 · Plan it":** the budget bars fill and the remaining amount counts up.
- **Split teaser:** its payment rows slide in.

All of these use the shared reveal system ([motion.md](motion.md#scroll-reveals-srcscriptsrevealts)) and are
`aria-hidden` mockups.
