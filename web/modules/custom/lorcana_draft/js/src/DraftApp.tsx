import type { DraftSettings } from './types';
import { DraftProvider, useDraft, useDraftReducer } from './state/store';
import { Landing } from './ui/Landing';
import { CreateSolo } from './ui/CreateSolo';
import { CreateRoom } from './ui/CreateRoom';
import { Lobby } from './ui/Lobby';
import { Countdown } from './ui/Countdown';
import { ActiveDraft } from './ui/ActiveDraft';
import { EndScreen } from './ui/EndScreen';

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
    case 'createRoom':
      return <CreateRoom />;
    case 'lobby':
      return <Lobby />;
    case 'countdown':
      return <Countdown />;
    case 'active':
      return <ActiveDraft />;
    case 'end':
      return <EndScreen />;
  }
}
