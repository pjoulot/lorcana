// Pre-draft lobby — share the code, watch the roster fill, host starts.
// Ported from LobbyDesktop (draft-flow.jsx); roster updates by polling room
// state (the WebRTC mesh + countdown arrive in 3b.2).
import { useEffect, useState } from 'react';
import { getRoom, startRoom } from '../api/room';
import { useDraft } from '../state/store';
import { RoomCode } from './RoomCode';
import { Link } from './icons';

const AVATAR_HUES = ['#E8C6BD', '#C9BEDF', '#C7DDBC', '#EBCB89', '#B3D8E2', '#D6CBB6'];

function Avatar({ name, size = 56 }: { name: string; size?: number }) {
  const bg = AVATAR_HUES[name.charCodeAt(0) % AVATAR_HUES.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: bg,
        display: 'grid',
        placeItems: 'center',
        color: 'var(--ink)',
        fontFamily: 'var(--font-display)',
        fontSize: size * 0.42,
        fontWeight: 600,
        boxShadow: '0 0 0 2px var(--paper), 0 0 0 4px var(--line)',
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function Lobby() {
  const { state, dispatch } = useDraft();
  const room = state.room;
  const code = room?.code ?? '';
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const [starting, setStarting] = useState(false);

  // Poll room state while waiting in the lobby.
  useEffect(() => {
    if (!code) {
      return;
    }
    let live = true;
    const tick = async () => {
      const next = await getRoom(code);
      if (live && next) {
        dispatch({ type: 'roomUpdated', room: next });
      }
    };
    const id = setInterval(tick, 1500);
    return () => {
      live = false;
      clearInterval(id);
    };
  }, [code, dispatch]);

  if (!room) {
    return null;
  }

  const isActive = room.state === 'active';
  const joinUrl = `${window.location.origin}/draft#join=${code}`;

  async function copy(what: 'code' | 'link', text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      window.prompt('Copy:', text);
    }
  }

  async function start() {
    if (!state.playerId || !state.token) {
      return;
    }
    setStarting(true);
    try {
      const { room: updated } = await startRoom(code, state.playerId, state.token);
      dispatch({ type: 'roomUpdated', room: updated });
    } catch {
      setStarting(false);
    }
  }

  if (isActive) {
    return (
      <div className="if-draft-wrap if-draft-wrap--narrow" style={{ textAlign: 'center' }}>
        <div className="if-draft-eyebrow" style={{ justifyContent: 'center' }}>
          <span className="if-draft-rule" /> Get ready…
        </div>
        <h1 className="serif if-draft-h1 if-draft-h1--sm">The draft is starting</h1>
        <p className="if-draft-lede" style={{ margin: '0 auto' }}>
          Connecting players and dealing packs. (The live draft lands in the next slice.)
        </p>
      </div>
    );
  }

  const seats = [...room.players];
  const empty = Math.max(0, room.playerCount - seats.length);

  return (
    <div className="if-draft-wrap if-draft-wrap--narrow">
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="if-draft-eyebrow" style={{ justifyContent: 'center' }}>
          Lobby · waiting for players
        </div>
        <h1 className="serif if-draft-h1 if-draft-h1--sm">Share this code with your friends</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <RoomCode code={code} size="lg" />
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="if-btn" onClick={() => copy('code', code)}>
            <Link size={13} /> {copied === 'code' ? 'Copied!' : 'Copy code'}
          </button>
          <button className="if-btn" onClick={() => copy('link', joinUrl)}>
            <Link size={13} /> {copied === 'link' ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>

      <div className="if-draft-form" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 className="serif" style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>
            Players <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>({seats.length} of {room.playerCount})</span>
          </h2>
        </div>
        <div className="if-lobby-roster">
          {seats.map((p) => (
            <div key={p.id} className="if-lobby-seat">
              <Avatar name={p.pseudonym} />
              <div className="if-lobby-seat__name">
                {p.pseudonym}
                {p.id === state.playerId && <span className="if-lobby-badge if-lobby-badge--you">YOU</span>}
                {p.host && <span className="if-lobby-badge if-lobby-badge--host">HOST</span>}
              </div>
            </div>
          ))}
          {Array.from({ length: empty }, (_, i) => (
            <div key={`empty-${i}`} className="if-lobby-seat if-lobby-seat--empty">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 21c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div className="if-lobby-seat__waiting">Waiting…</div>
            </div>
          ))}
        </div>
      </div>

      <div className="if-draft-actions">
        {state.isHost ? (
          <>
            <button className="if-btn if-btn--accent" onClick={start} disabled={seats.length < 2 || starting}>
              {starting ? 'Starting…' : 'Start draft →'}
            </button>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              {seats.length < 2 ? 'Waiting for at least one more player…' : 'Everyone in? Start when ready.'}
            </span>
          </>
        ) : (
          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Waiting for the host to start…</span>
        )}
        <span style={{ flex: 1 }} />
        <button className="if-btn" onClick={() => dispatch({ type: 'reset' })} disabled={starting}>
          Leave
        </button>
      </div>
    </div>
  );
}
