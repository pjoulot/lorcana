// Inkfolk — News listing + News article + Set page
// Desktop + mobile for each.

const COVERS = {
  seafoam: 'linear-gradient(135deg, #B3D8E2, #6E97AB)',
  rose:    'linear-gradient(135deg, #E8C6BD, #B47C82)',
  slate:   'linear-gradient(135deg, #B7BFC4, #6B7681)',
  meadow:  'linear-gradient(135deg, #C7DDBC, #6E9E70)',
  gold:    'linear-gradient(135deg, #EBCB89, #B6843F)',
  lavender:'linear-gradient(135deg, #C9BEDF, #8472A8)',
};

// ─── News listing — Desktop ────────────────────────────────
function NewsListingDesktop() {
  const cats = ['All', 'Set Spoilers', 'Tournaments', 'Rules', 'Decks', 'Community'];
  const [active, setActive] = React.useState('All');
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="news"/>

      {/* Masthead */}
      <header style={{
        padding: '52px 32px 40px',
        background: `linear-gradient(180deg, var(--paper-2) 0%, var(--paper) 100%)`,
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em',
                         textTransform: 'uppercase', color: 'var(--accent)' }}>
            The Inkfolk Journal
          </div>
          <h1 className="serif" style={{ fontSize: 56, fontWeight: 500, letterSpacing: '-.025em',
                                          margin: '8px 0 12px', lineHeight: 1.02, maxWidth: 900 }}>
            News, spoilers and tournament reports — written by players.
          </h1>
          <p style={{ fontSize: 17, color: 'var(--ink-2)', maxWidth: 640, margin: 0, lineHeight: 1.5 }}>
            Twice-weekly coverage of the meta, set releases, ruling updates, and the community around the table.
          </p>

          {/* Category tabs */}
          <div style={{ marginTop: 28, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {cats.map(c => (
              <button key={c} onClick={() => setActive(c)} className="if-btn" style={{
                padding: '7px 14px', fontSize: 13,
                ...(c === active ? {
                  background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)', fontWeight: 600,
                } : {}),
              }}>
                {c}
              </button>
            ))}
            <div style={{ flex: 1 }}/>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 999,
              padding: '6px 10px', fontSize: 13, color: 'var(--ink-2)',
            }}>
              <Globe size={14}/> EN + FR
            </div>
          </div>
        </div>
      </header>

      {/* Featured + grid */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 48px' }}>
        {/* Featured */}
        <a href="#" style={{
          display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 32, alignItems: 'center',
          textDecoration: 'none', color: 'inherit', marginBottom: 48,
        }}>
          <div style={{
            aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden',
            background: COVERS.seafoam,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 16, left: 16,
              background: 'rgba(255,255,255,.92)', borderRadius: 999, padding: '5px 11px',
              fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
            }}>Featured · Set Spoilers</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 10, display: 'flex', gap: 12 }}>
              <span>Margot Lemaire</span>
              <span>·</span>
              <span>8 May</span>
              <span>·</span>
              <span>12 min read</span>
              <span>·</span>
              <span style={{
                background: 'var(--paper-2)', padding: '2px 7px', borderRadius: 4,
                fontSize: 10, fontWeight: 600, letterSpacing: '.06em',
              }}>EN</span>
            </div>
            <h2 className="serif" style={{ fontSize: 38, fontWeight: 500, letterSpacing: '-.025em',
                                            margin: '0 0 14px', lineHeight: 1.08, textWrap: 'balance' }}>
              Azurite Sea: every card we know about so far
            </h2>
            <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.55, margin: '0 0 18px' }}>
              Ravensburger has unveiled the next big expansion, and it leans hard into seafaring stories. We round up the 38 cards revealed at Gen Con and what they tell us about where Lorcana is heading next year.
            </p>
            <span className="if-btn">Read article →</span>
          </div>
        </a>

        {/* Grid 3-col */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {NEWS.slice(1).map(n => <NewsTileCard key={n.id} news={n}/>)}
          {/* Repeat for visual density */}
          {NEWS.slice(0, 3).map((n, i) => <NewsTileCard key={`b-${n.id}`} news={n}/>)}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 36 }}>
          {['◀', '1', '2', '3', '4', '5', '…', '14', '▶'].map((p, i) => (
            <button key={i} className="if-btn" style={{
              padding: '6px 11px', fontSize: 13,
              ...(p === '1' ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' } : {}),
            }}>{p}</button>
          ))}
        </div>
      </section>

      <Footer/>
    </div>
  );
}

function NewsTileCard({ news }) {
  return (
    <a href="#" style={{
      display: 'flex', flexDirection: 'column', gap: 16,
      textDecoration: 'none', color: 'inherit',
    }}>
      <div style={{
        aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden',
        background: COVERS[news.cover] || COVERS.seafoam,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(255,255,255,.92)', borderRadius: 999, padding: '4px 9px',
          fontSize: 11, fontWeight: 600, color: 'var(--ink)',
        }}>{news.cat}</div>
        {news.lang === 'FR' && (
          <div style={{ position: 'absolute', top: 12, right: 12,
            background: 'rgba(15,10,5,.6)', color: '#fff',
            borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 700, letterSpacing: '.08em' }}>
            FR
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 6, display: 'flex', gap: 10 }}>
          <span>{news.author}</span>
          <span>·</span>
          <span>{news.date}</span>
        </div>
        <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.015em',
                                        margin: '0 0 8px', lineHeight: 1.15, textWrap: 'balance' }}>
          {news.title}
        </h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {news.excerpt}
        </p>
      </div>
    </a>
  );
}

// ─── News listing — Mobile ─────────────────────────────────
function NewsListingMobile() {
  return (
    <MobileFrame>
      <TopNavMobile title="Journal"/>
      <div className="if-scroll" style={{ height: 'calc(100% - 52px - 44px)', overflow: 'auto', paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ padding: '14px 18px 6px' }}>
          <h1 className="serif" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-.02em', margin: '0 0 8px', lineHeight: 1.05 }}>
            News & reports
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0, lineHeight: 1.4 }}>
            Spoilers, tournaments, rulings — by players, for players.
          </p>
        </div>

        {/* Category strip */}
        <div className="if-scroll" style={{ display: 'flex', gap: 6, padding: '14px 18px 10px', overflowX: 'auto' }}>
          {['All', 'Spoilers', 'Tournaments', 'Rules', 'Decks', 'Community', 'FR'].map((c, i) => (
            <button key={c} className="if-chip" style={{
              flexShrink: 0,
              ...(i === 0 ? {
                background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)', fontWeight: 600,
              } : {}),
            }}>{c}</button>
          ))}
        </div>

        {/* Featured */}
        <div style={{ padding: '4px 18px 0' }}>
          <a href="#" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden',
              background: COVERS.seafoam, position: 'relative', marginBottom: 12,
            }}>
              <div style={{
                position: 'absolute', top: 10, left: 10,
                background: 'rgba(255,255,255,.92)', borderRadius: 999, padding: '4px 9px',
                fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
              }}>Featured</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
              Set Spoilers · 12 min
            </div>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.015em',
                                            margin: '0 0 6px', lineHeight: 1.15, textWrap: 'balance' }}>
              Azurite Sea: every card we know about so far
            </h2>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              Margot Lemaire · 8 May
            </div>
          </a>
        </div>

        {/* List */}
        <div style={{ padding: '20px 18px 24px' }}>
          {NEWS.slice(1).map(n => (
            <a key={n.id} href="#" style={{
              display: 'grid', gridTemplateColumns: '88px 1fr', gap: 14, alignItems: 'center',
              padding: '14px 0', borderTop: '1px solid var(--line)',
              textDecoration: 'none', color: 'inherit',
            }}>
              <div style={{
                aspectRatio: '4/3', borderRadius: 8,
                background: COVERS[n.cover] || COVERS.seafoam, position: 'relative',
              }}>
                {n.lang === 'FR' && (
                  <div style={{ position: 'absolute', top: 4, right: 4,
                    background: 'rgba(15,10,5,.6)', color: '#fff',
                    borderRadius: 3, padding: '1px 4px', fontSize: 8, fontWeight: 700, letterSpacing: '.08em' }}>
                    FR
                  </div>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)',
                              letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {n.cat}
                </div>
                <h4 className="serif" style={{ fontSize: 15, lineHeight: 1.2, fontWeight: 600, margin: '0 0 4px',
                                                letterSpacing: '-.005em',
                                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {n.title}
                </h4>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                  {n.author} · {n.date} · {n.read}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <MobileTabBar active="news"/>
    </MobileFrame>
  );
}

// ─── News article — Desktop ────────────────────────────────
// Inline card chip with hover-preview (visual hint of hover state shown)
function CardChip({ name, ink, hover }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '1px 8px 1px 5px', borderRadius: 999,
      background: hover ? 'var(--accent-soft)' : 'var(--surface)',
      border: '1px solid ' + (hover ? 'transparent' : 'var(--line)'),
      fontSize: '.95em', fontWeight: 500, color: hover ? 'var(--accent-ink)' : 'var(--ink)',
      cursor: 'pointer', verticalAlign: 'baseline', position: 'relative',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: INK[ink].c }}/>
      {name}
    </span>
  );
}

function NewsArticleDesktop() {
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="news"/>

      {/* Editorial masthead — title left, image right */}
      <header style={{ padding: '64px 32px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto',
                       display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px',
                       gap: 48, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <span style={{ width: 28, height: 2, background: 'var(--accent)' }}/>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em',
                              textTransform: 'uppercase', color: 'var(--accent)' }}>Set Spoilers</span>
              <span style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '.06em' }}>
                · Issue 14 · 8 May 2026
              </span>
            </div>
            <h1 className="serif" style={{
              fontSize: 64, fontWeight: 400, letterSpacing: '-.03em',
              margin: '0 0 18px', lineHeight: .98, textWrap: 'balance',
            }}>
              Azurite Sea: every card we know about so far
            </h1>
            <p style={{ fontSize: 20, lineHeight: 1.45, color: 'var(--ink-2)', margin: 0,
                         fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              Thirty-eight reveals into Lorcana's seventh set, the seafaring identity is doing
              more work than just flavour. Here's the read on every preview so far.
            </p>
          </div>
          <figure style={{ margin: 0, padding: 0 }}>
            <div style={{
              aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden',
              backgroundImage: 'url("assets/sets/first-chapter.jpg")',
              backgroundSize: 'cover', backgroundPosition: 'center 30%',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-2)',
            }}/>
            <figcaption className="serif" style={{
              fontStyle: 'italic', fontSize: 12.5, color: 'var(--ink-3)',
              margin: '10px 0 0', lineHeight: 1.45,
            }}>
              The First Chapter cover art — Ravensburger's reveal panel at Gen Con 2025.
            </figcaption>
          </figure>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 28,
                         paddingTop: 22, borderTop: '1px solid var(--line)',
                         fontSize: 13, color: 'var(--ink-3)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 999,
                           background: 'linear-gradient(135deg, #E8C6BD, #B47C82)' }}/>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Margot Lemaire</div>
              <div style={{ fontSize: 12 }}>Senior writer · 12 min read</div>
            </div>
            <div style={{ flex: 1 }}/>
            <button className="if-btn" style={{ fontSize: 12, padding: '6px 10px' }}><Heart size={12}/> Save</button>
            <button className="if-btn" style={{ fontSize: 12, padding: '6px 10px' }}>Share</button>
          </div>
        </div>
      </header>

      <article style={{
        maxWidth: 720, margin: '0 auto', padding: '36px 32px 0',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 18.5, lineHeight: 1.7, color: 'var(--ink)',
        }}>
          <p style={{ margin: '0 0 18px' }}>
            <span className="serif" style={{
              float: 'left', fontSize: 76, lineHeight: .85, fontWeight: 500,
              padding: '6px 10px 0 0', color: 'var(--accent)',
            }}>R</span>
            avensburger pulled back the curtain on Azurite Sea at Gen Con this weekend, and the
            early impression is unmistakable: this set wants you on a boat. The new
            <CardChip name="Tidal Surge" ink="sapphire"/> is a tempo action that punishes wide
            boards, and <CardChip name="Ariel — Tidecaller" ink="sapphire" hover/> joins a growing
            list of Floodborn princesses that play very differently from their original prints.
          </p>
          <p style={{ margin: '0 0 22px' }}>
            What we don't know yet: how the third ink combination interacts with the existing
            Amber/Sapphire shells from <em>Shimmering Skies</em>. The judging team has been careful
            not to promise rotations, but a few of the previewed locations gesture quietly at the
            next year's worth of design space.
          </p>

          {/* Inline card trio — breaks out of measure */}
          <figure style={{ margin: '36px -80px', padding: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[0, 1, 2].map(i => <Card key={i} card={CARDS[i % CARDS.length]} size="normal" frame="subtle" style={{ width: '100%' }}/>)}
            </div>
            <figcaption className="serif" style={{
              fontStyle: 'italic', fontSize: 13.5, color: 'var(--ink-3)',
              textAlign: 'center', margin: '14px 40px 0',
            }}>
              Fig 1 — Three of the most-discussed reveals from the Gen Con panel.
            </figcaption>
          </figure>

          <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-.02em',
                                          margin: '40px 0 14px', lineHeight: 1.1 }}>
            The headline reveal: a new song-keyword
          </h2>
          <p style={{ margin: '0 0 20px' }}>
            Setting aside the speculation, the genuinely new mechanic is the song-keyword variant
            announced as <strong>"Encore"</strong> — a once-per-game replay clause that radically
            changes the value math on songs over four ink. <CardChip name="A Whole New World"
            ink="sapphire"/> won't be the budget Encore enabler people are hoping for, but the
            cheaper options previewed so far suggest the slot will exist.
          </p>

          {/* Pull quote */}
          <aside style={{
            margin: '36px -40px', padding: '32px 0',
            borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
            textAlign: 'center',
          }}>
            <div className="serif" style={{
              fontSize: 30, fontWeight: 400, letterSpacing: '-.015em', lineHeight: 1.25,
              color: 'var(--ink)', fontStyle: 'italic', textWrap: 'balance',
            }}>
              <span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>"</span>
              We wanted a way to reward decks that lean into songs as a strategy rather than as
              utility. Encore is the answer to that, and we'll keep iterating.
              <span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>"</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 14,
                           letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              Steve Warner · Lead designer · Gen Con panel
            </div>
          </aside>

          <p style={{ margin: '0 0 20px' }}>
            The rest of the column-inches will be spent on what this means for the meta. In short:
            singer-heavy decks were already healthy after Shimmering Skies, and Encore looks like a
            quiet buff at the very top of the curve. Bookmark this piece — we'll keep updating it
            as new cards are previewed across the next two weeks.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 24,
                         borderTop: '1px solid var(--line)', marginTop: 24 }}>
            {['Spoilers', 'Azurite Sea', 'Songs', 'Floodborn'].map(t => (
              <span key={t} className="if-chip">{t}</span>
            ))}
          </div>
        </div>
      </article>

      {/* Related — full-width strip */}
      <section style={{
        borderTop: '1px solid var(--line)', background: 'var(--paper-2)',
        padding: '48px 32px', marginTop: 32,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 className="serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-.015em', margin: 0 }}>
              More from the Journal
            </h2>
            <a href="#" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              All articles →
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {NEWS.slice(1, 4).map(n => <NewsTileCard key={n.id} news={n}/>)}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

// ─── News article — Mobile ─────────────────────────────────
function NewsArticleMobile() {
  return (
    <MobileFrame statusbarTheme="light">
      <TopNavMobile back title="" action={
        <button style={{ width: 40, height: 40, border: 0, background: 'transparent',
                          display: 'grid', placeItems: 'center', color: 'var(--ink-2)' }}>
          <Heart size={18}/>
        </button>
      }/>

      <div className="if-scroll" style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, overflow: 'auto' }}>
        {/* Editorial header — type-driven, no image */}
        <header style={{ padding: '20px 18px 22px', background: 'var(--paper-2)',
                          borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
                         fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em',
                         textTransform: 'uppercase', color: 'var(--accent)' }}>
            <span>Set Spoilers</span>
            <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--ink-3)' }}/>
            <span style={{ color: 'var(--ink-3)' }}>Issue 14 · 8 May</span>
          </div>
          <h1 className="serif" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-.02em',
                                          margin: '0 0 12px', lineHeight: 1.05, textWrap: 'balance' }}>
            Azurite Sea: every card we know about so far
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.45, color: 'var(--ink-2)', margin: 0,
                       fontFamily: 'var(--font-display)' }}>
            Thirty-eight reveals in, the seafaring set's identity is doing more work than flavour.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, fontSize: 12, color: 'var(--ink-3)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 999,
                           background: 'linear-gradient(135deg, #E8C6BD, #B47C82)' }}/>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink-2)' }}>Margot Lemaire</div>
              <div style={{ fontSize: 11 }}>12 min · EN · <a href="#" style={{ color: 'var(--accent)' }}>FR →</a></div>
            </div>
          </div>
        </header>

        <article style={{ padding: '22px 18px 60px',
                           fontFamily: 'var(--font-display)', fontSize: 16, lineHeight: 1.7,
                           color: 'var(--ink)' }}>
          <p style={{ margin: '0 0 14px' }}>
            <span className="serif" style={{
              float: 'left', fontSize: 56, lineHeight: .85, fontWeight: 500,
              padding: '4px 8px 0 0', color: 'var(--accent)',
            }}>R</span>
            avensburger pulled back the curtain at Gen Con. The new
            <CardChip name="Tidal Surge" ink="sapphire"/> is a tempo action, and
            <CardChip name="Ariel — Tidecaller" ink="sapphire" hover/> joins a growing list of
            Floodborn princesses that play very differently from their original prints.
          </p>
          <p style={{ margin: '0 0 18px' }}>
            What we don't know yet: how the third ink combination interacts with the existing
            Amber/Sapphire shells from <em>Shimmering Skies</em>.
          </p>

          <figure style={{ margin: '20px -18px' }}>
            <div className="if-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 18px' }}>
              {[0, 1, 2].map(i => <Card key={i} card={CARDS[i % CARDS.length]} size="normal" frame="subtle"/>)}
            </div>
            <figcaption className="serif" style={{
              fontStyle: 'italic', fontSize: 12.5, color: 'var(--ink-3)', textAlign: 'center',
              margin: '10px 18px 0',
            }}>
              Fig 1 — Three of the most-discussed Gen Con reveals.
            </figcaption>
          </figure>

          <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.015em',
                                          margin: '26px 0 10px', lineHeight: 1.1 }}>
            A new keyword: Encore
          </h2>
          <p style={{ margin: '0 0 16px' }}>
            Setting aside speculation, the genuinely new mechanic is the song-keyword variant
            <strong> Encore</strong> — a once-per-game replay clause that radically changes the
            value math on songs over four ink.
          </p>

          <aside style={{
            margin: '20px -18px', padding: '22px 18px',
            borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
          }}>
            <div className="serif" style={{
              fontSize: 19, fontWeight: 400, letterSpacing: '-.01em', lineHeight: 1.3,
              fontStyle: 'italic', textWrap: 'balance',
            }}>
              <span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>"</span>
              Encore rewards decks that lean into songs as a strategy.
              <span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>"</span>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 10,
                           letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              Steve Warner · Lead designer
            </div>
          </aside>

          <p style={{ margin: '0 0 16px' }}>
            Singer-heavy decks were already healthy after Shimmering Skies, and Encore looks like
            a quiet buff at the very top of the curve. Bookmark this piece — we'll keep updating
            it as new cards drop.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 18,
                         borderTop: '1px solid var(--line)', marginTop: 8 }}>
            {['Spoilers', 'Azurite Sea', 'Songs'].map(t => (
              <span key={t} className="if-chip" style={{ fontSize: 11 }}>{t}</span>
            ))}
          </div>
        </article>
      </div>
    </MobileFrame>
  );
}

// ─── Set page — Desktop ────────────────────────────────────
function SetPageDesktop({ frame = 'subtle' }) {
  const set = SETS[0];
  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="sets"/>

      {/* Hero band */}
      <header style={{
        position: 'relative', padding: '56px 32px 48px',
        overflow: 'hidden',
        background: `
          radial-gradient(60% 60% at 85% 0%, var(--ink-amber-soft) 0%, transparent 60%),
          radial-gradient(50% 60% at 0% 100%, var(--ink-amethyst-soft) 0%, transparent 60%),
          var(--paper)
        `,
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid',
                       gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                           padding: '5px 11px', borderRadius: 999,
                           background: 'var(--surface)', border: '1px solid var(--line)',
                           fontSize: 11, color: 'var(--ink-3)', fontWeight: 600,
                           letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 18 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)' }}/>
              Set № 01 · {set.code}
            </div>
            <h1 className="serif" style={{ fontSize: 56, fontWeight: 500, letterSpacing: '-.025em',
                                            color: 'var(--ink)',
                                            margin: '0 0 12px', lineHeight: 1.02, maxWidth: 540 }}>
              {set.name}
            </h1>
            <p style={{ fontSize: 16, margin: 0, color: 'var(--ink-2)', maxWidth: 480, lineHeight: 1.5 }}>
              The original Lorcana expansion — 204 cards introducing the six inks and the
              foundational Floodborn cast.
            </p>
            <div style={{ display: 'flex', gap: 28, marginTop: 22, fontSize: 13, color: 'var(--ink-2)', flexWrap: 'wrap' }}>
              <div><span style={{ color: 'var(--ink-3)' }}>Released</span> · <strong>{set.date}</strong></div>
              <div><span style={{ color: 'var(--ink-3)' }}>Cards</span> · <strong>{set.cards}</strong></div>
              <div><span style={{ color: 'var(--ink-3)' }}>Enchanted</span> · <strong>12</strong></div>
              <div><span style={{ color: 'var(--ink-3)' }}>Languages</span> · <strong>EN · FR · DE · IT · JP</strong></div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img src="assets/sets/first-chapter.jpg" alt="The First Chapter cover"
                 style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover',
                           borderRadius: 14, boxShadow: 'var(--shadow-3)',
                           border: '1px solid var(--line)',
                           transform: 'rotate(2deg)' }}/>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 32px 56px' }}>
        {/* Chase cards */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                            color: 'var(--accent)', marginBottom: 6 }}>Chase cards</div>
              <h2 className="serif" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-.02em', margin: 0, lineHeight: 1.05 }}>
                The pulls everyone's hunting
              </h2>
            </div>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>12 Enchanted · 14 Legendary</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {CARDS.slice(0, 5).map((c, i) => (
              <div key={`chase-${i}`} style={{ position: 'relative' }}>
                <Card card={c} size="normal" frame={frame} style={{ width: '100%' }}/>
                <div style={{
                  position: 'absolute', top: 8, left: 8,
                  padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                  letterSpacing: '.06em', textTransform: 'uppercase',
                  background: i < 2 ? 'linear-gradient(135deg, #F4B042, #A56FCF)' : 'rgba(15,10,5,.78)',
                  color: '#fff', backdropFilter: 'blur(4px)',
                }}>
                  {i < 2 ? 'Enchanted' : 'Legendary'}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center' }}>
            <a href="#" className="if-btn" style={{
              fontSize: 13, padding: '10px 18px', gap: 8, textDecoration: 'none',
            }}>
              See all cards in this set
              <span aria-hidden style={{ fontSize: 15 }}>→</span>
            </a>
          </div>
        </section>

        {/* Products */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                          color: 'var(--accent)', marginBottom: 6 }}>What you can buy</div>
            <h2 className="serif" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-.02em', margin: 0, lineHeight: 1.05 }}>
              Products in this set
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { name: 'Booster pack', sub: '12 cards', detail: '1 foil · 1 rare+', grad: 'linear-gradient(160deg, #F4B042, #C77A1E)', icon: '◫' },
              { name: 'Booster box', sub: '24 packs · 288 cards', detail: 'Sealed display', grad: 'linear-gradient(160deg, #A56FCF, #4F2A82)', icon: '☷' },
              { name: 'Starter deck', sub: '60 cards · pre-built', detail: '2 inks · ready to play', grad: 'linear-gradient(160deg, #3B7BC4, #1F4880)', icon: '◧' },
              { name: 'Illumineer\u2019s Trove', sub: '8 packs + accessories', detail: 'Deck box · sleeves · binder', grad: 'linear-gradient(160deg, #3D9F6A, #1E5C3D)', icon: '✦' },
            ].map(p => (
              <a key={p.name} href="#" style={{
                display: 'block', textDecoration: 'none', color: 'inherit',
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden',
              }}>
                <div style={{ height: 130, background: p.grad, display: 'grid', placeItems: 'center',
                              color: '#fff', fontSize: 64, fontWeight: 300, letterSpacing: '-.04em' }}>
                  {p.icon}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div className="serif" style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-.01em' }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 4 }}>{p.sub}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 6 }}>{p.detail}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Browse all CTA — illustrated, less dull */}
        <section>
          <a href="#" style={{
            display: 'block', position: 'relative', overflow: 'hidden',
            textDecoration: 'none', color: 'inherit',
            background: `
              radial-gradient(70% 100% at 100% 50%, var(--ink-amber-soft) 0%, transparent 60%),
              radial-gradient(60% 100% at 0% 50%, var(--ink-amethyst-soft) 0%, transparent 60%),
              var(--surface)
            `,
            border: '1px solid var(--line)', borderRadius: 18, padding: '36px 40px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
              <div style={{ maxWidth: 540 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                               fontSize: 11, fontWeight: 700, letterSpacing: '.12em',
                               textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
                  <span style={{ width: 18, height: 2, background: 'var(--accent)' }}/>
                  Explore the set
                </div>
                <h3 className="serif" style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-.025em',
                                                margin: '0 0 10px', lineHeight: 1.05 }}>
                  All 204 cards, one search away.
                </h3>
                <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: '0 0 22px', lineHeight: 1.55 }}>
                  Jump into the encyclopedia with <strong>{set.code}</strong> pre-filtered.
                  Layer on ink, cost, keyword — narrow to the cards you actually want.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <div className="if-btn if-btn--primary">Open encyclopedia →</div>
                  <a href="#" style={{ fontSize: 13, color: 'var(--ink-2)', textDecoration: 'underline',
                                        textDecorationColor: 'var(--line-strong)', textUnderlineOffset: 3 }}>
                    View set checklist
                  </a>
                </div>
              </div>
              {/* Stylised stacked cards visual */}
              <div style={{ position: 'relative', width: 280, height: 240,
                             display: 'grid', placeItems: 'center' }}>
                {CARDS.slice(0, 3).map((c, i) => {
                  const angles = [-10, 4, 14];
                  const offsetsX = [-70, 0, 70];
                  const offsetsY = [10, -6, 16];
                  return (
                    <div key={i} style={{
                      position: 'absolute',
                      transform: `translate(${offsetsX[i]}px, ${offsetsY[i]}px) rotate(${angles[i]}deg)`,
                      width: 120,
                      zIndex: i === 1 ? 3 : 3 - Math.abs(i - 1),
                      filter: `drop-shadow(0 10px 22px rgba(35,25,10,.18))`,
                    }}>
                      <Card card={c} size="normal" frame="subtle" style={{ width: '100%' }}/>
                    </div>
                  );
                })}
              </div>
            </div>
          </a>
        </section>
      </main>

      <Footer compact/>
    </div>
  );
}

// ─── Set page — Mobile ─────────────────────────────────────
function SetPageMobile({ frame = 'subtle' }) {
  const set = SETS[0];
  return (
    <MobileFrame statusbarTheme="dark">
      {/* Hero */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280, zIndex: 0,
                     background: `
                       radial-gradient(60% 60% at 90% 0%, var(--ink-amber-soft) 0%, transparent 60%),
                       radial-gradient(60% 60% at 0% 100%, var(--ink-amethyst-soft) 0%, transparent 60%),
                       var(--paper)
                     ` }}/>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <TopNavMobile back title="" action={
          <button style={{ width: 40, height: 40, border: 0, background: 'transparent',
                            display: 'grid', placeItems: 'center', color: 'var(--ink-2)' }}>
            <Search size={18}/>
          </button>
        }/>
      </div>

      <div className="if-scroll" style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, overflow: 'auto', paddingBottom: 80, zIndex: 2 }}>
        <div style={{ padding: '20px 18px 24px',
                       display: 'grid', gridTemplateColumns: '1fr 110px', gap: 16, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
                           textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>
              Set № 01 · {set.code}
            </div>
            <h1 className="serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-.02em',
                                            margin: 0, lineHeight: 1.05, color: 'var(--ink)' }}>
              {set.name}
            </h1>
            <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: '6px 0 0', lineHeight: 1.4 }}>
              204 cards. The original Lorcana set.
            </p>
          </div>
          <img src="assets/sets/first-chapter.jpg" alt=""
               style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover',
                         borderRadius: 10, boxShadow: 'var(--shadow-2)',
                         border: '1px solid var(--line)', transform: 'rotate(2deg)' }}/>
        </div>

        <div style={{ background: 'var(--paper)', paddingTop: 4, minHeight: '70%' }}>
          {/* Stats row */}
          <div style={{ padding: '18px 18px 6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { l: 'Cards', v: '204' },
              { l: 'Enchanted', v: '12' },
              { l: 'Released', v: 'Aug 23' },
            ].map(s => (
              <div key={s.l} style={{ background: 'var(--surface)', border: '1px solid var(--line)',
                                       borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{s.l}</div>
                <div className="serif" style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-.01em' }}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Chase cards */}
          <section style={{ padding: '18px 18px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                              color: 'var(--accent)', marginBottom: 3 }}>Chase cards</div>
                <h2 className="serif" style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.01em', margin: 0 }}>
                  Everyone's hunting
                </h2>
              </div>
            </div>
            <div className="if-scroll" style={{ display: 'flex', gap: 10, overflowX: 'auto',
                                                margin: '0 -18px', padding: '4px 18px 6px' }}>
              {CARDS.slice(0, 5).map((c, i) => (
                <div key={`chase-${i}`} style={{ position: 'relative', flexShrink: 0, width: 140 }}>
                  <Card card={c} size="normal" frame={frame} style={{ width: '100%' }}/>
                  <div style={{
                    position: 'absolute', top: 6, left: 6,
                    padding: '2px 6px', borderRadius: 999, fontSize: 9, fontWeight: 700,
                    letterSpacing: '.06em', textTransform: 'uppercase',
                    background: i < 2 ? 'linear-gradient(135deg, #F4B042, #A56FCF)' : 'rgba(15,10,5,.78)',
                    color: '#fff',
                  }}>
                    {i < 2 ? 'Enchanted' : 'Legendary'}
                  </div>
                </div>
              ))}
            </div>
            <a href="#" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              margin: '14px 0 0', padding: '10px 14px', fontSize: 12.5, fontWeight: 600,
              color: 'var(--ink)', textDecoration: 'none',
              border: '1px solid var(--line-strong)', borderRadius: 10,
              background: 'var(--surface)',
            }}>
              See all cards in this set
              <span aria-hidden style={{ fontSize: 14 }}>→</span>
            </a>
          </section>

          {/* Products */}
          <section style={{ padding: '18px 18px 8px' }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                            color: 'var(--accent)', marginBottom: 3 }}>What you can buy</div>
              <h2 className="serif" style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.01em', margin: 0 }}>
                Products
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { name: 'Booster pack', sub: '12 cards · 1 foil', grad: 'linear-gradient(160deg, #F4B042, #C77A1E)', icon: '◫' },
                { name: 'Booster box', sub: '24 packs · sealed', grad: 'linear-gradient(160deg, #A56FCF, #4F2A82)', icon: '☷' },
                { name: 'Starter deck', sub: '60 cards · 2 inks', grad: 'linear-gradient(160deg, #3B7BC4, #1F4880)', icon: '◧' },
                { name: 'Illumineer\u2019s Trove', sub: '8 packs + extras', grad: 'linear-gradient(160deg, #3D9F6A, #1E5C3D)', icon: '✦' },
              ].map(p => (
                <a key={p.name} href="#" style={{
                  display: 'block', textDecoration: 'none', color: 'inherit',
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden',
                }}>
                  <div style={{ height: 78, background: p.grad, display: 'grid', placeItems: 'center',
                                color: '#fff', fontSize: 36, fontWeight: 300 }}>
                    {p.icon}
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div className="serif" style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{p.sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Browse CTA */}
          <section style={{ padding: '18px 18px 24px' }}>
            <a href="#" style={{
              display: 'block', textDecoration: 'none', color: 'inherit',
              background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 14,
              padding: '16px 18px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                            color: 'var(--ink-3)', marginBottom: 4 }}>Discover</div>
              <h3 className="serif" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.01em', margin: '0 0 4px' }}>
                Browse all 204 cards
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: '0 0 10px', lineHeight: 1.45 }}>
                Open the encyclopedia with the {set.code} filter applied.
              </p>
              <div className="if-btn if-btn--primary" style={{ display: 'inline-flex', padding: '8px 14px', fontSize: 13 }}>
                Open encyclopedia →
              </div>
            </a>
          </section>
        </div>
      </div>
      <MobileTabBar active="cards"/>
    </MobileFrame>
  );
}

Object.assign(window, {
  NewsListingDesktop, NewsListingMobile, NewsArticleDesktop, NewsArticleMobile,
  SetPageDesktop, SetPageMobile, CardChip, NewsTileCard,
});
