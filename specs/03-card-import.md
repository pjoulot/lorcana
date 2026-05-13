# 03 — Card Import Pipeline

The encyclopedia is fed entirely by external data. This spec defines the pluggable importer architecture, the Lorcast adapter (our first plugin), scheduling, image handling, and operational concerns.

## Design principles

1. **Pluggable from day one.** We don't hardcode Lorcast anywhere outside one plugin. Adding `lorcana-api.com` later, or pulling from dreamborn.ink, is a matter of writing a new plugin class.
2. **Import-time only.** The Lorcast API (or any upstream) is touched **only by the import pipeline**, never at page-render time. Every encyclopedia request is served from our local nodes — no live API calls on the read path. This rule survives all future changes.
3. **Idempotent.** Re-running an import never duplicates data; it upserts based on stable identity.
4. **Resumable.** A crash mid-import doesn't corrupt state. The next run picks up where the previous left off.
5. **Observable.** Every run logs which cards were created/updated/skipped and which failed.
6. **Polite.** Respect upstream rate limits. Cache responses locally. Don't slam Lorcast nightly when most data hasn't changed.

## Plugin system

We use Drupal's built-in plugin discovery mechanism. Two **separate** plugin types — card data and card images are decoupled.

Rationale: a great structured-data source isn't always the best image source. Lorcast has excellent structured data; another community site might one day have higher-quality or more-complete images. Splitting the two means we can mix-and-match per-site-admin preference without touching downstream code.

### `CardDataImporterInterface`

Fetches structured card data only. Knows nothing about images beyond the URLs the upstream may include in its response (which are passed along in the DTO for the image importer to optionally use).

```php
namespace Drupal\lorcana_cards\Importer;

interface CardDataImporterInterface {

  public function getId(): string;
  public function getLabel(): string;

  /**
   * List sets known to the upstream source.
   * @return SetSummary[]
   */
  public function listSets(): array;

  /**
   * Fetch all cards in a set for a given language.
   * Yields one normalized CardData object at a time.
   *
   * @return \Generator<CardData>
   */
  public function fetchCardsForSet(string $setCode, string $langcode): \Generator;

  public function supportedLanguages(): array;
  public function supportsPriceRefresh(): bool;
  public function fetchPricesForSet(string $setCode): \Generator;

}
```

### `CardImageImporterInterface`

Fetches and provisions images for a card. Receives the `CardData` DTO (so it can read any source URLs the data importer captured) plus the card node identity (so it can look up the existing card if needed).

```php
namespace Drupal\lorcana_cards\Importer;

interface CardImageImporterInterface {

  public function getId(): string;
  public function getLabel(): string;

  /**
   * Whether this importer can produce an image for this card.
   * Lets us register "specialized" importers that only handle a subset
   * (e.g. an Enchanted-only importer, or a French-only importer).
   */
  public function supports(CardData $card): bool;

  /**
   * Fetch and convert the image at a given size.
   * Returns the local file path (in Drupal public:// or temp), or null
   * if unavailable. Conversion to JPG is the implementer's responsibility,
   * delegating to lorcana_cards.image_converter for the actual transcode.
   *
   * @param 'small'|'normal'|'large' $size
   */
  public function fetchImage(CardData $card, string $size): ?string;

}
```

### `CardData` value object

Plugin-neutral DTO. Data importers populate it; image importers can read from it (especially the `sourceImageUrls` field, which carries whatever URLs the data source provided). Field set matches the `card` node (see [data model](02-data-model.md)).

Includes a `sourceFields` blob for fields the upstream provides that we don't yet model — preserved so we can introspect what's available before committing to schema changes.

### Plugin discovery

Plugins live in:

```
modules/custom/lorcana_cards/src/Plugin/CardDataImporter/   # data plugins
modules/custom/lorcana_cards/src/Plugin/CardImageImporter/  # image plugins
```

Annotations:

```php
/**
 * @CardDataImporter(
 *   id = "lorcast",
 *   label = @Translation("Lorcast"),
 *   homepage = "https://lorcast.com",
 *   supports_languages = {"en", "fr", "de", "it"}
 * )
 */
class LorcastDataImporter implements CardDataImporterInterface { ... }

/**
 * @CardImageImporter(
 *   id = "lorcast",
 *   label = @Translation("Lorcast (default)"),
 *   homepage = "https://lorcast.com"
 * )
 */
class LorcastImageImporter implements CardImageImporterInterface { ... }
```

Two managers (`CardDataImporterManager`, `CardImageImporterManager`) expose `getDefinitions()` and `createInstance($id)`. Site admin picks the primary data importer and the primary image importer **independently** via two separate config keys.

### Default v1 setup

- Primary data importer: **Lorcast**.
- Primary image importer: **Lorcast** (downloads AVIF, converts to JPG per the image pipeline below).
- No second plugin ships in v1.

### Future image-importer candidates

Listed for reference; none of these ship in v1 and adding any of them requires (at minimum) verifying the source's terms of use:

- **`manual`** — placeholder importer that does nothing programmatically; admin uploads JPGs via the standard Drupal node edit form. Useful as a per-card override layer (see [Manual image overrides](#manual-image-overrides) below).
- **`lorcanaplayer`** — would scrape lorcanaplayer.com. Requires reaching out to them for permission; their site already blocks automated requests. Not on the roadmap.
- **`ravensburger_official`** — hypothetical, if Ravensburger ever publishes official assets.
- **`dreamborn`** — another community site; same permission considerations.

### Manual image overrides

Independent of which image importer is configured globally, **each card node supports a manual image override**:

- Card node has the standard three Drupal image fields (`image_small`, `image_normal`, `image_large`).
- Plus a `is_image_manual_override` boolean flag.
- When an admin uploads an image to a card and saves the node, `is_image_manual_override` is auto-set to `true`.
- The importer **skips images** for any card with `is_image_manual_override = true`. The admin's image survives all subsequent re-imports.
- Admin can clear the flag to re-enable automated updates.

This addresses the most common "I wish this card used a different image" need without requiring a whole new plugin.

## Lorcast plugin specifics

API base: `https://api.lorcast.com/v0`.

Endpoints we'll consume:

- `GET /sets` — list all sets.
- `GET /sets/:id/cards` — list cards in a set (returns full card objects).
- `GET /cards/search?q=lang:fr+set:1` — used to fetch French data per set. (Lorcast's search supports `lang:` filter — to be verified at implementation time; if not, we fall back to per-card lookup.)
- `GET /cards/:set/:number?lang=fr` — single card with language override (also to verify; we'll discover the exact mechanism during implementation).

### Rate limits

Lorcast asks for ~50-100ms between requests (≈10/sec). The plugin uses Guzzle with a custom middleware that enforces a 100ms minimum interval between requests using a Redis-backed token bucket — survives restarts and Drush vs. cron parallelism.

429 responses → exponential backoff (1s, 2s, 4s, 8s, max 30s). After 3 consecutive 429s, the importer pauses for 5 minutes and emits a warning.

### Caching

We cache full set responses for 24h on the local filesystem (`private://lorcana_import_cache/lorcast/sets-<id>.json`). When an import runs:

1. Check cache age. If <24h, use cache.
2. Otherwise fetch fresh.

This keeps reruns near-instant and respects Lorcast's "cache 24h+" guidance. Cache is opt-out via a Drush flag (`--no-cache`).

### Mapping Lorcast → CardData

Field-by-field, mostly 1:1. Notable transforms:

- Lorcast's `inkwell` → our `inkable`.
- Lorcast's `legalities.core` → our `legal_core`.
- Lorcast's `image_uris.digital.{small,normal,large}` → our three image URI fields. URLs are fetched per language (using Lorcast's `lang:` filter or per-card lang override) and written to the corresponding per-language card node — see [Language variants](02-data-model.md#language-variants) in spec 2.
- Lorcast returns `text` containing icons like `{i}` for ink and `{e}` for exert. We store the raw text; rendering replaces them with inline SVG icons in the theme layer.
- Lorcast doesn't return structured keywords; we **parse** them out of `text` using a per-keyword regex set built from the `keyword_ability` taxonomy (each term's `machine_name` + `parameter_kind` drives one regex). Example: `Challenger \+(\d+)` → `{keyword_tid: <Challenger term ID>, value: 2}`. If parsing finds an unknown keyword-shaped pattern, the import logs a warning and leaves keywords empty for that card — admin gets a notification on `/admin/lorcana` to add the missing term.
- Lorcast's `set` is an embedded object; we use its `code` to resolve to our local `card_set` node (creating it if missing).

## Image pipeline

We **always mirror images locally and never hotlink Lorcast.** Card images are served from our own server only.

### Why local-only

- Eliminates runtime dependency on Lorcast availability.
- Lets us serve a friendlier format than AVIF (we convert to JPG).
- Keeps the read path self-contained: a card detail page loads zero third-party assets.
- Avoids any future Lorcast policy/ToS surprise about hotlinking.

### Format conversion

Lorcast serves AVIF. We convert to **JPG** (quality 88) on import:

- JPG has universal browser support — no fallback `<picture>` element needed.
- File size at q=88 is close to AVIF for these images (small differences below user-perceptibility).
- Card art is photographic-style with smooth gradients; JPG handles it well. Numbers and rules text are large enough to remain crisp.

**Conversion stack:** PHP's `Imagick` extension (ImageMagick under the hood) since it has native AVIF decode. Drupal's own image toolkit can use Imagick as a backend. We register a custom service `lorcana_cards.image_converter` that takes a URL and produces a JPG file at a target dimension.

If a server can't install Imagick with AVIF support, fallback: a small CLI helper using `ffmpeg` (which is widely available and handles AVIF). The converter service abstracts which backend is used.

### Storage layout

```
public://cards/
  <set_code>/
    <langcode>/
      <collector_number>-small.jpg
      <collector_number>-normal.jpg
      <collector_number>-large.jpg
```

Each language gets its own image set — Lorcana cards are printed differently per language (different art credits, different rules-text rendering, localized symbols). Standard Drupal `public://` files directory. Drupal's image styles handle thumbnail derivatives (we may add 64px and 320px derivatives via the standard image-style system later, generated lazily by Drupal's image cache).

### Import-time flow

For each card:

1. Importer reads Lorcast's `image_uris.digital.{small,normal,large}` AVIF URLs.
2. For each size, downloads the AVIF to a temp file.
3. Converts to JPG via `lorcana_cards.image_converter`.
4. Saves into the Drupal file system, attaches to the card node's image field.
5. Stores no Lorcast URL.

### Re-import & idempotency

- If a card already has a local image, the importer **skips** the download unless `--force-images` is passed (a Drush flag).
- The weekly full re-pull (per the scheduling section below) includes `--force-images` once a month, not every week, to catch errata while keeping bandwidth low.
- Failed image fetches don't abort the card import — the card is saved without images and queued for retry. A second pass at end of import retries failures with exponential backoff.

### Disk-space estimate

- ~15k printings × 3 sizes × ~30KB average JPG = **~1.4 GB per language**.
- EN + FR at launch = **~2.8 GB**. Each additional language adds another ~1.4 GB.
- An OVH VPS with 40+ GB disk handles this trivially even at 5+ languages.

### Bandwidth

- First-time import pulls ~15k printings × 2 languages × 3 sizes × ~50KB AVIF ≈ **~4.5 GB one-time fetch from Lorcast** for EN + FR, paced at ~10 req/s.
- Steady-state: only new printings on import day. A new ~200-card set in two languages = ~60 MB.
- We are well within Lorcast's "be polite" budget.

## Scheduling

Three trigger paths:

1. **Manual Drush command:**
   - `drush lorcana:import:sets` — refresh set list.
   - `drush lorcana:import:cards --set=12 --lang=en` — import one set in one language.
   - `drush lorcana:import:all` — full import across all configured languages.
   - `drush lorcana:import:prices` — price-only refresh.
2. **Cron-driven:**
   - Daily at 03:00 UTC: refresh sets + import any newly released sets.
   - Daily at 03:30 UTC: refresh prices.
   - Weekly Sunday 04:00 UTC: full re-pull of all cards (catches errata).
3. **Admin UI:** a `/admin/lorcana/import` page with buttons to trigger any of the above. Useful for editors who don't ssh in.

Cron uses Drupal's queue system (`QueueWorker` plugins). The cron hook enqueues "import set X in lang Y" jobs; the queue worker processes them with rate-limit awareness. This gives natural backpressure and resumability.

## Idempotency & conflict handling

Upsert logic, in pseudocode:

```
for each CardData from importer:
  card = find by lorcast_id
  if not found:
    card = find by (set_code, collector_number, langcode)
  if not found:
    card = new card node with langcode = CardData.language
  apply all fields (cost, ink, name, text, flavor_text, prices, images, ...) -- overwrite
  save
```

Each `(printing, language)` is its own node — no per-field translation step. The node either matches the incoming language under import, or a new node is created with that langcode. Overwrites are intentional. Lorcast is the source of truth; if an editor "fixed" a card description manually, the next import wipes it. To allow editorial overrides, we introduce a `is_editor_locked` boolean per field (deferred to v2 — flagged in roadmap).

Deletions: Lorcast doesn't formally signal "this card was removed." We don't delete. If we ever need to, we'd add a `is_active` field and mark stale cards inactive.

## Multi-source future

When we add a second importer (say, dreamborn.ink), we need a tiebreaker policy. v1 design:

- Admin config sets a **primary source** (Lorcast by default). The primary source's output is authoritative for game-mechanic fields (cost, ink, strength, willpower, lore, rarity, etc.) — fields whose values are identical across languages.
- Secondary sources can only **fill gaps**: any field (including language-specific ones like `flavor_text` or `image_*`) that the primary source has no value for *on a given language node* can be filled by a secondary source. They don't overwrite.
- The `import_source` field on each card node records the primary source that last wrote it. Secondary-source contributions are logged separately (admin UI shows "FR `flavor_text` provided by lorcana-api.com on 2026-01-15" against the matching `fr` card node).

This is enough policy for v1. Truly conflicting data between sources is a milestone-3+ problem.

## Operational concerns

- **Logging.** Every import run writes a structured log: `{run_id, started_at, finished_at, source, language, sets_processed, cards_created, cards_updated, cards_failed}`. Surfaced in an admin report (`/admin/reports/lorcana/imports`).
- **Failure isolation.** A failed card never aborts the rest of the set. Failures are logged with the upstream payload; admin can retry individually.
- **Alerts.** If a full import run has >5% failure rate, send an email/Slack webhook to the site admin.
- **Backfill.** First-time setup: a `drush lorcana:import:all` against an empty DB pulls ~15k cards × 2 langs. Estimated time at 10 req/s: ~50 minutes (Lorcast returns whole sets per request, so it's actually closer to ~5 minutes total — set count × 2 langs × ~2 requests).

## Testing strategy

- Unit tests for the Lorcast → CardData mapper, using captured fixture responses.
- A `--dry-run` flag on every Drush command: logs what would change without writing.
- An integration test (Kernel test) that exercises the full importer against a small fixture set.
- A weekly canary: cron runs a "fetch one well-known card and verify all expected fields are populated." Alert if anything is null that shouldn't be.

## What about official Ravensburger data?

There is no official Lorcana data API. Ravensburger publishes set lists and individual reveals via marketing channels (Twitter, the Lorcana app, retail product pages). Community sites scrape and structure this data. We rely on community APIs as the upstream and document that clearly.

If Ravensburger ever ships an official API, we add it as another plugin and likely make it the primary source.
