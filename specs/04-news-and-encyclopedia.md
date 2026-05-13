# 04 — News & Card Encyclopedia

The two read-mostly content features. Lower complexity than the draft simulator, but they're the daily-visit features so the UX has to be solid.

> **Homepage (`/`) layout is TBD** pending the design pass. This spec defines the section landing pages (`/news`, `/cards`, `/sets/...`) and detail pages; the homepage's specific composition (which sections show, in what order, with what featured content) will follow the design deliverables.

## News section

> **No `lorcana_news` module.** Everything in this section is built from a content type + a Drupal View + theme templates, all shipped as YAML config in the install profile. If we ever need PHP for news (custom RSS handling, cross-posting, scheduled social posts), we promote to a module then.

### Information architecture

- Listing page at `/news` (also `/actualites` for the French version). Most recent first, paginated 20 per page.
- Optional category filter on the listing: Set Reveals, Tournament Reports, Rules Updates, Opinion, Community Spotlight.
- Detail page at `/news/<slug>`.
- Pathauto pattern: `/news/[node:created:custom:Y-m]/[node:title]`. French equivalent uses the FR alias.
- RSS feed at `/news/feed.xml` (per-language: `/fr/news/feed.xml`).
- Sitemap entry per article.

### Article content model

Already covered in [data model spec](02-data-model.md#news-article-drupal-node-bundle). Highlights:

- CKEditor 5 body with media library integration.
- `featured_cards` field lets editors drop in a card-strip — renders a small inline carousel/grid showing card images that link to the encyclopedia.
- Hero image with focal-point crop for the listing thumbnail vs. the article hero.

### Listing UI

A single Drupal View with two display variants:

1. **Recent feed** (homepage block, 4 articles + "more" link).
2. **Full archive** (`/news`, paginated).

Filters exposed: category, date range, language (only the active language by default, but a "show all languages" toggle for power users).

### Editor workflow

- The only authenticated role at launch is `site_admin`. Admins create / edit / publish articles.
- No editorial moderation workflow in v1 — too heavy for a 1-2 admin team. Simple draft → published states from core suffice.
- When user accounts arrive (M5), we can introduce a separate `news_editor` role for non-admin authors.

### Translation workflow

- Editors author in their primary language.
- A "Translate" tab on each article lets a second editor produce the other language. Translations are independent nodes linked via Drupal's content translation API.
- An untranslated article shows on the off-language listing with a "EN only" badge, linking to the English version.

### SEO essentials

- Metatag module: per-article OG image (defaults to hero), description (defaults to body excerpt), Twitter Card, canonical URL.
- Schema.org `NewsArticle` JSON-LD on detail pages.
- Pathauto-driven clean URLs.

## Card encyclopedia

### Information architecture

- Landing/index page at `/cards`. Faceted search.
- Card detail page at `/<langcode>/cards/<set_code>/<collector_number>-<slug>` (e.g., `/en/cards/1/207-elsa-snow-queen`, `/fr/cards/1/207-elsa-reine-des-neiges`). The langcode is Drupal's standard language path prefix, but here it identifies the *card's* content language rather than the visitor's UI preference. Visiting `/cards/1/207-...` without a prefix resolves to the visitor's UI language. Each language version has its own canonical, shareable URL.
- Set landing pages at `/sets/<set_code>` (e.g., `/sets/12` for Wilds Unknown) — gallery of all cards in a set, with quick filters.
- Cross-link from news articles: every card name in CKEditor can be auto-linked via a token + filter (a `[card:1/207]` token resolves to a tooltip-enabled link).

### `/cards` — faceted index

Layout (desktop):

```
┌──────────────────────────────────────────────────────────┐
│  Search bar (autocomplete)                               │
├──────────┬───────────────────────────────────────────────┤
│ Filters  │  Results grid                                 │
│          │                                               │
│ Ink      │  [card] [card] [card] [card] [card]           │
│ ☐ Amber  │  [card] [card] [card] [card] [card]           │
│ ☐ ...    │  ...                                          │
│          │                                               │
│ Type     │  Sort: Name | Cost | Lore | Strength | ...    │
│ ☐ Char.  │  Display: Grid | List                         │
│ ...      │                                               │
│          │                                               │
│ Rarity   │                                               │
│ Cost     │                                               │
│ Keywords │                                               │
│ Class.   │                                               │
│ Set      │                                               │
└──────────┴───────────────────────────────────────────────┘
```

Mobile: filters collapse into a drawer triggered from a "Filters (3)" button. Results grid is 2 columns.

### Default filters: primary printing + single language

By default, the encyclopedia returns **only primary printings** of each card (see [data model: printing variants](02-data-model.md#printing-variants)) **in a single content language** (the visitor's UI language). Otherwise the same Mickey would show up multiple times: standard EN, Enchanted EN, standard FR, Enchanted FR, etc.

Two independent controls let visitors override these defaults:

- A **"Show all printings"** toggle near the sort options reveals every printing variant as a separate result. The toggle's state is persisted in a cookie for the next visit. Useful for collectors comparing prints.
- A **language switcher** in the filter sidebar swaps the active *content* language filter — e.g., a visitor browsing the UI in English can list French-printed cards without changing their UI to French. The chosen content language is persisted in a cookie. A "Show all languages" option is also available for power users.

Content language is a property of the card (see [data model: language variants](02-data-model.md#language-variants)), distinct from the UI language switcher in the site header. The two move independently.

### Faceted search — implementation

- **Search API** index over the `card` entity (see [data model spec](02-data-model.md#search-api-index)).
- **Facets module** for the sidebar filters.
- **Search API Autocomplete** for the search bar — suggests card names as you type, with a thumbnail preview in the dropdown.
- Result grid via Views display, with View Modes: `card_thumbnail`, `card_list_row`.

### Search query syntax

Power users can use a Scryfall-like syntax in the search bar:

- `ink:amber` — filter to one ink.
- `cost:3` — exact cost.
- `cost>=5` — comparator.
- `t:character` — type.
- `r:legendary` — rarity.
- `set:1` — set code.
- `kw:rush` — has a keyword.
- `lore>=2` — comparator on lore.
- Free text matches `name`, `version`, `text`.

Combinable: `ink:amber t:character cost<=3 lore>=2` returns Amber Characters of cost ≤3 with lore ≥2.

This is implemented as a search-query alter that translates the syntax into Search API conditions. Falls back to plain fulltext if no syntax tokens are detected.

### Card detail page

Layout:

- **Hero image** (the large local JPG).
- **Stat panel**: name, version, ink+cost, type, strength/willpower/lore (or move-cost for Locations), classifications, keywords with reminder text.
- **Rules text** rendered with inline SVG icons for `{i}`, `{e}`, etc.
- **Flavor text** italicized.
- **Set + collector number + rarity + illustrator** at the bottom.
- **Content-language badge** in the header (e.g., "EN" / "FR" / "JA") indicating which language this card node is. The site header's UI-language switcher is unchanged; the badge here is about the *card*, not the chrome.
- **Other printings** section: printing variants of this card *in the same content language* (same `printing_group_id`, same `langcode`) appear as a small horizontal strip of card thumbnails — each linking to its own page. The variant's rarity (e.g., "Enchanted") and any distinguishing badge is overlaid.
- **Other languages** section: sibling-language versions of this exact printing (same `(set_code, collector_number)`, different `langcode`) appear as a horizontal strip of localized card thumbnails — each linking to its own page. A visitor browsing in EN can click the JA tile to see the Japanese version with its real JA name, JA card art, and JA market price, all without changing their UI language.
- **"Where to buy"** section: TCGPlayer link (using this language's `tcgplayer_id`), plus current cached USD price with timestamp. Both vary by language since each printed-language version trades on its own market.
- **Related news** block: news articles where this card is in `featured_cards`.
- **"Report a problem"** link — a small footer link on every card page that opens a Webform with the card auto-attached as context (see [Contact & feedback](#contact--feedback) below).

### Card images & rendering

All card images are JPG, served from our own server (converted from Lorcast's AVIF on import — see [spec 3](03-card-import.md#image-pipeline)). No `<picture>` fallback needed; no third-party domain in the image `src`.

Lazy-load (`loading="lazy"`) on all grid images. Drupal's responsive image module can serve appropriate sizes from the small/normal/large derivatives plus image-style auto-derived sizes.

### Performance budget

- Encyclopedia landing: under 1.5s LCP on a mid-tier mobile, 4G.
- Faceted query: under 300ms server response from cache, under 800ms cold.
- Page weight under 600KB initial (excluding card images).

Tools: Drupal's page cache + dynamic page cache + Redis. Search API index pre-built. Facets module's cache contexts configured correctly so the result grid caches per facet combination.

### Sitemap & SEO

- XML sitemap auto-generated, includes every card-language page as its own URL (~30k entries at EN + FR full coverage; scales linearly per additional language). Each language is generated as its own per-langcode sitemap by Drupal's `simple_sitemap`. Split into chunked sitemaps if any exceeds sitemap-size limits.
- Per-card Schema.org `Product` JSON-LD with `name`, `image`, `description`, and a `productID` pointing at TCGPlayer. The structured data is generated in the card's content language.
- OG image = the normal-size card image for this language.
- `hreflang` link tags wire each card-language page to its sibling-language pages (same `(set_code, collector_number)`), so search engines surface the right language to each user.

### Accessibility

- All card images have alt text auto-generated as `"{name} - {version} ({set} {collector_number})"`.
- Facet checkboxes are real checkboxes with proper labels.
- The search-syntax shorthand is documented in a help popover; not the only way to filter.
- Color is never the only conveyor of meaning — ink-color filters show both name and color swatch.

## Cross-feature: card linking in news articles

We do **not** build a custom CKEditor 5 plugin. Instead, a simple Drupal text filter does the job:

- Editors type `[card:1/207]` (or `[card:1/207-elsa]` if they want to verify the slug) directly in CKEditor body text.
- A Drupal `@Filter` plugin processes the rendered HTML on display: matches the token, looks up the card by `(set_code, collector_number)`, replaces with an anchor tag `<a class="card-link" data-card-id="...">{card name}</a>`.
- A small unobtrusive JS bundle (loaded only on news article pages) attaches a hover-preview popover on desktop and tap-preview on mobile. Renders the card image + key stats.

Why this approach: zero CKEditor 5 plugin development, zero custom toolbar work, zero JS that runs *inside* the editor. The cost is editors have to know the token format — but that's a documented convention rather than an undiscoverable trick. An admin help block in the CKEditor surround can show recent example tokens.

Bonus: the token form is portable. Copy-paste it across news articles, into an email, into a Markdown export — it's plain text and the filter rehydrates it everywhere on rendering.

## Contact & feedback

Two Webform-backed entry points:

1. **Per-card "Report a problem" link** on every card detail page. Pre-fills hidden fields with the card's set + collector number + URL. Form fields: issue type (wrong stats / wrong rules text / wrong translation / wrong image / other), description, optional email. Submitter remains anonymous unless they choose to provide email.
2. **General `/contact` page**, linked from the footer. Form fields: subject, message, optional email. Used for everything that isn't card-specific (site bugs, news suggestions, takedown requests, partnerships).

Both forms route to the same Drupal admin "submissions" queue. Admins triage there; replies go via whatever email the admin chooses (no integrated reply tooling in v1).

Honeypot module + a small invisible field protect against bot spam. No CAPTCHA at launch — add only if spam becomes a problem.

## Editorial dashboards

`/admin/lorcana` is a custom landing for site staff with quick links to:

- Recent imports (success/failure summary).
- Cards present in EN but with no FR sibling — i.e., `(set_code, collector_number)` pairs that have an `en` card node but no `fr` one. The same view generalizes per additional language as it's added.
- Cards with parse warnings (unknown keywords, malformed rules text).
- Recent news drafts and scheduled publishes.

This is a single View / Block layout page — no custom code beyond config.
