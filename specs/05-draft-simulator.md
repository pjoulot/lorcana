# 05 — Draft Simulator

The flagship interactive feature. Up to 8 players join a virtual room, open simulated booster packs, take turns picking cards, and walk away with a 40-card pool to play with physical cards.

## Design constraints

- **Mobile-first.** Most players will draft from their phone. Card size, tap targets, scroll behavior, and pack-rotation animation are all designed for a small screen first. Desktop is the "scales up" case.
- **React** for the embedded SPA. The team knows React; the bundle stays small with Vite + production-mode tree-shaking.
- **No analytics** during a draft. We don't want any third-party scripts running while peers are exchanging picks.

## Goals & non-goals

**Goals**
- Faithful simulation of an official Lorcana booster draft (4 packs of 12 cards per player; pass direction alternates).
- Real-time pick experience: when one player picks, the others see the pack rotate to them within ~1s.
- Low ops burden. Drupal handles signaling only.
- Reasonable resistance to casual cheating without burning weeks on cryptography.

**Non-goals**
- We do **not** simulate gameplay after the draft. Players take their pool offline.
- We do not record voice/video. Players can voice-chat on Discord alongside.
- No matchmaking, ranked play, or persistent stats.

## End-to-end user flow

1. Alice visits `/draft`.
2. Clicks **Create room**. Picks a set from a dropdown (Wilds Unknown, Winterspell, etc. — only sets marked `is_draftable`). Picks pack count (default 4). Picks player count (default 4, max 8).
3. Server returns: room code `XKPM`, a player token (cookie), Alice's pseudonym chosen via a small input.
4. Alice shares the code with friends.
5. Bob visits `/draft`. Enters `XKPM`, picks a pseudonym, clicks **Join**.
6. Alice's screen updates with Bob in the roster.
7. When all expected players are present, Alice clicks **Start draft**.
8. Server generates **all packs** deterministically. Sends each player their pack 1 envelope (12 face-down cards from the pool, with rarities respecting the set's `pack_distribution`).
9. Peers establish a WebRTC mesh during the "Get ready" countdown (3 seconds — gives signaling time to finish).
10. Pack 1 opens for everyone simultaneously. Each player picks one card. Picks broadcast over the mesh.
11. When all picks are in, packs rotate (left for pack 1). Round 2 within pack 1 begins. And so on, until pack 1 is empty.
12. Server releases pack 2 (when the last card of pack 1 is picked). Direction reverses.
13. Continue through 4 packs.
14. Draft complete. Each player sees their 48-card pool. They can mark which 40 they'd play. They can export to CSV / image / share-link (the link is a client-generated URL with the pool encoded — nothing is stored on our server).

## Architectural shape

```
                 Browser A             Browser B          ... up to 8
                    │                     │                    │
                    │ HTTPS (signaling    │                    │
                    │  + start + result)  │                    │
                    ▼                     ▼                    ▼
              ┌─────────────────────────────────────────────────┐
              │  Drupal 11 — lorcana_draft module               │
              │                                                 │
              │   • POST /api/draft/room                        │
              │   • POST /api/draft/room/{code}/join            │
              │   • POST /api/draft/room/{code}/start           │
              │   • GET  /api/draft/room/{code}/signal          │
              │           (HTTP long-poll, 25s timeout)         │
              │   • POST /api/draft/room/{code}/signal          │
              │   • POST /api/draft/room/{code}/release-pack    │
              │                                                 │
              │   • coturn credential broker (REST API)         │
              │                                                 │
              │   ┌────────────────────────────────┐            │
              │   │ Redis: room:{code} → state     │            │
              │   │        signal:{code}:{peer}    │            │
              │   │        packs:{code}:{round}    │            │
              │   └────────────────────────────────┘            │
              └─────────────────────────────────────────────────┘
                    │
                    │ TURN credentials (short-lived, HMAC-signed)
                    ▼
                coturn (same OVH box, separate port)

       After mesh forms:

       Browser A ◄═══ WebRTC data channel ═══► Browser B ◄═══► C ◄═══► ...
                              (full mesh, pick events ~200 bytes)
```

## Topology: full mesh

Every peer connects to every other peer via an `RTCPeerConnection` with an ordered, reliable data channel.

Why mesh:
- Payload is tiny (a pick event is `{round, pack_index, pick_index, picker_id, card_id, ts, sig}` ≈ 200 bytes).
- 8 players × 7 peers each = 28 connections per browser. Trivial for data-only.
- No host-migration logic needed. The draft survives as long as any one peer remains.

State authority: every peer holds the full draft state in memory (32-card-pool per player × 8 players = trivial). When a peer reconnects, it requests a state snapshot from any other peer.

## Signaling: HTTP long-poll

We deliberately avoid a Node WebSocket sidecar. Signaling is brief (~30s during room setup) and a few KB of traffic; HTTP long-poll on the Drupal endpoints handles it without adding infrastructure.

Flow:

- Peer A wants to send an SDP offer to peer B. A POSTs `{to: B, payload: {sdp}}` to `/api/draft/room/{code}/signal`. Drupal stashes it in Redis: `signal:{code}:{B}` → list-push of envelopes.
- Peer B is doing GET `/api/draft/room/{code}/signal` (long-poll, max 25s). The server pops any envelopes addressed to B and returns them; if none, blocks up to 25s waiting.
- Each peer keeps a long-poll open continuously during the signaling phase. Closes it once the mesh is formed.

Redis storage:

```
room:{code}                 → JSON: {set, packs, players: [{id, pseudonym, joined_at}], state, created_at}
signal:{code}:{peer_id}     → list of envelopes (LPUSH/BRPOP)
packs:{code}:{round}:{pid}  → JSON: array of 12 card IDs (only readable to player {pid})
```

All keys have TTLs:
- `room:{code}` — 2h TTL, refreshed on every event.
- `signal:*` — 5min TTL.
- `packs:*` — 2h TTL, deleted as the pack is drafted.

## Pack generation (server-side, deterministic)

Determinism gives us replay + audit + simple fairness. The server is the single source of truth for what cards exist in each pack.

Algorithm at `POST /api/draft/room/{code}/start`:

1. Compute `seed = hash(room_code + set_code + start_timestamp + nonce)`. Store nonce in Redis.
2. Seed a CSPRNG.
3. Fetch the set's card pool from `lorcana_cards.pack_pool` service, grouped by rarity.
4. For each `(player, pack_index)` in `(players × pack_count)`:
   - Build a pack by sampling from each rarity slot per the set's `pack_distribution`.
   - Push to `packs:{code}:{pack_index}:{player_id}`.
5. Release **only pack 1** to each player (their own pack only). Packs 2/3/4 stay server-side, released when the previous pack is exhausted across all players.

**Duplicates across packs are expected and allowed.** A real Lorcana booster box of 24 packs contains many duplicates of common cards; commons especially repeat heavily. Our pack generator samples **with replacement across packs** (independent draws — two different packs may contain the same common, and at high enough player counts the same uncommon). **Within a single pack** we sample without replacement (no two of the same card in one pack — matches physical-pack behavior). This is the correct simulation of a real draft and the only way small sets remain draftable at 4-8 players.

**Why staged release?** It prevents a peer from MITM'ing the data channel to see future packs early. Each peer only ever sees, for any round, the packs that will reach them via the rotation. Even that is implemented client-side: each pack is sent to its initial owner; rotation happens over the mesh.

**Why deterministic seeding?** Auditability and reproducibility — the same seed produces the same draft every time, useful for testing the generator. We don't persist the seed beyond the room's Redis TTL, since [we don't store completed drafts](#draft-persistence).

## Room privacy & access control

Rooms are **private by default**. There is no public room list, no matchmaking, no "find a draft" UI. The only way into a room is to have its 4-character code, which the host shares directly with friends (text, Discord, voice, whatever).

### Access rules

- The host picks the player count at room creation (default 4, max 8). Once that many players have joined, the room is **automatically closed** to new joiners.
- The host can manually **lock** the room earlier from the lobby (e.g., 3 of 4 friends are in, the 4th isn't coming). Once locked, the code is dead until the host unlocks.
- The host can **kick** any other player from the lobby or during the draft. A kicked player's pseudonym is added to a per-room block-list; if they try to rejoin with a new pseudonym, their browser fingerprint (a stable client-side ID stored in localStorage and sent at join) still blocks them. (Determined attackers can clear localStorage — see "what we accept.")
- Once the draft starts, the room rejects new joiners entirely. Only rejoins (via stored player tokens) are accepted.
- After the draft ends, the room enters a 15-minute "review" window where the same players can see their pools, then expires.

### Anti-brute-force

Code space: 4 characters × 22-character alphabet (A-Z minus I, O, 0, 1) = **234,256 codes**. With only the active codes mattering (a few hundred concurrent rooms, max), random brute-force hit rate is in the millions-to-one.

To make brute-force even less attractive:

- The **join endpoint is rate-limited to 5 attempts per minute per IP**, with exponential backoff after the first miss. After 20 misses in an hour, the IP gets a 24h cooldown.
- Failed join responses (wrong code, room full, room locked, room not found) are identical — a 404 — so attackers can't enumerate which codes exist.
- Long codes are an option for the paranoid host: a "long code mode" toggle at room creation produces a 6-char code (~10M codes) at the cost of being harder to read aloud. Default stays at 4.

### What we explicitly accept

- A host who shares the code in a public Discord channel will get strangers. Their problem, not ours.
- A determined attacker with a botnet can mount distributed brute-force. The mitigations above make it impractical for a fan site; if it ever becomes a real problem, we add CAPTCHA or require a one-time email at join.
- A kicked player who clears their browser data can rejoin under a new pseudonym. Acceptable for the friend-group threat model.

### Future hardening (when needed, not now)

- An optional shared **room password** in addition to the code. Useful if a host suspects their code was leaked.
- Friend-list integration (requires user accounts, M5+).
- Phone-number verification or SSO at the join step (overkill for a casual draft app, listed for completeness).

## Draft persistence

**We do not persist completed drafts.** No `completed_draft` entity, no server-side record of who drafted what. Reasons:

- GDPR posture: pseudonyms could constitute personal data; not storing avoids that whole policy area.
- Operational simplicity: no archival entity to model, no retention policy to enforce, no admin UI to browse drafts.
- The feature wasn't requested. Players export their pool to CSV / image / share-link client-side and that's enough.

Implications:
- The "share-link" at draft end encodes the picked pool in the URL (compressed JSON in a query param or fragment). No server lookup. Lossy if very long pools — fall back to CSV download.
- No "view past draft" feature in any future milestone. If demand ever arises, it'd be a clean addition (new entity, opt-in retention).
- The Redis room state is the only record of an in-progress draft and is GC'd by TTL (2h) after completion.

## SEO directives

Every page under `/draft/*` carries `<meta name="robots" content="noindex,nofollow">`. These pages are ephemeral, user-specific, and contain no content worth indexing. Their inclusion in the sitemap is suppressed.

## Cheating model (and what we accept)

We defend against:
- A player editing their browser to "re-roll" a pack: impossible, packs are server-generated.
- A player seeing all packs in advance: impossible, packs are released per-round.
- A player making picks faster than their turn: pick events are signed with a per-session token and validated by other peers; an out-of-order pick is rejected.

We do **not** defend against:
- Two players collusion-chatting on Discord. Solvable only by physical isolation. Not in scope.
- A player closing their browser and refusing to pick (DoS). Mitigated by the pick timer auto-pick fallback (below).
- A player using the browser DevTools to read their own future picks. Their *own* future packs only — they could already see them with normal play; the only thing they don't see is what other players will pass them. Acceptable.

## Pick timer & auto-pick

Each round has a configurable timer (default 60s). When time runs out:

- If a single player is missing their pick, the *first card in pack order* is auto-picked for them. (Deterministic, all peers agree.)
- The auto-picked event is broadcast normally with a `reason: timeout` flag.
- A toast notification appears for that player when they return.

## Reconnection

When a peer disconnects (TCP timeout on every WebRTC data channel from that peer), surviving peers mark them as "offline." If they're the picker for the current round, the pick timer kicks in.

When the peer returns:

1. Browser still has player_token in localStorage. They visit `/draft/{code}`.
2. Server confirms the token matches a player in the room.
3. Client re-establishes WebRTC connections to all surviving peers via signaling.
4. Client requests a state snapshot from any peer: `{type: 'state_request'}` over the data channel. First peer to reply wins.
5. Client merges snapshot into its own state. If a pick was due during the absence and auto-pick fired, the snapshot reflects it.

If **all** peers leave, the room is gone — Redis TTL eventually GCs it. Reconnect to an empty room shows a "draft abandoned" page with the option to start over.

## Library choices

- **PeerJS** for the WebRTC abstraction. Wraps RTCPeerConnection + data channels nicely. We bring our own signaling (the Drupal endpoints), not PeerJS Cloud.
- **React 18+** for the UI. Standard hooks-based components, no Redux — `useReducer` + context for the draft state is enough.
- **Vite** for the bundle build. Output is plain JS + CSS, no runtime Node dependency on the server.
- **Zustand** (small, ~3KB) for the cross-component reactive state store, if context+reducer feels awkward as the app grows. Avoid heavier options.
- No CSS framework. The starterkit theme's SCSS variables are imported into the SPA's CSS so card colors / ink colors / spacing tokens stay consistent with the rest of the site.

## TURN — self-hosted coturn

A small fraction of peers (10-20%) will be behind NAT that defeats direct WebRTC. They need a TURN relay.

**We run coturn on the same OVH VPS as Drupal.** Free, ~5 minutes to configure, no third-party dependency.

- coturn listens on UDP 3478 + TLS 5349; the VPS firewall opens those ports.
- coturn uses its **REST API auth mode**: credentials are short-lived HMAC-signed values, not stored in coturn's database. Drupal endpoint `GET /api/draft/turn-credentials` returns `{username, credential, ttl}` computed from a shared secret. No database round-trip on the coturn side.
- Bandwidth: relayed traffic is signaling-rate small (pick events are kilobytes). Even at 100 concurrent drafters with 20% relayed, we're under 10 MB/day. The OVH VPS bandwidth allowance handles this trivially.
- Fallback if coturn ops becomes a headache: switch the `TurnCredentialBroker` service to a paid provider (Twilio, Metered). The TURN config is behind a single service interface — swapping providers is a config change.

Why not Cloudflare Realtime TURN? It's free *only* when paired with their Realtime SFU, which we don't use (we're data-channel only). Standalone, it's $0.05/GB. Not bad, but for our usage profile coturn is simpler and definitely free.

## Embedded React app structure

```
modules/custom/lorcana_draft/
  js/
    src/
      main.tsx                 # Entry point — mounts <DraftApp/>
      DraftApp.tsx             # Top-level router (Lobby vs Draft vs End)
      api/
        signaling.ts           # POST/GET against Drupal endpoints
        room.ts                # Room CRUD (create, join, start, result)
        turn.ts                # TURN credential fetch
      peer/
        mesh.ts                # PeerJS mesh manager
        protocol.ts            # Wire protocol (pick events, state requests)
      state/
        draft-store.ts         # Zustand store for authoritative draft state
        reducers.ts            # Pure reducers for pick / pass / state-merge
      ui/
        Lobby.tsx              # Pre-draft: roster, room code, share link
        Draft.tsx              # Mid-draft: current pack + picked pile drawer
        Pack.tsx               # The 12-card grid; tap-to-pick
        Card.tsx               # One card; touch-friendly, lazy image
        PickedPile.tsx         # Bottom-sheet drawer of your picks
        Roster.tsx             # Player avatars + connection status
        Timer.tsx              # Pick countdown
        EndScreen.tsx          # Final pool + 40-card selection
        styles/
          tokens.scss          # Imported from theme
          components.scss
    package.json
    vite.config.ts
    tsconfig.json
  src/
    Controller/
      RoomController.php
      SignalController.php
      TurnController.php
    Service/
      RoomManager.php          # Redis-backed CRUD on room state
      PackGenerator.php        # Deterministic pack generation
      TurnCredentialBroker.php # HMAC-signed coturn credentials
    Plugin/
      QueueWorker/
        StaleRoomCleanup.php
```

The compiled JS bundle is committed to `js/dist/` and loaded via a Drupal library on the `/draft/*` routes only.

## Mobile-first UX

The screen real estate target is **375×667** (iPhone SE) up to **414×896** (iPhone Pro Max). Anything wider scales up gracefully.

### Lobby screen (mobile)

```
┌─────────────────────────────┐
│  ← Lorcana Draft            │
├─────────────────────────────┤
│                             │
│       Room code             │
│       ┌─────────┐           │
│       │  XKPM   │  [Copy]   │
│       └─────────┘           │
│                             │
│  Players (3 / 4)            │
│  ┌───────────────────────┐  │
│  │ ● Alice (you)         │  │
│  │ ● Bob                 │  │
│  │ ● Cleo                │  │
│  │ ○ Waiting...          │  │
│  └───────────────────────┘  │
│                             │
│  Set: Wilds Unknown      ⌄  │
│  Packs: 4                ⌄  │
│                             │
│  [ Start draft ]            │
│  (host-only; greyed for     │
│   non-hosts)                │
└─────────────────────────────┘
```

### Active draft screen (mobile)

```
┌─────────────────────────────┐
│ Pack 1 of 4 · pick 3 of 12  │
│ ⏱ 0:47        [Roster (4)] │
├─────────────────────────────┤
│                             │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │card│ │card│ │card│       │
│  │ 1  │ │ 2  │ │ 3  │       │
│  └────┘ └────┘ └────┘       │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │card│ │card│ │card│       │
│  │ 4  │ │ 5  │ │ 6  │       │
│  └────┘ └────┘ └────┘       │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │ 7  │ │ 8  │ │ 9  │       │
│  └────┘ └────┘ └────┘       │
│   (10,11,12 below — scroll) │
│                             │
├─────────────────────────────┤
│ My picks (2) ▲              │  ← bottom-sheet, swipe up to expand
└─────────────────────────────┘
```

Tapping a card brings up a full-screen preview with a **Pick** button — single-tap pick is too easy to mis-fire. Pinch-zoom on the preview reveals fine rules text. Two-tap pattern: tap card → tap "Pick". Tap outside the preview to dismiss.

### Roster overlay

Tapping the "Roster (4)" pill shows player avatars + connection status as a sheet. The active picker (whose turn it is) gets a pulsing border. Long-press a player → kick option (host only).

### Picked pile drawer

A bottom-sheet swipes up from off-screen. Shows your picks grouped by ink color, with rarity badges. Tap to deselect (during the optional 40-card-selection phase at end of draft).

### Animations

- Card-tap pick: card scales up briefly, then "shoots" toward the bottom-sheet (CSS transform, 200ms). Other peers see a "Cleo picked" toast.
- Pack rotation: the entire pack-of-cards swooshes left/right based on pass direction, replaced by the next pack with the same animation in the opposite direction. ~400ms.
- Connection lost: avatar turns grey with a "reconnecting…" caption. Persistent until the peer rejoins or the timer triggers auto-pick.

### Desktop scaling

- Two-column layout: pack grid on the left, picked pile + roster on the right (no drawers needed).
- Card preview opens as a modal centered on the screen.
- Keyboard shortcuts: number keys 1-9 select cards 1-9, `Enter` confirms pick, `r` toggles roster.

### Accessibility notes

- All cards have descriptive alt text.
- The pick flow works keyboard-only (Tab to focus, Enter for preview, Enter again for pick).
- Color is not the only indicator: ink color is shown alongside an ink-name label and an icon.
- Pick timer is visually prominent but also announced via `aria-live` at 30s remaining and 5s remaining.

## Wire protocol (over data channel)

JSON messages, schema-versioned:

```json
{ "v": 1, "type": "pick", "round": 1, "pack_index": 0, "pick_index": 3, "picker_id": "bob", "card_id": "lorcast_abc", "ts": 1234567890, "sig": "..." }
{ "v": 1, "type": "state_request", "from": "bob" }
{ "v": 1, "type": "state_snapshot", "to": "bob", "state": {...} }
{ "v": 1, "type": "heartbeat", "from": "bob", "ts": 1234567890 }
{ "v": 1, "type": "pseudonym_update", "player_id": "bob", "pseudonym": "Bob" }
{ "v": 1, "type": "pack_passed", "from": "bob", "to": "alice", "pack_contents_remaining": ["...", "..."] }
```

The `sig` field on pick events is an HMAC over `{room_code, picker_id, round, pick_index, card_id}` using the player token issued at join (which is itself signed by the server). Other peers verify the HMAC and reject mismatches. This stops a malicious peer from forging picks "from" another player.

## Reasonable load assumptions

- Each room: 4-8 concurrent connections to Drupal during signaling (~30s window).
- 100 concurrent active drafts at peak = ~600 concurrent long-polls on PHP-FPM. Tunable with FPM workers (each long-poll holds a worker; we'd need 1000+ workers, which is a lot of memory).

**If long-polling against PHP-FPM doesn't scale**, the fallback is a small Mercure server (or Node + ws) listening on a separate port — but that's a milestone-2 optimization. v1 launches with HTTP long-poll on Drupal. We measure under realistic load before deciding.

(Alternative: replace long-poll with **SSE via php-fpm + a Reactor like ReactPHP**, but ReactPHP inside a typical Drupal stack is a heavy lift. Mercure is a cleaner upgrade path.)

## Phasing within milestone 3

(See [roadmap](06-roadmap.md) for milestone phasing.)

1. **3a — Solo dry run.** Single-player "draft" mode: server generates packs, you pick through 4 packs alone. No peers. Validates pack generation and UI. No WebRTC.
2. **3b — Two-player happy path.** Two browsers, full WebRTC mesh (trivially: 1 connection), no reconnect handling, no timer. Validates signaling and pick broadcast.
3. **3c — Multi-player.** 4-8 player support. Full mesh. Rotation. Share-link export.
4. **3d — Hardening.** Pick timer, auto-pick, reconnect, TURN integration, abuse alerts, room lock + kick.

Each sub-phase is shippable in isolation.
