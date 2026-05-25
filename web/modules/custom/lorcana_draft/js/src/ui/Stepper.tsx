// Numeric stepper, ported from the design (draft-flow.jsx) — used for player
// count.
interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function Stepper({ value, min, max, onChange }: StepperProps) {
  const btn = {
    width: 32,
    height: 32,
    padding: 0,
    justifyContent: 'center',
    borderRadius: 999,
    fontSize: 18,
    lineHeight: 1,
  } as const;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        background: 'var(--paper-2)',
        border: '1px solid var(--line)',
        borderRadius: 999,
        padding: '4px 8px',
      }}
    >
      <button type="button" className="if-btn" style={btn} onClick={() => onChange(Math.max(min, value - 1))} aria-label="Fewer">
        −
      </button>
      <div className="mono" style={{ minWidth: 36, textAlign: 'center', fontSize: 17, fontWeight: 700 }}>
        {value}
      </div>
      <button type="button" className="if-btn" style={btn} onClick={() => onChange(Math.min(max, value + 1))} aria-label="More">
        +
      </button>
      <span style={{ fontSize: 12, color: 'var(--ink-3)', paddingRight: 6 }}>
        {min}–{max}
      </span>
    </div>
  );
}
