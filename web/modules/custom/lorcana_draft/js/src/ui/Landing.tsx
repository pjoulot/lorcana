// Draft landing — ported from draft-flow.jsx (DraftLandingDesktop). Now that
// rooms exist (3b), the two cards are live: create a multiplayer room, or
// join one by code. A solo dry run stays available as a secondary link.
import { useEffect, useState } from 'react';
import { joinRoom } from '../api/room';
import { useDraft } from '../state/store';
import { Sparkle, Link } from './icons';

const STEPS = [
  { n: 1, t: 'Open a room', d: 'The host picks a set and player count, and a code appears. Share it.' },
  { n: 2, t: 'Open & pick', d: 'Packs of 12 open in sync. Take one card, pass the rest — across four packs, ~48 cards land in your pool.' },
  { n: 3, t: 'Play in person', d: 'Export your pool as CSV or a shareable link, then sit down with the physical cards.' },
];

export function Landing() {
  const { state, dispatch } = useDraft();
  const hasSets = state.sets.length > 0;
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Honour a shared #join=CODE link by pre-filling the code.
  useEffect(() => {
    const m = window.location.hash.match(/join=([A-Za-z]+)/);
    if (m) {
      setCode(m[1].toUpperCase());
    }
  }, []);

  async function join() {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      return;
    }
    setJoining(true);
    setError(null);
    try {
      const result = await joinRoom(trimmed, '');
      dispatch({ type: 'roomJoined', result });
    } catch {
      setError("That code didn't match an open room.");
      setJoining(false);
    }
  }

  return (
    <div className="if-draft-wrap">
      <header className="if-draft-landing-head">
        <div className="if-draft-eyebrow">
          <span className="if-draft-rule" />
          Booster draft · simulator
        </div>
        <h1 className="serif if-draft-h1">A booster draft, run from the couch.</h1>
        <p className="if-draft-lede">
          Open simulated packs with friends — we handle the picking. You bring the physical cards to the
          table afterwards.
        </p>
      </header>

      <div className="if-draft-cards">
        <div className="if-draft-card if-draft-card--accent">
          <div className="if-draft-card-kicker">
            <Sparkle size={18} style={{ color: 'var(--accent)' }} />
            <span>Host a draft</span>
          </div>
          <h2 className="serif if-draft-card-title">Create a room</h2>
          <p className="if-draft-card-body">
            Pick a set, set a player count, and share a 6-letter code with your group.
          </p>
          <button
            className="if-btn if-btn--accent if-draft-card-cta"
            disabled={!hasSets}
            onClick={() => dispatch({ type: 'goto', screen: 'createRoom' })}
          >
            {hasSets ? 'Create a room →' : 'No draftable sets yet'}
          </button>
        </div>

        <div className="if-draft-card if-draft-card--muted">
          <div className="if-draft-card-kicker">
            <Link size={16} style={{ color: 'var(--ink-3)' }} />
            <span>Joining one?</span>
          </div>
          <h2 className="serif if-draft-card-title">Enter a code</h2>
          <p className="if-draft-card-body">Ask the host for the 6-letter room code (it'll look like “WHRTNK”).</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && join()}
              placeholder="ABCDEF"
              maxLength={6}
              className="mono"
              aria-label="Room code"
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
                color: 'var(--ink)',
                outline: 0,
              }}
            />
            <button className="if-btn if-btn--primary" onClick={join} disabled={joining || code.trim().length < 4} style={{ fontSize: 14, padding: '12px 20px' }}>
              {joining ? '…' : 'Join →'}
            </button>
          </div>
          {error && <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--ink-ruby)' }}>{error}</div>}
        </div>
      </div>

      <div style={{ marginTop: 18, fontSize: 13, color: 'var(--ink-3)' }}>
        Just practising?{' '}
        <button
          onClick={() => dispatch({ type: 'goto', screen: 'create' })}
          style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'var(--accent)', fontWeight: 600, fontSize: 13 }}
        >
          Start a solo draft →
        </button>
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
