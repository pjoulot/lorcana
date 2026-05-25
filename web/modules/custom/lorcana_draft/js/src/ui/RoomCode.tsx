// Big per-character room-code display, ported from RoomCode (draft-atoms.jsx).
interface RoomCodeProps {
  code: string;
  size?: 'lg' | 'md';
}

export function RoomCode({ code, size = 'lg' }: RoomCodeProps) {
  const cell = size === 'lg' ? 56 : 42;
  const font = size === 'lg' ? 34 : 24;
  return (
    <div style={{ display: 'inline-flex', gap: 6 }}>
      {code.split('').map((ch, i) => (
        <div
          key={i}
          className="mono"
          style={{
            width: cell,
            height: cell * 1.2,
            display: 'grid',
            placeItems: 'center',
            background: 'var(--surface)',
            border: '1px solid var(--line-strong)',
            borderRadius: size === 'lg' ? 12 : 8,
            fontSize: font,
            fontWeight: 700,
            color: 'var(--ink)',
            boxShadow: 'var(--shadow-1)',
          }}
        >
          {ch}
        </div>
      ))}
    </div>
  );
}
