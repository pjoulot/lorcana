import type { SoloResponse } from '../types';

/** Requests a fresh solo draft (all packs) from the Drupal endpoint. */
export async function startSolo(endpoint: string, set: string, packs: number): Promise<SoloResponse> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ set, packs }),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error((detail as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as SoloResponse;
}
