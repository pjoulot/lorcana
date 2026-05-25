// Inkfolk — Draft simulator
// Shared atoms + mock data used across every draft screen.

// ─── Mock data ─────────────────────────────────────────────
// 6 letters, no ambiguous chars (no I/O/0/1) — same length whether
// 1 or 12 active rooms exist, no toggle, no "advanced" mode.
const DRAFT_ROOM_CODE = 'WHRTNK';
const DRAFT_PLAYERS = [
  { id: 'cleo',   name: 'Cleo',   status: 'connected',     you: true,  host: false, picking: false },
  { id: 'jules',  name: 'Jules',  status: 'connected',     host: true,  picking: false },
  { id: 'margot', name: 'Margot', status: 'connected',     picking: true },
  { id: 'theo',   name: 'Théo',   status: 'reconnecting',  picking: false },
];

// Pack of 12 — synthesised from CARDS, varying inks/rarities so the grid
// reads like a real opening rather than 12 of the same card.
const RARITY_CYCLE = ['common','common','common','common','common','common',
                       'uncommon','uncommon','uncommon','rare','super','legendary'];
function makeDraftPack(offset = 0) {
  return RARITY_CYCLE.map((r, i) => {
    const src = CARDS[(i + offset) % CARDS.length];
    return { ...src, rarity: r, pickIndex: i };
  });
}
const DRAFT_PACK = makeDraftPack(0);

// Player's accumulated pool (12 cards so far), grouped logically
const DRAFT_POOL = [
  ...CARDS.slice(0, 5),
  ...CARDS.slice(1, 4),
  ...CARDS.slice(0, 4),
].slice(0, 14).map((c, i) => ({
  ...c,
  rarity: ['common','common','uncommon','common','rare','common','uncommon',
            'common','super','common','common','uncommon','common','legendary'][i] || 'common',
}));

// Full ~48-card end-of-draft pool
const DRAFT_END_POOL = (() => {
  const out = [];
  const rarities = ['common','common','common','common','uncommon','uncommon','rare','super','legendary'];
  for (let i = 0; i < 48; i++) {
    const src = CARDS[i % CARDS.length];
    out.push({ ...src, rarity: rarities[i % rarities.length], poolId: i });
  }
  return out;
})();

// ─── Player avatar with status ring ────────────────────────
// status: 'connected' (green), 'reconnecting' (yellow), 'offline' (gray).
// `picking` adds a pulsing accent ring on top.
const STATUS_COLORS = {
  connected:    '#3D9F6A',
  reconnecting: '#F4B042',
  offline:      '#8C9AA3',
};

function PlayerAvatar({ player, size = 40, label = false, compact = false }) {
  const status = STATUS_COLORS[player.status] || STATUS_COLORS.connected;
  const initial = player.name.charAt(0).toUpperCase();
  // colored backgrounds derived from name hash, but warm tones only
  const hues = ['#E8C6BD','#C9BEDF','#C7DDBC','#EBCB89','#B3D8E2','#D6CBB6'];
  const bg = hues[player.name.charCodeAt(0) % hues.length];
  return (
    <div style={{ display: 'inline-flex', flexDirection: compact ? 'row' : 'column',
                    alignItems: 'center', gap: compact ? 10 : 6, minWidth: 0 }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        {/* Active-picker pulsing ring */}
        {player.picking && (
          <span aria-hidden style={{
            position: 'absolute', inset: -6, borderRadius: 999,
            border: '2px solid var(--accent)',
            animation: 'inkfolk-pulse 1.4s ease-out infinite',
            pointerEvents: 'none',
          }}/>
        )}
        {/* Status ring */}
        <div style={{
          width: size, height: size, borderRadius: 999,
          background: bg,
          boxShadow: `0 0 0 2px ${status}, 0 0 0 4px var(--paper)`,
          display: 'grid', placeItems: 'center',
          color: 'var(--ink)', fontFamily: 'var(--font-display)',
          fontSize: size * 0.42, fontWeight: 600, letterSpacing: '-.02em',
        }}>
          {initial}
        </div>
        {/* Status dot for screen readers + clarity */}
        <span aria-hidden style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 12, height: 12, borderRadius: 999,
          background: status, border: '2px solid var(--paper)',
        }}/>
      </div>
      {label && (
        <div style={{ minWidth: 0, textAlign: compact ? 'left' : 'center' }}>
          <div style={{
            fontSize: 12.5, fontWeight: 600, color: 'var(--ink)',
            display: 'flex', alignItems: 'center', gap: 6, justifyContent: compact ? 'flex-start' : 'center',
          }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 88 }}>
              {player.name}
            </span>
            {player.you && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em',
                              padding: '1px 5px', borderRadius: 4,
                              background: 'var(--accent)', color: 'var(--accent-ink)' }}>
                YOU
              </span>
            )}
            {player.host && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em',
                              padding: '1px 5px', borderRadius: 4,
                              background: 'var(--ink)', color: 'var(--paper)' }}>
                HOST
              </span>
            )}
          </div>
          {player.status !== 'connected' && (
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2,
                           letterSpacing: '.04em', fontWeight: 500 }}>
              {player.status === 'reconnecting' ? 'reconnecting…' : 'offline'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pick timer pill ───────────────────────────────────────
// Monospace, colour-shifts as time runs low.
// state: 'normal' (>30s), 'warning' (≤30s), 'danger' (≤5s)
function PickTimer({ seconds, total = 60, compact = false }) {
  const state = seconds <= 5 ? 'danger' : seconds <= 30 ? 'warning' : 'normal';
  const fg = state === 'danger' ? '#fff' : state === 'warning' ? '#5e3f10' : 'var(--ink)';
  const bg = state === 'danger' ? 'var(--ink-ruby)'
            : state === 'warning' ? 'var(--ink-amber-soft)'
            : 'var(--surface)';
  const border = state === 'danger' ? 'transparent'
                : state === 'warning' ? 'transparent'
                : 'var(--line-strong)';
  const mm = Math.floor(seconds / 60), ss = seconds % 60;
  const txt = `${mm}:${ss.toString().padStart(2, '0')}`;
  return (
    <div role="timer" aria-live="polite" style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: bg, color: fg,
      border: `1px solid ${border}`,
      borderRadius: 999,
      padding: compact ? '5px 10px' : '7px 14px',
      animation: state === 'danger' ? 'inkfolk-flash 1s ease-in-out infinite' : 'none',
    }}>
      <svg width={compact ? 12 : 14} height={compact ? 12 : 14} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 9v4l2.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M9 3h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
      <span className="mono" style={{
        fontSize: compact ? 12 : 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
        letterSpacing: '.04em',
      }}>{txt}</span>
    </div>
  );
}

// ─── Room code display ─────────────────────────────────────
// Big mono 4-char code with per-character cells. Optional copy button.
function RoomCode({ code = DRAFT_ROOM_CODE, size = 'lg', onCopy }) {
  // Cells get smaller as the code grows so 6 chars still fit comfortably.
  const cellSize = size === 'lg' ? 56 : size === 'md' ? 42 : 32;
  const cellFont = size === 'lg' ? 34 : size === 'md' ? 24 : 18;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size === 'lg' ? 14 : 8 }}>
      <div style={{ display: 'inline-flex', gap: 6 }}>
        {code.split('').map((ch, i) => (
          <div key={i} className="mono" style={{
            width: cellSize, height: cellSize * 1.2,
            display: 'grid', placeItems: 'center',
            background: 'var(--surface)',
            border: '1px solid var(--line-strong)',
            borderRadius: size === 'lg' ? 12 : 8,
            fontSize: cellFont, fontWeight: 700,
            color: 'var(--ink)', letterSpacing: '0',
            boxShadow: 'var(--shadow-1)',
          }}>
            {ch}
          </div>
        ))}
      </div>
      {onCopy && (
        <button onClick={onCopy} className="if-btn" style={{
          padding: size === 'lg' ? '10px 16px' : '7px 12px',
          fontSize: size === 'lg' ? 13 : 12,
        }}>
          <Link size={14}/> Copy
        </button>
      )}
    </div>
  );
}

// ─── Theme wrapper — lets one artboard force light or dark ──
// Wraps children in a node that flips the theme tokens via [data-theme].
function ThemeWrap({ mode = 'light', children, style = {} }) {
  return (
    <div data-theme={mode} style={{
      width: '100%', height: '100%',
      background: 'var(--paper)',
      color: 'var(--ink)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Pack-grid card cell ─────────────────────────────────
// Tap the card body to select (selection is marked with a big center check
// + accent ring + tinted veil). Tap the small eye button (top-left) to open
// the full card preview in the modal — kept separate so quick selects don't
// hijack the more careful "let me read the rules text" gesture.
function PackCell({ card, n, onClick, onPreview, frame = 'subtle', selected = false, dimmed = false }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{
        position: 'relative',
        transform: selected ? 'translateY(-4px)' : 'none',
        transition: 'transform .15s, opacity .15s',
        opacity: dimmed ? .45 : 1,
      }}>
        <Card card={card} size="normal" frame={frame} onClick={onClick} style={{ width: '100%' }}/>

        {/* Selection ring */}
        {selected && (
          <div aria-hidden style={{
            position: 'absolute', inset: -4, borderRadius: 14,
            border: '3px solid var(--accent)',
            boxShadow: '0 0 0 5px color-mix(in oklab, var(--accent) 28%, transparent), var(--shadow-2)',
            pointerEvents: 'none',
          }}/>
        )}

        {/* Selection veil + big center check */}
        {selected && (
          <div aria-hidden style={{
            position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden',
            background: 'color-mix(in oklab, var(--accent) 14%, transparent)',
            display: 'grid', placeItems: 'center', pointerEvents: 'none',
            animation: 'inkfolk-pick-pop .25s ease-out',
          }}>
            <div style={{
              width: '46%', aspectRatio: '1',
              borderRadius: 999,
              background: 'color-mix(in oklab, var(--accent) 75%, transparent)',
              color: 'var(--accent-ink)',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 6px 18px rgba(244,176,66,.3), 0 0 0 5px rgba(255,255,255,.25)',
            }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: '58%', height: '58%', opacity: .9 }}>
                <path d="m5 12.5 4.5 4.5L19 7"
                      stroke="currentColor" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}

        {/* Eye / preview button (top-right) */}
        {onPreview !== null && (
          <button
            onClick={(e) => { e.stopPropagation(); onPreview && onPreview(card); }}
            aria-label="Preview card"
            style={{
              position: 'absolute', top: 8, right: 8,
              width: 32, height: 32, borderRadius: 999,
              background: 'rgba(15,10,5,.6)', color: '#fff',
              border: 0, padding: 0, cursor: 'pointer',
              display: 'grid', placeItems: 'center',
              backdropFilter: 'blur(4px)',
              transition: 'background .15s',
              zIndex: 2,
            }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                    stroke="currentColor" strokeWidth="1.7"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/>
            </svg>
          </button>
        )}
      </div>

      {/* Pick-number badge (top-left) — hidden when selected */}
      {!selected && n != null && (
        <div className="mono" aria-label={`Pick number ${n}`} style={{
          position: 'absolute', top: 8, left: 8,
          width: 22, height: 22, borderRadius: 6,
          background: 'rgba(15,10,5,.6)', color: '#fff',
          display: 'grid', placeItems: 'center',
          fontSize: 11, fontWeight: 700, letterSpacing: '.04em',
          backdropFilter: 'blur(4px)',
        }}>
          {n}
        </div>
      )}
    </div>
  );
}

// ─── Pool sorting & grouping ───────────────────────────────
// Default sort is by cost ascending (curve view, useful for a draft pool),
// with name as a stable tiebreaker. Grouping switches between cost / ink / rarity.
function poolGrouped(pool, mode = 'cost') {
  if (mode === 'ink') {
    const order = ['amber','amethyst','emerald','ruby','sapphire','steel'];
    const groups = Object.fromEntries(order.map(i => [i, []]));
    pool.forEach(c => (groups[c.ink] || (groups[c.ink] = [])).push(c));
    return order
      .map(ink => ({ key: ink, label: INK[ink].name, ink, cards: groups[ink] || [] }))
      .filter(g => g.cards.length);
  }
  if (mode === 'rarity') {
    const order = ['legendary','super','rare','uncommon','common'];
    const labels = { common: 'Common', uncommon: 'Uncommon', rare: 'Rare',
                       super: 'Super rare', legendary: 'Legendary' };
    const groups = Object.fromEntries(order.map(r => [r, []]));
    pool.forEach(c => (groups[c.rarity] || (groups[c.rarity] = [])).push(c));
    return order
      .map(r => ({ key: r, label: labels[r] || r, rarity: r, cards: groups[r] || [] }))
      .filter(g => g.cards.length);
  }
  // 'cost' — group by cost 1, 2, 3, 4, 5, 6, 7+
  const byCost = {};
  pool.forEach(c => {
    const k = c.cost >= 7 ? '7+' : String(c.cost);
    (byCost[k] || (byCost[k] = [])).push(c);
  });
  return ['1','2','3','4','5','6','7+']
    .filter(k => byCost[k])
    .map(k => ({ key: k, label: `Cost ${k}`, cost: k, cards: byCost[k] }));
}

// ─── SortSelect — dropdown to change pool grouping ─────────
// Compact <select> styled to feel like one of our chips.
function SortSelect({ value = 'cost', onChange, compact = false }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: compact ? 10 : 11, color: 'var(--ink-3)',
                      cursor: 'pointer', userSelect: 'none' }}>
      <span>by</span>
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <select value={value}
          onChange={e => onChange && onChange(e.target.value)}
          style={{
            appearance: 'none', WebkitAppearance: 'none',
            background: 'transparent', border: 0,
            color: 'var(--ink-2)', fontSize: compact ? 10 : 11, fontWeight: 600,
            paddingRight: 14, cursor: 'pointer',
            fontFamily: 'var(--font-ui)', letterSpacing: '.02em',
          }}>
          <option value="cost">cost</option>
          <option value="ink">ink</option>
          <option value="rarity">rarity</option>
        </select>
        <Chevron dir="down" size={9} style={{ position: 'absolute', right: 2,
                                                  pointerEvents: 'none', color: 'var(--ink-3)' }}/>
      </span>
    </label>
  );
}

// ─── PoolGroup — one section of the My picks list ──────────
// Uses 4-col grid of thumbs by default, with a header that varies by sort mode.
function PoolGroup({ group, sortBy = 'cost', cols = 4, thumbStyle = {} }) {
  const rarityColors = { common: 'var(--rare-common)', uncommon: 'var(--rare-uncommon)',
                          rare: 'var(--rare-rare)', super: 'var(--rare-super)',
                          legendary: 'var(--rare-legendary)' };
  return (
    <section style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 10, fontWeight: 700, letterSpacing: '.06em',
                      color: 'var(--ink-2)', textTransform: 'uppercase',
                      margin: '8px 4px 6px' }}>
        {sortBy === 'ink'    && <InkDot ink={group.ink} size={7}/>}
        {sortBy === 'cost'   && (
          <span className="mono" style={{
            display: 'inline-grid', placeItems: 'center',
            minWidth: 18, height: 18, padding: '0 4px', borderRadius: 4,
            background: 'var(--paper-2)', color: 'var(--ink)', fontSize: 10, fontWeight: 700,
          }}>{group.cost}</span>
        )}
        {sortBy === 'rarity' && (
          <span style={{ width: 7, height: 7, borderRadius: 999,
                          background: rarityColors[group.rarity] || 'var(--ink-3)' }}/>
        )}
        <span>{group.label}</span>
        <span style={{ color: 'var(--ink-4)', fontWeight: 500 }}>· {group.cards.length}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}>
        {group.cards.map((c, i) => (
          <Card key={i} card={c} size="thumb" frame="subtle" style={{ width: '100%', ...thumbStyle }}/>
        ))}
      </div>
    </section>
  );
}

// ─── ConfirmPickBar — sticky confirm CTA ──────────────────
// Shows the selected card name + ink + a big Pick button.
// Three variants: desktop (in side panel), mobile (sticky bottom),
// and inline (taller, for use under the pack grid).
function ConfirmPickBar({ card, desktop = false }) {
  const empty = !card;
  return (
    <div style={{
      borderTop: '1px solid var(--line)',
      background: 'var(--surface-2)',
      padding: desktop ? '12px 14px 14px' : '10px 14px 14px',
    }}>
      {empty ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: desktop ? '10px 0' : '8px 0',
          color: 'var(--ink-3)', fontSize: 12.5, fontStyle: 'italic',
          textAlign: 'center',
        }}>
          <span style={{
            width: 18, height: 18, borderRadius: 999,
            border: '1.5px dashed var(--line-strong)',
            display: 'inline-grid', placeItems: 'center',
            color: 'var(--ink-4)', fontSize: 11,
          }}>?</span>
          Tap a card to select it
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Mini thumb of the selected card */}
          <div style={{ width: 32, flexShrink: 0 }}>
            <Card card={card} size="thumb" frame="subtle" style={{ width: '100%' }}/>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
                            textTransform: 'uppercase', color: 'var(--ink-3)',
                            display: 'flex', alignItems: 'center', gap: 5 }}>
              <InkDot ink={card.ink} size={6}/> Selected
            </div>
            <div className="serif" style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '-.005em',
              color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden',
              textOverflow: 'ellipsis', marginTop: 1,
            }}>
              {card.name}
            </div>
          </div>
          <button className="if-btn if-btn--accent" style={{
            fontSize: 12.5, fontWeight: 600, padding: '9px 14px', flexShrink: 0,
          }}>
            Pick →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Mini ink dot row (used in pool grouping headings) ─────
function InkDot({ ink, size = 8 }) {
  const c = (INK[ink] || INK.steel).c;
  return (
    <span style={{ width: size, height: size, borderRadius: 999, background: c,
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)', display: 'inline-block' }}/>
  );
}

// ─── Animations (injected once on first render) ────────────
(function injectDraftStyles() {
  if (document.getElementById('inkfolk-draft-styles')) return;
  const s = document.createElement('style');
  s.id = 'inkfolk-draft-styles';
  s.textContent = `
    @keyframes inkfolk-pulse {
      0%   { transform: scale(0.95); opacity: 0.9; }
      70%  { transform: scale(1.18); opacity: 0;   }
      100% { transform: scale(1.18); opacity: 0;   }
    }
    @keyframes inkfolk-flash {
      0%, 100% { box-shadow: 0 0 0 0 rgba(209,75,75,.55); }
      50%      { box-shadow: 0 0 0 6px rgba(209,75,75,0); }
    }
    @keyframes inkfolk-countdown {
      from { transform: scale(1.4); opacity: 0; }
      40%  { transform: scale(1);   opacity: 1; }
      to   { transform: scale(0.6); opacity: 0; }
    }
    @keyframes inkfolk-pick-pop {
      0%   { transform: scale(.6); opacity: 0; }
      60%  { transform: scale(1.08); opacity: 1; }
      100% { transform: scale(1);    opacity: 1; }
    }
    @keyframes inkfolk-spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(s);
})();

Object.assign(window, {
  DRAFT_ROOM_CODE, DRAFT_PLAYERS, DRAFT_PACK, DRAFT_POOL, DRAFT_END_POOL,
  makeDraftPack,
  PlayerAvatar, PickTimer, RoomCode, ThemeWrap, PackCell, InkDot,
  STATUS_COLORS, poolGrouped, SortSelect, PoolGroup, ConfirmPickBar,
});
