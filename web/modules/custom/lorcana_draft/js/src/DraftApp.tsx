import type { DraftSettings } from './types';
import { DraftProvider, useDraft, useDraftReducer } from './state/store';
import { Landing } from './ui/Landing';
import { CreateSolo } from './ui/CreateSolo';

export function DraftApp({ settings }: { settings: DraftSettings }) {
  const store = useDraftReducer(settings.sets, settings.soloEndpoint);

  return (
    <DraftProvider value={store}>
      <Screens />
    </DraftProvider>
  );
}

function Screens() {
  const { state } = useDraft();
  switch (state.screen) {
    case 'landing':
      return <Landing />;
    case 'create':
      return <CreateSolo />;
    case 'active':
    case 'end':
      // Replaced by the active-draft and end screens in the next commits.
      return <Placeholder />;
  }
}

function Placeholder() {
  const { state, dispatch } = useDraft();
  return (
    <div className="if-draft-wrap if-draft-wrap--narrow" style={{ textAlign: 'center' }}>
      <h1 className="serif if-draft-h1 if-draft-h1--sm">Packs ready</h1>
      <p className="if-draft-lede">
        {state.setMeta?.name} · {state.packs.length} packs · seed{' '}
        <span className="mono">{state.seed}</span>. The pick screen lands in the next commit.
      </p>
      <div className="if-draft-actions" style={{ justifyContent: 'center' }}>
        <button className="if-btn" onClick={() => dispatch({ type: 'reset' })}>
          ← Back to start
        </button>
      </div>
    </div>
  );
}
