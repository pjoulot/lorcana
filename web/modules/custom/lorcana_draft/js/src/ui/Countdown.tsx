// "Get ready" countdown — forms the WebRTC mesh while a 3-2-1 plays, then
// shows each peer connecting. Ported visually from CountdownDesktop
// (draft-flow.jsx). The live two-player draft replaces the ready state in 3b.3.
import { useEffect, useMemo, useState } from 'react';
import { useDraft } from '../state/store';
import { useMesh } from '../peer/useMesh';
import { isWireMessage } from '../peer/protocol';

export function Countdown() {
  const { state, dispatch } = useDraft();
  const room = state.room;
  const myId = state.playerId;

  const peerIds = useMemo(
    () => (room?.players ?? []).map((p) => p.id).filter((id) => id !== myId),
    [room, myId],
  );

  const [hello, setHello] = useState<Set<string>>(new Set());
  const [count, setCount] = useState(3);

  const { statuses, broadcast } = useMesh(
    Boolean(room),
    room?.code ?? null,
    myId,
    state.token,
    peerIds,
    (from, message) => {
      if (isWireMessage(message) && message.t === 'hello') {
        setHello((prev) => (prev.has(from) ? prev : new Set(prev).add(from)));
      }
    },
  );

  // 3-2-1 countdown (visual only; readiness gates on the mesh).
  useEffect(() => {
    const id = setInterval(() => setCount((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const connected = peerIds.every((id) => statuses[id] === 'connected');
  const greeted = peerIds.every((id) => hello.has(id));
  const ready = connected && greeted && count === 0;

  // Announce ourselves until everyone has greeted back.
  useEffect(() => {
    if (ready || !myId) {
      return;
    }
    const id = setInterval(() => broadcast({ v: 1, t: 'hello', from: myId }), 600);
    return () => clearInterval(id);
  }, [ready, myId, broadcast]);

  if (!room) {
    return null;
  }

  const peerName = (id: string) => room.players.find((p) => p.id === id)?.pseudonym ?? id;
  const dot = (id: string) => {
    const s = statuses[id];
    if (s === 'connected' && hello.has(id)) {
      return { c: 'var(--ink-emerald)', label: 'connected' };
    }
    if (s === 'failed') {
      return { c: 'var(--ink-ruby)', label: 'failed' };
    }
    return { c: 'var(--ink-amber)', label: 'connecting…' };
  };

  return (
    <div className="if-draft-countdown">
      <div style={{ textAlign: 'center' }}>
        <div className="if-draft-eyebrow" style={{ justifyContent: 'center' }}>
          {ready ? 'All players connected' : 'Get ready…'}
        </div>
        <div className="serif if-draft-countdown__n" key={count}>
          {ready ? 'Go' : count === 0 ? '…' : count}
        </div>

        <div className="if-draft-peerlist">
          {peerIds.map((id) => {
            const d = dot(id);
            return (
              <div key={id} className="if-draft-peer">
                <span className="if-draft-peer__dot" style={{ background: d.c }} />
                <span className="if-draft-peer__name">{peerName(id)}</span>
                <span className="if-draft-peer__status">{d.label}</span>
              </div>
            );
          })}
        </div>

        {ready && (
          <p className="if-draft-lede" style={{ margin: '18px auto 0' }}>
            The mesh is live. The two-player draft over this channel lands in the next slice.
          </p>
        )}

        <div className="if-draft-actions" style={{ justifyContent: 'center', marginTop: 24 }}>
          <button className="if-btn" onClick={() => dispatch({ type: 'reset' })}>
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
