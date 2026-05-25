// Draft landing — ported from draft-flow.jsx (DraftLandingDesktop), adapted
// for the phase-3a solo dry run: the primary CTA starts a solo draft, and the
// multiplayer "enter a code" card is shown as coming soon.
import { useDraft } from '../state/store';
import { Sparkle, Link } from './icons';

const STEPS = [
  { n: 1, t: 'Pick a set', d: 'Choose a draftable set and how many packs to open.' },
  { n: 2, t: 'Open & pick', d: 'Packs of 12 open one by one. Take one card, set the rest aside — across four packs, ~48 cards land in your pool.' },
  { n: 3, t: 'Play in person', d: 'Export your pool as CSV or a shareable link, then sit down with the physical cards.' },
];

export function Landing() {
  const { state, dispatch } = useDraft();
  const hasSets = state.sets.length > 0;

  return (
    <div className="if-draft-wrap">
      <header className="if-draft-landing-head">
        <div className="if-draft-eyebrow">
          <span className="if-draft-rule" />
          Booster draft · simulator
        </div>
        <h1 className="serif if-draft-h1">A booster draft, run from the couch.</h1>
        <p className="if-draft-lede">
          Open simulated packs and build a pool, then bring the physical cards to the table.
          Solo dry run today — drafting with friends is coming soon.
        </p>
      </header>

      <div className="if-draft-cards">
        {/* Primary: start a solo draft */}
        <div className="if-draft-card if-draft-card--accent">
          <div className="if-draft-card-kicker">
            <Sparkle size={18} style={{ color: 'var(--accent)' }} />
            <span>Solo dry run</span>
          </div>
          <h2 className="serif if-draft-card-title">Start a draft</h2>
          <p className="if-draft-card-body">
            Open four packs and draft a full pool on your own — no account, nothing saved.
          </p>
          <button
            className="if-btn if-btn--accent if-draft-card-cta"
            disabled={!hasSets}
            onClick={() => dispatch({ type: 'goto', screen: 'create' })}
          >
            {hasSets ? 'Start a draft →' : 'No draftable sets yet'}
          </button>
        </div>

        {/* Secondary: multiplayer, coming soon */}
        <div className="if-draft-card if-draft-card--muted">
          <div className="if-draft-card-kicker">
            <Link size={16} style={{ color: 'var(--ink-3)' }} />
            <span>With friends</span>
            <span className="if-draft-soon">Soon</span>
          </div>
          <h2 className="serif if-draft-card-title">Enter a code</h2>
          <p className="if-draft-card-body">
            Room codes arrive with multiplayer drafting. For now, draft solo and export your pool.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              placeholder="ABCDEF"
              maxLength={6}
              className="mono"
              disabled
              aria-label="Room code (coming soon)"
              style={{
                flex: 1,
                padding: '14px 18px',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '.3em',
                textTransform: 'uppercase',
                textAlign: 'center',
                border: '1px solid var(--line-strong)',
                borderRadius: 12,
                background: 'var(--surface)',
                color: 'var(--ink-4)',
                outline: 0,
              }}
            />
            <button className="if-btn" disabled style={{ fontSize: 14, padding: '12px 20px' }}>
              Join
            </button>
          </div>
        </div>
      </div>

      <section className="if-draft-section">
        <div className="if-draft-section-label">How it works</div>
        <div className="if-draft-steps">
          {STEPS.map((s) => (
            <div key={s.n}>
              <div className="serif if-draft-step-n">{String(s.n).padStart(2, '0')}</div>
              <h3 className="serif if-draft-step-t">{s.t}</h3>
              <p className="if-draft-step-d">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <aside className="if-draft-note">
        <span style={{ fontSize: 18 }}>ⓘ</span>
        <span>
          <strong>Nothing is saved on our server.</strong> When the draft ends you'll be able to export
          your pool — that's your only chance to keep it.
        </span>
      </aside>
    </div>
  );
}
