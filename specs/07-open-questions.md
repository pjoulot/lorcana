# 07 — Decisions Log & Remaining Open Questions

This started as a list of open questions; most have been resolved. Decisions are recorded here for traceability. Items still open are at the bottom.

## Resolved decisions

### Stack & infrastructure

| Topic | Decision | Notes |
|---|---|---|
| Drupal version | Drupal 11 | Latest stable; PHP 8.3+. |
| Distribution | `drupal/recommended-project` Composer template + custom install profile | Not Drupal CMS. |
| Database | MariaDB 11 | Familiar Drupal pairing. |
| Hosting | Single OVH VPS, EU region | GDPR-friendly default. Canada-heavy audience is fine — latency tolerable. |
| Cache / signaling backend | Redis on the same VPS | |
| Theme | **Standalone `lorcana_theme` generated via `php core/scripts/drupal generate-theme`** — Drupal 11's recommended approach. No base theme inheritance. | The generator copies `starterkit_theme` content into our theme. Old "extend Olivero" or "extend stable9" patterns are not used. |
| **Image format** | **Local JPG only.** AVIF from Lorcast is converted on import via Imagick (q=88). No hotlinking, no AVIF served to browsers. | Universal browser support, no fallback element needed. ~1.4 GB total disk. |
| **Importer architecture** | **Two separate plugin types**: `CardDataImporterInterface` and `CardImageImporterInterface`. Data and images can be sourced from different plugins, configured independently. | v1 ships Lorcast for both. Per-card manual image override flag lets admins replace any card's image without affecting the importer. |
| **Color modes** | **Light + dark, both first-class.** Default: respect `prefers-color-scheme`. User toggle persists via cookie. | |
| **Browser support** | **Modern evergreen, last 2 stable.** iOS Safari 16+, Android Chrome last 2. No IE, no legacy Edge. No graceful degradation beyond native features. | |
| TURN server | Self-hosted **coturn** on the same VPS | Cloudflare TURN is paid for our usage (no SFU). coturn is free and simple. |
| **Source license** | **Proprietary / closed-source.** Single private Git repo. No public release. | If we ever extract a generic Drupal contrib, that piece would relicense to GPL-2.0+. |
| Analytics | None at launch | Twig hook reserved in theme; provider chosen later. |
| Comments | Never on news. Possibly on future user-generated content if the project ever gets there. | |

### Modules & content

| Topic | Decision | Notes |
|---|---|---|
| Custom modules | `lorcana_cards`, `lorcana_draft` | No `lorcana_news` — news is config + theme only. |
| `card` & `card_set` | **Node bundles** | Revisions OFF, comments OFF. Native pages via Drupal routing. |
| `card_classification` | Taxonomy vocab | |
| `keyword_ability` | **Taxonomy vocab** with custom fields (`machine_name`, `parameterized`, `parameter_kind`, `reminder_text`) | Switched from config entity for Facets integration + editor-manageability. |
| `news_article` | Node bundle (config-defined) | |
| **Printing variants** | **Each printing is its own card node**, linked via `printing_group_id` + `is_primary_printing` boolean | Encyclopedia defaults to primary printings; "Show all printings" toggle reveals all variants. Detail page shows "Other printings" section. |
| **Completed drafts** | **Not persisted. Ever.** No `completed_draft` entity. Final pool exported client-side as share-link or CSV. | Sidesteps GDPR posture around pseudonyms. Removed from data model, draft simulator, and roadmap. |

### Multilingual

| Topic | Decision | Notes |
|---|---|---|
| Launch languages | EN + FR | Both UI and card content available. |
| More languages later | Yes — UI via standard Drupal interface translation; card content via additional per-language `card` nodes. | DE/IT/JA/etc. added on demand. Each language adds ~1.4 GB image storage. |
| **Card language model** | **Cards are NOT translated via Drupal i18n.** One `card` node per `(set_code, collector_number, langcode)`. Sibling-language nodes share `(set_code, collector_number)` but are otherwise independent: separate images, prices, name, rules text, market data. | Lets an EN-UI visitor browse the JA version of a card and see its real JA art and price. News articles continue to use standard Drupal content translation since they're *authored* content. See [spec 2: language variants](02-data-model.md#language-variants). |
| News translation workflow | Manual by admins via standard Drupal content translation. | No DeepL, no TMGMT, no machine translation at launch. |
| Card translation workflow | None — cards are imported per language from Lorcast. | If Lorcast has no record for a card in a given language, that language is simply absent until upstream publishes it. |
| Untranslated taxonomy terms | Show English with subtle muted-color indicator; admin dashboard surfaces them. | Applies to `keyword_ability`, `card_classification`, `ink_color` term labels. Terms render in the card's content language, not the visitor's UI language. |

### Draft simulator

| Topic | Decision | Notes |
|---|---|---|
| Primary device | **Mobile-first**, desktop scales up | Phones are the primary draft surface. |
| Frontend framework | **React 18+** + Vite | Team knows it. Zustand for state if needed. |
| WebRTC library | PeerJS with our own signaling endpoint | Not PeerJS Cloud. |
| Signaling transport | HTTP long-poll on Drupal endpoints | No Node sidecar. Mercure is the upgrade path if FPM workers saturate. |
| Topology | Full mesh, 4-8 peers | Trivial for data-channel-only payloads. |
| Pack generation | Server-side, deterministic, staged per round | Drupal generates all packs at draft start; releases pack N only when pack N-1 is exhausted. |
| Pseudonyms | Allowlist (letters/digits/spaces/hyphens, max 20 chars). No profanity filter. Host can kick. | Stricter validation deferred until needed. |
| Abandoned drafts | Continue if ≥2 humans remain (auto-pick for absent ones). Show "abandoned" screen if only 1 remains. | |
| Room privacy | **Code-only entry, no public discovery, no room listing.** Host can lock and kick. Join endpoint rate-limited to 5/min/IP. | Strangers can't stumble in; kick is a safety net for the rare case someone guesses or gets a leaked code. |
| **Pack duplication** | **Duplicates allowed across packs** (independent draws per pack). No duplicates within a single pack (matches physical-pack behavior). | Makes small sets draftable at 4-8 players. Common cards repeat heavily — that's realistic. |
| **Draft pages indexable?** | **No.** `<meta name="robots" content="noindex,nofollow">` on all `/draft/*` pages. Suppressed from sitemap. | Ephemeral, user-specific, no SEO value. |
| **Pricing source** | TCGPlayer only | One link per card. No multi-region storefront integration. |

### Compliance & legal

| Topic | Decision | Notes |
|---|---|---|
| Disclaimer wording | Recommended by legal review; full text in [spec 1](01-overview-and-architecture.md#footer-disclaimer-text-english) | Cites Ravensburger Community Code Policy URL; names Lorcast as data source. |
| Footer disclaimer scope | Site-wide footer is sufficient; no per-card repeat | |
| Required pages | `/about` and `/legal` ship in **Milestone 2** (not delayed to launch polish). `/privacy` when accounts arrive (M5). | |
| Cookie banner | Not needed at launch (no analytics, no marketing cookies) | Revisit when analytics is added. |
| Legal review | Recommended (informally) but not blocking for a fan site of this scope | If donations are ever introduced, get a real attorney's eyes on the disclaimer. |

### Editorial tooling

| Topic | Decision | Notes |
|---|---|---|
| Card references in news | **`[card:1/207]` text token + Drupal filter**, no custom CKEditor 5 plugin | Tokens are portable; no in-editor plugin to maintain. |

### Out of scope at launch

| Topic | Decision |
|---|---|
| User accounts | M5+ |
| Global site search (across news + cards) | M6+ (low priority — explicitly "not that important") |
| Deck builder | M7+ |
| Public API | No |
| Discord integration | No |
| Mobile app | No (responsive web only) |
| Comments | No |
| Tournament/event coverage | M8+ |
| Pricing & market features | M9+ |
| Saved drafts / draft history | **Never** — completed drafts are not persisted. |

### Webform & contact

| Topic | Decision | Notes |
|---|---|---|
| Per-card "Report a problem" | Yes — small footer link on each card detail page; opens a Webform with the card auto-attached as context | |
| General `/contact` page | Yes — Webform-backed | |
| Anti-spam | Honeypot module; no CAPTCHA at launch | Add CAPTCHA only if needed. |
| Submissions handling | Single Drupal admin queue; admins triage manually | No integrated reply tooling in v1. |

## Still open

### O.1 — Pack distribution calibration (low priority; default ships)

**Resolved enough to ship.** The default `pack_distribution` (in [spec 2](02-data-model.md#pack_distribution)) is `6 commons + 3 uncommons + 2 rare-or-higher + 1 foil`, anchored on [Lorcana Portal](https://lorcanaportal.com/pull-rates/) community polling (Fabled set: ~2% Enchanted, ~2.4% Legendary in the foil slot). The exact Rare/Super Rare/Legendary split for the two guaranteed slots is best-effort — no community data exists.

Per-set manual overrides are first-class in the data model: any admin can tune a set's `pack_distribution` JSON field if drafts on that set feel off. No code deploy needed.

**Remaining nice-to-have:** as community polls publish per-set data, an admin pass to tune each set's weights. Tracked as a maintenance task, not blocking any milestone.

### O.2 — Image hotlink vs. local mirror — RESOLVED

**Always local mirror, with AVIF → JPG conversion at import time.** No hotlinking ever. See [spec 3](03-card-import.md#image-pipeline).

### O.3 — Long-poll scaling threshold

[Spec 5](05-draft-simulator.md) says "if FPM workers saturate, evaluate Mercure." We don't pre-optimize. The trigger: PHP-FPM worker utilization >80% during a typical draft hour. Monitoring will tell us.

### O.4 — When exactly to add user accounts (M5)

Driven by demand. Conditions that would push it sooner:
- Multiple admins requesting per-user article authoring.
- Drafters asking "can I save my drafts to a profile?"
- Spam/abuse on the draft simulator that needs identity to mitigate.

No hard timeline. M5 is "when needed."

### O.5 — Editorial team identity

Just the project owner? Two people? More? Affects whether a `news_editor` role gets introduced in M2 or waits for M5. Currently planned as "site_admin only" at launch.

### O.6 — Homepage layout

The home route `/` does not yet have a defined composition. Spec 4 stubs this — design pass will define which sections appear (news teasers, popular cards, draft CTA, etc.), in what order, and what featured content is highlighted. Resolution gated on design deliverables.

### O.7 — SMTP / email provider

Admin password reset and contact-form replies need outbound email. Options: Postmark / SendGrid / Mailgun (paid, ~$10-15/mo), Brevo / MailerSend free tier (limited but enough), self-hosted Postfix (fragile). To pick before M2 launches contact forms.

### O.8 — Expected first-year traffic

We don't know. Affects:
- VPS sizing (small for <10k MAU, medium for <100k).
- Whether Search API stays on database backend or moves to Solr/Meilisearch.
- Whether long-poll on Drupal stays viable for the draft simulator.

We'll launch on a small OVH VPS and monitor.

---

## Decisions log usage

Each milestone kickoff should:
1. Re-read this file.
2. Move any newly-resolved items from "Still open" to the appropriate "Resolved" table.
3. Add new questions as they emerge into "Still open."
4. Never delete a resolved decision; if a decision changes, update its row and add a note: "Revised 2026-XX-XX because…"
