// Pill segmented control, ported from the design (draft-flow.jsx).
interface SegmentedProps<T extends string | number> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
}

export function Segmented<T extends string | number>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 999,
        padding: 3,
      }}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={String(opt)}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: 0,
              cursor: 'pointer',
              background: active ? 'var(--ink)' : 'transparent',
              color: active ? 'var(--paper)' : 'var(--ink-2)',
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              fontFamily: 'var(--font-ui)',
            }}
            aria-pressed={active}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
