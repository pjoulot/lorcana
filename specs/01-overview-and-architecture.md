# 01 — Overview & Architecture

## Goals

A community-oriented Lorcana site that:

- Keeps players up to date with news.
- Gives them a fast, faceted card browser they actually prefer over the official tools.
- Lets a group of friends draft together remotely when they can't be in the same room — with the picked decks then played offline with physical cards.

Quality bar: the site should feel like a contemporary card-game fan site (Scryfall, EDHREC, dotGG), not a stock Drupal install.

## Non-goals (at least for v1)

- We are **not** simulating the actual Lorcana game. No combat resolution, no turn engine, no AI opponent.
- We are **not** building a deck builder. (Likely v2; flagged in the roadmap.)
- We are **not** running tournaments / pairings / Elo.
- We are **not** an e-commerce / price tracker. We may *show* prices from Lorcast but won't process transactions.
- No user accounts at launch (see [roadmap](06-roadmap.md)).

## Audience

- **Casual players** browsing news and looking up cards on mobile.
- **Drafters** — 4 to 8 friends who want to do a remote pre-draft before a physical play session. Most will be on phones.
- **Site admins** (1-2 people) authoring news posts. They're the only authenticated users at launch.

**Mobile-first across the board**, including the draft simulator. Drafters will pick cards from their phones during get-togethers, on transit, in the kitchen. The desktop layout is the "scales up" case, not the primary design target.

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| CMS | Drupal 11 | Latest stable major. PHP 8.3+. |
| DB | MariaDB 11 | Decided. Fewer footguns for a Drupal project. |
| Cache | Redis | Used by Drupal cache *and* by the draft signaling layer (ephemeral room state). |
| Search | Drupal Search API + database backend at first, Solr or Meilisearch if it doesn't perform | The card encyclopedia is the heavy search target; ~15k cards is small but faceting needs Search API. |
| Frontend (site) | Twig (Drupal-rendered pages) | Server-rendered theme with progressive enhancement. No SPA for news or encyclopedia. |
| Frontend (draft sim) | **React** + Vite-built bundle, embedded in the `/draft/*` routes only | React because the team knows it; Vite gives a small enough bundle. No Node at runtime — output is plain JS committed or built in CI. |
| WebRTC | PeerJS library | With our own signaling endpoint (not PeerJS Cloud). See [draft simulator spec](05-draft-simulator.md). |
| TURN | **Self-hosted coturn** on the same OVH box | Cloudflare TURN is paid ($0.05/GB) once you use it standalone — only free when paired with their SFU, which we don't need. coturn is free, ~5 min to set up, runs on the same VPS. |
| Build tooling | Vite for the embedded JS bundle | Output is committed or built in CI; no Node required at runtime on the Drupal box. |
| Hosting | **Single OVH VPS** (EU region for GDPR posture) | Audience is likely Canada-heavy but an EU host is fine for latency and gives a default GDPR-friendly stance. The architecture is single-box-friendly; horizontal scale is possible later but not designed for. |

## Drupal module layout

**Two** custom modules, each with a single clear responsibility:

```
modules/custom/
├── lorcana_cards/        # Card content model, importer plugin system, encyclopedia UI
└── lorcana_draft/        # Draft rooms, signaling endpoints, embedded JS app
```

**News is config-only.** No `lorcana_news` module. The news content type, its fields, the listing view, the RSS feed, the category taxonomy, and any related blocks are defined in YAML config and shipped via the install profile + `drush deploy`. If we ever need PHP for news (custom RSS handling, cross-posting, etc.), we promote it to a module then — not before.

**`lorcana_cards`** is the larger module. It owns:
- The `card` and `card_set` **node bundles**, plus the `card_classification` and `keyword_ability` taxonomies, defined in config (the module's role here is supporting code, not entity definitions in code).
- The `CardImporterInterface` plugin type + the Lorcast adapter.
- The Drush commands for manual import.
- The cron hook that schedules imports.
- The encyclopedia route enhancements, search-syntax parser, and any custom Views/Facets query alterations.

**`lorcana_draft`** owns:
- The room signaling REST endpoints (room create, join, signal poll/post, start).
- The room state service (Redis-backed).
- The deterministic pack generator (so the server, not a peer, defines pack contents).
- The coturn credential broker.
- The embedded React app (the SPA).

It does **not** persist completed drafts — finished pools are exported client-side. See [spec 5](05-draft-simulator.md#draft-persistence).

Cross-module coupling stays minimal: `lorcana_draft` reads from `lorcana_cards` only via a public service (`lorcana_cards.pack_pool`) that returns a card pool for a given set + rarity distribution.

## Contrib modules we'll lean on

- **Pathauto** + **Redirect** — clean URLs for cards (`/cards/1/207-elsa-snow-queen`).
- **Token** + **Metatag** — SEO essentials.
- **Search API** + **Search API Autocomplete** + **Facets** — encyclopedia.
- **JSON:API** (core) — used by the draft simulator's JS app and a future deck builder.
- **Simple OAuth** — *deferred*; we'll add it when accounts arrive.
- **Content Translation** + **Configuration Translation** + **Interface Translation** — multilingual.
- **Crop API** + **Focal Point** — image cropping (card thumbnails, news hero images).
- **Webform** — contact / report-a-card-issue form.
- **Honeypot** — anti-spam on the (eventually) account form and the contact form.
- **Schemata** / **OpenAPI** — generate API docs for the import + draft endpoints.

## Drupal CMS vs. plain Drupal 11

We're using the **`drupal/recommended-project` Composer template** + our own install profile, not the Drupal CMS distribution. Rationale:

- Drupal CMS recipes (especially the AI-assist ones) bring opinions we don't need for a fan site, and removing them is more work than adding individual contrib modules to a clean install.
- The custom-module surface area is large enough that we want full control over install / update / deploy mechanics.

We *will* borrow recipes selectively (e.g., the SEO recipe, the multilingual recipe) — they're standalone YAML and can be applied to a plain Drupal 11 install.

## Theming

- **No Olivero**. We generate a minimal theme using `php core/scripts/drupal generate-theme lorcana_theme` — the official Drupal 11 way to scaffold a theme. The generator **copies** core's `starterkit_theme` into our new theme; the result is a **standalone theme with no base theme inheritance**. This is the recommended pattern in Drupal 11 and replaces the older "sub-theme of `stable9` or `classy`" approach. We get clean, modern markup as the starting point and own every template we ship.
- Component approach: SDC (Single Directory Components, native to Drupal 11). One component per card display, pack display, news teaser, etc.
- Design tokens: SCSS variables driven by a small palette. The six Lorcana ink colors map to brand accent colors used across the encyclopedia and draft UI.
- Mobile-first CSS: everything starts as a mobile layout; media queries scale *up* to desktop, not down.

### Light & dark mode

Both modes are first-class. Default behavior:

1. The site respects `prefers-color-scheme` on first visit (system setting wins).
2. A persistent toggle in the header/footer lets the user override (saved as a cookie + `data-theme` attribute on `<html>`).
3. The React draft simulator reads the same `data-theme` attribute on mount and applies the matching CSS variable set — no separate theming logic.

Implementation: a single CSS custom-property set per mode. Light mode is defined as the default; dark mode is a single `[data-theme="dark"]` override block. No JS for theme rendering — only for toggle persistence.

## Browser support matrix

- **Modern evergreen browsers, last 2 stable versions** of: Chrome, Edge, Firefox, Safari.
- **iOS Safari** 16+ (iPhones from 2017+).
- **Android Chrome** last 2 stable.
- **No legacy browsers**: no IE, no pre-Chromium Edge, no Safari <16, no Firefox ESR older than 2 major versions.
- **No graceful degradation effort** beyond what modern features provide natively — we use CSS custom properties, CSS Grid, modern ES (ES2022+). Card images are served as **JPG** (converted on import from Lorcast's AVIF — see [spec 3](03-card-import.md#image-pipeline)), so no AVIF browser dependency.

If a user reports their browser doesn't work, the response is "please update."

## Multilingual approach (overview)

Detail in [spec 4 — multilingual is folded into news & encyclopedia](04-news-and-encyclopedia.md) but the high-level decision:

- **Site UI** translated via Drupal's standard interface translation (`po` files for FR).
- **News content** authored once per language. Editor selects source language; translations are independent nodes linked via Drupal's translation API. No machine translation at launch.
- **Card content** treats language as a property of the data, not as UI chrome. The `card` bundle is **not** translatable in Drupal i18n terms; instead, each language version of a printing is its own node, identified by `(set_code, collector_number, langcode)`. Per-language nodes carry independent `name`, `version`, `text`, `flavor_text`, `image_*`, `price_usd`, and `tcgplayer_id` — different printed art and different market prices per language are first-class. A visitor browsing in English can navigate to the Japanese version of any card without switching their UI. See [spec 2: language variants](02-data-model.md#language-variants).
- A card with no node for the requested language is simply absent from that language's encyclopedia until Lorcast publishes it; the card detail page in another language exposes an "Other languages" strip listing whatever language siblings exist.

## Ravensburger Community Code Policy compliance

We operate under [Ravensburger's Community Code Policy](https://cdn.ravensburger.com/lorcana/community-code-en). We will:

- Display the **site-wide footer disclaimer** below verbatim (in the active language). One site-wide footer is sufficient under the policy — we do **not** need to repeat it per card page.
- Never charge for site access. No paid tiers, no donation-required content.
- Not use Ravensburger / Disney logos as our site logo or in marketing.
- Cache card data per Lorcast's request (24h+). Lorcast is consumed at **import time only**, never at runtime page-render — our pages serve cached, locally-stored data.
- Keep card images at reasonable display resolution (no print-ready archives, no bulk-download endpoints).
- Provide `/about` (states fan/non-commercial status, who runs the site) and `/legal` (longer-form version of the footer) pages, both linked from the footer. `/privacy` page added when accounts arrive.

### Footer disclaimer text (English)

```
This site is an unofficial, non-commercial fan project and is not
published, endorsed, or specifically approved by Disney or Ravensburger.
Disney Lorcana TCG trademarks and copyrights are the property of their
respective owners and are used here under Ravensburger's Community
Code Policy (https://cdn.ravensburger.com/lorcana/community-code-en).
Card data is provided by Lorcast (https://lorcast.com); card images
remain © Disney / Ravensburger.
```

URLs render as anchor tags in the actual footer. A French translation will ship alongside; meaning preserved, no machine translation.

The policy permits community sites doing exactly what we're building. This wording matches the pattern used by Lorcast, Dreamborn, Mushu Report, and Lorcana Player. **Not legal advice** — the project owner may want a quick attorney review before launch, especially if any monetization (donations, etc.) is ever considered down the line.

## Source license

**Proprietary / closed-source.** The Drupal modules, theme, and React app are private code. No public repo, no contribution guidelines, no license headers required. If we ever extract a generic Drupal contrib (e.g., the importer plugin abstraction) and want to publish it to drupal.org, that piece would need to be relicensed GPL-2.0-or-later — but that's a hypothetical, not the v1 plan.

Implications:

- Single private Git repository (Gitea, GitHub private, GitLab — pick at M0).
- No `LICENSE` file at the repo root (or a `LICENSE.txt` with "All rights reserved, [owner], [year]").
- Composer's autoloader still works fine without a license declaration on internal modules.

## Out-of-band concerns we'll need to address before launch

- **Hosting & deploy story.** Single OVH VPS running Drupal + Redis + Nginx + PHP-FPM + coturn. Backups via restic to OVH object storage. Deploy via Git pull + `drush deploy`. Not designed in detail here.
- **CI** — at minimum, PHPStan + PHPCS (Drupal coding standards) + a unit test suite running on push.
- **Monitoring** — Sentry for PHP errors and JS errors. Uptime ping via a free service.
- **Analytics integration slot.** We won't ship an analytics provider in v1, but the Drupal theme will include a `{{ analytics }}` Twig hook in the page bottom region, ready to host a Plausible / Matomo / GoatCounter snippet when someone decides which one. Behind a config flag — empty by default.

These are operational concerns; they don't shape the data model or feature specs, so they're called out here but not specified in detail. We'll cover them in a separate ops doc once we start building.
