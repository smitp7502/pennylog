# Split calculator (`/split`)

A one-off "who owes whom" calculator that runs entirely in the browser. It saves nothing: no storage, no network.
Closing the tab loses the group.

- Logic: [`src/scripts/split.ts`](../src/scripts/split.ts)
- Markup: [`src/pages/split.astro`](../src/pages/split.astro) (the `[data-split]` section)

## Model

```ts
Person  = { id, name }
Expense = { id, title, paise, paidBy }   // paidBy is a Person id
state   = { group, nextId, paidBy, people[], expenses[] }
```

- **Money is integer paise** (₹1 = 100 paise) everywhere, so there are no floating-point errors. It is formatted
  only for display, with `toLocaleString('en-IN')` to two decimals, e.g. `₹1,20,000.00`.
- **Every expense is shared equally by everyone currently in the group.** There is no per-expense "split among"
  choice; it was removed to keep adding expenses fast. Uneven splits are what the app's sub-groups are for (see
  [hike-story.md](hike-story.md)).
- Because shares are worked out from the *current* people, adding or removing a person re-splits every existing
  expense among the new set.
- The page starts **empty**: no group name, people or expenses. There is no built-in example or reset button;
  reloading the page clears everything.

## Equal shares and leftover paise

For each expense of `p` paise across `n` people:

```
base = floor(p / n)
rem  = p - base * n          // 0 … n-1 paise left over
```

Everyone's share is `base`; the first `rem` people, in group order, pay one extra paisa. The shares always add up to
exactly `p`.

Each person's **net balance** = what they paid − the sum of their shares. Positive means they get money back;
negative means they owe. The nets always sum to zero.

## Settle-up (who pays whom)

A greedy match, repeated until nobody is owed:

1. Pick the person who owes the most (most negative net) and the person owed the most (most positive net).
2. The debtor pays the creditor `min(debt, credit)`.
3. Update both balances; one of them reaches zero.

Each round settles at least one person, so it finishes in at most `n − 1` payments. That is usually, but not always,
the theoretical minimum. A loop guard stops it after 500 rounds.

**Worked example** ("Night out"): dinner ₹492 paid by Het, movie ₹450 paid by Aaditya, chai ₹78 paid by
Smit, among 5 people. The total is ₹1,020, or ₹204 each. Nets: Het +₹288, Aaditya +₹246, Smit −₹126, Haresh −₹204,
Manan −₹204. Result: **4 payments** (Haresh → Het ₹204, Manan → Aaditya ₹204, Smit → Het ₹84, Smit → Aaditya ₹42).

## Input rules

**People**

- One field takes several names separated by commas: `Riya, Kabir, Zoe`. Each name is trimmed and cut to 20
  characters.
- Duplicates are skipped, compared case-insensitively against the group and within the same entry. A note names
  what was skipped ("riya is already in the group.").
- A person who **paid** for an expense can't be removed (their × is disabled) until that expense is deleted. Anyone
  else can be removed at any time.

**Expenses**

- **Amount**: commas, `₹` and spaces are stripped, then parsed. It must be greater than 0 and is rounded to the
  nearest paisa. Invalid amounts disable **Add expense**.
- **Paid by**: a native `<select>` of the people. It remembers the last payer between expenses.
- **What for?**: optional; defaults to "Expense".
- **Add expense** is disabled with a hint until there are at least 2 people and a valid amount. Below the button, a
  line previews the share: "₹100.00 each for 3 people".
- After adding, the amount and title clear and focus returns to **Amount**, ready for the next expense.
- The expense list shows the newest expense first.

## Rendering

- `render()` recomputes everything from state and rewrites the dynamic regions with `innerHTML`. All user text goes
  through `esc()` first. The text inputs are never re-rendered, so typing isn't interrupted.
- **Focus** is kept across re-renders: the focused `[data-action][data-id]` button is found again and refocused.
- **Animations run only for new things.** People and expenses slide in once, tracked in a `seen` set: person ids are
  stored as-is, expense ids negated. Payment rows replay their entrance only when the set of payments actually
  changes, compared as JSON.
- Person colours cycle through 7 category hues by id (`HUES[(id - 1) % 7]`). The same hues are used for avatars
  across the site.

## Result, summary and sharing

- **Result panel**: a headline ("Add an expense to start", "Everyone is even", "1 payment settles everyone",
  "N payments settle everyone"), total and per-head figures, the payment list, and each person's balance ("gets
  back", "owes" or "settled").
- **Summary card**: a fixed light-palette card that mirrors the image the app shares, whatever the theme.
- **Share**: uses `navigator.share` (text) where available; otherwise it copies the text instead.
- **Copy text**: uses `navigator.clipboard`. If that is blocked, a read-only textarea appears so the text can be
  copied by hand.
- The share text format: title line, total and people count, "Who paid" lines, "Who pays whom" lines, then
  "Made with PennyLog" and the Play Store URL.

## Mobile result bar

On screens below `lg` (1024px), a bar pinned to the bottom shows the live headline and a **See who pays** button that
scrolls to the result panel. It is shown only when all of these are true (`syncBar()`):

| Condition | Source |
| --- | --- |
| There is at least one expense | `render()` |
| The result panel is off screen | IntersectionObserver on `#result-zone` |
| No input, select or textarea in the tool has focus | `focusin` / `focusout` on `[data-split]`, so the bar never covers the keyboard or form |
| The reader is still in the tool section | IntersectionObserver on `[data-split]` with a −40% bottom margin, so it doesn't float over the hike story |

The section has extra bottom padding on phones so its last controls can scroll clear of the bar. The result panel
has `scroll-mt-20` (`md:scroll-mt-24`) so the sticky header doesn't cover it after the jump.

## Differences from the app

The app saves groups and people, supports sub-groups (uneven splits), adds a UPI QR to each payment, and can mark a
group settled. The page's "In the app" section and the hike story say so; keep them accurate if the app changes.
