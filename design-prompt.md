# Design Prompt — Lorcana Fan Site

Drop this prompt into Claude Design (or any design AI). It's self-contained — the design tool doesn't have access to our spec files.

---

## Project

I'm building **a fan website for Disney Lorcana** (a trading card game by Ravensburger / Disney). Three main features:

1. **News** — a blog about Lorcana set releases, tournament reports, rules updates.
2. **Card encyclopedia** — a searchable, filterable index of every Lorcana card (~15,000 cards across multiple sets).
3. **Draft simulator** — 4-8 friends join a room by code, open simulated booster packs, pick cards together over WebRTC. They then play with physical cards offline. We are not simulating the game itself, only the pack-opening and picking phase.

The site is **bilingual (English + French)** at launch. Built on Drupal 11 with a custom theme + one embedded React app for the draft simulator.

## Audience & tone

- **Casual players** looking up cards on their phone.
- **Drafters** — friend groups doing a remote pre-draft before getting together physically. Mostly on phones during a Friday-night Discord call.
- The tone is **fan-made but professional**: warm, knowledgeable, playful, not corporate. Think a great hobby site, not an enterprise product.

## Hard constraints

- **Mobile-first** across every screen, including the draft simulator. Many drafters will be on a phone in their kitchen.
- **We cannot use Disney or Ravensburger logos, marks, or official artwork** beyond the card images themselves (which are licensed under Ravensburger's Community Code Policy for fan-site use). Our own brand identity must be original.
- **Accessibility target: WCAG 2.2 AA** for news and encyclopedia. Color cannot be the only meaning-carrier — ink colors always come with labels and icons.
- A small footer disclaimer must always be visible: "This site is an unofficial, non-commercial fan project and is not published, endorsed, or specifically approved by Disney or Ravensburger." The footer also holds links to About, Legal, Contact, plus a language switcher (EN/FR) and a light/dark mode toggle.
- No analytics or ads at launch. No paid tiers, ever.

## The Lorcana visual vocabulary you should know

Lorcana cards have **six "ink colors"** (the game's resource system). Each has a strong color identity. Designs should use them as accent colors, never as the dominant palette:

| Ink | Hex (approx) | Vibe |
|---|---|---|
| Amber | `#F4B042` | warm gold |
| Amethyst | `#A56FCF` | royal purple |
| Emerald | `#3D9F6A` | rich green |
| Ruby | `#D14B4B` | bold red |
| Sapphire | `#3B7BC4` | deep blue |
| Steel | `#8C9AA3` | cool gray |

Cards have these intrinsic attributes that should be reflected in card-display components:
- **Cost** (a number, 0-10)
- **Ink color** (one of the six)
- **Strength / Willpower / Lore** (combat numbers, on Characters)
- **Card type** (Character, Action, Item, Location, Song)
- **Rarity** (Common, Uncommon, Rare, Super Rare, Legendary, Enchanted, Promo)
- **Classifications** (Hero, Villain, Princess, Floodborn, etc. — like sub-types)
- **Keywords / abilities** (Bodyguard, Challenger, Evasive, Rush, Singer, Shift, etc.)

The cards themselves have a distinctive ornate-fantasy frame (gold filigree, Disney-storybook feel). **Our site UI should not try to imitate that** — it should be a clean, modern contemporary feel that lets the cards' own art shine through, similar to how Scryfall feels next to a Magic: The Gathering card.

## Style references

These are sites I admire — please look them up, study them, and synthesize:

- **scryfall.com** — the gold standard for TCG card search. Dense information, fast, search-syntax-friendly, clean.
- **lorcast.com** — already exists as a Lorcana search engine; clean, minimal, modern.
- **dreamborn.ink** — Lorcana-focused, more playful aesthetic.
- **17lands.com** — MTG draft analytics; great info-dense data UI.
- **edhrec.com** — community feel, lots of card thumbnails.

What I want is something that **feels like a great hobby site**: confident, knowledgeable, a bit playful, not trying to be corporate or AAA-gaming. The card art carries the heavy visual lift; our chrome should be elegant and stay out of the way.

## Screens to design

Please produce mockups for these screens. **Both 375×812 (mobile) and 1280×800 (desktop)** for each — mobile is the primary; desktop is the "scales up" case.

### Public site

1. **Homepage** — site nav, recent news teasers, a "popular cards" section, a "start a draft" CTA. Show how news + cards + draft all coexist on one landing page.
2. **News listing** (`/news`) — paginated list of news article teasers with filters (category, language).
3. **News article detail** — long-form article with hero image, body text, inline card-reference chips that show a hover-preview on desktop / tap-preview on mobile.
4. **Card encyclopedia landing** (`/cards`) — faceted search:
   - Search bar with autocomplete (suggests card names with thumbnails).
   - Facets sidebar (desktop) / drawer (mobile): Ink, Type, Rarity, Cost, Keywords, Classifications, Set. Each facet shows counts.
   - Results grid: cards as thumbnails. Toggle between Grid and List view.
   - Sort options: Name, Cost, Lore, Strength, Willpower, Release date.
5. **Card detail page** — one card. Large hero image, stats panel, rules text with inline iconography (ink/exert/lore icons), flavor text, set + collector number, rarity, illustrator, "Where to buy" link (TCGPlayer), "Related news" section, **"Other printings" horizontal strip** (when a card has alternate-art / Enchanted / promo variants — they're modeled as separate cards but visually grouped here), and a small **"Report a problem with this card"** footer link.
6. **Set landing page** (`/sets/{code}`) — gallery of all cards in a set, organized by rarity, filterable by ink.
7. **About page** — fan-status disclosure, who runs the site.
8. **Legal page** — full disclaimer, attribution, link to Ravensburger's Community Code Policy.
9. **Contact page** (`/contact`) — short form (subject, message, optional email).
10. **"Report a problem" form** (opens from the card detail page link) — pre-fills the card context; user describes the issue, optional email.
11. **404 + 500 error pages** — keep them on-brand and a little playful.

### Draft simulator (the big one)

10. **Draft landing** (`/draft`) — two big CTAs: "Create room" and "Join room (enter code)". Brief explainer of how it works.
11. **Create room form** — pick set, pick player count (2-8), pick pack count (default 4), pick pseudonym, optional "long code mode" toggle. Lock-room and kick-from-lobby controls.
12. **Lobby** (mobile + desktop) — large room code (with copy button), share-link / share-via-OS button (mobile only), roster of connected players with their pseudonyms + connection status indicator, host-only "Start draft" button (greyed for non-hosts), "Lock room" toggle for host.
13. **Active draft view** (mobile-first, primary focus) — the **most important screen**:
    - Top bar: "Pack 1 of 4 · pick 3 of 12 · ⏱ 0:47" + a roster pill.
    - Pack grid: 12 cards in a 3-wide grid, vertically scrolling on mobile.
    - **Tap a card → full-screen preview with a "Pick" button** (two-tap pattern to prevent mis-fires).
    - Bottom sheet drawer ("My picks (N)"): swipes up to reveal your accumulated pool, grouped by ink color.
    - Roster pill → tap opens an overlay of all players with connection status and turn indicators.
14. **Pack rotation animation** — show the moment a pack passes from one player to the next. (Storyboard frames.)
15. **End-of-draft screen** — your 48-card pool, with an interaction to mark which 40 to play. Export options: CSV download, image, and a share-link (URL with the pool encoded — no server-side storage). The export options should be visually prominent — **drafts are never saved server-side, so this is the one chance to take the pool away with you.**
16. **Reconnect screen** — what a player sees when they lose connection and come back.
17. **Empty / waiting states** — "waiting for players", "host hasn't started yet", "room is locked", "room not found" (a single shared error state to prevent code enumeration).

### Components & tokens

Please also produce:

- **A card component** in three sizes: thumbnail (~120px), normal (~250px), large (full-resolution preview). Show how rarity is indicated (subtle border / gem icon), how the ink color is shown (small swatch).
- **Card list row** (alternative to thumbnail grid).
- **Filter chip / facet checkbox styles**.
- **Player avatar component** with a ring color showing connection status (green = connected, yellow = reconnecting, gray = offline).
- **Pick timer** (visible mobile, in pack header).
- **Bottom-sheet drawer pattern** (mobile only).
- **Color tokens** — primary, secondary, surface, text, plus the six ink accent colors.
- **Typography scale** — headings, body, captions, the small monospace for card costs/stats.
- **Iconography style** — pick a style for the in-rules-text icons (ink drops, exert arrow, lore diamond, strength burst). Lorcana has its own visual language for these; design hints, not exact replicas. We will render them as inline SVG.

## What I want back

- High-fidelity mockups (Figma file or equivalent) for all the screens above, at both mobile and desktop sizes.
- A component library with the elements listed above.
- Design tokens (colors, type, spacing) exportable as CSS variables or JSON.
- A short rationale (one paragraph) explaining the visual direction you chose and how it serves the audience.

## What I do NOT want

- Anything that looks like an official Disney or Ravensburger product. Our brand must be clearly our own.
- A heavy "gamer" or "epic fantasy" aesthetic. Lorcana's own cards do that work; we are the calm container.
- An interface that imitates the card-frame style. Keep it modern and restrained.
- Dark patterns. No fake urgency, no "1 player left!" pressure tactics in the draft lobby.
- Generic SaaS-marketing-page energy. This is a fan site by hobbyists, for hobbyists.

## A note on light vs. dark mode

I haven't decided. **Please present both** — show me the same key screen (probably the card encyclopedia + the active draft view) in both light and dark, and tell me which one you think is the right "primary" for this audience. Drafters at night might prefer dark; encyclopedia browsers on a bus might prefer light. Lean on your judgment.

## Constraint: design system feasibility

The implementation team is small (1-2 people, part-time). Favor a design system that:
- Reuses components rather than bespoke per-page layouts.
- Avoids exotic animations or technically risky interactions (3D card flips fine; physics-based pack openings expensive).
- Works well with Drupal's Twig templating and React for the draft app.

Thanks!
