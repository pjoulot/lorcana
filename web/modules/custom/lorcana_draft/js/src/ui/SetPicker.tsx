// Searchable single-select set picker, ported from the design's
// SetSearchPicker (draft-flow.jsx). Filters draftable sets by name or code.
import { useMemo, useState, type ReactNode } from 'react';
import type { SetInfo } from '../types';
import { Search } from './icons';

interface SetPickerProps {
  sets: SetInfo[];
  selected: string | null;
  onSelect: (code: string) => void;
}

export function SetPicker({ sets, selected, onSelect }: SetPickerProps) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const matches = useMemo(
    () =>
      q
        ? sets.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
        : sets,
    [sets, q],
  );

  return (
    <div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, color: 'var(--ink-3)' }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a set…"
          aria-label="Search sets"
          style={{
            width: '100%',
            padding: '10px 36px',
            fontSize: 13.5,
            border: '1px solid var(--line-strong)',
            borderRadius: 10,
            background: 'var(--surface)',
            color: 'var(--ink)',
            outline: 0,
            fontFamily: 'var(--font-ui)',
          }}
        />
        {q && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: 6,
              width: 22,
              height: 22,
              border: 0,
              background: 'transparent',
              color: 'var(--ink-3)',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              borderRadius: 999,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {q && (
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 8 }}>
          <strong className="mono" style={{ color: 'var(--ink-2)' }}>
            {matches.length}
          </strong>{' '}
          match{matches.length === 1 ? '' : 'es'} for{' '}
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>"{q}"</span>
        </div>
      )}

      {matches.length === 0 ? (
        <div
          style={{
            padding: '20px 16px',
            textAlign: 'center',
            border: '1px dashed var(--line-strong)',
            borderRadius: 12,
            fontSize: 12.5,
            color: 'var(--ink-3)',
            lineHeight: 1.5,
          }}
        >
          No sets match <strong>"{q}"</strong>.
          <div style={{ marginTop: 4, fontSize: 11.5 }}>Codes are short (1, 2, 3…).</div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {matches.map((s) => {
            const active = selected === s.code;
            return (
              <button
                key={s.code}
                type="button"
                onClick={() => onSelect(s.code)}
                className="if-chip"
                style={{
                  padding: '8px 12px',
                  fontSize: 13,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  ...(active
                    ? { background: 'var(--accent-soft)', borderColor: 'transparent', color: 'var(--accent-ink)', fontWeight: 600 }
                    : {}),
                }}
                aria-pressed={active}
              >
                <span className="mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', opacity: 0.7 }}>
                  {s.code}
                </span>
                {highlight(s.name, q)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function highlight(text: string, q: string): ReactNode {
  if (!q) {
    return text;
  }
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) {
    return text;
  }
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: 'rgba(244,176,66,.35)', color: 'inherit', padding: 0, borderRadius: 2 }}>
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
}
