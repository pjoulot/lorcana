// Ink + rarity lookups, mirroring the design's data.jsx but bound to the
// theme's CSS tokens (tokens.css). Card field_rarity uses `super_rare`, while
// the design keys it `super` — normalizeRarity bridges that.

export interface InkInfo {
  c: string;
  soft: string;
  name: string;
}

export const INK: Record<string, InkInfo> = {
  amber: { c: 'var(--ink-amber)', soft: 'var(--ink-amber-soft)', name: 'Amber' },
  amethyst: { c: 'var(--ink-amethyst)', soft: 'var(--ink-amethyst-soft)', name: 'Amethyst' },
  emerald: { c: 'var(--ink-emerald)', soft: 'var(--ink-emerald-soft)', name: 'Emerald' },
  ruby: { c: 'var(--ink-ruby)', soft: 'var(--ink-ruby-soft)', name: 'Ruby' },
  sapphire: { c: 'var(--ink-sapphire)', soft: 'var(--ink-sapphire-soft)', name: 'Sapphire' },
  steel: { c: 'var(--ink-steel)', soft: 'var(--ink-steel-soft)', name: 'Steel' },
};

export function ink(slug: string): InkInfo {
  return INK[slug] ?? INK.steel;
}

export interface RarityInfo {
  label: string;
  full: string;
  color: string;
}

export const RARITY: Record<string, RarityInfo> = {
  common: { label: 'C', full: 'Common', color: 'var(--rarity-common)' },
  uncommon: { label: 'U', full: 'Uncommon', color: 'var(--rarity-uncommon)' },
  rare: { label: 'R', full: 'Rare', color: 'var(--rarity-rare)' },
  super: { label: 'SR', full: 'Super rare', color: 'var(--rarity-super)' },
  legendary: { label: 'L', full: 'Legendary', color: 'var(--rarity-legendary)' },
  enchanted: { label: 'E', full: 'Enchanted', color: 'var(--rarity-enchanted)' },
};

/** Maps a field_rarity value to a RARITY key (super_rare → super). */
export function normalizeRarity(rarity: string): string {
  return rarity === 'super_rare' ? 'super' : rarity;
}

export function rarity(value: string): RarityInfo {
  return RARITY[normalizeRarity(value)] ?? RARITY.common;
}
