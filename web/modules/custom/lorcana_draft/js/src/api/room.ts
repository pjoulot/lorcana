import type { PublicRoom } from '../types';

export interface RoomCredentials {
  playerId: string;
  token: string;
  room: PublicRoom;
}

interface CreateResult extends RoomCredentials {
  code: string;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error((detail as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

/** Creates a room as host. */
export function createRoom(set: string, packs: number, players: number, pseudonym: string): Promise<CreateResult> {
  return postJson<CreateResult>('/api/draft/room', { set, packs, players, pseudonym });
}

/** Joins a lobby by code. Rejects with "not_found" for any failure. */
export function joinRoom(code: string, pseudonym: string): Promise<RoomCredentials> {
  return postJson<RoomCredentials>(`/api/draft/room/${encodeURIComponent(code)}/join`, { pseudonym });
}

/** Fetches current public room state (lobby polling). */
export async function getRoom(code: string): Promise<PublicRoom | null> {
  const res = await fetch(`/api/draft/room/${encodeURIComponent(code)}`, { headers: { 'Cache-Control': 'no-cache' } });
  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as { room: PublicRoom };
  return data.room;
}

/** Host starts the draft. */
export function startRoom(code: string, playerId: string, token: string): Promise<{ room: PublicRoom }> {
  return postJson<{ room: PublicRoom }>(`/api/draft/room/${encodeURIComponent(code)}/start`, { playerId, token });
}
