// Shared types for the draft SPA.

/** A draftable set, as passed in drupalSettings.lorcanaDraft.sets. */
export interface SetInfo {
  code: string;
  name: string;
  cards: number;
}

/** A card payload from PackPoolProvider::payload() (PHP). */
export interface CardData {
  id: number;
  name: string;
  version: string | null;
  ink: string;
  type: string;
  rarity: string;
  cost: number | null;
  strength: number | null;
  willpower: number | null;
  lore: number | null;
  image: string | null;
  imageLarge: string | null;
  foil: boolean;
}

/** Response from POST /api/draft/solo. */
export interface SoloResponse {
  seed: string;
  set: string;
  /** packs[packIndex] = 12 cards. */
  packs: CardData[][];
}

/** A player in a room's public roster. */
export interface RoomPlayer {
  id: string;
  pseudonym: string;
  host: boolean;
}

/** Token-free room state shared with clients. */
export interface PublicRoom {
  code: string;
  set: string;
  packs: number;
  playerCount: number;
  state: 'lobby' | 'active' | 'done';
  locked: boolean;
  hostId: string;
  players: RoomPlayer[];
}

/** drupalSettings.lorcanaDraft. */
export interface DraftSettings {
  sets: SetInfo[];
  soloEndpoint: string;
}

declare global {
  interface Window {
    drupalSettings?: { lorcanaDraft?: DraftSettings };
  }
}
