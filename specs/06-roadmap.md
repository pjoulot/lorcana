# 06 — Roadmap & Milestones

Build phases. Each milestone produces something usable; nothing is "all-or-nothing" until launch.

## Milestone 0 — Foundations (1-2 weeks)

**Outcome:** A bare Drupal 11 site running locally, with the contrib modules installed and a custom install profile that bootstraps the whole site reproducibly.

- Private Git repository created (no public source — see [spec 1: source license](01-overview-and-architecture.md#source-license)).
- Composer-managed Drupal 11 project (`drupal/recommended-project` as starting point).
- Custom install profile `lorcana_site` that:
  - Installs core + contrib (list in [spec 1](01-overview-and-architecture.md)).
  - Configures English + French as languages.
  - Configures Redis as the cache backend.
- DDEV local-dev setup with PHP 8.3, MariaDB 11, Redis, **PHP `Imagick` extension with AVIF support enabled** (needed for the image conversion pipeline).
- CI scaffold: PHPStan + PHPCS + a single passing test.
- Empty `lorcana_cards` and `lorcana_draft` modules registered, doing nothing.
- Starterkit-generated `lorcana_theme` in place; light + dark mode scaffolded with CSS custom properties; no Olivero.
- Browser support matrix encoded as the Vite + Browserslist config target (see [spec 1: browser support matrix](01-overview-and-architecture.md#browser-support-matrix)).

**Definition of done:** Fresh clone + `ddev start` + `drush si lorcana_site` produces a working empty Lorcana site at `https://lorcana.ddev.site`.

## Milestone 1 — Card data is live (2-3 weeks)

**Outcome:** Cards are imported from Lorcast and browsable in a basic encyclopedia.

- `card` and `card_set` node bundles created; `card_classification` and `keyword_ability` taxonomy vocabularies created — all via config sync.
- `CardImporterInterface` plugin system in place.
- Lorcast plugin implemented and imports all sets in English.
- Basic admin UI for triggering imports.
- Cron-based daily import.
- Encyclopedia landing page at `/cards` with Search API + Facets module configured.
- Card detail page (`/cards/<set>/<number>`).
- Set landing page (`/sets/<set>`).

Includes:
- Local image pipeline from day 1: AVIF download → JPG conversion → local storage (Imagick or ffmpeg). See [spec 3](03-card-import.md#image-pipeline).

Not yet:
- French data (deferred to milestone 2 to keep scope tight).
- Power-user search syntax (Scryfall-like). Free text + facets only at this stage.
- Tooltip popovers for inline card links (depends on news, in M2).

**Definition of done:** A user can land on the site and find any Lorcana card via search or facets, in English.

## Milestone 2 — Multilingual + news (2-3 weeks)

**Outcome:** Site supports French. News section ships.

- French as second site language, including FR-translated UI strings.
- Lorcast importer fetches French card data into independent per-language `card` nodes (see [spec 2: language variants](02-data-model.md#language-variants)); encyclopedia listings default to the visitor's UI language, card detail pages expose an "Other languages" strip to navigate between siblings.
- French URL prefix (`/fr/...`) routing.
- News content type with full editor workflow.
- News listing, detail, RSS feed, sitemap, schema.org metadata.
- Card-reference token in news bodies: filter-based, `[card:1/207]` → linked chip with hover-preview popover. **No custom CKEditor 5 plugin** — see [spec 4](04-news-and-encyclopedia.md#cross-feature-card-linking-in-news-articles).
- Search syntax (Scryfall-like) implemented.
- "Other printings" section on card detail pages (multi-printing UI per [data model](02-data-model.md#printing-variants)).
- "Show all printings" toggle on encyclopedia listing.
- Sitemap module configured.
- Webform module configured with: per-card "Report a problem" form + general `/contact` form (per [spec 4](04-news-and-encyclopedia.md#contact--feedback)).
- **`/about` page** (states fan/non-commercial status, who runs the site, contact).
- **`/legal` page** (longer-form Ravensburger Community Code Policy attribution + disclaimer).
- Footer disclaimer rendered site-wide (per [spec 1](01-overview-and-architecture.md#footer-disclaimer-text-english)).
- SMTP provider chosen and wired (admin password reset, contact-form replies). Specific provider TBD — see [spec 7 open Q.9](07-open-questions.md).

**Definition of done:** An editor can publish a French article that references cards by token, and the published page renders with the card popover working.

## Milestone 3 — Draft simulator (4-6 weeks)

The biggest milestone. Phased as described in [spec 5](05-draft-simulator.md#phasing-within-milestone-3):

- **3a** — Solo dry-run mode (no WebRTC). 1 week.
- **3b** — Two-player WebRTC happy path. 1-2 weeks.
- **3c** — Multi-player (4-8) with rotation. Client-side share-link export. 1-2 weeks.
- **3d** — Hardening: pick timer, reconnect, TURN, room lock + kick, abuse alerts, `noindex` on `/draft/*`. 1 week.

**Definition of done:** 4 players in different cities can complete a full draft, with one losing internet mid-draft and reconnecting successfully. Each player can export their final 48-card pool via share-link or CSV.

## Milestone 4 — Polish & launch readiness (2 weeks)

- Visual design pass per the finalized design deliverables. Includes homepage (`/`) IA, which is TBD pending design.
- Light + dark mode polish and consistency across encyclopedia, news, and draft simulator.
- Accessibility audit (WCAG 2.2 AA target on news + encyclopedia; draft simulator pragmatically AA on the lobby, A on the live draft due to time-pressure UI).
- Performance pass: card grid LCP, search latency, page weight.
- Verify footer disclaimer / `/about` / `/legal` content is finalized (built in M2; this is a content review).
- No cookie banner needed at launch (no analytics, no marketing cookies). Add one if/when an analytics provider gets wired.
- Privacy policy page deferred to when accounts arrive (M5).
- No analytics provider wired at launch (the theme has a Twig hook ready; we leave it empty for v1 and decide later).
- Sentry wired up for both PHP and JS.
- Production deploy + DNS + TLS.

**Definition of done:** Site is live at a public domain. End-to-end smoke tests pass.

## Post-launch / future milestones

### M5 — User accounts (when demand is there)

- Simple OAuth + Drupal account registration.
- Email verification, password reset, sensible defaults.
- Profile page with:
  - Favorite cards (a many-to-many to the `card` node).
  - (No saved drafts — that feature is permanently out of scope per [spec 5](05-draft-simulator.md#draft-persistence).)
- Editor role becomes account-required (not anonymous editorial).
- Privacy policy page added.

### M6 — Global site search

- A top-of-page search box that crosses news + cards + sets in one query.
- Result page that groups results by type with separate "see more" links per group.
- Re-uses the existing Search API index; adds a second index for news.
- Low priority — explicitly listed as "not that important" by the project owner. Slot here so we don't forget.

### M7 — Deck builder

- New `deck` content entity. List of card references + counts.
- Constructed-format validation (40-60 card deck, max 4 of any card, exactly 2 inks unless legality says otherwise).
- Deck sharing via URL.
- Mana curve / ink distribution chart.
- "Build from draft pool" — accept a share-link from the draft simulator's export and load it as a starting point.

### M8 — Tournament / event coverage

- Event content type.
- Top-8 lists.
- Meta-snapshot pages (which cards are most-played).

### M9 — Pricing & market

- Price history charts (requires daily price snapshots, longer retention).
- "Watchlist" for users (requires accounts).
- Integration with multiple market sources (Cardmarket EU, TCGPlayer US).

### M10 — Cube draft + custom draft formats

- Beyond official set drafts: user-curated card pools.
- "Chaos draft" (mix sets).
- Saved cube definitions.

### Maybe-never

- In-browser Lorcana gameplay simulation.
- Live tournament pairings.
- Marketplace.

These are not on the roadmap. If the project takes off, evaluate. For now, write them down so we don't reinvent the same conversations.

## Capacity & timing realism

The milestone estimates assume a team of 1-2 working part-time (10-20h/week combined), familiar with Drupal + React but not deeply expert in WebRTC. A full-time Drupal expert could compress the timeline roughly 3x.

Total to public launch: **~3 months part-time** if M0-M4 run cleanly, **~5 months part-time** if M3 (the draft simulator) hits the snags it likely will.

## What we'll measure

Pre-launch, define and instrument:

- **Encyclopedia:** searches/day, top-searched cards, faceted-filter usage breakdown.
- **News:** articles/month, avg read time, RSS subscribers.
- **Draft:** rooms created/day, drafts completed/day, average player count, completion rate (drafts that finish vs. abandon), reconnect attempts.

These telemetry questions drive the post-launch roadmap (where do we invest?).
