// Inkfolk — Draft simulator: active draft + overlays
// The ⭐ screen plus card preview, roster overlay, pick toasts / pack rotation.

// ─── Active draft — Desktop ────────────────────────────────
// 1280×800 app-like: top bar, two-column body (pack grid + side panel).
// `selectedPick` is the index of the currently-marked card (0–11) or null.
function ActiveDraftDesktopContent({ pickTimer = 47, selectedPick = 2, sortBy = 'cost' }) {
  const pack = DRAFT_PACK;
  const pool = DRAFT_POOL;
  const selectedCard = selectedPick != null ? pack[selectedPick] : null;
  return (
    <div className="if-screen" style={{ width: '100%', height: '100%',
                                          display: 'grid', gridTemplateRows: '60px 1fr',
                                          overflow: 'hidden' }}>
      {/* Top bar */}
      <header style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '0 22px', borderBottom: '1px solid var(--line)',
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Wordmark size={16}/>
          <span style={{ width: 1, height: 18, background: 'var(--line)' }}/>
          <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)',
                                            letterSpacing: '.04em' }}>
            ROOM <strong style={{ color: 'var(--ink)', marginLeft: 6 }}>WHRTNK</strong>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            Pack <strong style={{ color: 'var(--ink)' }}>1</strong> of 4
            <span style={{ color: 'var(--ink-3)' }}>  ·  </span>
            pick <strong style={{ color: 'var(--ink)' }}>3</strong> of 12
          </div>
          {/* Progress bar */}
          <div style={{
            width: 100, height: 4, borderRadius: 999, overflow: 'hidden',
            background: 'var(--paper-2)',
          }}>
            <div style={{
              width: `${(2/12)*100}%`, height: '100%',
              background: 'var(--accent)',
            }}/>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PickTimer seconds={pickTimer}/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
          {/* Roster pill — 4 avatars stacked */}
          <button className="if-btn" style={{ padding: '5px 10px 5px 5px', fontSize: 12 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center',
                            marginRight: 4 }}>
              {DRAFT_PLAYERS.map((p, i) => (
                <div key={p.id} style={{
                  marginLeft: i === 0 ? 0 : -8, position: 'relative', zIndex: DRAFT_PLAYERS.length - i,
                }}>
                  <PlayerAvatar player={{ ...p, picking: false }} size={22}/>
                </div>
              ))}
            </div>
            Roster <span className="mono" style={{ color: 'var(--ink-3)', marginLeft: 2 }}>(4)</span>
          </button>
          <button className="if-btn" style={{ padding: '6px 8px' }} title="Keyboard shortcuts">
            <KbIcon/>
          </button>
          <button className="if-btn" style={{ padding: '6px 8px' }}>
            <Menu size={14}/>
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px',
                      overflow: 'hidden' }}>
        {/* Pack grid */}
        <div className="if-scroll" style={{ overflow: 'auto', padding: '22px 24px 24px',
                                              background: 'var(--paper)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                          marginBottom: 14 }}>
            <h2 className="serif" style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-.01em', margin: 0 }}>
              Pack 1 — tap a card to select
            </h2>
            <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
              <span className="mono">1–9</span> select  ·  <span className="mono">↵</span> confirm
              ·  <span className="mono">r</span> roster
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {pack.slice(0, 9).map((c, i) => (
              <PackCell key={i} card={c} n={i + 1} frame="subtle"
                          selected={selectedPick === i}
                          dimmed={selectedPick != null && selectedPick !== i}/>
            ))}
            {pack.slice(9, 12).map((c, i) => (
              <PackCell key={i + 9} card={c} n={i + 10} frame="subtle"
                          selected={selectedPick === i + 9}
                          dimmed={selectedPick != null && selectedPick !== i + 9}/>
            ))}
          </div>
        </div>

        {/* Side panel — picks + roster */}
        <aside style={{
          background: 'var(--surface)', borderLeft: '1px solid var(--line)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Section: roster compact */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
                            textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>
              Roster · pack flows →
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              {DRAFT_PLAYERS.map((p, i) => (
                <React.Fragment key={p.id}>
                  <div title={p.name}>
                    <PlayerAvatar player={p} size={32}/>
                  </div>
                  {i < DRAFT_PLAYERS.length - 1 && (
                    <Chevron dir="right" size={10} style={{ color: 'var(--ink-4)' }}/>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--ink-3)' }}>
              <strong style={{ color: 'var(--ink-2)' }}>Margot</strong> is picking from your pack
            </div>
          </div>

          {/* Section: my picks */}
          <div style={{ padding: '14px 18px 6px',
                          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div className="serif" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.01em' }}>
              My picks <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>({pool.length})</span>
            </div>
            <SortSelect value={sortBy}/>
          </div>
          <div className="if-scroll" style={{ flex: 1, overflow: 'auto',
                                                padding: '4px 14px 14px' }}>
            {poolGrouped(pool, sortBy).map(g => (
              <PoolGroup key={g.key} group={g} sortBy={sortBy}/>
            ))}
          </div>

          {/* Confirm pick footer — sticky in the side panel */}
          <ConfirmPickBar card={selectedCard} desktop/>
        </aside>
      </div>
    </div>
  );
}

function ActiveDraftDesktopLight(props) {
  return <ThemeWrap mode="light"><ActiveDraftDesktopContent {...props}/></ThemeWrap>;
}
function ActiveDraftDesktopDark(props) {
  return <ThemeWrap mode="dark"><ActiveDraftDesktopContent {...props}/></ThemeWrap>;
}

function KbIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M6 10h.5M9 10h.5M12 10h.5M15 10h.5M18 10h.5M7 14h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Active draft — Mobile A: Drawer-up ────────────────────
function ActiveDraftMobileDrawerContent({ pickTimer = 47, selectedPick = 2 }) {
  const pack = DRAFT_PACK;
  const pool = DRAFT_POOL;
  const selectedCard = selectedPick != null ? pack[selectedPick] : null;
  return (
    <div className="if-mobile-frame if-screen" style={{ background: 'var(--paper)' }}>
      {/* Status bar */}
      <DraftStatusBar/>
      {/* Draft top bar */}
      <DraftMobileTopBar pickTimer={pickTimer}/>

      {/* Pack grid — scrolls under sticky drawer */}
      <div className="if-scroll" style={{
        position: 'absolute', top: 96, left: 0, right: 0, bottom: 156,
        overflow: 'auto', padding: '10px 14px 16px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 4px 8px',
        }}>
          <div className="serif" style={{ fontSize: 14, fontWeight: 600 }}>
            Pack 1 — tap to select
          </div>
          <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>Long-press to preview</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {pack.map((c, i) => (
            <PackCell key={i} card={c} n={i + 1} frame="subtle"
                        selected={selectedPick === i}
                        dimmed={selectedPick != null && selectedPick !== i}/>
          ))}
        </div>
      </div>

      {/* Bottom-sheet drawer — collapsed.
          Order: confirm bar (always visible), then drawer handle + peek row. */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface)',
        borderTop: '1px solid var(--line)',
        borderTopLeftRadius: 18, borderTopRightRadius: 18,
        boxShadow: '0 -8px 24px rgba(20,15,8,.06)',
        paddingBottom: 28,
      }}>
        {/* Confirm pick — sits on top so it's always thumb-reach */}
        <ConfirmPickBar card={selectedCard}/>

        {/* Drawer handle + my picks teaser */}
        <div style={{ display: 'grid', placeItems: 'center', padding: '6px 0 2px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--line-strong)' }}/>
        </div>
        <div style={{ padding: '2px 16px 6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="serif" style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '-.01em' }}>
            My picks <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>({pool.length})</span>
            <Chevron dir="up" size={10} style={{ marginLeft: 5, color: 'var(--ink-3)' }}/>
          </div>
          <SortSelect value="cost" compact/>
        </div>
      </div>

      {/* Home indicator */}
      <HomeIndicator/>
    </div>
  );
}

function ActiveDraftMobileDrawerLight(props) {
  return <ThemeWrap mode="light"><ActiveDraftMobileDrawerContent {...props}/></ThemeWrap>;
}
function ActiveDraftMobileDrawerDark(props) {
  return <ThemeWrap mode="dark"><ActiveDraftMobileDrawerContent {...props}/></ThemeWrap>;
}

// ─── Active draft — Mobile B: Side-by-side ─────────────────
// Picks panel is always visible at bottom, grouped by cost.
// Confirm bar sits between the pack grid and the picks list.
function ActiveDraftMobileSplitContent({ pickTimer = 47, selectedPick = 2, sortBy = 'cost' }) {
  const pack = DRAFT_PACK;
  const pool = DRAFT_POOL;
  const selectedCard = selectedPick != null ? pack[selectedPick] : null;
  return (
    <div className="if-mobile-frame if-screen" style={{ background: 'var(--paper)' }}>
      <DraftStatusBar/>
      <DraftMobileTopBar pickTimer={pickTimer}/>

      {/* Pack scroll area */}
      <div className="if-scroll" style={{
        position: 'absolute', top: 96, left: 0, right: 0, bottom: 250,
        overflow: 'auto', padding: '8px 14px 14px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {pack.map((c, i) => (
            <PackCell key={i} card={c} n={i + 1} frame="subtle"
                        selected={selectedPick === i}
                        dimmed={selectedPick != null && selectedPick !== i}/>
          ))}
        </div>
      </div>

      {/* Confirm strip — wedged between pack and picks */}
      <div style={{
        position: 'absolute', bottom: 196, left: 0, right: 0,
        background: 'var(--surface)',
        borderTop: '1px solid var(--line)',
      }}>
        <ConfirmPickBar card={selectedCard}/>
      </div>

      {/* Always-visible picks panel — bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 196,
        background: 'var(--surface)', borderTop: '1px solid var(--line)',
        paddingBottom: 28,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '8px 16px 4px',
                        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="serif" style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-.01em' }}>
            My picks <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>({pool.length})</span>
          </div>
          <SortSelect value={sortBy} compact/>
        </div>
        {/* Horizontal pile — grouped per current sort */}
        <div className="if-scroll" style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden',
                                              padding: '2px 14px 6px' }}>
          <div style={{ display: 'inline-flex', gap: 14, height: '100%', alignItems: 'flex-start' }}>
            {poolGrouped(pool, sortBy).map(g => (
              <div key={g.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4,
                                fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em',
                                color: 'var(--ink-3)', textTransform: 'uppercase',
                                padding: '0 2px' }}>
                  {sortBy === 'cost' && (
                    <span className="mono" style={{
                      display: 'inline-grid', placeItems: 'center',
                      minWidth: 14, height: 14, padding: '0 3px', borderRadius: 3,
                      background: 'var(--paper-2)', color: 'var(--ink)',
                      fontSize: 9, fontWeight: 700,
                    }}>{g.cost}</span>
                  )}
                  {sortBy === 'ink' && <InkDot ink={g.ink} size={6}/>}
                  {g.label} <span style={{ color: 'var(--ink-4)', fontWeight: 500 }}>{g.cards.length}</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {g.cards.map((c, i) => (
                    <div key={i} style={{ width: 48, flexShrink: 0 }}>
                      <Card card={c} size="thumb" frame="subtle" style={{ width: '100%' }}/>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <HomeIndicator/>
    </div>
  );
}

function ActiveDraftMobileSplitLight(props) {
  return <ThemeWrap mode="light"><ActiveDraftMobileSplitContent {...props}/></ThemeWrap>;
}
function ActiveDraftMobileSplitDark(props) {
  return <ThemeWrap mode="dark"><ActiveDraftMobileSplitContent {...props}/></ThemeWrap>;
}

// ─── Shared mobile draft chrome ────────────────────────────
function DraftStatusBar({ light = false }) {
  const fg = light ? '#fff' : '#1F1A12';
  return (
    <div style={{
      height: 44, padding: '0 22px 0 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      color: 'var(--ink)', fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
      position: 'relative', zIndex: 6,
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M3.5 7.5a6 6 0 0 1 9 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M.5 4.5a10 10 0 0 1 15 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor"/><rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor"/><rect x="23.5" y="4" width="2" height="4" rx="1" fill="currentColor"/></svg>
      </div>
    </div>
  );
}

function DraftMobileTopBar({ pickTimer = 47 }) {
  return (
    <header style={{
      position: 'relative', height: 52,
      borderBottom: '1px solid var(--line)',
      background: 'var(--surface)',
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center', padding: '0 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{
          width: 32, height: 32, border: 0, background: 'transparent',
          display: 'grid', placeItems: 'center', borderRadius: 999, color: 'var(--ink-2)',
        }} aria-label="Menu">
          <Menu size={18}/>
        </button>
        <div>
          <div className="mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
                                            color: 'var(--ink-3)', textTransform: 'uppercase' }}>
            Pack 1/4
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-2)', marginTop: 1 }}>
            pick <strong style={{ color: 'var(--ink)' }}>3</strong>/12
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PickTimer seconds={pickTimer} compact/>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button className="if-btn" style={{ padding: '4px 8px 4px 4px', fontSize: 11 }}>
          <div style={{ display: 'inline-flex' }}>
            {DRAFT_PLAYERS.slice(0, 3).map((p, i) => (
              <div key={p.id} style={{ marginLeft: i === 0 ? 0 : -6 }}>
                <PlayerAvatar player={{ ...p, picking: false }} size={18}/>
              </div>
            ))}
          </div>
          <span className="mono">4</span>
        </button>
      </div>

      {/* Progress strip */}
      <div style={{
        position: 'absolute', bottom: -1, left: 0, right: 0, height: 2,
        background: 'var(--paper-2)',
      }}>
        <div style={{ width: `${(2/12)*100}%`, height: '100%', background: 'var(--accent)' }}/>
      </div>
    </header>
  );
}

function HomeIndicator({ dark = false }) {
  return (
    <div style={{
      position: 'absolute', bottom: 6, left: 0, right: 0,
      display: 'grid', placeItems: 'center', zIndex: 6, pointerEvents: 'none',
    }}>
      <div style={{ width: 134, height: 5, borderRadius: 999,
        background: dark ? 'rgba(255,255,255,.6)' : 'rgba(31,26,18,.4)' }}/>
    </div>
  );
}

// ─── Card preview overlay — Mobile ─────────────────────────
function CardPreviewMobile() {
  const card = CARDS[1]; // Pocahontas — has art
  return (
    <div className="if-mobile-frame if-screen" style={{ background: 'var(--paper)', position: 'relative' }}>
      {/* Faded pack-grid background */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        filter: 'blur(6px) brightness(.9)', opacity: .5,
      }}>
        <ActiveDraftMobileDrawerContent/>
      </div>
      {/* Scrim */}
      <div style={{ position: 'absolute', inset: 0,
                      background: 'rgba(15,10,5,.5)' }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex',
                      flexDirection: 'column', padding: '60px 24px 40px',
                      zIndex: 2 }}>
        {/* Close X */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: 12 }}>
          <span className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,.7)',
                                            fontWeight: 600, letterSpacing: '.1em' }}>
            #3 OF 12
          </span>
          <button style={{
            width: 36, height: 36, borderRadius: 999, border: 0,
            background: 'rgba(0,0,0,.5)', color: '#fff', display: 'grid', placeItems: 'center',
            cursor: 'pointer',
          }}>
            <Close size={18}/>
          </button>
        </div>

        {/* The card */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card card={card} size="large" frame="subtle"
                 style={{ width: 260, boxShadow: '0 30px 60px rgba(0,0,0,.5)' }}/>
        </div>

        {/* Hint */}
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.7)',
                        fontSize: 11.5, marginBottom: 16, letterSpacing: '.04em' }}>
          Pinch to zoom rules text
        </div>

        {/* Select button — marks selection then returns to grid for confirm */}
        <button className="if-btn if-btn--accent" style={{
          width: '100%', justifyContent: 'center', padding: '14px 16px', fontSize: 15,
          fontWeight: 600,
        }}>
          Select this card
        </button>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,.55)' }}>
            You'll confirm the pick on the next screen · tap outside to keep looking
          </span>
        </div>
      </div>
      <HomeIndicator dark/>
    </div>
  );
}

// ─── Card preview overlay — Desktop ────────────────────────
function CardPreviewDesktop() {
  const card = CARDS[1];
  return (
    <div className="if-screen" style={{ width: 1280, height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Faded background */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        filter: 'blur(6px) brightness(.9)', opacity: .55,
      }}>
        <ActiveDraftDesktopContent/>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,10,5,.55)' }}/>

      {/* Modal */}
      <div style={{
        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
        padding: 40, zIndex: 2,
      }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 22,
          padding: 32, display: 'grid', gridTemplateColumns: 'auto 320px', gap: 32,
          boxShadow: '0 30px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.1)',
          maxWidth: 800,
        }}>
          <Card card={card} size="large" frame="subtle"
                 style={{ width: 340, boxShadow: '0 8px 30px rgba(0,0,0,.18)' }}/>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: INK.amber.c }}/>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
                              textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                {INK.amber.name} · Character · Rare
              </span>
            </div>
            <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-.02em',
                                              margin: '4px 0 4px', lineHeight: 1.05 }}>
              {card.name}
            </h2>
            <div className="serif" style={{ fontSize: 16, color: 'var(--ink-3)',
                                              fontStyle: 'italic', marginBottom: 14 }}>
              {card.subtitle}
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 16, padding: '12px 0',
                            borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
                            marginBottom: 16, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#c47733' }}>
                <Strength size={14}/> {card.strength}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#c14b4b' }}>
                <Willpower size={14}/> {card.willpower}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink-amber)', marginLeft: 'auto' }}>
                <Lore size={14}/> {card.lore}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink-2)' }}>
                <InkDrop size={14}/> {card.cost}
              </div>
            </div>

            <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.55, margin: '0 0 10px' }}>
              <strong>Shift 4</strong> — You may pay 4 ⟨ink⟩ to play this on top of one of your characters named Pocahontas.
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--ink-3)', fontStyle: 'italic',
                          lineHeight: 1.5, margin: '0 0 18px' }}>
              "There's so much you don't know."
            </p>

            <div style={{ marginTop: 'auto' }}>
              <button className="if-btn if-btn--accent" style={{
                width: '100%', justifyContent: 'center', padding: '13px 18px', fontSize: 14, fontWeight: 600,
              }}>
                Select this card
              </button>
              <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--ink-3)', textAlign: 'center' }}>
                Selecting marks it — confirm the pick on the draft view
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-4)', textAlign: 'center' }}>
                <span className="mono">← →</span> browse cards · <span className="mono">Esc</span> to close
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Roster overlay — Mobile ───────────────────────────────
function RosterOverlayMobile() {
  return (
    <div className="if-mobile-frame if-screen" style={{ background: 'var(--paper)', position: 'relative' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0,
                                  filter: 'blur(5px) brightness(.9)', opacity: .5 }}>
        <ActiveDraftMobileDrawerContent/>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,10,5,.4)' }}/>

      {/* Sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface)',
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        boxShadow: '0 -10px 30px rgba(0,0,0,.2)',
        paddingBottom: 30,
      }}>
        <div style={{ display: 'grid', placeItems: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--line-strong)' }}/>
        </div>
        <div style={{ padding: '6px 20px 4px',
                        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h2 className="serif" style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.01em', margin: 0 }}>
            Roster
          </h2>
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
            Pack flow →
          </span>
        </div>

        <div style={{ padding: '8px 8px 16px' }}>
          {DRAFT_PLAYERS.map(p => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: 12,
              alignItems: 'center', padding: '10px 14px', borderRadius: 12,
              background: p.picking ? 'var(--accent-soft)' : 'transparent',
            }}>
              <PlayerAvatar player={p} size={40}/>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)',
                                display: 'flex', alignItems: 'center', gap: 6 }}>
                  {p.name}
                  {p.you && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em',
                                              padding: '1px 5px', borderRadius: 4,
                                              background: 'var(--accent)', color: 'var(--accent-ink)' }}>YOU</span>}
                  {p.host && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em',
                                              padding: '1px 5px', borderRadius: 4,
                                              background: 'var(--ink)', color: 'var(--paper)' }}>HOST</span>}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>
                  {p.picking ? 'Picking now…'
                    : p.status === 'reconnecting' ? 'reconnecting…'
                    : 'Waiting'}
                </div>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textAlign: 'right' }}>
                <div className="mono" style={{ fontWeight: 700, color: 'var(--ink-2)' }}>
                  {p.id === 'cleo' ? '14' : p.id === 'jules' ? '13' : p.id === 'margot' ? '12' : '11'} picks
                </div>
                <div>so far</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '4px 20px 8px', fontSize: 11.5, color: 'var(--ink-3)',
                        borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          Long-press a player to kick (host only).
        </div>
      </div>
      <HomeIndicator/>
    </div>
  );
}

// ─── Toasts & pack rotation — desktop storyboard ───────────
function ToastsAndRotationDesktop() {
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="draft"/>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 32px 56px' }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em',
                          textTransform: 'uppercase', color: 'var(--accent)' }}>
            Motion · storyboard
          </div>
          <h1 className="serif" style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-.02em',
                                            margin: '6px 0 4px', lineHeight: 1.05 }}>
            Pack rotation & pick toasts
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5, maxWidth: 720 }}>
            How a pick lands, the pack slides to the next player (~400ms), and the
            new pack arrives. Two toast styles: a normal pick, and the timed-out auto-pick.
          </p>
        </div>

        {/* Four-frame storyboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { t: 'T = 0ms', caption: 'You pick a card. Your selection scales up briefly and dims the other 11.' },
            { t: 'T = 120ms', caption: 'Toast in: "Cleo picked" lower-left. Pack starts to slide out left.' },
            { t: 'T = 300ms', caption: 'Outgoing pack at 60% offscreen left. Incoming pack from right at 40%.' },
            { t: 'T = 440ms', caption: 'New pack settles. Pick counter ticks to 4/12. Timer resets to 0:60.' },
          ].map((f, i) => (
            <StoryboardFrame key={i} idx={i} {...f}/>
          ))}
        </div>

        {/* Toast variants */}
        <section style={{ marginTop: 40 }}>
          <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.015em', margin: '0 0 14px' }}>
            Toast variants
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <ToastDemo
              kind="pick"
              who={DRAFT_PLAYERS[2]}
              label="Margot picked"
              detail="Pack 1 · pick 3"
            />
            <ToastDemo
              kind="timeout"
              who={DRAFT_PLAYERS[3]}
              label="Théo timed out"
              detail="First card taken automatically"
            />
            <ToastDemo
              kind="join"
              who={{ name: 'Sam', status: 'connected' }}
              label="Sam reconnected"
              detail="Resumed at pack 2 · pick 5"
            />
          </div>
        </section>
      </main>
      <Footer compact/>
    </div>
  );
}

function StoryboardFrame({ idx, t, caption }) {
  const pack = makeDraftPack(idx);
  const selectedIdx = idx === 0 ? 2 : -1;
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: 14, padding: 14, overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10,
      }}>
        <span className="mono" style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '.08em',
          color: 'var(--ink-3)', textTransform: 'uppercase',
        }}>{t}</span>
        <span style={{ fontSize: 10, color: 'var(--ink-4)' }}>Frame {idx + 1}/4</span>
      </div>
      {/* mini "viewport" */}
      <div style={{
        position: 'relative', height: 200,
        background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)',
        overflow: 'hidden',
      }}>
        {/* The pack — small grid, positioned per frame */}
        <div style={{
          position: 'absolute',
          top: 12, left: 12, right: 12,
          transform: idx === 1 ? 'translateX(-5%)'
                    : idx === 2 ? 'translateX(-60%)'
                    : idx === 3 ? 'translateX(0)'
                    : 'translateX(0)',
          transition: 'transform .4s',
          opacity: idx === 2 ? .85 : 1,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
        }}>
          {pack.slice(0, 6).map((c, i) => (
            <div key={i} style={{
              opacity: idx === 0 && i !== selectedIdx ? .35 : 1,
              transform: idx === 0 && i === selectedIdx ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform .15s, opacity .15s',
            }}>
              <Card card={c} size="thumb" frame="subtle" style={{ width: '100%' }}/>
            </div>
          ))}
        </div>
        {/* Incoming pack from right */}
        {idx === 2 && (
          <div style={{
            position: 'absolute', top: 12, left: '60%', right: -100,
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
            opacity: .85,
          }}>
            {makeDraftPack(2).slice(0, 6).map((c, i) => (
              <Card key={i} card={c} size="thumb" frame="subtle" style={{ width: '100%' }}/>
            ))}
          </div>
        )}
        {/* Toast — visible from frame 1 */}
        {idx >= 1 && idx <= 2 && (
          <div style={{
            position: 'absolute', left: 8, bottom: 8,
            background: 'rgba(15,10,5,.92)', color: '#fff',
            borderRadius: 8, padding: '6px 9px',
            fontSize: 10, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 14, height: 14, borderRadius: 999, background: '#E8C6BD',
                            display: 'grid', placeItems: 'center', color: 'var(--ink)',
                            fontSize: 9, fontWeight: 700 }}>C</span>
            Cleo picked
          </div>
        )}
      </div>
      <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.45 }}>
        {caption}
      </p>
    </div>
  );
}

function ToastDemo({ kind, who, label, detail }) {
  const accent = kind === 'timeout' ? 'var(--ink-ruby)' : 'var(--ink-emerald)';
  return (
    <div style={{
      background: 'var(--paper-2)', border: '1px solid var(--line)',
      borderRadius: 14, padding: '24px 16px 16px',
      display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start',
    }}>
      <div style={{
        background: 'rgba(15,10,5,.92)', color: '#fff', borderRadius: 12,
        padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 6px 18px rgba(0,0,0,.25)',
      }}>
        <PlayerAvatar player={who} size={26}/>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-.005em' }}>
            {label}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', marginTop: 1 }}>
            {detail}
          </div>
        </div>
        <div style={{
          width: 6, height: 6, borderRadius: 999, background: accent,
          marginLeft: 4,
        }}/>
      </div>
      <div>
        <div className="mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em',
                                          textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          {kind}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 4, lineHeight: 1.5 }}>
          {kind === 'pick' && 'Shown when any player picks. Auto-dismisses after 2s.'}
          {kind === 'timeout' && 'The pick timer hit 0:00. Red dot signals it was automatic, not chosen.'}
          {kind === 'join' && 'A previously-disconnected player came back online.'}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ActiveDraftDesktopLight, ActiveDraftDesktopDark,
  ActiveDraftMobileDrawerLight, ActiveDraftMobileDrawerDark,
  ActiveDraftMobileSplitLight, ActiveDraftMobileSplitDark,
  CardPreviewMobile, CardPreviewDesktop,
  RosterOverlayMobile,
  ToastsAndRotationDesktop,
});
