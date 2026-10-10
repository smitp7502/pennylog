# Docs

How the PennyLog website behaves and why. These docs are kept current with the code: see the rule in
[`../CLAUDE.md`](../CLAUDE.md#keep-the-docs-current-required).

| Doc | Covers |
| --- | --- |
| [home-page.md](home-page.md) | `/` home page: hero mockup, the Expense / Income / Transfer switcher, section animations |
| [split-calculator.md](split-calculator.md) | `/split` calculator: paise maths, equal shares, greedy settle-up, input rules, rendering, share/copy, mobile result bar |
| [hike-story.md](hike-story.md) | `/split` scroll story for sub-groups: scenario numbers, chapters, scene state machine, walking hikers |
| [hike-assets-brief.md](hike-assets-brief.md) | Prompts, file names and specs for the hike story's illustration assets (one-shot zip prompt + per-asset prompts) |
| [screenshots.md](screenshots.md) | Real app captures and the logo: sources, which screen is used where, how to refresh, and features without captures |
| [releases.md](releases.md) | `/whats-new` release notes: Firestore database, data model, security rules, how to add a release, how the 1.0 history was rebuilt |
| [design-system.md](design-system.md) | Tokens and Tailwind names, theme switching, components, header and mobile menu, layout rules |
| [motion.md](motion.md) | Page transitions, scroll reveals, count-ups, hover motion, reduced motion |
| [privacy-policy.md](privacy-policy.md) | Where each privacy-policy claim comes from in the app, and what to watch |
| [CHANGELOG.md](CHANGELOG.md) | Dated log of behaviour changes |

## Adding a doc

Create `docs/<topic>.md`, add a row here and in the table in `CLAUDE.md`, and log it in `CHANGELOG.md`.
