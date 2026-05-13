# Lorcana Fan Site — Build Plan & Specs

A Drupal 11 fan site for Disney Lorcana. This repo currently contains only the planning artifacts; no code yet.

## What we're building

Three primary features:

1. **News** — editorially curated blog about Lorcana (set reveals, tournament coverage, rules updates).
2. **Card encyclopedia** — searchable, filterable index of every Lorcana card, fed from external community APIs.
3. **Draft simulator** — players join a room by code, open simulated booster packs, and pick cards together over WebRTC. **Mobile-first**: most players will be picking from a phone. Finished drafts are exported client-side (share-link / CSV) and never stored on our server. The actual game is then played with physical cards; we don't simulate the game itself.

## Key constraints & decisions

- **Drupal 11** on **MariaDB 11**, hosted on a single **OVH VPS** (EU region; GDPR-aware even though early traffic is likely Canada-heavy).
- A minimal **starterkit-generated theme** (not an Olivero sub-theme) so we inherit as little as possible from core themes.
- Two custom modules: `lorcana_cards` (card content + importer + encyclopedia) and `lorcana_draft` (draft rooms + WebRTC signaling). News and other content shapes are handled via **config sync** in the install profile.
- **Card data is imported, not authored** — the encyclopedia is a read-mostly mirror of upstream data. The **Lorcast API is consumed at import time only**, never at runtime page-render. A pluggable importer abstraction lets us add sources beyond Lorcast over time.
- **Multilingual at launch: English + French**. Other languages can be added later — that's a Drupal core feature.
- **No user accounts at launch.** Only site admins log in. The draft simulator uses room codes + ephemeral pseudonyms. The data model is designed so accounts can be added later without migration pain.
- **The Drupal server does not arbitrate draft gameplay.** It handles signaling (peer discovery) and pre-generates deterministic pack contents at draft start. Once peers connect, all pick traffic flows over WebRTC data channels.
- **No comments, ever** on news articles. No analytics provider at launch (the integration slot is built; we just don't wire a provider).
- **Light + dark mode** are both first-class; user toggles, system default respected on first visit.
- **Closed-source / proprietary.** Single private repo. The code is not open source.

## Reading order

Specs are numbered. Read them in order on first pass.

| # | Document | What it covers |
|---|---|---|
| 1 | [Overview & architecture](specs/01-overview-and-architecture.md) | Scope, audience, tech stack, Drupal module layout, non-goals |
| 2 | [Data model](specs/02-data-model.md) | Lorcana domain entities, fields, identity, relationships |
| 3 | [Card import pipeline](specs/03-card-import.md) | Pluggable importer system, Lorcast adapter, scheduling, image handling |
| 4 | [News & encyclopedia features](specs/04-news-and-encyclopedia.md) | Blog content type, card index UI, search & filtering |
| 5 | [Draft simulator](specs/05-draft-simulator.md) | WebRTC topology, signaling, room lifecycle, pack generation, fairness, reconnect |
| 6 | [Roadmap](specs/06-roadmap.md) | Milestones, what ships in each phase, future accounts |
| 7 | [Decisions log & open questions](specs/07-open-questions.md) | What's been decided, with the rationale; remaining open items at the bottom |

## Status

Planning only. Nothing is built. Once these specs are approved, milestone 1 (per the roadmap) is "set up Drupal 11 and import card data."

## Disclaimers

This is a fan project. Disney Lorcana is © Ravensburger / Disney. The site will operate under Ravensburger's Community Code Policy: no charging users for access, clear "not affiliated" disclaimer in the footer, no use of official marks beyond what fair-use community sites do. See spec 1 for details.
