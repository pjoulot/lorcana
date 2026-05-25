// Icon glyphs ported from the design handoff (icons.jsx + chrome.jsx).
// Sized via `size`, coloured via currentColor.
import type { CSSProperties } from 'react';

interface IconProps {
  size?: number;
  style?: CSSProperties;
}

export function Sparkle({ size = 16, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 7c0 3 2 5 5 5-3 0-5 2-5 5 0-3-2-5-5-5 3 0 5-2 5-5Z" fill="currentColor" />
    </svg>
  );
}

export function Link({ size = 14, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
      <path d="M9 4h2.5a2.5 2.5 0 1 1 0 5H9 M7 12H4.5a2.5 2.5 0 1 1 0-5H7 M5.5 8h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Share({ size = 14, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
      <path d="M8 2v8 M8 2L5.5 4.5 M8 2l2.5 2.5 M3 9v3.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Search({ size = 16, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Close({ size = 16, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

type Dir = 'left' | 'right' | 'up' | 'down';

export function Chevron({ size = 14, dir = 'right', style }: IconProps & { dir?: Dir }) {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ transform: `rotate(${rot}deg)`, ...style }}
      aria-hidden="true"
    >
      <path d="M6 3 L11 8 L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Strength({ size = 14, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <path d="M12 2.5 14 9.3l6.5 1L15.7 14.3l1.3 6.7L12 17.6 6 21l1.3-6.7L3.5 10.3l6.5-1L12 2.5Z" fill="currentColor" />
    </svg>
  );
}

export function Willpower({ size = 14, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <path d="M12 3c1.8-1.2 4-1.1 5.4.3 1.7 1.7 1.7 4.5 0 6.2L12 15 6.6 9.5C4.9 7.8 4.9 5 6.6 3.3 8 1.9 10.2 1.8 12 3Z" fill="currentColor" />
      <path d="M6 12c0 4 3 7 6 9 3-2 6-5 6-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Lore({ size = 14, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z" fill="currentColor" />
      <path d="M12 7 17 12 12 17 7 12 12 7Z" fill="rgba(255,255,255,.35)" />
    </svg>
  );
}

export function InkDrop({ size = 14, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <path d="M12 2.5c-1.6 3-6 7.6-6 11.4a6 6 0 0 0 12 0c0-3.8-4.4-8.4-6-11.4Z" fill="currentColor" />
      <path d="M9.2 12.5c-.5 1.3-.4 2.5.4 3.5" stroke="rgba(255,255,255,.55)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
