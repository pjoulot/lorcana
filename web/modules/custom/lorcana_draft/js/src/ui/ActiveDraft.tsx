// Active draft — the pick loop. Ported from ActiveDraft (draft-active.jsx),
// collapsed into one responsive screen (desktop two-column; mobile pack grid
// + a fixed bottom pool sheet). Solo: no timer, roster, or peers.
import { useState } from 'react';
import { useDraft } from '../state/store';
import { rarity as rarityInfo } from '../data/ink';
import { Card } from './Card';
import { CardPreview } from './CardPreview';
import { ConfirmPickBar, InkDot, PackCell, poolGrouped, SortSelect, type SortMode } from './atoms';

export function ActiveDraft() {
  const { state, dispatch } = useDraft();
  const [sort, setSort] = useState<SortMode>('cost');
  const [preview, setPreview] = useState<number | null>(null);

  const { current, selected, pool, packIndex, packs } = state;
  const packSize = 12;
  const pickNumber = packSize - current.length + 1;
  const selectedCard = selected !== null ? current[selected] ?? null : null;

  return (
    <div className="if-draft-active">
      <header className="if-draft-topbar">
        <div className="if-draft-topbar__left">
          <span className="serif if-draft-topbar__set">{state.setMeta?.name}</span>
          <span className="if-draft-topbar__sep" />
          <span className="if-draft-topbar__counts">
            Pack <strong>{packIndex + 1}</strong> of {packs.length}
            <span className="if-draft-topbar__dot"> · </span>
            pick <strong>{Math.min(pickNumber, packSize)}</strong> of {packSize}
          </span>
          <span className="if-draft-progress" aria-hidden>
            <span style={{ width: `${((packSize - current.length) / packSize) * 100}%` }} />
          </span>
        </div>
        <button type="button" className="if-btn" onClick={() => dispatch({ type: 'reset' })}>
          Exit
        </button>
      </header>

      <div className="if-draft-active-body">
        <div className="if-draft-pack if-scroll">
          <div className="if-draft-pack__head">
            <h2 className="serif">Pack {packIndex + 1} — tap a card to select</h2>
            <span className="if-draft-pack__hint">Tap the eye to preview</span>
          </div>
          <div className="if-draft-pack__grid">
            {current.map((card, i) => (
              <PackCell
                key={`${card.id}-${i}`}
                card={card}
                n={i + 1}
                selected={selected === i}
                dimmed={selected !== null && selected !== i}
                onSelect={() => dispatch({ type: 'select', index: selected === i ? null : i })}
                onPreview={() => setPreview(i)}
              />
            ))}
          </div>
        </div>

        <aside className="if-draft-panel">
          <div className="if-draft-panel__head">
            <span className="serif">
              My picks <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>({pool.length})</span>
            </span>
            <SortSelect value={sort} onChange={setSort} />
          </div>
          <div className="if-draft-pool if-scroll">
            {pool.length === 0 ? (
              <p className="if-draft-pool__empty">Your picks land here.</p>
            ) : (
              poolGrouped(pool, sort).map((g) => (
                <section key={g.key} className="if-draft-poolgroup">
                  <div className="if-draft-poolgroup__head">
                    {g.cost !== undefined && <span className="mono if-draft-cost">{g.cost}</span>}
                    {g.ink !== undefined && <InkDot slug={g.ink} size={7} />}
                    {g.rarity !== undefined && (
                      <span style={{ width: 7, height: 7, borderRadius: 999, background: rarityInfo(g.rarity).color }} />
                    )}
                    <span>{g.label}</span>
                    <span style={{ color: 'var(--ink-4)', fontWeight: 500 }}>· {g.cards.length}</span>
                  </div>
                  <div className="if-draft-poolgroup__grid">
                    {g.cards.map((c, i) => (
                      <Card key={`${c.id}-${i}`} card={c} size="thumb" style={{ width: '100%' }} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
          <ConfirmPickBar card={selectedCard} onPick={() => dispatch({ type: 'pick' })} />
        </aside>
      </div>

      {preview !== null && current[preview] && (
        <CardPreview
          card={current[preview]}
          index={preview}
          total={current.length}
          onSelect={() => {
            dispatch({ type: 'select', index: preview });
            setPreview(null);
          }}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
