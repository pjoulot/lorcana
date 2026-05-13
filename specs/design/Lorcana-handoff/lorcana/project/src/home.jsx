// Inkfolk — Homepage
// Desktop + mobile. Hero, search, popular cards, recent news, sets, draft CTA.

// Stylised card spread visual for the hero
function CardSpread({ scale = 1 }) {
  // 5 fanned cards
  const n = CARDS.length;
  const pick = i => CARDS[((i % n) + n) % n];
  const picks = [
    { card: pick(8),  rot: -16, x: -180, y: 30, z: 1 },
    { card: pick(0),  rot: -8,  x: -90,  y: -10, z: 2 },
    { card: pick(1),  rot: 0,   x: 0,    y: -22, z: 3 },
    { card: pick(7),  rot: 8,   x: 90,   y: -10, z: 2 },
    { card: pick(10), rot: 16,  x: 180,  y: 30, z: 1 },
  ];
  return (
    <div style={{
      position: 'relative', height: 320 * scale, width: 540 * scale,
      pointerEvents: 'none',
    }}>
      {picks.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: `translate(-50%,-50%) translate(${p.x * scale}px,${p.y * scale}px) rotate(${p.rot}deg) scale(${scale})`,
          transformOrigin: 'center center',
          filter: `drop-shadow(0 ${16 - i * 2}px ${24 - i * 2}px rgba(35,25,10,.18))`,
          zIndex: p.z,
        }}>
          <Card card={p.card} size="normal" frame="subtle"/>
        </div>
      ))}
    </div>
  );
}

// ─── Homepage — Desktop ──────────────────────────────
function HomeDesktop() {
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="home"/>

      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: '64px 32px 56px',
        background: `
          radial-gradient(60% 50% at 80% 0%, var(--ink-amber-soft) 0%, transparent 60%),
          radial-gradient(50% 60% at 0% 100%, var(--ink-amethyst-soft) 0%, transparent 60%),
          var(--paper)
        `,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 540px', gap: 48, alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 11px', borderRadius: 999,
              background: 'var(--surface)', border: '1px solid var(--line)',
              fontSize: 12, color: 'var(--ink-2)', fontWeight: 500, marginBottom: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--ink-emerald)' }}/>
              Reign of Jafar live · 204 new cards indexed
            </div>
            <h1 className="serif" style={{
              fontSize: 60, lineHeight: 1.02, fontWeight: 500,
              letterSpacing: '-0.025em', margin: '0 0 16px',
              color: 'var(--ink)', textWrap: 'balance',
            }}>
              Every Lorcana card, <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>at a glance.</span>
            </h1>
            <p style={{
              fontSize: 17, lineHeight: 1.5, color: 'var(--ink-2)', margin: '0 0 28px',
              maxWidth: 460,
            }}>
              A fan-made, ad-free database for searching cards, planning decks, and
              drafting with friends. EN&nbsp;·&nbsp;FR.
            </p>
            {/* Big search */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--surface)', border: '1px solid var(--line-strong)',
              borderRadius: 14, padding: '14px 16px',
              boxShadow: 'var(--shadow-2)',
              maxWidth: 480,
            }}>
              <Search size={20} style={{ color: 'var(--ink-3)' }}/>
              <input placeholder="Search cards, abilities, sets…"
                style={{ border: 0, outline: 0, background: 'transparent', flex: 1,
                  font: '16px var(--font-ui)', color: 'var(--ink)' }} defaultValue=""/>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)',
                background: 'var(--paper-2)', padding: '3px 6px', borderRadius: 4 }}>⌘ K</span>
            </label>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--ink-3)', alignSelf: 'center', marginRight: 6 }}>Try:</span>
              {['ink:ruby cost<=3', 'keyword:singer', 't:song rare', 'set:azurite ink:sapphire+steel'].map(s => (
                <span key={s} className="mono" style={{
                  fontSize: 12, padding: '4px 9px', borderRadius: 6,
                  background: 'var(--paper-2)', color: 'var(--ink-2)', border: '1px solid var(--line)',
                }}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', alignSelf: 'center' }}>
            <CardSpread scale={1}/>
          </div>
        </div>
      </section>

      {/* News + Draft side by side */}
      <section style={{ padding: '48px 32px 32px', maxWidth: 1200, margin: '0 auto', width: '100%',
                        display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 32 }}>
        <div>
          <SectionHeading
            eyebrow="From the editors"
            title="Recent news"
            link="All articles →"
          />
          <div style={{ display: 'grid', gap: 20, marginTop: 24 }}>
            {NEWS.slice(0, 3).map((n, i) => <NewsCard key={n.id} news={n} variant={i === 0 ? 'feature' : 'row'}/>)}
          </div>
        </div>

        {/* Draft CTA card */}
        <aside style={{
          background: `
            radial-gradient(120% 80% at 100% 0%, var(--ink-sapphire-soft), transparent 60%),
            linear-gradient(180deg, var(--surface) 0%, var(--paper-2) 100%)
          `,
          border: '1px solid var(--line)',
          borderRadius: 20, padding: 28,
          position: 'sticky', top: 80, alignSelf: 'start',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-sapphire)',
                        fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            <Sparkle size={14}/> Live draft
          </div>
          <h3 className="serif" style={{ fontSize: 28, lineHeight: 1.1, margin: '12px 0 10px',
                                          fontWeight: 500, letterSpacing: '-.02em' }}>
            Run a remote draft with up to <em>eight</em> friends.
          </h3>
          <p style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.5, margin: '0 0 20px' }}>
            Open virtual booster packs together over Discord. Pick cards in 30 seconds. Bring your physical decks to the table on Friday.
          </p>
          <button className="if-btn if-btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
            Create a room
          </button>
          <button className="if-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            Join with a code
          </button>
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)',
                        fontSize: 12, color: 'var(--ink-3)', display: 'flex', gap: 14 }}>
            <span>↻ No account</span>
            <span>•</span>
            <span>Peer-to-peer</span>
            <span>•</span>
            <span>Phone-friendly</span>
          </div>
        </aside>
      </section>

      {/* Popular cards */}
      <section style={{ padding: '24px 32px 48px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <SectionHeading
          eyebrow="Trending this week"
          title="Popular cards"
          link="See all cards →"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginTop: 24 }}>
          {CARDS.slice(0, 6).map(c => (
            <Card key={c.id} card={c} size="normal" frame="subtle" style={{ width: '100%' }}/>
          ))}
        </div>
      </section>

      {/* Sets grid */}
      <section style={{ padding: '0 32px 56px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <SectionHeading eyebrow="By release" title="Browse sets" link="All sets →"/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 24 }}>
          {SETS.slice(0, 4).map(s => <SetTile key={s.code} set={s}/>)}
        </div>
      </section>

      <Footer/>
    </div>
  );
}

// Sub-components
function SectionHeading({ eyebrow, title, link }) {
  return (
    <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 16 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.08em',
                      textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
          {eyebrow}
        </div>
        <h2 className="serif" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-.02em',
                                        margin: 0, lineHeight: 1.05 }}>{title}</h2>
      </div>
      {link && (
        <a href="#" style={{ fontSize: 14, color: 'var(--ink-2)', textDecoration: 'none', fontWeight: 500 }}>
          {link}
        </a>
      )}
    </div>
  );
}

function NewsCard({ news, variant = 'row' }) {
  const covers = {
    seafoam: 'linear-gradient(135deg, #B3D8E2, #6E97AB)',
    rose:    'linear-gradient(135deg, #E8C6BD, #B47C82)',
    slate:   'linear-gradient(135deg, #B7BFC4, #6B7681)',
    meadow:  'linear-gradient(135deg, #C7DDBC, #6E9E70)',
    gold:    'linear-gradient(135deg, #EBCB89, #B6843F)',
    lavender:'linear-gradient(135deg, #C9BEDF, #8472A8)',
  };
  if (variant === 'feature') {
    return (
      <a href="#" style={{
        display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'center',
        textDecoration: 'none', color: 'inherit',
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 16, padding: 16,
      }}>
        <div style={{ background: covers[news.cover] || covers.seafoam,
                      borderRadius: 12, aspectRatio: '4/3',
                      position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(255,255,255,.92)', borderRadius: 999, padding: '4px 9px',
            fontSize: 11, fontWeight: 600, color: 'var(--ink)',
          }}>{news.cat}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 8,
                        display: 'flex', gap: 10 }}>
            <span>{news.author}</span>
            <span>·</span>
            <span>{news.date}</span>
            <span>·</span>
            <span>{news.read} read</span>
          </div>
          <h3 className="serif" style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-.02em',
                                          margin: '0 0 8px', lineHeight: 1.15, textWrap: 'balance' }}>
            {news.title}
          </h3>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)' }}>
            {news.excerpt}
          </p>
        </div>
      </a>
    );
  }
  return (
    <a href="#" style={{
      display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 16, alignItems: 'center',
      textDecoration: 'none', color: 'inherit',
      padding: '14px 4px', borderBottom: '1px solid var(--line)',
    }}>
      <div style={{ background: covers[news.cover] || covers.seafoam,
                    borderRadius: 8, aspectRatio: '4/3' }}/>
      <div>
        <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '.05em',
                      textTransform: 'uppercase', marginBottom: 4 }}>{news.cat}</div>
        <h4 className="serif" style={{ fontSize: 17, lineHeight: 1.2, fontWeight: 500, margin: '0 0 4px',
                                        letterSpacing: '-.01em' }}>{news.title}</h4>
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{news.author} · {news.date}</div>
      </div>
      <ChevR size={16} style={{ color: 'var(--ink-3)' }}/>
    </a>
  );
}

function SetTile({ set, variant = 'tile' }) {
  const gradients = {
    TFC: 'linear-gradient(135deg, #F4B042, #A56FCF)',
    RFB: 'linear-gradient(135deg, #3B7BC4, #3D9F6A)',
    IIH: 'linear-gradient(135deg, #3D9F6A, #8C9AA3)',
    URR: 'linear-gradient(135deg, #A56FCF, #3B7BC4)',
    SSK: 'linear-gradient(135deg, #3B7BC4, #F4B042)',
    AZS: 'linear-gradient(135deg, #3B7BC4, #A56FCF)',
    INK: 'linear-gradient(135deg, #D14B4B, #F4B042)',
  };
  return (
    <a href="#" style={{
      display: 'block', borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--line)', background: 'var(--surface)',
      textDecoration: 'none', color: 'inherit',
    }}>
      <div style={{ height: 120, background: gradients[set.code] || gradients.TFC,
                    position: 'relative', display: 'grid', placeItems: 'center' }}>
        <div className="serif" style={{
          fontSize: 48, color: '#fff', fontWeight: 500, letterSpacing: '-.04em',
          textShadow: '0 2px 8px rgba(0,0,0,.25)',
        }}>{set.icon}</div>
        <span style={{
          position: 'absolute', top: 10, right: 12,
          fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '.1em',
          background: 'rgba(0,0,0,.25)', padding: '3px 7px', borderRadius: 4,
        }}>{set.code}</span>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div className="serif" style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-.01em' }}>
          {set.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
          {set.cards} cards · {set.date}
        </div>
      </div>
    </a>
  );
}

// ─── Homepage — Mobile ───────────────────────────────
function HomeMobile() {
  return (
    <MobileFrame>
      <TopNavMobile/>
      <div className="if-scroll" style={{ height: 'calc(100% - 52px - 44px)', overflow: 'auto', paddingBottom: 80 }}>
        {/* Hero */}
        <section style={{
          padding: '14px 18px 24px',
          background: `
            radial-gradient(80% 60% at 100% 0%, var(--ink-amber-soft), transparent 70%),
            var(--paper)
          `,
        }}>
          <h1 className="serif" style={{
            fontSize: 30, lineHeight: 1.05, fontWeight: 500, letterSpacing: '-.025em',
            margin: '6px 0 8px', textWrap: 'balance',
          }}>
            Every Lorcana card, <em style={{ color: 'var(--accent)' }}>at a glance.</em>
          </h1>
          <p style={{ fontSize: 13.5, lineHeight: 1.45, color: 'var(--ink-2)', margin: '0 0 14px' }}>
            Search 1,428 cards. Plan decks. Draft with friends.
          </p>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--surface)', border: '1px solid var(--line-strong)',
            borderRadius: 12, padding: '11px 14px', boxShadow: 'var(--shadow-1)',
          }}>
            <Search size={16} style={{ color: 'var(--ink-3)' }}/>
            <input placeholder="Search cards, abilities…" style={{
              border: 0, outline: 0, background: 'transparent', flex: 1,
              font: '14px var(--font-ui)', color: 'var(--ink)',
            }} defaultValue=""/>
          </label>
          {/* Pill row of inks */}
          <div style={{ display: 'flex', gap: 6, marginTop: 12, overflowX: 'auto' }}>
            {Object.entries(INK).map(([k, v]) => (
              <button key={k} className="if-chip" style={{ flexShrink: 0 }}>
                <span style={{ width: 9, height: 9, borderRadius: 999, background: v.c }}/>
                {v.name}
              </button>
            ))}
          </div>
        </section>

        {/* Draft CTA — bright */}
        <section style={{ padding: '0 18px 20px' }}>
          <div style={{
            background: `
              radial-gradient(120% 80% at 100% 0%, var(--ink-sapphire-soft), transparent),
              var(--surface)
            `,
            border: '1px solid var(--line)', borderRadius: 16, padding: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6,
              color: 'var(--ink-sapphire)', fontSize: 11, fontWeight: 600, letterSpacing: '.06em',
              textTransform: 'uppercase' }}>
              <Sparkle size={12}/> Live draft
            </div>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, margin: '8px 0 6px',
              lineHeight: 1.15, letterSpacing: '-.01em' }}>
              Draft remotely with friends, on your phone.
            </h3>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: '0 0 14px', lineHeight: 1.4 }}>
              Open virtual packs together, pick cards, then play offline.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button className="if-btn if-btn--primary" style={{ justifyContent: 'center', padding: '10px 0' }}>Create</button>
              <button className="if-btn" style={{ justifyContent: 'center', padding: '10px 0' }}>Join</button>
            </div>
          </div>
        </section>

        {/* Recent news */}
        <section style={{ padding: '4px 18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Editors</div>
              <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.02em', margin: 0 }}>
                Latest news
              </h2>
            </div>
            <a href="#" style={{ fontSize: 12, color: 'var(--ink-2)', textDecoration: 'none' }}>All →</a>
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            {NEWS.slice(0, 3).map(n => <NewsCard key={n.id} news={n}/>)}
          </div>
        </section>

        {/* Popular cards horizontal scroll */}
        <section style={{ padding: '4px 0 20px' }}>
          <div style={{ padding: '0 18px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Trending</div>
              <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.02em', margin: 0 }}>
                Popular cards
              </h2>
            </div>
            <a href="#" style={{ fontSize: 12, color: 'var(--ink-2)', textDecoration: 'none' }}>See all →</a>
          </div>
          <div className="if-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 18px 6px' }}>
            {CARDS.slice(0, 8).map(c => (
              <Card key={c.id} card={c} size="normal" frame="subtle"/>
            ))}
          </div>
        </section>

        {/* Sets */}
        <section style={{ padding: '0 18px 28px' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>By release</div>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.02em', margin: 0 }}>
              Sets
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {SETS.slice(0, 4).map(s => <SetTile key={s.code} set={s}/>)}
          </div>
        </section>

        {/* Mini footer */}
        <Footer compact/>
      </div>
      <MobileTabBar active="home"/>
    </MobileFrame>
  );
}

Object.assign(window, { HomeDesktop, HomeMobile, CardSpread, SectionHeading, NewsCard, SetTile });
