// Client-side pool export: CSV download + a share link that encodes the pool
// in the URL fragment (nothing is stored server-side, per spec 05).
import type { CardData } from '../types';

// ── CSV ──────────────────────────────────────────────────
const CSV_HEADER = ['Name', 'Version', 'Rarity', 'Ink', 'Type', 'Cost', 'Strength', 'Willpower', 'Lore'];

function csvCell(value: string | number | null): string {
  const s = value === null ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function poolToCsv(pool: CardData[]): string {
  const rows = pool.map((c) => [c.name, c.version ?? '', c.rarity, c.ink, c.type, c.cost, c.strength, c.willpower, c.lore]);
  return [CSV_HEADER, ...rows].map((r) => r.map(csvCell).join(',')).join('\n');
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ── Share link (pool encoded in the URL fragment) ────────
const HASH_KEY = 'pool=';

export interface SharedPool {
  set: string;
  setName: string;
  packs: number;
  cards: CardData[];
}

// Keys are abbreviated to keep the fragment compact.
interface PackedCard {
  i: number;
  n: string;
  v: string | null;
  k: string;
  t: string;
  r: string;
  c: number | null;
  s: number | null;
  w: number | null;
  l: number | null;
  m: string | null;
  f: boolean;
}

function utf8ToBase64(str: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

function base64ToUtf8(b64: string): string {
  return new TextDecoder().decode(Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0)));
}

export function encodeShareUrl(set: string, setName: string, packs: number, pool: CardData[]): string {
  const cards: PackedCard[] = pool.map((c) => ({
    i: c.id,
    n: c.name,
    v: c.version,
    k: c.ink,
    t: c.type,
    r: c.rarity,
    c: c.cost,
    s: c.strength,
    w: c.willpower,
    l: c.lore,
    m: c.image,
    f: c.foil,
  }));
  const json = JSON.stringify({ v: 1, set, setName, packs, cards });
  const url = new URL(window.location.href);
  url.hash = HASH_KEY + utf8ToBase64(json);
  return url.toString();
}

export function decodeSharedPool(): SharedPool | null {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash.startsWith(HASH_KEY)) {
    return null;
  }
  try {
    const data = JSON.parse(base64ToUtf8(hash.slice(HASH_KEY.length)));
    if (data?.v !== 1 || !Array.isArray(data.cards)) {
      return null;
    }
    const cards: CardData[] = data.cards.map((c: PackedCard) => ({
      id: c.i,
      name: c.n,
      version: c.v ?? null,
      ink: c.k,
      type: c.t,
      rarity: c.r,
      cost: c.c ?? null,
      strength: c.s ?? null,
      willpower: c.w ?? null,
      lore: c.l ?? null,
      image: c.m ?? null,
      imageLarge: c.m ?? null,
      foil: Boolean(c.f),
    }));
    return { set: data.set, setName: data.setName ?? data.set, packs: data.packs ?? 0, cards };
  } catch {
    return null;
  }
}

export function clearShareHash(): void {
  if (window.location.hash.replace(/^#/, '').startsWith(HASH_KEY)) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}
