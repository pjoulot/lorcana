import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DraftApp } from './DraftApp';
import type { DraftSettings } from './types';
import './styles/draft.css';

const mount = document.getElementById('lorcana-draft-app');
const settings: DraftSettings = window.drupalSettings?.lorcanaDraft ?? {
  sets: [],
  soloEndpoint: '/api/draft/solo',
};

if (mount) {
  mount.textContent = '';
  createRoot(mount).render(
    <StrictMode>
      <DraftApp settings={settings} />
    </StrictMode>,
  );
}
