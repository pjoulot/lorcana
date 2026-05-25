// Multiplayer room setup — the fuller create form from CreateRoom
// (draft-flow.jsx): packs, players, set, pseudonym. Creates a room and lands
// the host in the lobby.
import { useState } from 'react';
import { createRoom } from '../api/room';
import { useDraft } from '../state/store';
import { Chevron } from './icons';
import { Segmented } from './Segmented';
import { SetPicker } from './SetPicker';
import { Stepper } from './Stepper';

export function CreateRoom() {
  const { state, dispatch } = useDraft();
  const [setCode, setSetCode] = useState(state.sets[0]?.code ?? '');
  const [packs, setPacks] = useState(4);
  const [players, setPlayers] = useState(4);
  const [pseudonym, setPseudonym] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setMeta = state.sets.find((s) => s.code === setCode) ?? null;

  async function create() {
    if (!setMeta) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await createRoom(setMeta.code, packs, players, pseudonym.trim() || 'Host');
      dispatch({ type: 'roomCreated', result });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown');
      setBusy(false);
    }
  }

  return (
    <div className="if-draft-wrap if-draft-wrap--narrow">
      <button className="if-draft-crumb" onClick={() => dispatch({ type: 'goto', screen: 'landing' })}>
        <Chevron dir="left" size={12} /> Draft
      </button>

      <h1 className="serif if-draft-h1 if-draft-h1--sm">New room</h1>
      <p className="if-draft-lede">You'll get a code to share with your friends.</p>

      <div className="if-draft-form">
        <div className="if-draft-row">
          <div className="if-draft-row-label">
            <div className="serif if-draft-row-title">Packs per player</div>
            <div className="if-draft-row-hint">Each player opens this many packs across the draft.</div>
          </div>
          <Segmented options={[3, 4, 5, 6]} value={packs} onChange={setPacks} />
        </div>

        <div className="if-draft-row">
          <div className="if-draft-row-label">
            <div className="serif if-draft-row-title">Players</div>
            <div className="if-draft-row-hint">2 to 8. We'll wait for everyone before starting.</div>
          </div>
          <Stepper value={players} min={2} max={8} onChange={setPlayers} />
        </div>

        <div className="if-draft-row">
          <div className="if-draft-row-label">
            <div className="serif if-draft-row-title">Set</div>
            <div className="if-draft-row-hint">
              {setMeta ? `All ${packs} packs come from ${setMeta.name}.` : 'Choose a draftable set.'}
            </div>
          </div>
          <SetPicker sets={state.sets} selected={setCode} onSelect={setSetCode} />
        </div>

        <div className="if-draft-row">
          <div className="if-draft-row-label">
            <div className="serif if-draft-row-title">Pseudonym</div>
            <div className="if-draft-row-hint">Shown to other drafters. No accounts, no email.</div>
          </div>
          <input
            value={pseudonym}
            onChange={(e) => setPseudonym(e.target.value)}
            placeholder="Cleo"
            maxLength={24}
            style={{
              width: '100%',
              maxWidth: 320,
              padding: '11px 14px',
              fontSize: 15,
              border: '1px solid var(--line-strong)',
              borderRadius: 10,
              background: 'var(--surface)',
              color: 'var(--ink)',
              outline: 0,
              fontFamily: 'var(--font-ui)',
            }}
          />
        </div>
      </div>

      {error && (
        <div className="if-draft-error" role="alert">
          Couldn't create the room ({error}). Try again.
        </div>
      )}

      <div className="if-draft-actions">
        <button className="if-btn if-btn--accent" onClick={create} disabled={!setMeta || busy}>
          {busy ? 'Creating…' : 'Create room →'}
        </button>
        <button className="if-btn" onClick={() => dispatch({ type: 'goto', screen: 'landing' })} disabled={busy}>
          Cancel
        </button>
      </div>
    </div>
  );
}
