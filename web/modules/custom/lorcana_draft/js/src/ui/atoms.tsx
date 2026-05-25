// Draft atoms ported from draft-atoms.jsx: ink dot, pool grouping/sorting,
// the pack-grid cell, and the confirm-pick bar. Bound to CardData + theme
// tokens (note: design used the nonexistent --rare-*; real token is --rarity-*).
import type { CardData } from '../types';
import { ink, INK, rarity as rarityInfo, normalizeRarity } from '../data/ink';
import { Card } from './Card';

export type SortMode = 'cost' | 'ink' | 'rarity';

export function InkDot({ slug, size = 8 }: { slug: string; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: ink(slug).c,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)',
        display: 'inline-block',
      }}
    />
  );
}

export interface PoolGroup {
  key: string;
  label: string;
  cards: CardData[];
  ink?: string;
  rarity?: string;
  cost?: string;
}

const INK_ORDER = ['amber', 'amethyst', 'emerald', 'ruby', 'sapphire', 'steel'];
const RARITY_ORDER = ['enchanted', 'legendary', 'super', 'rare', 'uncommon', 'common'];

/** Groups a pool for the "My picks" panel by cost, ink, or rarity. */
export function poolGrouped(pool: CardData[], mode: SortMode): PoolGroup[] {
  if (mode === 'ink') {
    const groups: Record<string, CardData[]> = {};
    pool.forEach((c) => (groups[c.ink] ??= []).push(c));
    return INK_ORDER.filter((i) => groups[i]?.length).map((i) => ({
      key: i,
      label: INK[i]?.name ?? i,
      ink: i,
      cards: groups[i],
    }));
  }
  if (mode === 'rarity') {
    const groups: Record<string, CardData[]> = {};
    pool.forEach((c) => {
      const r = normalizeRarity(c.rarity);
      (groups[r] ??= []).push(c);
    });
    return RARITY_ORDER.filter((r) => groups[r]?.length).map((r) => ({
      key: r,
      label: rarityInfo(r).full,
      rarity: r,
      cards: groups[r],
    }));
  }
  // cost
  const byCost: Record<string, CardData[]> = {};
  pool.forEach((c) => {
    const cost = c.cost ?? 0;
    const k = cost >= 7 ? '7+' : String(cost);
    (byCost[k] ??= []).push(c);
  });
  return ['0', '1', '2', '3', '4', '5', '6', '7+']
    .filter((k) => byCost[k]?.length)
    .map((k) => ({ key: k, label: `Cost ${k}`, cost: k, cards: byCost[k] }));
}

export function SortSelect({
  value,
  onChange,
  compact = false,
}: {
  value: SortMode;
  onChange: (v: SortMode) => void;
  compact?: boolean;
}) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: compact ? 10 : 11,
        color: 'var(--ink-3)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span>by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortMode)}
        style={{
          background: 'transparent',
          border: 0,
          color: 'var(--ink-2)',
          fontSize: compact ? 10 : 11,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-ui)',
        }}
      >
        <option value="cost">cost</option>
        <option value="ink">ink</option>
        <option value="rarity">rarity</option>
      </select>
    </label>
  );
}

/** One pack-grid cell: tap the card to select; the eye button previews it. */
export function PackCell({
  card,
  n,
  selected,
  dimmed,
  onSelect,
  onPreview,
}: {
  card: CardData;
  n: number;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
  onPreview: () => void;
}) {
  return (
    <div
      className="if-packcell"
      style={{
        position: 'relative',
        width: '100%',
        opacity: dimmed ? 0.45 : 1,
        transform: selected ? 'translateY(-4px)' : 'none',
        transition: 'transform .15s, opacity .15s',
      }}
    >
      <button
        type="button"
        className="if-packcell__hit"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Select ${card.name}`}
        style={{ display: 'block', width: '100%', padding: 0, border: 0, background: 'none', cursor: 'pointer' }}
      >
        <Card card={card} size="normal" style={{ width: '100%' }} />
      </button>

      {selected && (
        <>
          <span
            aria-hidden
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: 14,
              border: '3px solid var(--accent)',
              boxShadow: '0 0 0 5px color-mix(in oklab, var(--accent) 28%, transparent), var(--shadow-2)',
              pointerEvents: 'none',
            }}
          />
          <span
            aria-hidden
            className="if-packcell__check"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 10,
              display: 'grid',
              placeItems: 'center',
              background: 'color-mix(in oklab, var(--accent) 14%, transparent)',
              pointerEvents: 'none',
              animation: 'inkfolk-pick-pop .25s ease-out',
            }}
          >
            <span
              style={{
                width: '46%',
                aspectRatio: '1',
                borderRadius: 999,
                background: 'color-mix(in oklab, var(--accent) 75%, transparent)',
                color: 'var(--accent-ink)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 6px 18px rgba(244,176,66,.3), 0 0 0 5px rgba(255,255,255,.25)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" style={{ width: '58%', height: '58%' }}>
                <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
        aria-label={`Preview ${card.name}`}
        className="if-packcell__eye"
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 32,
          height: 32,
          borderRadius: 999,
          background: 'rgba(15,10,5,.6)',
          color: '#fff',
          border: 0,
          padding: 0,
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          backdropFilter: 'blur(4px)',
          zIndex: 2,
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </button>

      {!selected && (
        <span
          className="mono"
          aria-hidden
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 22,
            height: 22,
            borderRadius: 6,
            background: 'rgba(15,10,5,.6)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontSize: 11,
            fontWeight: 700,
            backdropFilter: 'blur(4px)',
          }}
        >
          {n}
        </span>
      )}
    </div>
  );
}

/** Sticky confirm CTA showing the selected card; empty prompt otherwise. */
export function ConfirmPickBar({ card, onPick }: { card: CardData | null; onPick: () => void }) {
  return (
    <div className="if-confirmbar">
      {!card ? (
        <div className="if-confirmbar__empty">
          <span className="if-confirmbar__q">?</span>
          Tap a card to select it
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, flexShrink: 0 }}>
            <Card card={card} size="thumb" style={{ width: '100%' }} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="if-confirmbar__kicker">
              <InkDot slug={card.ink} size={6} /> Selected
            </div>
            <div className="serif if-confirmbar__name">{card.name}</div>
          </div>
          <button type="button" className="if-btn if-btn--accent" onClick={onPick} style={{ fontSize: 12.5, fontWeight: 600, padding: '9px 14px', flexShrink: 0 }}>
            Pick →
          </button>
        </div>
      )}
    </div>
  );
}
