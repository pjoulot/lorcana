import { createContext, useContext, useReducer, type Dispatch } from 'react';
import type { CardData, SetInfo, SoloResponse } from '../types';

export type Screen = 'landing' | 'create' | 'active' | 'end';

export interface DraftState {
  screen: Screen;
  sets: SetInfo[];
  endpoint: string;
  loading: boolean;
  error: string | null;
  // Active-draft data, populated when a draft starts.
  setMeta: SetInfo | null;
  seed: string | null;
  packs: CardData[][];
  packIndex: number;
  current: CardData[];
  selected: number | null;
  pool: CardData[];
}

export type DraftAction =
  | { type: 'goto'; screen: Screen }
  | { type: 'startPending' }
  | { type: 'startSuccess'; response: SoloResponse; setMeta: SetInfo }
  | { type: 'startError'; message: string }
  | { type: 'select'; index: number | null }
  | { type: 'pick' }
  | { type: 'reset' };

export function initialState(sets: SetInfo[], endpoint: string): DraftState {
  return {
    screen: 'landing',
    sets,
    endpoint,
    loading: false,
    error: null,
    setMeta: null,
    seed: null,
    packs: [],
    packIndex: 0,
    current: [],
    selected: null,
    pool: [],
  };
}

export function reducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'goto':
      return { ...state, screen: action.screen, error: null };

    case 'startPending':
      return { ...state, loading: true, error: null };

    case 'startError':
      return { ...state, loading: false, error: action.message };

    case 'startSuccess': {
      const packs = action.response.packs;
      return {
        ...state,
        loading: false,
        error: null,
        screen: 'active',
        setMeta: action.setMeta,
        seed: action.response.seed,
        packs,
        packIndex: 0,
        current: [...(packs[0] ?? [])],
        selected: null,
        pool: [],
      };
    }

    case 'select':
      return { ...state, selected: action.index };

    case 'pick': {
      if (state.selected === null || !state.current[state.selected]) {
        return state;
      }
      const card = state.current[state.selected];
      const pool = [...state.pool, card];
      const remaining = state.current.filter((_, i) => i !== state.selected);

      // Solo: keep drafting the current pack until it's empty, then open the
      // next one; when all packs are exhausted the draft is done.
      if (remaining.length > 0) {
        return { ...state, pool, current: remaining, selected: null };
      }
      const nextIndex = state.packIndex + 1;
      if (nextIndex < state.packs.length) {
        return {
          ...state,
          pool,
          packIndex: nextIndex,
          current: [...state.packs[nextIndex]],
          selected: null,
        };
      }
      return { ...state, pool, current: [], selected: null, screen: 'end' };
    }

    case 'reset':
      return initialState(state.sets, state.endpoint);

    default:
      return state;
  }
}

interface Store {
  state: DraftState;
  dispatch: Dispatch<DraftAction>;
}

const DraftContext = createContext<Store | null>(null);

export function useDraftReducer(sets: SetInfo[], endpoint: string): Store {
  const [state, dispatch] = useReducer(reducer, initialState(sets, endpoint));
  return { state, dispatch };
}

export const DraftProvider = DraftContext.Provider;

export function useDraft(): Store {
  const store = useContext(DraftContext);
  if (!store) {
    throw new Error('useDraft must be used within DraftProvider');
  }
  return store;
}
