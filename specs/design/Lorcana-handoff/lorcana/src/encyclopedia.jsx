// Inkfolk — Encyclopedia (card search) + Card detail
// Desktop and mobile variants.

// ─── Shared facet/checkbox primitives ──────────────────────
function FacetGroup({ title, children, count, open = true, onToggle }) {
  return (
    <div style={{ borderTop: '1px solid var(--line)', padding: '14px 0' }}>
      <button onClick={onToggle} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.06em',
                       textTransform: 'uppercase', color: 'var(--ink-2)' }}>
          {title} {count != null && <span style={{ color: 'var(--ink-4)', fontWeight: 500, marginLeft: 4 }}>({count})</span>}
        </span>
        <ChevD size={14} style={{ color: 'var(--ink-3)', transform: open ? '' : 'rotate(-90deg)' }}/>
      </button>
      {open && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  );
}

function FacetCheck({ label, count, ink, checked, swatch, onChange }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', cursor: 'pointer',
      fontSize: 13, color: checked ? 'var(--ink)' : 'var(--ink-2)',
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: 4,
        border: '1.5px solid ' + (checked ? 'var(--accent)' : 'var(--line-strong)'),
        background: checked ? 'var(--accent)' : 'var(--surface)',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        {checked && <svg viewBox="0 0 16 16" width="10" height="10"><path d="m3 8 3.5 3.5L13 5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
      </span>
      {swatch && <span style={{ width: 10, height: 10, borderRadius: 999, background: swatch }}/>}
      <span style={{ flex: 1 }}>{label}</span>
      {count != null && (
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{count}</span>
      )}
    </label>
  );
}

// ─── Encyclopedia — Desktop ────────────────────────────────
function EncyclopediaDesktop({ frame = 'subtle' }) {
  const [view, setView] = React.useState('grid');
  const [selectedInks, setSelectedInks] = React.useState(new Set(['ruby', 'amber']));
  const [costRange, setCostRange] = React.useState([0, 10]);

  const toggleInk = (k) => {
    const n = new Set(selectedInks);
    if (n.has(k)) n.delete(k); else n.add(k);
    setSelectedInks(n);
  };

  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="cards"/>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0,
                    maxWidth: 1280, minHeight: 'calc(100% - 64px)' }}>
        {/* Sidebar facets */}
        <aside style={{
          padding: '24px 22px 32px', borderRight: '1px solid var(--line)',
          background: 'var(--paper)',
          position: 'sticky', top: 64, alignSelf: 'start', height: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <h3 className="serif" style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Filters</h3>
            <button style={{ fontSize: 12, color: 'var(--ink-3)', background: 'none', border: 0, cursor: 'pointer' }}>
              Reset
            </button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>1,428 cards · {selectedInks.size > 0 ? `${selectedInks.size} ink filter${selectedInks.size > 1 ? 's' : ''}` : 'no filters'}</div>

          <FacetGroup title="Ink" count={6}>
            {Object.entries(INK).map(([k, v]) => (
              <FacetCheck key={k} label={v.name} count={[214, 198, 224, 207, 232, 219]['amber amethyst emerald ruby sapphire steel'.split(' ').indexOf(k)]}
                          swatch={v.c}
                          checked={selectedInks.has(k)}
                          onChange={() => toggleInk(k)}/>
            ))}
          </FacetGroup>

          <FacetGroup title="Type">
            {[['Character', 712], ['Action', 312], ['Item', 196], ['Location', 88], ['Song', 120]].map(([t, n]) => (
              <FacetCheck key={t} label={t} count={n}/>
            ))}
          </FacetGroup>

          <FacetGroup title="Rarity">
            {[['Common', 480, 'common'], ['Uncommon', 360, 'uncommon'], ['Rare', 312, 'rare'],
              ['Super Rare', 168, 'super'], ['Legendary', 84, 'legendary'], ['Enchanted', 24, 'enchanted']].map(([l, n, k]) => (
              <FacetCheck key={l} label={l} count={n} swatch={k === 'enchanted' ? null : `var(--rarity-${k})`} checked={l === 'Rare' || l === 'Legendary'}/>
            ))}
          </FacetGroup>

          <FacetGroup title="Cost" count={`${costRange[0]}–${costRange[1]}`}>
            <div style={{ padding: '6px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>
                <span>{costRange[0]}</span><span>{costRange[1]}</span>
              </div>
              <div style={{ position: 'relative', height: 4, background: 'var(--line)', borderRadius: 999 }}>
                <div style={{ position: 'absolute', left: `${costRange[0] * 10}%`, right: `${100 - costRange[1] * 10}%`,
                              top: 0, bottom: 0, background: 'var(--accent)', borderRadius: 999 }}/>
                <div style={{ position: 'absolute', left: `${costRange[0] * 10}%`, top: -6, width: 16, height: 16,
                              borderRadius: 999, background: 'var(--surface)', border: '2px solid var(--accent)',
                              transform: 'translateX(-50%)' }}/>
                <div style={{ position: 'absolute', left: `${costRange[1] * 10}%`, top: -6, width: 16, height: 16,
                              borderRadius: 999, background: 'var(--surface)', border: '2px solid var(--accent)',
                              transform: 'translateX(-50%)' }}/>
              </div>
              <div className="mono" style={{ display: 'flex', gap: 2, marginTop: 14 }}>
                {Array.from({length: 11}).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 24, borderRadius: 3,
                    background: i >= costRange[0] && i <= costRange[1] ? 'var(--accent-soft)' : 'var(--paper-2)',
                    color: 'var(--ink-2)',
                    fontSize: 11, display: 'grid', placeItems: 'center', fontWeight: 600 }}>
                    {i}{i === 10 ? '+' : ''}
                  </div>
                ))}
              </div>
            </div>
          </FacetGroup>

          <FacetGroup title="Keywords">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {['Bodyguard','Challenger +2','Evasive','Rush','Singer','Shift','Reckless','Support','Ward','Voiceless'].map((k, i) => (
                <span key={k} className="if-chip" style={{
                  fontSize: 11, padding: '4px 8px',
                  background: i < 2 ? 'var(--accent-soft)' : 'var(--surface)',
                  borderColor: i < 2 ? 'transparent' : 'var(--line)',
                  color: i < 2 ? 'var(--accent-ink)' : 'var(--ink-2)',
                  cursor: 'pointer',
                }}>{k}</span>
              ))}
            </div>
          </FacetGroup>

          <FacetGroup title="Set">
            {SETS.slice(0, 5).map(s => (
              <FacetCheck key={s.code} label={`${s.name}`} count={s.cards}/>
            ))}
          </FacetGroup>

          <FacetGroup title="Classifications">
            {[['Hero', 380], ['Villain', 196], ['Princess', 72], ['Floodborn', 84], ['Ally', 124], ['Sorcerer', 96]].map(([c, n]) => (
              <FacetCheck key={c} label={c} count={n}/>
            ))}
          </FacetGroup>
        </aside>

        {/* Results */}
        <main style={{ padding: '24px 32px 56px' }}>
          {/* Header strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h1 className="serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-.02em', margin: 0 }}>
                Cards
              </h1>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
                Showing <strong style={{ color: 'var(--ink-2)' }}>421</strong> of 1,428 results
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select style={{
                font: '13px var(--font-ui)', padding: '8px 28px 8px 12px',
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 8, color: 'var(--ink)', appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'><path d=\'m4 6 4 4 4-4\' fill=\'none\' stroke=\'%237b7160\' stroke-width=\'1.6\'/></svg>")',
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
              }}>
                <option>Sort: Name (A–Z)</option>
                <option>Cost (low → high)</option>
                <option>Lore (high → low)</option>
                <option>Strength · Willpower</option>
                <option>Release date (new)</option>
              </select>
              <div style={{
                display: 'inline-flex', background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 8, padding: 2,
              }}>
                <button onClick={() => setView('grid')} style={{
                  background: view === 'grid' ? 'var(--paper-2)' : 'transparent',
                  border: 0, padding: '6px 8px', borderRadius: 6, cursor: 'pointer',
                  color: view === 'grid' ? 'var(--ink)' : 'var(--ink-3)',
                }}><Grid size={14}/></button>
                <button onClick={() => setView('list')} style={{
                  background: view === 'list' ? 'var(--paper-2)' : 'transparent',
                  border: 0, padding: '6px 8px', borderRadius: 6, cursor: 'pointer',
                  color: view === 'list' ? 'var(--ink)' : 'var(--ink-3)',
                }}><List size={14}/></button>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
            {[...selectedInks].map(k => (
              <span key={k} className="if-chip" style={{
                background: 'var(--accent-soft)', borderColor: 'transparent', color: 'var(--accent-ink)',
                fontWeight: 600,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: INK[k].c }}/>
                Ink: {INK[k].name}
                <button onClick={() => toggleInk(k)} style={{ background: 'none', border: 0, padding: 0, marginLeft: 2, display: 'grid', placeItems: 'center', color: 'inherit', cursor: 'pointer' }}>
                  <Close size={12}/>
                </button>
              </span>
            ))}
            <span className="if-chip" style={{ background: 'var(--accent-soft)', borderColor: 'transparent', color: 'var(--accent-ink)', fontWeight: 600 }}>
              Rarity: Rare, Legendary
              <Close size={12}/>
            </span>
            <span className="if-chip" style={{ background: 'var(--accent-soft)', borderColor: 'transparent', color: 'var(--accent-ink)', fontWeight: 600 }}>
              Set: First Chapter
              <Close size={12}/>
            </span>
          </div>

          {/* Grid */}
          {view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
              {CARDS.slice(0, 20).map(c => (
                <Card key={c.id} card={c} size="normal" frame={frame} style={{ width: '100%' }}/>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
              {CARDS.slice(0, 14).map(c => <CardListRow key={c.id} card={c}/>)}
            </div>
          )}

          {/* Pagination */}
          <nav aria-label="Pagination" style={{
            marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
              Page <strong style={{ color: 'var(--ink-2)' }}>1</strong> of <strong style={{ color: 'var(--ink-2)' }}>22</strong>
              <span style={{ margin: '0 8px', color: 'var(--line-strong)' }}>·</span>
              <span>Showing <strong style={{ color: 'var(--ink-2)' }}>1–66</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button className="if-btn" disabled style={{
                width: 36, height: 36, padding: 0, display: 'grid', placeItems: 'center',
                opacity: .4, cursor: 'not-allowed',
              }} aria-label="Previous page">‹</button>
              {[
                { n: 1, current: true },
                { n: 2 },
                { n: 3 },
                { n: 4 },
                { gap: true },
                { n: 22 },
              ].map((p, i) => p.gap ? (
                <span key={`g-${i}`} style={{ padding: '0 4px', color: 'var(--ink-3)', fontSize: 13 }}>…</span>
              ) : (
                <button key={p.n} aria-current={p.current ? 'page' : undefined} style={{
                  minWidth: 36, height: 36, padding: '0 10px',
                  border: '1px solid ' + (p.current ? 'var(--ink)' : 'transparent'),
                  background: p.current ? 'var(--ink)' : 'transparent',
                  color: p.current ? 'var(--paper)' : 'var(--ink-2)',
                  borderRadius: 8, fontFamily: 'var(--font-ui)', fontSize: 13,
                  fontWeight: p.current ? 600 : 500, cursor: 'pointer',
                }}>{p.n}</button>
              ))}
              <button className="if-btn" style={{
                height: 36, padding: '0 14px', gap: 6,
                fontSize: 13, fontWeight: 500,
              }} aria-label="Next page">
                Next <span aria-hidden style={{ fontSize: 15, marginTop: -1 }}>›</span>
              </button>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                             fontSize: 12.5, color: 'var(--ink-3)' }}>
              Per page
              <select defaultValue="66" style={{
                font: '12.5px var(--font-ui)', padding: '6px 8px',
                border: '1px solid var(--line-strong)', borderRadius: 8,
                background: 'var(--surface)', color: 'var(--ink)',
              }}>
                <option>33</option>
                <option>66</option>
                <option>132</option>
              </select>
            </label>
          </nav>
        </main>
      </div>
      <Footer compact/>
    </div>
  );
}

// ─── Encyclopedia — Mobile ─────────────────────────────────
function EncyclopediaMobile({ frame = 'subtle' }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <MobileFrame>
      <TopNavMobile title="Cards" action={
        <button style={{ width: 40, height: 40, border: 0, background: 'transparent',
                          display: 'grid', placeItems: 'center', borderRadius: 999, color: 'var(--ink)' }}>
          <Filter size={18}/>
        </button>
      }/>
      <div className="if-scroll" style={{ height: 'calc(100% - 52px - 44px)', overflow: 'auto', paddingBottom: 80 }}>
        {/* Search */}
        <div style={{ padding: '12px 14px 10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--surface)', border: '1px solid var(--line-strong)',
            borderRadius: 10, padding: '10px 12px' }}>
            <Search size={16} style={{ color: 'var(--ink-3)' }}/>
            <input placeholder="Search cards…" style={{ border: 0, outline: 0, background: 'transparent', flex: 1,
              font: '14px var(--font-ui)' }} defaultValue=""/>
          </label>
        </div>

        {/* Quick-filter row — sticky */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 2,
          background: 'color-mix(in oklab, var(--paper) 90%, transparent)',
          backdropFilter: 'blur(8px)',
          padding: '6px 14px 10px',
          borderBottom: '1px solid var(--line)',
        }}>
          <div className="if-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
            <button onClick={() => setDrawerOpen(true)} className="if-chip" style={{
              background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)', fontWeight: 600,
              flexShrink: 0,
            }}>
              <Filter size={12}/> Filters · 4
            </button>
            {[
              { l: 'Ink: Ruby, Amber', a: true },
              { l: 'Rare + Legendary', a: true },
              { l: 'Cost ≤ 7', a: true },
              { l: 'Type', a: false },
              { l: 'Set', a: false },
              { l: 'Keyword', a: false },
            ].map((c, i) => (
              <span key={i} className="if-chip" style={{
                flexShrink: 0,
                ...(c.a ? { background: 'var(--accent-soft)', borderColor: 'transparent', color: 'var(--accent-ink)', fontWeight: 600 } : {}),
              }}>
                {c.l}
                {c.a && <Close size={11}/>}
              </span>
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            <strong style={{ color: 'var(--ink-2)' }}>421</strong> of 1,428
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Name A–Z</span>
            <ChevD size={12}/>
          </div>
        </div>

        {/* Grid 3-wide */}
        <div style={{ padding: '4px 14px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {CARDS.slice(0, 15).map(c => (
            <Card key={c.id} card={c} size="thumb" frame={frame} style={{ width: '100%' }}/>
          ))}
        </div>
      </div>

      {/* Filter drawer overlay */}
      {drawerOpen && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(15,10,5,.4)', zIndex: 7,
        }} onClick={() => setDrawerOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '85%',
            background: 'var(--paper)', borderTopLeftRadius: 20, borderTopRightRadius: 20,
            padding: '8px 18px 24px', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'grid', placeItems: 'center', padding: '6px 0' }}>
              <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--line-strong)' }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0 8px' }}>
              <h3 className="serif" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Filters</h3>
              <button style={{ background: 'none', border: 0, color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>Reset</button>
            </div>
            <div className="if-scroll" style={{ overflowY: 'auto', flex: 1 }}>
              <FacetGroup title="Ink">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                  {Object.entries(INK).map(([k, v]) => (
                    <FacetCheck key={k} label={v.name} count={210} swatch={v.c} checked={k === 'ruby' || k === 'amber'}/>
                  ))}
                </div>
              </FacetGroup>
              <FacetGroup title="Type">
                {[['Character', 712], ['Action', 312], ['Item', 196]].map(([t, n]) => (
                  <FacetCheck key={t} label={t} count={n}/>
                ))}
              </FacetGroup>
              <FacetGroup title="Cost" count="0–7">
                <div className="mono" style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                  {Array.from({length: 11}).map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 28, borderRadius: 4,
                      background: i <= 7 ? 'var(--accent-soft)' : 'var(--paper-2)',
                      color: 'var(--ink-2)', fontSize: 11, display: 'grid', placeItems: 'center', fontWeight: 600 }}>
                      {i}{i === 10 ? '+' : ''}
                    </div>
                  ))}
                </div>
              </FacetGroup>
            </div>
            <button className="if-btn if-btn--primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '14px 0' }}>
              Show 421 results
            </button>
          </div>
        </div>
      )}
      <MobileTabBar active="cards"/>
    </MobileFrame>
  );
}

// ─── Card detail — Desktop ──────────────────────────────────
function CardDetailDesktop({ frame = 'subtle' }) {
  const c = CARDS[0]; // Mickey legendary
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="cards"/>
      {/* Breadcrumb */}
      <div style={{ padding: '14px 32px 0', fontSize: 13, color: 'var(--ink-3)' }}>
        <a href="#" style={{ color: 'var(--ink-3)' }}>Cards</a> · <a href="#" style={{ color: 'var(--ink-3)' }}>The First Chapter</a> · <span style={{ color: 'var(--ink-2)' }}>Mickey Mouse — Brave Little Tailor</span>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 56px',
                     display: 'grid', gridTemplateColumns: '440px 1fr', gap: 48, alignItems: 'start' }}>
        {/* Large card */}
        <div style={{ position: 'sticky', top: 88 }}>
          <div style={{ filter: 'drop-shadow(0 16px 30px rgba(35,25,10,.18))' }}>
            <Card card={c} size="large" frame={frame} style={{ width: 440, height: 616 }}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
            <button className="if-btn"><Heart size={14}/> Save to deck</button>
            <button className="if-btn">↻ Reverse</button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 14, lineHeight: 1.6 }}>
            <div>Illustrator: Matthew Oxley</div>
            <div>Collector № 1 / 204 · The First Chapter</div>
            <div>Released: 18 August 2023</div>
            <div>Languages: EN · FR · DE · IT · JP</div>
          </div>
        </div>

        {/* Info column */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--rarity-legendary)',
                            textTransform: 'uppercase', letterSpacing: '.1em' }}>Legendary</span>
            <span style={{ color: 'var(--ink-4)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)',
                            textTransform: 'uppercase', letterSpacing: '.08em' }}>The First Chapter</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 6, letterSpacing: '.02em' }}>
            Brave Little Tailor
          </div>
          <h1 className="serif" style={{ fontSize: 52, fontWeight: 500, letterSpacing: '-.025em',
                                          margin: 0, lineHeight: 1, color: 'var(--ink)' }}>
            Mickey Mouse
          </h1>

          {/* Type / classification line */}
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12,
                        flexWrap: 'wrap', fontSize: 14, color: 'var(--ink-2)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <TypeCharacter size={16}/> Character
            </span>
            <span style={{ color: 'var(--ink-4)' }}>—</span>
            <span style={{ fontWeight: 500 }}>Hero · Knight</span>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
            marginTop: 20,
            background: 'var(--line)', border: '1px solid var(--line)',
            borderRadius: 14, overflow: 'hidden',
          }}>
            {[
              { i: <CostGem size={20} style={{ color: INK.ruby.c }}/>,  l: 'Cost',      v: '8',  s: 'ink' },
              { i: <Strength size={18}/>,    l: 'Strength',  v: '5' },
              { i: <Willpower size={18}/>,   l: 'Willpower', v: '5' },
              { i: <Lore size={18} style={{ color: 'var(--accent)' }}/>, l: 'Lore', v: '3' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--surface)', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-3)', fontSize: 12,
                              fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 6 }}>
                  <span style={{ color: i === 0 ? INK.ruby.c : i === 3 ? 'var(--accent)' : 'var(--ink-3)' }}>{s.i}</span>
                  {s.l}
                </div>
                <div className="serif" style={{ fontSize: 36, fontWeight: 500, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-.02em' }}>
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          {/* Rules text */}
          <section style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)',
                          letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Abilities
            </h2>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 12, padding: '18px 20px', fontSize: 15, lineHeight: 1.55, color: 'var(--ink)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                <span style={{
                  fontWeight: 700, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase',
                  padding: '3px 7px', borderRadius: 4, background: 'var(--ink-amber-soft)', color: 'var(--accent-ink)',
                }}>Evasive</span>
                <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>Only characters with Evasive can challenge this character.</span>
              </div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12, marginTop: 12 }}>
                <p style={{ margin: 0 }}>
                  <strong>And Two for Tea! —</strong> When you play this character, you may remove up to 2 damage from each of your <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2 }}><span style={{ width: 9, height: 9, borderRadius: 999, background: INK.amber.c, display: 'inline-block' }}/>Amber</span> characters.
                </p>
              </div>
            </div>
          </section>

          {/* Flavor text */}
          <p className="serif" style={{
            fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: 'var(--ink-3)',
            margin: '18px 0 0', padding: '0 4px',
          }}>
            "Forward march! And don't spare the rolling pin!"
          </p>

          {/* Where to buy */}
          <section style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)',
                          letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Where to buy
            </h2>
            <div style={{ display: 'grid', gap: 6 }}>
              {[
                { name: 'CardKingdom', stock: 'In stock', price: '€8.40' },
                { name: 'TCGPlayer (FR)', stock: '4 left', price: '€7.90' },
                { name: 'Magic Bazar', stock: 'In stock', price: '€9.20' },
              ].map(s => (
                <a key={s.name} href="#" style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: 14,
                  padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: 10, textDecoration: 'none', color: 'inherit',
                }}>
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.stock}</span>
                  <span className="mono" style={{ fontWeight: 600 }}>{s.price}</span>
                  <External size={14} style={{ color: 'var(--ink-3)' }}/>
                </a>
              ))}
              <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 4 }}>
                Affiliate-free links. Prices last refreshed 12 min ago.
              </div>
            </div>
          </section>

          {/* Related news */}
          <section style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)',
                          letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Mentioned in
            </h2>
            <div style={{ display: 'grid', gap: 4 }}>
              {NEWS.slice(0, 2).map(n => <NewsCard key={n.id} news={n}/>)}
            </div>
          </section>
        </div>
      </main>

      {/* Other versions strip */}
      <section style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--line)',
                         padding: '36px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeading eyebrow="Other versions" title="Mickey Mouse — across all sets" link="See all 14 →"/>
          <div style={{ display: 'flex', gap: 14, marginTop: 22, overflowX: 'auto' }} className="if-scroll">
            {CARDS.slice(0, 7).map(c2 => <Card key={c2.id} card={{ ...c2, name: 'Mickey Mouse', subtitle: c2.subtitle || 'Stalwart Friend' }} size="normal" frame={frame}/>)}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

// ─── Card detail — Mobile ──────────────────────────────────
function CardDetailMobile({ frame = 'subtle' }) {
  const c = CARDS[0];
  return (
    <MobileFrame statusbarTheme="dark">
      {/* Dark hero with the card */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          linear-gradient(180deg, rgba(15,10,5,.7) 0%, rgba(15,10,5,0) 30%),
          radial-gradient(120% 80% at 50% 0%, ${INK.ruby.c}55, transparent 55%),
          linear-gradient(180deg, #2a1d18 0%, var(--paper) 38%)
        `,
        zIndex: 0,
      }}/>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <TopNavMobile back title="" action={
          <button style={{ width: 40, height: 40, border: 0, background: 'transparent',
                            display: 'grid', placeItems: 'center', color: '#fff' }}>
            <Heart size={20}/>
          </button>
        }/>
      </div>
      <div className="if-scroll" style={{ position: 'absolute', top: 96, left: 0, right: 0, bottom: 0, overflow: 'auto', zIndex: 2 }}>
        {/* Hero card */}
        <div style={{ display: 'grid', placeItems: 'center', padding: '4px 0 24px' }}>
          <div style={{ filter: 'drop-shadow(0 14px 30px rgba(0,0,0,.4))' }}>
            <Card card={c} size="normal" frame={frame} style={{ width: 220, height: 308 }}/>
          </div>
        </div>

        {/* Light card content */}
        <div style={{ background: 'var(--paper)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
                       padding: '20px 18px 90px', marginTop: -16,
                       minHeight: '60%' }}>
          <div style={{ display: 'grid', placeItems: 'center', marginBottom: 14 }}>
            <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--line-strong)' }}/>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--rarity-legendary)',
                            textTransform: 'uppercase', letterSpacing: '.1em' }}>Legendary</span>
            <span style={{ color: 'var(--ink-4)' }}>·</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-3)',
                            textTransform: 'uppercase', letterSpacing: '.08em' }}>The First Chapter</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 2 }}>
            Brave Little Tailor
          </div>
          <h1 className="serif" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-.02em',
                                          margin: 0, lineHeight: 1.05 }}>
            Mickey Mouse
          </h1>

          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--ink-2)', display: 'flex', gap: 6 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <TypeCharacter size={13}/> Character
            </span>
            <span style={{ color: 'var(--ink-4)' }}>—</span>
            <span>Hero · Knight</span>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
                         marginTop: 16, background: 'var(--line)', borderRadius: 12, overflow: 'hidden',
                         border: '1px solid var(--line)' }}>
            {[
              { i: <CostGem size={14} style={{ color: INK.ruby.c }}/>, l: 'Cost', v: '8' },
              { i: <Strength size={13}/>, l: 'Str', v: '5' },
              { i: <Willpower size={13}/>, l: 'Will', v: '5' },
              { i: <Lore size={13} style={{ color: 'var(--accent)' }}/>, l: 'Lore', v: '3' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--surface)', padding: '10px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink-3)',
                              fontSize: 10, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 2 }}>
                  {s.i}{s.l}
                </div>
                <div className="serif" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1, letterSpacing: '-.02em' }}>
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          {/* Abilities */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 10, padding: '14px 14px', marginTop: 18,
            fontSize: 13.5, lineHeight: 1.5,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{
                fontWeight: 700, fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase',
                padding: '2px 6px', borderRadius: 4, background: 'var(--ink-amber-soft)', color: 'var(--accent-ink)',
              }}>Evasive</span>
              <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>Only Evasive can challenge.</span>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
              <p style={{ margin: 0 }}>
                <strong>And Two for Tea! —</strong> When you play this character, you may remove up to 2 damage from each of your Amber characters.
              </p>
            </div>
          </div>

          {/* Flavor */}
          <p className="serif" style={{ fontStyle: 'italic', fontSize: 14, color: 'var(--ink-3)',
            margin: '14px 4px 0', lineHeight: 1.5 }}>
            "Forward march! And don't spare the rolling pin!"
          </p>

          {/* Meta */}
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 20, lineHeight: 1.7,
            paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            <div>Illustrator · Matthew Oxley</div>
            <div>№ 1 / 204 · The First Chapter</div>
            <div>Released · 18 Aug 2023</div>
          </div>
        </div>
      </div>

      {/* Sticky buy bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
        background: 'color-mix(in oklab, var(--surface) 90%, transparent)',
        borderTop: '1px solid var(--line)',
        backdropFilter: 'blur(10px)',
        padding: '10px 14px 26px',
        display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 10, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Lowest</div>
          <div className="mono" style={{ fontSize: 18, fontWeight: 700 }}>€7.90</div>
        </div>
        <button className="if-btn if-btn--primary" style={{ justifyContent: 'center', padding: '13px 0' }}>
          Where to buy
        </button>
      </div>
    </MobileFrame>
  );
}

Object.assign(window, {
  EncyclopediaDesktop, EncyclopediaMobile, CardDetailDesktop, CardDetailMobile,
  FacetGroup, FacetCheck,
});
