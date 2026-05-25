// Inkfolk — Sets index page
// Plain listing. Desktop (1280) + Mobile (375).

// Per-set decoration: signature ink color and a short motif.
// Drives cover gradients only; metadata stays minimal.
const SETS_META = {
  TFC: { g1: '#F4B042', g2: '#7E4715', motif: 'Where it all begins.' },
  RFB: { g1: '#5FA3D6', g2: '#1E3F6B', motif: 'A new wave of heroes.' },
  IIH: { g1: '#5BB87E', g2: '#143E27', motif: 'Locations open up the board.' },
  URR: { g1: '#B587D6', g2: '#3F1F6E', motif: 'The sea witch resurfaces.' },
  SSK: { g1: '#A4B3BE', g2: '#3F4A53', motif: 'Take to the air.' },
  AZS: { g1: '#73BFD8', g2: '#1B466B', motif: 'Songs from the deep.' },
  INK: { g1: '#D85959', g2: '#5E1717', motif: 'The viziers ascendant.' },
};

// Newest first
const SETS_REVERSE = [...SETS].reverse();

// ─── SetCover ──────────────────────────────────────────────
// Editorial book-cover: gradient + ghosted glyph + serif title.
function SetCover({ set, aspect = '3/4', size = 'md' }) {
  const meta = SETS_META[set.code];
  const titleSize = size === 'sm' ? 18 : 28;
  const codeSize  = 11;
  const glyphSize = size === 'sm' ? 160 : 240;
  return (
    <div style={{
      position: 'relative',
      aspectRatio: aspect,
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden',
      color: '#fff',
      background: `
        radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,.18) 0%, transparent 55%),
        radial-gradient(90% 100% at 0% 100%, rgba(0,0,0,.32) 0%, transparent 60%),
        linear-gradient(155deg, ${meta.g1} 0%, ${meta.g2} 100%)
      `,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08), 0 10px 24px rgba(20,15,8,.12)',
    }}>
      {/* Ghosted glyph */}
      <div className="serif" aria-hidden style={{
        position: 'absolute',
        right: -20, bottom: -50,
        fontSize: glyphSize, lineHeight: .8, fontWeight: 500,
        color: 'rgba(255,255,255,.14)',
        letterSpacing: '-.04em',
        userSelect: 'none', pointerEvents: 'none',
      }}>
        {set.icon}
      </div>

      {/* Set code badge */}
      <div className="mono" style={{
        position: 'absolute', top: 14, left: 14,
        fontSize: codeSize, fontWeight: 600, letterSpacing: '.14em',
        color: 'rgba(255,255,255,.85)',
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 999,
                        background: 'rgba(255,255,255,.85)' }}/>
        {set.code}
      </div>

      {/* Title block, bottom-left */}
      <div style={{
        position: 'absolute', left: 16, right: 16, bottom: 16,
      }}>
        <div className="serif" style={{
          fontSize: titleSize, fontWeight: 500, letterSpacing: '-.02em',
          lineHeight: .95, textWrap: 'balance',
          color: '#fff', textShadow: '0 2px 18px rgba(0,0,0,.25)',
        }}>
          {set.name}
        </div>
        {size !== 'sm' && (
          <div className="serif" style={{
            marginTop: 8, fontSize: 13, fontStyle: 'italic',
            color: 'rgba(255,255,255,.85)', lineHeight: 1.3,
          }}>
            {meta.motif}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SetTile ───────────────────────────────────────────────
function SetTile({ set }) {
  return (
    <a href="#" style={{
      display: 'flex', flexDirection: 'column', gap: 12,
      textDecoration: 'none', color: 'inherit',
    }}>
      <SetCover set={set} aspect="3/4" size="md"/>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
          {set.date} · {set.cards} cards
        </div>
        <span style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 500,
                        whiteSpace: 'nowrap' }}>
          Explore →
        </span>
      </div>
    </a>
  );
}

// ─── Sets index — DESKTOP ──────────────────────────────────
function SetsIndexDesktop() {
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="sets"/>

      {/* Compact masthead */}
      <header style={{
        padding: '56px 32px 36px',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 28, height: 2, background: 'var(--accent)' }}/>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em',
                            textTransform: 'uppercase', color: 'var(--accent)' }}>
              The archive
            </span>
          </div>
          <h1 className="serif" style={{
            fontSize: 56, fontWeight: 500, letterSpacing: '-.03em',
            margin: '0 0 14px', lineHeight: 1, maxWidth: 900, textWrap: 'balance',
          }}>
            Sets
          </h1>
          <p style={{ fontSize: 17, color: 'var(--ink-2)', maxWidth: 620, margin: 0, lineHeight: 1.5 }}>
            Find every Lorcana set in one place — release dates, card counts,
            and a quick read on what each expansion brought to the table.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '44px 32px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {SETS_REVERSE.map(s => <SetTile key={s.code} set={s}/>)}
        </div>
      </main>

      <Footer compact/>
    </div>
  );
}

// ─── Sets index — MOBILE ───────────────────────────────────
function SetRowMobile({ set }) {
  const meta = SETS_META[set.code];
  return (
    <a href="#" style={{
      display: 'grid', gridTemplateColumns: '92px 1fr', gap: 14, alignItems: 'center',
      padding: '14px 0', borderTop: '1px solid var(--line)',
      textDecoration: 'none', color: 'inherit',
    }}>
      <div style={{ width: 92 }}>
        <SetCover set={set} aspect="3/4" size="sm"/>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                                          color: meta.g2, marginBottom: 4 }}>
          {set.code}
        </div>
        <h4 className="serif" style={{
          fontSize: 17, fontWeight: 500, letterSpacing: '-.01em',
          margin: '0 0 4px', lineHeight: 1.15, textWrap: 'balance',
        }}>
          {set.name}
        </h4>
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
          {set.date} · {set.cards} cards
        </div>
      </div>
    </a>
  );
}

function SetsIndexMobile() {
  return (
    <MobileFrame>
      <TopNavMobile title="Sets"/>
      <div className="if-scroll" style={{
        position: 'absolute', top: 44, left: 0, right: 0, bottom: 0,
        overflow: 'auto', paddingBottom: 80,
      }}>
        {/* Header */}
        <div style={{ padding: '18px 18px 4px' }}>
          <h1 className="serif" style={{
            fontSize: 30, fontWeight: 500, letterSpacing: '-.02em',
            margin: '0 0 6px', lineHeight: 1.02,
          }}>
            Sets
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0, lineHeight: 1.45 }}>
            Find every Lorcana set in one place — release dates, card counts,
            and what each expansion brought.
          </p>
        </div>

        {/* List */}
        <div style={{ padding: '14px 18px 24px' }}>
          {SETS_REVERSE.map(s => <SetRowMobile key={s.code} set={s}/>)}
        </div>
      </div>
      <MobileTabBar active="cards"/>
    </MobileFrame>
  );
}

Object.assign(window, {
  SetsIndexDesktop, SetsIndexMobile,
  SetCover, SetTile, SetRowMobile,
});
