// Inkfolk — Draft simulator: flow screens
// Landing → Create → Lobby → Countdown → … → End / Reconnect / Errors.
// Active-draft screens live in draft-active.jsx.

// ─── 1. Landing — Desktop ──────────────────────────────────
function DraftLandingDesktop() {
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="draft"/>
      <header style={{ padding: '64px 32px 24px',
                        borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ width: 28, height: 2, background: 'var(--accent)' }}/>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em',
                            textTransform: 'uppercase', color: 'var(--accent)' }}>
              Booster draft · simulator
            </span>
          </div>
          <h1 className="serif" style={{
            fontSize: 64, fontWeight: 500, letterSpacing: '-.03em',
            margin: '0 0 16px', lineHeight: .98, maxWidth: 880, textWrap: 'balance',
          }}>
            A booster draft, run from the couch.
          </h1>
          <p style={{ fontSize: 18, color: 'var(--ink-2)', maxWidth: 620, margin: 0, lineHeight: 1.5 }}>
            Open simulated packs with 2–8 friends. We handle the picking — you bring
            the physical cards to the table afterwards.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px 56px' }}>
        {/* Two CTAs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Create */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 18, padding: '32px 32px 28px', boxShadow: 'var(--shadow-2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Sparkle size={18} style={{ color: 'var(--accent)' }}/>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em',
                              textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                Host a draft
              </span>
            </div>
            <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-.02em',
                                            margin: '0 0 8px', lineHeight: 1.05 }}>
              Create a room
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '0 0 22px', lineHeight: 1.5 }}>
              Pick a set, set a player count, and share a 6-letter code with your group.
            </p>
            <button className="if-btn if-btn--accent" style={{ fontSize: 14, padding: '12px 20px', width: '100%', justifyContent: 'center' }}>
              Create a room →
            </button>
          </div>

          {/* Join */}
          <div style={{
            background: 'var(--paper-2)', border: '1px solid var(--line)',
            borderRadius: 18, padding: '32px 32px 28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Link size={16} style={{ color: 'var(--ink-3)' }}/>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em',
                              textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                Joining one?
              </span>
            </div>
            <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-.02em',
                                            margin: '0 0 8px', lineHeight: 1.05 }}>
              Enter a code
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '0 0 22px', lineHeight: 1.5 }}>
              Ask the host for the 6-letter room code (it'll look like “WHRTNK”).
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                placeholder="ABCDEF"
                maxLength={6}
                className="mono"
                style={{
                  flex: 1, padding: '14px 18px', fontSize: 22, fontWeight: 700,
                  letterSpacing: '.3em', textTransform: 'uppercase', textAlign: 'center',
                  border: '1px solid var(--line-strong)', borderRadius: 12,
                  background: 'var(--surface)', color: 'var(--ink)', outline: 0,
                }}
                aria-label="Room code"
              />
              <button className="if-btn if-btn--primary" style={{ fontSize: 14, padding: '12px 20px' }}>
                Join →
              </button>
            </div>
          </div>
        </div>

        {/* How it works */}
        <section style={{ marginTop: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em',
                          textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 18 }}>
            How it works
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { n: 1, t: 'Open a room', d: 'The host picks a set and player count, and a 6-letter code appears. Share it.' },
              { n: 2, t: 'Open & pick',  d: 'Packs of 12 open in sync. Pick one card, pass the rest. Across four packs, ~48 cards land in your pool.' },
              { n: 3, t: 'Play in person', d: 'Export your pool as CSV or a shareable link, then sit down with your friends and the physical cards.' },
            ].map(s => (
              <div key={s.n}>
                <div className="serif" style={{
                  fontSize: 56, fontWeight: 500, color: 'var(--accent)',
                  letterSpacing: '-.03em', lineHeight: 1, marginBottom: 8,
                }}>
                  {s.n.toString().padStart(2, '0')}
                </div>
                <h3 className="serif" style={{ fontSize: 22, fontWeight: 500,
                                                letterSpacing: '-.015em', margin: '0 0 6px' }}>
                  {s.t}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, lineHeight: 1.55 }}>
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Aside */}
        <aside style={{
          marginTop: 48, padding: '18px 22px',
          background: 'var(--paper-2)', border: '1px solid var(--line)',
          borderRadius: 14, display: 'flex', gap: 14, alignItems: 'center',
          fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5,
        }}>
          <span style={{ fontSize: 18 }}>ⓘ</span>
          <span>
            <strong>Nothing is saved on our server.</strong> When the draft ends you'll
            be able to export your pool — that's your only chance to keep it.
          </span>
        </aside>
      </main>
      <Footer compact/>
    </div>
  );
}

// ─── 1. Landing — Mobile ───────────────────────────────────
function DraftLandingMobile() {
  return (
    <MobileFrame>
      <TopNavMobile title="Draft"/>
      <div className="if-scroll" style={{
        position: 'absolute', top: 44, left: 0, right: 0, bottom: 0,
        overflow: 'auto', paddingBottom: 90,
      }}>
        <header style={{ padding: '18px 18px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                          fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em',
                          textTransform: 'uppercase', color: 'var(--accent)' }}>
            <span style={{ width: 18, height: 2, background: 'var(--accent)' }}/>
            Booster draft
          </div>
          <h1 className="serif" style={{
            fontSize: 30, fontWeight: 500, letterSpacing: '-.02em',
            margin: '0 0 8px', lineHeight: 1.02, textWrap: 'balance',
          }}>
            A booster draft, run from the couch.
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0, lineHeight: 1.45 }}>
            Open simulated packs with 2–8 friends — we handle the picking.
          </p>
        </header>

        <div style={{ padding: '18px 18px 6px', display: 'grid', gap: 12 }}>
          {/* Create */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 14, padding: '18px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
                            textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>
              Host a draft
            </div>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.015em',
                                            margin: '0 0 6px', lineHeight: 1.1 }}>
              Create a room
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: '0 0 14px', lineHeight: 1.45 }}>
              Pick a set and share a 4-letter code with your group.
            </p>
            <button className="if-btn if-btn--accent" style={{ fontSize: 13, padding: '11px 16px', width: '100%', justifyContent: 'center' }}>
              Create a room →
            </button>
          </div>

          {/* Join */}
          <div style={{
            background: 'var(--paper-2)', border: '1px solid var(--line)',
            borderRadius: 14, padding: '18px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
                            textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>
              Joining one?
            </div>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.015em',
                                            margin: '0 0 6px', lineHeight: 1.1 }}>
              Enter a code
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: '0 0 14px', lineHeight: 1.45 }}>
              Ask the host for the 6-letter room code.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="ABCDEF" maxLength={6} className="mono"
                style={{
                  flex: 1, padding: '10px 10px', fontSize: 16, fontWeight: 700,
                  letterSpacing: '.18em', textTransform: 'uppercase', textAlign: 'center',
                  border: '1px solid var(--line-strong)', borderRadius: 10,
                  background: 'var(--surface)', color: 'var(--ink)', outline: 0,
                }}
                aria-label="Room code"
              />
              <button className="if-btn if-btn--primary" style={{ fontSize: 13, padding: '10px 14px' }}>
                Join
              </button>
            </div>
          </div>
        </div>

        {/* How it works */}
        <section style={{ padding: '24px 18px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
                          textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
            How it works
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {[
              { n: 1, t: 'Open a room', d: 'Host picks a set, gets a 6-letter code, and shares it.' },
              { n: 2, t: 'Open & pick',  d: 'Packs of 12 open in sync. Pick one card, pass the rest.' },
              { n: 3, t: 'Play in person', d: 'Export your ~48-card pool, then play with your physical cards.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'grid', gridTemplateColumns: '38px 1fr', gap: 12 }}>
                <div className="serif" style={{
                  fontSize: 32, fontWeight: 500, color: 'var(--accent)',
                  letterSpacing: '-.03em', lineHeight: .9,
                }}>
                  {s.n}
                </div>
                <div>
                  <div className="serif" style={{ fontSize: 16, fontWeight: 600,
                                                    letterSpacing: '-.01em', marginBottom: 2 }}>
                    {s.t}
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>
                    {s.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{
          margin: '8px 18px 24px', padding: '12px 14px',
          background: 'var(--paper-2)', border: '1px solid var(--line)',
          borderRadius: 12, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5,
        }}>
          <strong>Nothing is saved on our server.</strong> Export your pool at the end
          to keep it.
        </aside>
      </div>
      <MobileTabBar active="draft"/>
    </MobileFrame>
  );
}

// ─── 2. Create Room — Desktop ──────────────────────────────
const DRAFTABLE_SETS = SETS;

function FormRow({ label, hint, children }) {
  return (
    <div style={{ padding: '20px 0', borderTop: '1px solid var(--line)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24, alignItems: 'baseline' }}>
        <div>
          <div className="serif" style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-.01em' }}>
            {label}
          </div>
          {hint && (
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.45 }}>
              {hint}
            </div>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

// PackAllocation — in multi-set mode, splits the packs-per-player budget
// across the selected sets via per-row mini steppers. Header shows the
// running total vs the budget, with a check / warning depending on whether
// they balance.
function PackAllocation({ sets, packs, total, valid, compact = false }) {
  const sum = sets.reduce((a, s) => a + (packs[s.code] || 0), 0);
  const ok = sum === total;
  return (
    <div style={{
      background: 'var(--paper-2)', border: '1px solid var(--line)',
      borderRadius: 12, padding: compact ? '4px 8px' : '6px 12px',
    }}>
      {/* Header strip with running total */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: compact ? '8px 4px' : '10px 4px',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
                        textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          Allocation
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 600,
          color: ok ? 'var(--ink-emerald)' : 'var(--ink-ruby)',
        }}>
          {ok ? (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              <circle cx="8" cy="11" r=".9" fill="currentColor"/>
            </svg>
          )}
          <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {sum}/{total}
          </span>
          <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>
            {ok ? 'balanced' : sum < total ? `add ${total - sum}` : `remove ${sum - total}`}
          </span>
        </div>
      </div>

      {/* Rows */}
      <div>
        {sets.map((s, i) => (
          <div key={s.code} style={{
            display: 'grid', gridTemplateColumns: '1fr auto', gap: 12,
            alignItems: 'center', padding: compact ? '8px 4px' : '12px 4px',
            borderTop: i === 0 ? 0 : '1px solid var(--line)',
          }}>
            <div style={{ minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 9.5, fontWeight: 700,
                                                letterSpacing: '.1em', color: 'var(--ink-3)' }}>
                {s.code}
              </div>
              <div className="serif" style={{ fontSize: compact ? 13 : 14, fontWeight: 500,
                                                letterSpacing: '-.005em',
                                                whiteSpace: 'nowrap', overflow: 'hidden',
                                                textOverflow: 'ellipsis' }}>
                {s.name}
              </div>
            </div>
            <MiniStepper value={packs[s.code] || 0} max={total} compact={compact}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// Small inline stepper for the allocation rows. Renders "packs" suffix
// only on >0 so the row stays calm when empty.
function MiniStepper({ value, max, compact }) {
  const sz = compact ? 26 : 30;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'var(--surface)', border: '1px solid var(--line)',
                    borderRadius: 999, padding: '3px 4px' }}>
      <button className="if-btn" style={{ width: sz, height: sz, padding: 0,
                                            justifyContent: 'center', borderRadius: 999,
                                            fontSize: 16, lineHeight: 1, color: value === 0 ? 'var(--ink-4)' : 'var(--ink-2)' }}>
        −
      </button>
      <div className="mono" style={{ minWidth: compact ? 22 : 28, textAlign: 'center',
                                        fontSize: compact ? 14 : 15, fontWeight: 700,
                                        fontVariantNumeric: 'tabular-nums',
                                        color: value === 0 ? 'var(--ink-4)' : 'var(--ink)' }}>
        {value}
      </div>
      <button className="if-btn" style={{ width: sz, height: sz, padding: 0,
                                            justifyContent: 'center', borderRadius: 999,
                                            fontSize: 16, lineHeight: 1 }}>
        +
      </button>
    </div>
  );
}

// SetSearchPicker — searchable chip picker shared by desktop + mobile.
// `multi` makes it a checklist (with checkboxes inside the chips).
// `query` is a static prop for design purposes (no actual filtering state).
function SetSearchPicker({ sets, selected, multi = true, query = '', placeholder = 'Search by name or code…', emptyHint, compact = false }) {
  const q = (query || '').trim().toLowerCase();
  const matches = q
    ? sets.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
    : sets;
  return (
    <div>
      {/* Search input */}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        marginBottom: 10,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              style={{ position: 'absolute', left: 12, color: 'var(--ink-3)' }}>
          <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8"/>
          <path d="m20 20-4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input
          defaultValue={query}
          placeholder={placeholder}
          style={{
            width: '100%', padding: compact ? '9px 36px 9px 34px' : '10px 36px 10px 36px',
            fontSize: compact ? 12.5 : 13.5,
            border: '1px solid var(--line-strong)', borderRadius: 10,
            background: 'var(--surface)', color: 'var(--ink)', outline: 0,
            fontFamily: 'var(--font-ui)',
          }}/>
        {q && (
          <button style={{
            position: 'absolute', right: 6, width: 22, height: 22, border: 0,
            background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer',
            display: 'grid', placeItems: 'center', borderRadius: 999,
          }} aria-label="Clear search">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Match summary */}
      {q && (
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 8,
                       display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>
            <strong className="mono" style={{ color: 'var(--ink-2)' }}>{matches.length}</strong>
            {' '}match{matches.length === 1 ? '' : 'es'} for
            {' '}<span style={{ color: 'var(--ink)', fontWeight: 600 }}>"{q}"</span>
          </span>
        </div>
      )}

      {/* Chips */}
      {matches.length === 0 ? (
        <div style={{
          padding: '20px 16px', textAlign: 'center',
          border: '1px dashed var(--line-strong)', borderRadius: 12,
          fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.5,
        }}>
          No sets match <strong>"{q}"</strong>.
          {emptyHint && <div style={{ marginTop: 4, fontSize: 11.5 }}>{emptyHint}</div>}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: compact ? 6 : 8, flexWrap: 'wrap' }}>
          {matches.map(s => {
            const isActive = selected instanceof Set
              ? selected.has(s.code)
              : selected === s.code;
            return (
              <button key={s.code} className="if-chip" style={{
                padding: compact ? '6px 10px' : '8px 12px',
                fontSize: compact ? 11.5 : 13,
                display: 'inline-flex', alignItems: 'center', gap: compact ? 5 : 6,
                ...(isActive ? {
                  background: 'var(--accent-soft)', borderColor: 'transparent',
                  color: 'var(--accent-ink)', fontWeight: 600,
                } : {}),
              }}>
                {multi && (
                  <span style={{
                    width: compact ? 11 : 14, height: compact ? 11 : 14, borderRadius: 4,
                    border: '1.5px solid ' + (isActive ? 'var(--accent-ink)' : 'var(--line-strong)'),
                    background: isActive ? 'var(--accent-ink)' : 'transparent',
                    display: 'grid', placeItems: 'center', color: 'var(--accent)',
                  }}>
                    {isActive && (
                      <svg width={compact ? 7 : 9} height={compact ? 7 : 9} viewBox="0 0 16 16" fill="none">
                        <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2.4"
                              strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                )}
                <span className="mono" style={{
                  fontSize: compact ? 9 : 10, fontWeight: 700, letterSpacing: '.08em', opacity: .7,
                }}>{s.code}</span>
                {highlight(s.name, q)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Lightweight match highlighter used inside chips.
function highlight(text, q) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: 'rgba(244,176,66,.35)', color: 'inherit',
                       padding: 0, borderRadius: 2 }}>
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
}

function CreateRoomDesktop({ setMode = 'single', packsPerPlayer = 4, query = '' }) {
  const selectedSet = 'INK';
  // In multi-set mode, several sets are selected; allocate packs across them.
  const multiSelected = new Set(['IIH', 'URR', 'SSK', 'AZS', 'INK']);
  // Even-ish default allocation that sums to packsPerPlayer.
  const packsPerSet = (() => {
    const codes = [...multiSelected];
    const base = Math.floor(packsPerPlayer / codes.length);
    const extra = packsPerPlayer - base * codes.length;
    const out = {};
    codes.forEach((c, i) => out[c] = base + (i < extra ? 1 : 0));
    return out;
  })();
  const allocSum = Object.values(packsPerSet).reduce((a, b) => a + b, 0);
  const allocValid = allocSum === packsPerPlayer;
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="draft"/>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 32px 56px' }}>
        {/* Crumb back to landing */}
        <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                              fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none', marginBottom: 18 }}>
          <Chevron dir="left" size={12}/> Draft
        </a>
        <h1 className="serif" style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-.025em',
                                          margin: '0 0 8px', lineHeight: 1.02 }}>
          New room
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', margin: '0 0 32px', lineHeight: 1.5 }}>
          You'll get a code to share with your friends.
        </p>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 18,
          padding: '8px 28px 28px', boxShadow: 'var(--shadow-1)',
        }}>
          <FormRow label="Packs per player" hint="Each player opens this many packs across the draft. Sets the budget for how many you pull from each set below.">
            <Segmented options={[3, 4, 5, 6]} value={packsPerPlayer}/>
          </FormRow>

          <FormRow label="Players" hint="2 to 8. We'll wait for everyone before starting.">
            <Stepper value={4} min={2} max={8}/>
          </FormRow>

          <FormRow label="Format" hint={
            setMode === 'single'
              ? 'Draft from the card pool of a single set — a classic block draft.'
              : 'Draft from a pooled card pool across multiple sets — chaotic and fun.'
          }>
            <Segmented options={[{ value: 'single', label: 'Single set' }, { value: 'multi', label: 'Multi-set' }]}
                          value={setMode}/>
          </FormRow>

          <FormRow label={setMode === 'multi' ? 'Sets to include' : 'Set'}
                    hint={
                      setMode === 'multi'
                        ? 'Pick 2 or more. Allocate packs to each below.'
                        : `All ${packsPerPlayer} packs will come from this set.`
                    }>
            <SetSearchPicker
              sets={DRAFTABLE_SETS}
              selected={setMode === 'multi' ? multiSelected : selectedSet}
              multi={setMode === 'multi'}
              query={query}
              placeholder={setMode === 'multi'
                ? 'Search 7 sets by name or code…'
                : 'Find a set…'}
              emptyHint="Codes are 3 letters (TFC, RFB, INK)."
            />
            {setMode === 'multi' && (
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 10 }}>
                <strong style={{ color: 'var(--ink-2)' }}>{multiSelected.size} selected</strong>
                {' '}— allocate packs in the row below.
              </div>
            )}
          </FormRow>

          {setMode === 'multi' && (
            <FormRow label="Pack allocation" hint={`Split your ${packsPerPlayer} packs across the selected sets. Each player opens these in order.`}>
              <PackAllocation
                sets={DRAFTABLE_SETS.filter(s => multiSelected.has(s.code))}
                packs={packsPerSet}
                total={packsPerPlayer}
                valid={allocValid}/>
            </FormRow>
          )}

          <FormRow label="Pseudonym" hint="Shown to other drafters. No accounts, no email.">
            <input defaultValue="Cleo"
              style={{
                width: '100%', maxWidth: 320, padding: '11px 14px', fontSize: 15,
                border: '1px solid var(--line-strong)', borderRadius: 10,
                background: 'var(--surface)', color: 'var(--ink)', outline: 0,
                fontFamily: 'var(--font-ui)',
              }}/>
          </FormRow>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 28, alignItems: 'center' }}>
          <button className="if-btn if-btn--accent" style={{ fontSize: 14, padding: '12px 22px' }}>
            Create room →
          </button>
          <button className="if-btn" style={{ fontSize: 13, padding: '11px 18px' }}>
            Cancel
          </button>
          <span style={{ flex: 1 }}/>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            You'll be the host. You can change settings until the draft starts.
          </span>
        </div>
      </main>
      <Footer compact/>
    </div>
  );
}

// Stepper — for player count
function Stepper({ value, min = 2, max = 8 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14,
                    background: 'var(--paper-2)', border: '1px solid var(--line)',
                    borderRadius: 999, padding: '4px 8px' }}>
      <button className="if-btn" style={{ width: 32, height: 32, padding: 0, justifyContent: 'center',
                                            borderRadius: 999, fontSize: 18, lineHeight: 1 }}>−</button>
      <div className="mono" style={{ minWidth: 36, textAlign: 'center', fontSize: 17, fontWeight: 700 }}>
        {value}
      </div>
      <button className="if-btn" style={{ width: 32, height: 32, padding: 0, justifyContent: 'center',
                                            borderRadius: 999, fontSize: 18, lineHeight: 1 }}>+</button>
      <span style={{ fontSize: 12, color: 'var(--ink-3)', paddingRight: 6 }}>
        {min}–{max}
      </span>
    </div>
  );
}

// Segmented control — generic. Options can be primitives (rendered as labels)
// or { value, label } objects for richer labels.
function Segmented({ options, value }) {
  const items = options.map(o => (typeof o === 'object' ? o : { value: o, label: o }));
  return (
    <div style={{
      display: 'inline-flex', background: 'var(--surface)',
      border: '1px solid var(--line)', borderRadius: 999, padding: 3,
    }}>
      {items.map(o => (
        <button key={o.value} style={{
          padding: '8px 16px', borderRadius: 999, border: 0, cursor: 'pointer',
          background: o.value === value ? 'var(--ink)' : 'transparent',
          color: o.value === value ? 'var(--paper)' : 'var(--ink-2)',
          fontSize: 13, fontWeight: o.value === value ? 600 : 500,
          fontFamily: 'var(--font-ui)',
        }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Toggle
function Toggle({ value }) {
  return (
    <button style={{
      width: 44, height: 24, borderRadius: 999, border: 0, cursor: 'pointer',
      background: value ? 'var(--accent)' : 'var(--line-strong)',
      position: 'relative', padding: 0,
    }}>
      <span style={{
        position: 'absolute', top: 2, left: value ? 22 : 2, width: 20, height: 20,
        borderRadius: 999, background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left .15s',
      }}/>
    </button>
  );
}

// ─── 2. Create Room — Mobile ───────────────────────────────
function CreateRoomMobile({ setMode = 'single', packsPerPlayer = 4, query = '' }) {
  const selectedSet = 'INK';
  const multiSelected = new Set(['IIH', 'URR', 'SSK', 'AZS', 'INK']);
  const packsPerSet = (() => {
    const codes = [...multiSelected];
    const base = Math.floor(packsPerPlayer / codes.length);
    const extra = packsPerPlayer - base * codes.length;
    const out = {};
    codes.forEach((c, i) => out[c] = base + (i < extra ? 1 : 0));
    return out;
  })();
  const allocSum = Object.values(packsPerSet).reduce((a, b) => a + b, 0);
  const allocValid = allocSum === packsPerPlayer;
  return (
    <MobileFrame>
      <TopNavMobile back title="New room"/>
      <div className="if-scroll" style={{
        position: 'absolute', top: 44, left: 0, right: 0, bottom: 76,
        overflow: 'auto',
      }}>
        <div style={{ padding: '14px 18px 24px' }}>
          {/* Packs per player — top, as it gates the rest */}
          <div style={{ paddingBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
                            textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
              Packs per player
            </div>
            <Segmented options={[3, 4, 5, 6]} value={packsPerPlayer}/>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6 }}>
              Each player opens this many packs total.
            </div>
          </div>

          {/* Format toggle */}
          <div style={{ paddingBottom: 14, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
                            textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
              Format
            </div>
            <Segmented options={[{ value: 'single', label: 'Single set' }, { value: 'multi', label: 'Multi-set' }]}
                          value={setMode}/>
          </div>

          {/* Set picker — searchable */}
          <div style={{ paddingBottom: 16, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
                              textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                {setMode === 'multi' ? `Sets (${multiSelected.size})` : 'Set'}
              </div>
              {setMode === 'multi' && (
                <button style={{
                  background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
                  fontSize: 11, color: 'var(--accent)', fontWeight: 600,
                }}>Select all</button>
              )}
            </div>
            <SetSearchPicker
              sets={DRAFTABLE_SETS}
              selected={setMode === 'multi' ? multiSelected : selectedSet}
              multi={setMode === 'multi'}
              query={query}
              placeholder="Search by name or code…"
              compact
            />
          </div>

          {setMode === 'multi' && (
            <div style={{ borderTop: '1px solid var(--line)', padding: '16px 0' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
                              textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
                Pack allocation
              </div>
              <PackAllocation
                sets={DRAFTABLE_SETS.filter(s => multiSelected.has(s.code))}
                packs={packsPerSet}
                total={packsPerPlayer}
                valid={allocValid}
                compact/>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--line)', padding: '16px 0',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="serif" style={{ fontSize: 15, fontWeight: 500 }}>Players</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>2 to 8</div>
            </div>
            <Stepper value={4}/>
          </div>

          <div style={{ borderTop: '1px solid var(--line)', padding: '16px 0' }}>
            <div className="serif" style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Pseudonym</div>
            <input defaultValue="Cleo" style={{
              width: '100%', padding: '11px 14px', fontSize: 15,
              border: '1px solid var(--line-strong)', borderRadius: 10,
              background: 'var(--surface)', color: 'var(--ink)', outline: 0,
              fontFamily: 'var(--font-ui)',
            }}/>
          </div>
        </div>
      </div>
      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 18px 26px',
        background: 'color-mix(in oklab, var(--paper) 92%, transparent)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--line)',
      }}>
        <button className="if-btn if-btn--accent" style={{
          width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: 14,
        }}>
          Create room →
        </button>
      </div>
    </MobileFrame>
  );
}

// ─── 3. Lobby — Desktop ────────────────────────────────────
function LobbyDesktop({ isHost = true }) {
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="draft"/>
      <main style={{ maxWidth: 920, margin: '0 auto', padding: '56px 32px 56px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em',
                          textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
            Lobby · waiting for players
          </div>
          <h1 className="serif" style={{ fontSize: 38, fontWeight: 500, letterSpacing: '-.025em',
                                            margin: '0 0 22px', lineHeight: 1.05 }}>
            Share this code with your friends
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RoomCode code="WHRTNK" size="lg" onCopy={() => {}}/>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--ink-3)' }}>
            Or send them <a href="#" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>inkfolk.fan/draft/WHRTNK</a>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 18, padding: 28, boxShadow: 'var(--shadow-1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                          marginBottom: 18 }}>
            <h2 className="serif" style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.015em', margin: 0 }}>
              Players <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>(3 of 4)</span>
            </h2>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              {DRAFTABLE_SETS.find(s => s.code === 'INK').name} · 4 packs · ~12 min
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[...DRAFT_PLAYERS.slice(0, 3), null].map((p, i) =>
              p ? (
                <div key={p.id} style={{
                  background: 'var(--paper-2)', border: '1px solid var(--line)',
                  borderRadius: 14, padding: 16,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                }}>
                  <PlayerAvatar player={{ ...p, picking: false }} size={56} label/>
                  {isHost && !p.you && (
                    <button className="if-btn" style={{ fontSize: 11, padding: '4px 10px',
                                                          color: 'var(--ink-3)' }}>
                      Kick
                    </button>
                  )}
                </div>
              ) : (
                <div key={`empty-${i}`} style={{
                  background: 'transparent',
                  border: '1px dashed var(--line-strong)',
                  borderRadius: 14, padding: 16, minHeight: 132,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                  color: 'var(--ink-3)',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 21c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.05em',
                                  textTransform: 'uppercase' }}>
                    Waiting…
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 28, alignItems: 'center' }}>
          {isHost ? (
            <>
              <button className="if-btn if-btn--accent" style={{ fontSize: 14, padding: '12px 22px' }}>
                Start when ready →
              </button>
              <button className="if-btn" style={{ fontSize: 13 }}>
                Lock room
              </button>
              <button className="if-btn" style={{ fontSize: 13 }}>
                Settings
              </button>
              <span style={{ flex: 1 }}/>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                You can start with fewer players — empty seats become bots.
              </span>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Spinner/>
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                Waiting for the host to start…
              </span>
            </div>
          )}
        </div>
      </main>
      <Footer compact/>
    </div>
  );
}

function Spinner({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ animation: 'inkfolk-spin 1s linear infinite', transformOrigin: 'center' }}>
      <circle cx="8" cy="8" r="6" stroke="var(--line-strong)" strokeWidth="2" fill="none"/>
      <path d="M8 2a6 6 0 0 1 6 6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ─── 3. Lobby — Mobile ─────────────────────────────────────
function LobbyMobile() {
  return (
    <MobileFrame>
      <TopNavMobile back title="Lobby"/>
      <div className="if-scroll" style={{
        position: 'absolute', top: 44, left: 0, right: 0, bottom: 84,
        overflow: 'auto',
      }}>
        <div style={{ padding: '18px 18px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                          textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
            Share to invite
          </div>
          <div style={{ display: 'inline-flex' }}>
            <RoomCode code="WHRTNK" size="md"/>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="if-btn" style={{ fontSize: 12, padding: '8px 14px' }}>
              <Link size={12}/> Copy code
            </button>
            <button className="if-btn" style={{ fontSize: 12, padding: '8px 14px' }}>
              <Share size={12}/> Share
            </button>
          </div>
        </div>

        <div style={{ padding: '12px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                          marginBottom: 10 }}>
            <div className="serif" style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-.01em' }}>
              Players <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>(3 of 4)</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>
              Reign of Jafar · 4 packs
            </span>
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            {DRAFT_PLAYERS.slice(0, 3).map(p => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderTop: '1px solid var(--line)',
              }}>
                <PlayerAvatar player={{ ...p, picking: false }} size={36}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)',
                                  display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.name}
                    {p.you && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em',
                                                padding: '1px 5px', borderRadius: 4,
                                                background: 'var(--accent)', color: 'var(--accent-ink)' }}>YOU</span>}
                    {p.host && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em',
                                                padding: '1px 5px', borderRadius: 4,
                                                background: 'var(--ink)', color: 'var(--paper)' }}>HOST</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                    {p.status === 'connected' ? 'Ready' : p.status === 'reconnecting' ? 'Reconnecting…' : 'Offline'}
                  </div>
                </div>
              </div>
            ))}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0', borderTop: '1px solid var(--line)',
              color: 'var(--ink-3)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 999,
                border: '1.5px dashed var(--line-strong)',
                display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 300,
              }}>+</div>
              <span style={{ fontSize: 13 }}>Waiting for one more…</span>
            </div>
          </div>
        </div>
      </div>
      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 18px 32px',
        background: 'color-mix(in oklab, var(--paper) 92%, transparent)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--line)',
      }}>
        <button className="if-btn if-btn--accent" style={{
          width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: 14,
        }}>
          Start when ready →
        </button>
      </div>
    </MobileFrame>
  );
}

// ─── 4. Countdown — Desktop ────────────────────────────────
function CountdownDesktop({ n = 3 }) {
  return (
    <div className="if-screen" style={{ width: 1280, height: '100%',
                                            position: 'relative', overflow: 'hidden' }}>
      {/* Dimmed pack-grid backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(60% 50% at 50% 50%, var(--paper-2) 0%, var(--paper) 80%)`,
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, padding: 80,
        opacity: .18, filter: 'blur(2px)',
      }}>
        {makeDraftPack(0).slice(0, 4).map((c, i) => (
          <Card key={i} card={c} size="normal" frame="subtle" style={{ width: '100%' }}/>
        ))}
      </div>

      <div style={{ position: 'relative', height: '100%', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.2em',
                          textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 24 }}>
            Get ready…
          </div>
          <div className="serif" key={n} style={{
            fontSize: 220, fontWeight: 500, letterSpacing: '-.04em', lineHeight: 1,
            color: 'var(--ink)',
            animation: 'inkfolk-countdown 1s ease-out forwards',
          }}>
            {n}
          </div>
          <div style={{ marginTop: 14, fontSize: 16, color: 'var(--ink-2)' }}>
            Pack 1 of 4 opening shortly
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 4. Countdown — Mobile ─────────────────────────────────
function CountdownMobile({ n = 3 }) {
  return (
    <MobileFrame>
      <div style={{
        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
        background: `radial-gradient(60% 50% at 50% 50%, var(--paper-2) 0%, var(--paper) 80%)`,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.18em',
                          textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 18 }}>
            Get ready…
          </div>
          <div className="serif" style={{
            fontSize: 160, fontWeight: 500, letterSpacing: '-.04em', lineHeight: 1,
            color: 'var(--ink)',
          }}>
            {n}
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-2)' }}>
            Pack 1 of 4 opening shortly
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

// ─── 10. End-of-draft — shared pool-by-ink helper ──────────
function poolByInk(pool) {
  const order = ['amber','amethyst','emerald','ruby','sapphire','steel'];
  const groups = {};
  order.forEach(i => groups[i] = []);
  pool.forEach(c => (groups[c.ink] || (groups[c.ink] = [])).push(c));
  return order.map(ink => ({ ink, name: INK[ink].name, cards: groups[ink] || [] }))
                .filter(g => g.cards.length);
}

// ─── 10. End-of-draft — Desktop ────────────────────────────
function EndOfDraftDesktop() {
  const groups = poolByInk(DRAFT_END_POOL);
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="draft"/>

      <header style={{ padding: '48px 32px 32px',
                        background: `linear-gradient(180deg, var(--paper-2) 0%, var(--paper) 100%)`,
                        borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
                        display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ width: 28, height: 2, background: 'var(--accent)' }}/>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em',
                              textTransform: 'uppercase', color: 'var(--accent)' }}>
                Draft complete · WHRTNK
              </span>
            </div>
            <h1 className="serif" style={{ fontSize: 52, fontWeight: 500, letterSpacing: '-.025em',
                                              margin: '0 0 10px', lineHeight: 1, textWrap: 'balance' }}>
              Your draft pool
            </h1>
            <p style={{ fontSize: 16, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5, maxWidth: 580 }}>
              48 cards across 4 packs. Export now — we don't keep a copy.
            </p>
          </div>

          {/* Export row — the prominent moment */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="if-btn if-btn--accent" style={{ fontSize: 13, padding: '11px 18px' }}>
              <ExportIcon/> Download CSV
            </button>
            <button className="if-btn if-btn--primary" style={{ fontSize: 13, padding: '11px 18px' }}>
              <Share size={13}/> Share link
            </button>
            <button className="if-btn" style={{ fontSize: 13, padding: '11px 16px' }}>
              <ImageIcon/> Image
            </button>
          </div>
        </div>

        {/* Per-ink counts strip */}
        <div style={{ maxWidth: 1200, margin: '24px auto 0',
                        display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {groups.map(g => (
            <span key={g.ink} className="if-chip" style={{ fontSize: 12, padding: '6px 12px' }}>
              <InkDot ink={g.ink} size={9}/> {g.name} · <strong className="mono" style={{ marginLeft: 4 }}>{g.cards.length}</strong>
            </span>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 56px' }}>
        {groups.map(g => (
          <section key={g.ink} style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
              <InkDot ink={g.ink} size={14}/>
              <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.015em', margin: 0 }}>
                {g.name}
              </h2>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                {g.cards.length} cards
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
              {g.cards.map((c, i) => (
                <Card key={i} card={c} size="normal" frame="subtle" style={{ width: '100%' }}/>
              ))}
            </div>
          </section>
        ))}

        {/* Reminder strip */}
        <aside style={{
          marginTop: 24, padding: '18px 22px',
          background: 'var(--paper-2)', border: '1px solid var(--line)',
          borderRadius: 14, display: 'flex', gap: 14, alignItems: 'center',
          fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5,
        }}>
          <span style={{ fontSize: 18 }}>ⓘ</span>
          <span>
            <strong>Last call.</strong> Once you close this page, we forget the pool.
            Save what you need before you go.
          </span>
        </aside>
      </main>

      <Footer compact/>
    </div>
  );
}

function ExportIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v9 M5 7l3 3 3-3 M2 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="6" cy="7" r="1.2" fill="currentColor"/>
      <path d="m3 12 3-3 4 3 3-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

// ─── 10. End-of-draft — Mobile ─────────────────────────────
function EndOfDraftMobile() {
  const groups = poolByInk(DRAFT_END_POOL);
  return (
    <MobileFrame>
      <TopNavMobile title="Your pool"/>
      <div className="if-scroll" style={{
        position: 'absolute', top: 44, left: 0, right: 0, bottom: 92,
        overflow: 'auto', paddingBottom: 16,
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 18px 16px',
          background: `linear-gradient(180deg, var(--paper-2) 0%, transparent 100%)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
                          fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                          textTransform: 'uppercase', color: 'var(--accent)' }}>
            Draft complete · WHRTNK
          </div>
          <h1 className="serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-.02em',
                                            margin: '0 0 6px', lineHeight: 1.02 }}>
            48 cards
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.45 }}>
            Export below — we don't keep a copy.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            {groups.map(g => (
              <span key={g.ink} className="if-chip" style={{ fontSize: 11, padding: '4px 9px' }}>
                <InkDot ink={g.ink} size={7}/> {g.name} <strong className="mono" style={{ marginLeft: 3 }}>{g.cards.length}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Pool — grouped */}
        <div style={{ padding: '4px 18px 20px' }}>
          {groups.map(g => (
            <section key={g.ink} style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <InkDot ink={g.ink} size={10}/>
                <h3 className="serif" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.01em', margin: 0 }}>
                  {g.name}
                </h3>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                  · {g.cards.length}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {g.cards.map((c, i) => (
                  <Card key={i} card={c} size="thumb" frame="subtle" style={{ width: '100%' }}/>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      {/* Sticky export */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px 30px',
        background: 'color-mix(in oklab, var(--paper) 94%, transparent)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--line)',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="if-btn if-btn--accent" style={{ flex: 1, justifyContent: 'center',
                                                                padding: '11px 10px', fontSize: 12.5 }}>
            <ExportIcon/> CSV
          </button>
          <button className="if-btn if-btn--primary" style={{ flex: 1, justifyContent: 'center',
                                                                padding: '11px 10px', fontSize: 12.5 }}>
            <Share size={12}/> Link
          </button>
          <button className="if-btn" style={{ flex: 1, justifyContent: 'center',
                                                padding: '11px 10px', fontSize: 12.5 }}>
            <ImageIcon/> Image
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}

// ─── 11. Reconnect — Mobile ────────────────────────────────
function ReconnectMobile() {
  return (
    <MobileFrame>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', placeItems: 'center',
        background: 'var(--paper)',
      }}>
        <div style={{
          textAlign: 'center', padding: 30,
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 18, maxWidth: 280, boxShadow: 'var(--shadow-2)',
        }}>
          <div style={{ display: 'grid', placeItems: 'center', margin: '4px auto 18px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 999,
              background: 'var(--ink-amber-soft)',
              display: 'grid', placeItems: 'center',
              animation: 'inkfolk-flash 1.8s ease-in-out infinite',
              boxShadow: '0 0 0 0 rgba(244,176,66,.55)',
            }}>
              <Spinner size={24}/>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
                          textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>
            Connection lost
          </div>
          <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.015em',
                                            margin: '0 0 8px', lineHeight: 1.1 }}>
            Reconnecting…
          </h2>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: '0 0 18px', lineHeight: 1.5 }}>
            We'll pick up where you left off. Your spot in room <strong className="mono">WHRTNK</strong> is held.
          </p>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
            Pack 2 · pick 5 of 12 · Cleo
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

// ─── 12. Error states board — Desktop ──────────────────────
// Storyboards four edge-state screens on one artboard so they read together.
function ErrorStateCard({ icon, title, body, action, tone = 'neutral' }) {
  const accent = tone === 'warn' ? 'var(--ink-amber)' : tone === 'err' ? 'var(--ink-ruby)' : 'var(--ink-3)';
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: 16, padding: 28, textAlign: 'center',
      boxShadow: 'var(--shadow-1)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minHeight: 280,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 999,
        background: 'var(--paper-2)',
        display: 'grid', placeItems: 'center', color: accent,
        marginBottom: 8,
      }}>
        {icon}
      </div>
      <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.015em',
                                        margin: 0, lineHeight: 1.15 }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: '6px 0 16px',
                    lineHeight: 1.5, maxWidth: 260 }}>
        {body}
      </p>
      <div style={{ marginTop: 'auto' }}>
        {action}
      </div>
    </div>
  );
}

function ErrorStatesDesktop() {
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="draft"/>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px 56px' }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em',
                          textTransform: 'uppercase', color: 'var(--accent)' }}>
            States · storyboard
          </div>
          <h1 className="serif" style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-.02em',
                                            margin: '6px 0 4px', lineHeight: 1.05 }}>
            Empty, locked, lost, abandoned
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0 }}>
            Every place the flow can stall, with the response we'd show.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
          <ErrorStateCard
            tone="neutral"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 11.5 12 4l9 7.5 M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            title="Waiting for the host"
            body="The room has filled up. The host hasn't started the draft yet — sit tight."
            action={
              <span style={{ fontSize: 12, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Spinner size={14}/> Listening for start signal…
              </span>
            }
          />
          <ErrorStateCard
            tone="warn"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8"/></svg>}
            title="Room is locked"
            body="The host has closed the door — no new players can join."
            action={
              <button className="if-btn" style={{ fontSize: 13, padding: '8px 14px' }}>
                Back to draft home
              </button>
            }
          />
          <ErrorStateCard
            tone="err"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M8 12h8 M12 8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
            title="Room not found"
            body="That code didn't match an open room. Double-check the letters with your host — codes are case-insensitive."
            action={
              <button className="if-btn if-btn--accent" style={{ fontSize: 13, padding: '8px 14px' }}>
                Try another code
              </button>
            }
          />
          <ErrorStateCard
            tone="neutral"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 7h18 M5 7v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7 M9 4h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
            title="Draft abandoned"
            body="Everyone else left this room. We've saved your partial pool for export."
            action={
              <button className="if-btn if-btn--accent" style={{ fontSize: 13, padding: '8px 14px' }}>
                Export what I have →
              </button>
            }
          />
        </div>

        <aside style={{
          marginTop: 28, padding: '16px 20px',
          background: 'var(--paper-2)', border: '1px solid var(--line)',
          borderRadius: 14, display: 'flex', gap: 14, alignItems: 'center',
          fontSize: 13, color: 'var(--ink-2)',
        }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <span>
            <strong>Wrong / full / locked / missing</strong> all share the same "Room
            not found" response — so no one can enumerate codes to find live rooms.
          </span>
        </aside>
      </main>
      <Footer compact/>
    </div>
  );
}

Object.assign(window, {
  DraftLandingDesktop, DraftLandingMobile,
  CreateRoomDesktop, CreateRoomMobile,
  LobbyDesktop, LobbyMobile,
  CountdownDesktop, CountdownMobile,
  EndOfDraftDesktop, EndOfDraftMobile,
  ReconnectMobile, ErrorStatesDesktop,
  Stepper, Segmented, Toggle, Spinner,
  poolByInk,
});
