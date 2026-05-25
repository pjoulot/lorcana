// End of draft — the final pool by ink + export, ported from EndOfDraft
// (draft-flow.jsx). CSV and share-link are client-side; image export is
// deferred. A shared #pool= link opens straight here (read-only).
import { useState } from 'react';
import { useDraft } from '../state/store';
import { Card } from './Card';
import { InkDot, poolGrouped } from './atoms';
import { Share } from './icons';
import { clearShareHash, downloadCsv, encodeShareUrl, poolToCsv } from '../lib/export';

export function EndScreen() {
  const { state, dispatch } = useDraft();
  const { pool, setMeta, packs } = state;
  const groups = poolGrouped(pool, 'ink');
  const [copied, setCopied] = useState(false);

  function onCsv() {
    const slug = (setMeta?.code ?? 'draft').toString();
    downloadCsv(`lorcana-draft-${slug}.csv`, poolToCsv(pool));
  }

  async function onShare() {
    const url = encodeShareUrl(setMeta?.code ?? '', setMeta?.name ?? '', packs.length, pool);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — drop the link into the address bar as a fallback.
      window.prompt('Copy your pool link:', url);
    }
  }

  function startOver() {
    clearShareHash();
    dispatch({ type: 'reset' });
  }

  return (
    <div className="if-draft-wrap">
      <header className="if-draft-end-head">
        <div>
          <div className="if-draft-eyebrow">
            <span className="if-draft-rule" />
            Draft complete{setMeta ? ` · ${setMeta.name}` : ''}
          </div>
          <h1 className="serif if-draft-h1 if-draft-h1--sm">Your draft pool</h1>
          <p className="if-draft-lede">
            {pool.length} cards{packs.length ? ` across ${packs.length} packs` : ''}. Export now — we don't keep a copy.
          </p>
        </div>
        <div className="if-draft-end-export">
          <button className="if-btn if-btn--accent" onClick={onCsv}>
            <DownloadIcon /> Download CSV
          </button>
          <button className="if-btn if-btn--primary" onClick={onShare}>
            <Share size={13} /> {copied ? 'Link copied!' : 'Share link'}
          </button>
          <button className="if-btn" disabled title="Coming soon">
            <ImageIcon /> Image
          </button>
        </div>
      </header>

      <div className="if-draft-end-chips">
        {groups.map((g) => (
          <span key={g.key} className="if-chip" style={{ fontSize: 12, padding: '6px 12px' }}>
            <InkDot slug={g.ink!} size={9} /> {g.label} ·{' '}
            <strong className="mono" style={{ marginLeft: 4 }}>
              {g.cards.length}
            </strong>
          </span>
        ))}
      </div>

      {groups.map((g) => (
        <section key={g.key} className="if-draft-end-section">
          <div className="if-draft-end-section-head">
            <InkDot slug={g.ink!} size={14} />
            <h2 className="serif">{g.label}</h2>
            <span className="if-draft-end-count">{g.cards.length} cards</span>
          </div>
          <div className="if-draft-end-grid">
            {g.cards.map((c, i) => (
              <Card key={`${c.id}-${i}`} card={c} size="normal" style={{ width: '100%' }} />
            ))}
          </div>
        </section>
      ))}

      <aside className="if-draft-note">
        <span style={{ fontSize: 18 }}>ⓘ</span>
        <span>
          <strong>Last call.</strong> Once you close this page, we forget the pool. Save what you need before you go.
        </span>
      </aside>

      <div className="if-draft-actions">
        <button className="if-btn" onClick={startOver}>
          ← Start another draft
        </button>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1v9 M5 7l3 3 3-3 M2 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="7" r="1.2" fill="currentColor" />
      <path d="m3 12 3-3 4 3 3-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
