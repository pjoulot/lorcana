// Full-card preview overlay, ported from CardPreview (draft-active.jsx).
// Tap the eye on a pack cell → read the card large → "Select this card".
import type { CardData } from '../types';
import { ink, rarity as rarityInfo } from '../data/ink';
import { Card } from './Card';
import { Close, InkDrop, Lore, Strength, Willpower } from './icons';

export function CardPreview({
  card,
  index,
  total,
  onSelect,
  onClose,
}: {
  card: CardData;
  index: number;
  total: number;
  onSelect: () => void;
  onClose: () => void;
}) {
  const ic = ink(card.ink);
  const ra = rarityInfo(card.rarity);
  const isCharacter = card.type === 'character';

  return (
    <div className="if-preview" role="dialog" aria-modal="true" aria-label={card.name} onClick={onClose}>
      <div className="if-preview__panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="if-preview__close" onClick={onClose} aria-label="Close preview">
          <Close size={18} />
        </button>

        <div className="if-preview__art">
          <Card card={card} size="large" style={{ width: '100%' }} />
        </div>

        <div className="if-preview__meta">
          <div className="if-preview__kicker">
            <span style={{ width: 8, height: 8, borderRadius: 999, background: ic.c }} />
            {ic.name} · {capitalize(card.type)} · {ra.full}
          </div>
          <h2 className="serif if-preview__name">{card.name}</h2>
          {card.version && <div className="serif if-preview__version">{card.version}</div>}

          {isCharacter && (
            <div className="if-preview__stats mono">
              <span style={{ color: '#c47733' }}>
                <Strength size={14} /> {card.strength ?? '–'}
              </span>
              <span style={{ color: '#c14b4b' }}>
                <Willpower size={14} /> {card.willpower ?? '–'}
              </span>
              <span style={{ color: 'var(--ink-amber)', marginLeft: 'auto' }}>
                <Lore size={14} /> {card.lore ?? '–'}
              </span>
              <span style={{ color: 'var(--ink-2)' }}>
                <InkDrop size={14} /> {card.cost ?? '–'}
              </span>
            </div>
          )}

          <div className="if-preview__spacer" />
          <button type="button" className="if-btn if-btn--accent if-preview__cta" onClick={onSelect}>
            Select this card
          </button>
          <div className="if-preview__hint">
            #{index + 1} of {total} · selecting marks it — confirm the pick on the draft view
          </div>
        </div>
      </div>
    </div>
  );
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
