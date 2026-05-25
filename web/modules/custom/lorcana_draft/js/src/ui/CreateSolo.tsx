// Solo draft setup — a pared-down port of CreateRoom (draft-flow.jsx): pick a
// set and pack count, then start. Player count, format, and pseudonym are
// dropped for the solo dry run.
import { useState } from 'react';
import { startSolo } from '../api/solo';
import { useDraft } from '../state/store';
import { Chevron } from './icons';
import { Segmented } from './Segmented';
import { SetPicker } from './SetPicker';

export function CreateSolo() {
  const { state, dispatch } = useDraft();
  const [setCode, setSetCode] = useState(state.sets[0]?.code ?? '');
  const [packs, setPacks] = useState(4);

  const setMeta = state.sets.find((s) => s.code === setCode) ?? null;

  async function start() {
    if (!setMeta) {
      return;
    }
    dispatch({ type: 'startPending' });
    try {
      const response = await startSolo(state.endpoint, setMeta.code, packs);
      dispatch({ type: 'startSuccess', response, setMeta });
    } catch (e) {
      dispatch({ type: 'startError', message: e instanceof Error ? e.message : 'unknown' });
    }
  }

  return (
    <div className="if-draft-wrap if-draft-wrap--narrow">
      <button className="if-draft-crumb" onClick={() => dispatch({ type: 'goto', screen: 'landing' })}>
        <Chevron dir="left" size={12} /> Draft
      </button>

      <h1 className="serif if-draft-h1 if-draft-h1--sm">New draft</h1>
      <p className="if-draft-lede">Pick a set and open some packs. You'll draft through them solo.</p>

      <div className="if-draft-form">
        <div className="if-draft-row">
          <div className="if-draft-row-label">
            <div className="serif if-draft-row-title">Packs</div>
            <div className="if-draft-row-hint">How many packs to open and draft through.</div>
          </div>
          <Segmented options={[3, 4, 5, 6]} value={packs} onChange={setPacks} />
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
      </div>

      {state.error && (
        <div className="if-draft-error" role="alert">
          Couldn't start the draft ({state.error}). Try again.
        </div>
      )}

      <div className="if-draft-actions">
        <button className="if-btn if-btn--accent" onClick={start} disabled={!setMeta || state.loading}>
          {state.loading ? 'Opening packs…' : 'Start draft →'}
        </button>
        <button className="if-btn" onClick={() => dispatch({ type: 'goto', screen: 'landing' })} disabled={state.loading}>
          Cancel
        </button>
      </div>
    </div>
  );
}
