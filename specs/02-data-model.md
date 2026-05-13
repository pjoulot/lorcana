# 02 — Data Model

This spec describes the Lorcana domain in Drupal terms. It is the foundation for the import pipeline (spec 3), the encyclopedia (spec 4), and the draft simulator (spec 5).

## Domain primer (for context)

Lorcana cards have these intrinsic properties:

- **Ink** — one of six colors (Amber, Amethyst, Emerald, Ruby, Sapphire, Steel). Some cards have no ink (Promo/Special edge cases — Lorcast returns `null`).
- **Type** — Character, Action, Item, Location, Song. A card can have multiple types (e.g., Action + Song).
- **Cost** — integer "ink cost" to play.
- **Inkable** — boolean; whether the card can be placed face-down into the inkwell as a resource.
- **Strength / Willpower / Lore** — combat & scoring numbers, only on Characters and (Willpower only) Locations.
- **Move Cost** — only on Locations: cost to move a Character there.
- **Classifications** — sub-types like Hero, Villain, Princess, King, Floodborn, Dreamborn, Storyborn, Sorcerer, etc. Free-form list per card.
- **Keywords / Abilities** — Bodyguard, Challenger, Evasive, Resist, Shift, Singer, Support, Ward, Rush, Reckless, Vanish, Sing Together, Universal Shift, etc. Some are parameterized (Challenger +X, Resist +X).
- **Rarity** — Common, Uncommon, Rare, Super Rare, Legendary, Enchanted, Promo, Special.
- **Set + Collector Number** — the natural key. `(set_code, collector_number)` uniquely identifies a card (within a language).
- **Layout** — `normal` for most cards, `landscape` for Locations.

Lorcast returns one record per `(card, language)`. So the same card in EN and FR are two records sharing identity via `(set_code, collector_number)`. We mirror this shape: each language version of a printing is its own `card` node, sharing `(set_code, collector_number)` with its sibling-language nodes but distinguished by Drupal's `langcode`. See [Language variants](#language-variants) below for the rationale.

## Entity inventory

Three node bundles, two taxonomies. All standard Drupal building blocks.

| Entity | Drupal type | Translatable | Purpose |
|---|---|---|---|
| `card` | **Node bundle** | **No, see [Language variants](#language-variants)** | One node per unique printing of a card *in one language*. Revisions OFF, comments OFF. |
| `card_set` | **Node bundle** | Partial (display name) | One node per set (e.g., "The First Chapter", "Wilds Unknown"). Revisions OFF, comments OFF. |
| `news_article` | Node bundle | Yes | Blog posts. |
| `card_classification` | Taxonomy vocab | Yes | Sub-types: Hero, Villain, Princess, etc. |
| `keyword_ability` | **Taxonomy vocab** | Yes | Bodyguard, Challenger, Evasive, etc. With custom fields on each term for `parameterized` flag and reminder text. |

### Why node bundles for `card` and `card_set` (revised)

Originally we proposed custom content entities, citing performance. **Switched to node bundles** because:

- We want a real, discoverable, themed *page* for every card and every set — node bundles give us that for free (canonical route, Pathauto, menu integration, edit forms, View modes).
- Performance at 15-30k nodes is fine in Drupal 11 with Redis + Search API. The "node overhead" is mostly mythological at this scale.
- The complexity savings (no custom entity definitions, no custom routes, no custom forms) easily outweigh the table-width win we'd get from a custom entity.

To keep the node bundles lean, we **disable revisions and comments** on both bundles in their configuration. Identity (`set_code` + `collector_number`) is enforced via a unique compound index on two custom fields, not via the primary key.

### Why a taxonomy for `keyword_ability` (revised)

Originally proposed as a config entity. **Switched to taxonomy** because:

- Same Facets / Search API integration we get from `card_classification` — uniform editor experience.
- Editors can manage the list via standard Drupal UI without touching code/YAML.
- Multilingual labels and per-term custom fields (`parameterized` boolean, `reminder_text` long-text) are first-class on taxonomy terms.
- We restrict edit permission to admins, so it's effectively closed in practice but not in mechanism.

Parameterized values (the "+2" in `Challenger +2`) live on the *card*, not the term. The term defines whether the keyword *takes* a parameter; each card stores its parameter value (see `keywords` field below).

Why a taxonomy for `card_classification` rather than nodes? Because classifications are user-facing facets and we don't need pages for them in v1. If demand arises ("show me everything tagged Princess"), we can promote to a node bundle later — taxonomy terms have URLs already.

## `card` node bundle — full field list

Field names match Lorcast's response where possible to keep the importer simple. All fields below are on the `card` node bundle (`node__field_*` storage). The node's built-in `title` is unused for display; we set it programmatically to `"{name} - {version}"` for admin listings.

| Field | Type | Translatable | Notes |
|---|---|---|---|
| `nid` | integer (primary key) | No | Drupal-assigned node ID. |
| `uuid` | UUID | No | Drupal-built-in. |
| `langcode` | language (core field) | — | Drupal core field present on every node. Identifies the language this card's values are in. Required, indexed. Sibling-language nodes share `(set_code, collector_number)` but have different langcodes. See [Language variants](#language-variants). |
| `lorcast_id` | string | No | Lorcast's `id` value. Unique index. Allows fast upsert. Lorcast assigns a distinct ID per `(printing, language)`, so this maps 1:1 to one of our card nodes. |
| `set` | entity reference → `card_set` node | No | Required. |
| `collector_number` | string | No | Stored as string because some sets use suffixes (e.g., "207a"). |
| `name` | string | No | Card name. Belongs to this node's `langcode`; the sibling-language node holds that language's printed name. |
| `version` | string (nullable) | No | The subtitle: "Brave Little Tailor", "True Friend". Per-language by virtue of being on a per-language node. |
| `layout` | enum: `normal`, `landscape` | No | Drives the rendered card frame. |
| `cost` | integer | No | Ink cost. Range 0–10+. |
| `inkable` | boolean | No | Maps from Lorcast's `inkwell`. |
| `ink` | enum or entity ref → `ink_color` (taxonomy) | No | Amber, Amethyst, Emerald, Ruby, Sapphire, Steel, or null. Modeled as taxonomy for facet support. |
| `card_types` | multi-value enum | No | Character, Action, Item, Location, Song. Multi-value because a card can be Action+Song. |
| `classifications` | entity reference (multi) → `card_classification` taxonomy | No (terms themselves are translatable) | Hero, Villain, Princess, Floodborn, etc. |
| `strength` | integer (nullable) | No | Characters only. |
| `willpower` | integer (nullable) | No | Characters + Locations. |
| `lore` | integer (nullable) | No | Characters only. |
| `move_cost` | integer (nullable) | No | Locations only. |
| `text` | long text (plain) | No | Rules text. Newlines preserved. May contain `{e}` style icon markers — we'll parse + render to inline SVG. Per-language via the node's `langcode`. |
| `flavor_text` | long text (plain, nullable) | No | Italicized flavor below the rules box. Per-language via the node's `langcode`. |
| `keywords` | multi-value structured: `{keyword_tid, value}` | No | E.g., `[{"keyword_tid": 42 /* Challenger */, "value": 2}, {"keyword_tid": 51 /* Rush */}]`. References `keyword_ability` taxonomy terms. Indexed for facet search. |
| `rarity` | enum | No | `common`, `uncommon`, `rare`, `super_rare`, `legendary`, `enchanted`, `promo`, `special`. |
| `illustrators` | multi-value string | No | Lorcast returns an array. |
| `image_small` | Drupal image field | No | Locally stored JPG, ~150px wide. Populated by the configured image importer (default: Lorcast → AVIF→JPG) or manually uploaded by an admin. |
| `image_normal` | Drupal image field | No | Locally stored JPG, ~600px wide. |
| `image_large` | Drupal image field | No | Locally stored JPG, ~1000px wide. |
| `is_image_manual_override` | boolean | No | When `true`, the importer skips images for this card — admin-uploaded images survive re-imports. Auto-set when an admin edits the image fields via the node form. See [spec 3: manual image overrides](03-card-import.md#manual-image-overrides). |
| `image_source` | string | No | Which image importer last wrote these images (`lorcast`, `manual`, etc.). Separate from `import_source` because data and images can come from different plugins. |
| `tcgplayer_id` | integer (nullable) | No | For deep-linking to a price page. |
| `legal_core` | enum | No | `legal`, `not_legal`, `banned`. |
| `price_usd` | decimal (nullable) | No | Snapshot from last import. Display "as of <date>". |
| `price_usd_foil` | decimal (nullable) | No | Same. |
| `released_at` | date | No | Set release date — denormalized for sorting/filtering. |
| `last_imported` | timestamp | No | When this row was last touched by an importer. |
| `import_source` | string | No | Which importer wrote this row (`lorcast`, etc.). Future-proofing for multi-source merge logic. |
| `printing_group_id` | string | No | Identifier shared by all printings of the "same card" — e.g., the standard Ruby Mickey and its Enchanted variant share a `printing_group_id`. Indexed. See [printing variants](#printing-variants) below. |
| `is_primary_printing` | boolean | No | One printing per group is flagged primary; that's the one that wins in default listings/search. |

**Notes on multilingual storage:** the `card` node bundle is **not** marked as translatable in Drupal's content translation system. Instead, each language version of a printing is its own independent node, distinguished by Drupal's `langcode`. The EN and FR versions of the Ruby Mickey "Brave Little Tailor" share `(set_code, collector_number) = (1, 207)` but are two separate nodes with two separate sets of field values — including separate `image_*`, `price_usd`, `name`, `version`, `text`, and `flavor_text`. Game-mechanic fields (cost, ink, strength, etc.) are duplicated across the sibling nodes; the values are identical by construction (the importer writes the same value for each language) and the duplication cost is negligible at ~15k printings × handful of languages. See [Language variants](#language-variants) below for the rationale.

### Printing variants

Lorcana cards exist in multiple printings: the standard print, the Enchanted variant (rare alternate art), occasional promo or special-frame printings. Each printing has its own collector number (e.g., "207" for standard, "207e" or "224" for Enchanted) and is therefore a **separate node** in our model.

To let users see the relationships, we link variants together:

- `printing_group_id` — string field on every card node. All printings of "the same card" share the same value.
- The importer determines the group ID from Lorcast (Lorcast's `unique=cards` query collapses prints; we read that grouping and persist it).
- Fallback if Lorcast doesn't expose the group directly: compute `slug(set_code + name + version)` and use that. Multiple variants of the Ruby Mickey "Brave Little Tailor" in set 1 all hash to the same group ID.
- `is_primary_printing` — exactly one card per group is flagged primary. The importer marks the standard (lowest collector number, non-Enchanted, non-promo) as primary.

UI implications (detailed in [spec 4](04-news-and-encyclopedia.md)):

- Default encyclopedia search returns only primary printings — otherwise the same card shows up 2-3 times in results.
- The card detail page shows an "Other printings" section listing the non-primary variants of the same group, each linking to its own page.
- A "Show all printings" toggle in the encyclopedia reveals every printing as a separate result. Useful for collectors.

This keeps the data model honest (each printing is a real card with its own stats, image, price) while letting the UI hide the duplication for most users.

### Language variants

Lorcana cards are printed in multiple languages: EN, FR, DE, IT, JA, etc. We treat each language version of a printing as **a separate `card` node**, not as a translation of a single canonical node. Concretely:

- The card bundle is **not** translatable in Drupal's content translation system. Each node has its own `langcode` and its own values for every field.
- The natural sibling-grouping key for "same printing across languages" is `(set_code, collector_number)`. The EN and FR versions of "Mickey Mouse — Brave Little Tailor" (set 1, #207) are two nodes sharing that pair, with `langcode` of `en` and `fr` respectively. There's no separate `language_group_id` field — the natural key is enough.
- All fields are per-language by virtue of being on per-language nodes: `name`, `version`, `text`, `flavor_text`, `image_small/normal/large`, `price_usd`, `price_usd_foil`, `tcgplayer_id`. A visitor browsing the site in English can navigate to the Japanese version of any card and see its real JA name, JA card art, and JA market price — without changing their UI language.
- `printing_group_id` (introduced above) groups printing variants — standard, Enchanted, promo — and groups them **across both languages**. To slice by one dimension at a time: same `(set_code, collector_number)` = same printing in different languages; same `printing_group_id` + same `langcode` = different printings in the same language.

**Why not Drupal content translation?** Drupal i18n treats languages as alternates of a single canonical entity, with field-level translatability. That model fits *authored* content (news articles, UI strings) where one logical thing exists in multiple translations. Cards are different: each printed-language version is its own physical product with its own data — different printed art, different market price, different rules-text wording chosen by the publisher's localization team, not by a translator at our site. Treating language as a property of the data avoids forcing a contrived "canonical" language and lets a visitor browse any language without first switching their UI.

**Taxonomy term display.** Shared taxonomy terms (`card_classification`, `keyword_ability`, `ink_color`, plus the set name on `card_set`) **do** use Drupal's standard term translation. When rendering a card, terms are displayed in the **card's** `langcode`, not the visitor's UI language — so a French card shows "Défi" and an English card shows "Challenger" regardless of which UI language the visitor is browsing in.

**Import implications.** Each `(set_code, collector_number, langcode)` round-trips to and from Lorcast independently; the importer creates or upserts the matching node and writes the language-specific values directly. See [spec 3: idempotency](03-card-import.md#idempotency--conflict-handling).

## `card_set` node bundle

| Field | Type | Notes |
|---|---|---|
| `nid` | integer | Drupal-assigned. |
| `lorcast_id` | string | |
| `code` | string | Short code: "1", "2", "D100" (the promo Disney 100 set). Unique index. |
| `name` | node `title`, translatable | "The First Chapter", "Le Premier Chapitre". Uses the node's built-in title field. |
| `released_at` | date | |
| `prereleased_at` | date (nullable) | |
| `card_count` | integer | Denormalized count of imported cards. Updated by the importer. |
| `pack_distribution` | structured field (JSON-typed) | See below. |
| `is_draftable` | boolean | Whether the draft simulator should offer this set. |

### `pack_distribution`

This is the per-set spec for what a booster pack contains. We store it as JSON on the set node (not in code) so admins can override per-set without a code deploy. Ravensburger doesn't publish per-rarity pull rates; community polling on [Lorcana Portal](https://lorcanaportal.com/pull-rates/) gives us the foil-slot Enchanted (~2%) and Legendary (~2.4%) rates for the Fabled set, plus the qualitative observation that legendaries are "much more common than Enchanted."

**Default shape** (used for any set without a manual override):

```yaml
pack_size: 12
slots:
  - count: 6
    rarities: [common]
  - count: 3
    rarities: [uncommon]
  - count: 2
    rarities: [rare, super_rare, legendary]
    weights:  [0.70,  0.22,       0.08]
  - count: 1
    foil: true
    rarities: [common, uncommon, rare, super_rare, legendary, enchanted]
    weights:  [0.55,   0.30,     0.09,  0.02,       0.02,      0.02]
```

**Numbers calibration notes:**
- The 6/3/2/1 pack structure is the mainstream-recent breakdown confirmed by multiple sources (Lorcana Player, Dexerto, retailer product pages).
- The 2 rare-or-higher slots' Rare/Super Rare/Legendary weights are best-effort estimates — no precise community data exists. They feel reasonable; calibrate when reports come in.
- Foil-slot weights are anchored on the Lorcana Portal Fabled data (~2% Enchanted, ~2.4% Legendary, foils are "mostly common and uncommon") with the remaining mass split proportionally.

**Per-set manual override:** an admin can edit any set's `pack_distribution` via the standard node edit form (the field is JSON-typed with a structured widget). When a set's distribution looks off in practice, fix it there; the draft simulator re-reads the field on every draft start.

The draft simulator's pack generator (spec 5) consumes this structure verbatim — no per-set special-case code.

## `card_classification` — taxonomy

Vocabulary: `card_classification`. Terms are translatable.

Seed list (will grow as new sets release):

`Hero, Villain, Ally, Princess, Prince, King, Queen, Captain, Knight, Inventor, Sorcerer, Pirate, Dragon, Storyborn, Dreamborn, Floodborn, Broom, Madrigal, Detective, Mentor, Musketeer, Tigger, Seven Dwarfs, Puppy`

Imported automatically — when the importer sees a classification on a card it doesn't recognize, it creates the term (English) and queues it for manual translation review.

## `keyword_ability` — taxonomy

Vocabulary: `keyword_ability`. Terms are translatable. Term fields:

| Field | Type | Notes |
|---|---|---|
| `name` (term label) | string, translatable | "Challenger", "Défi" |
| `machine_name` | string | Stable ID: `challenger`, `bodyguard`. Indexed; used by the importer's text parser. |
| `parameterized` | boolean | Whether the keyword takes a `+X` value (Challenger, Resist) or a parameter (Shift by name). |
| `parameter_kind` | enum: `none`, `integer`, `card_name` | Drives the importer's regex and the renderer. |
| `reminder_text` | long text, translatable | "While challenging, this character gets +X strength." Used in tooltips and the card detail page. |

Seed list shipped via config + a migration: `Bodyguard, Challenger, Evasive, Reckless, Resist, Rush, Shift, Singer, Support, Ward, Vanish, Sing Together, Universal Shift, Puppy Shift`.

When new keywords appear in a future set, an admin adds the term via the UI in a couple of clicks. The importer's text parser fails loudly (logs + admin notice on `/admin/lorcana`) if it encounters an unknown keyword in a card's rules text — that's the prompt to add the term.

Edit permission on the `keyword_ability` vocabulary is restricted to the `site_admin` role (the only authenticated role at launch). No anonymous editing.

## News article (Drupal node bundle)

Standard fields plus:

| Field | Type | Notes |
|---|---|---|
| `title` | string, translatable | |
| `body` | long text (formatted), translatable | CKEditor 5 with the standard Drupal toolbar. |
| `hero_image` | image, translatable (alt text only) | Crop API for the listing thumbnail. |
| `category` | entity reference → `news_category` taxonomy | Set Reveals, Tournament Reports, Rules Updates, Opinion, etc. |
| `featured_cards` | entity reference (multi) → `card` | Optional. Renders an inline card-strip in the article. |
| `author` | entity reference → user | The Drupal author. (We'll show display name; usernames remain internal.) |
| `published_at` | datetime | Separate from Drupal's `created` — lets editors schedule. |

## Identity & dedup

Canonical card identity is the tuple `(set.code, collector_number, langcode)` — one node per printing per language. The importer:

1. Looks up the card node by `lorcast_id`. Each Lorcast ID corresponds to exactly one `(printing, language)`, so this resolves unambiguously to one of our nodes.
2. If not found → look up by the natural key `(set_code, collector_number, langcode)`, where `langcode` is the language of the response being processed.
3. If found → update in place.
4. Otherwise → create a new card node, setting its `langcode` to match the response's language.

There's no per-field translation step: each `(printing, language)` is its own node, so the importer either updates the matching node or creates a fresh one. Sibling-language nodes are not formally linked by a translation set; the relationship is implicit via the shared `(set_code, collector_number)`. Views and pages that need to show language siblings (e.g., the "Other languages" section on the card detail page — [spec 4](04-news-and-encyclopedia.md#card-detail-page)) query by that pair.

## ER overview

```
card_set (node) ──< card (node, langcode) >── card_classification (taxonomy)
                          │
                          ├── ink_color (taxonomy, 1)
                          └── keywords (structured field, 0..n) ──> keyword_ability (taxonomy)

news_article (node) ──< featured_cards >── card
news_article (node) ── category ── news_category (taxonomy)

card (node) ── printing_group_id ── (groups variants + language siblings; no separate entity)
card (node) ── (set_code, collector_number) ── sibling-language nodes (implicit via shared natural key)
```

## Search API index

A single index, `cards`, with these fields enabled for search/facet/sort:

- Fulltext: `name`, `version`, `text`, `flavor_text`. Each card node is indexed in its own `langcode` and tokenized with the matching per-language analyzer.
- Facets: `langcode` (defaults to the visitor's UI language; visitors can override without changing UI), `ink`, `card_types`, `rarity`, `set`, `classifications`, `keywords.keyword_id`, `cost` (bucketed 0,1,2,3,4,5,6,7,8+), `inkable`.
- Sort: `cost`, `lore`, `strength`, `willpower`, `released_at`, `collector_number`.

The default `cards` listing filters to a single content language at a time (the visitor's UI language by default), since otherwise each printing would appear once per language in results. A language switcher in the filter sidebar lets visitors override (see [spec 4: default filters](04-news-and-encyclopedia.md#default-filters-primary-printing--single-language)).

Backend: database in v1. Switch to Solr or Meilisearch if total-card-count × user-load makes the DB index too slow. ~15k printings × 2 languages = ~30k indexed card nodes — still well within database backend territory.
