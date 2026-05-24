// Inkfolk — shared chrome
// TopNav (mobile + desktop), MobileTabBar, Footer with disclaimer

// ─── Brand mark ────────────────────────────────────────────
// Stylised wordmark: an inkwell glyph + "inkfolk" in serif.
// Original — no Disney/Ravensburger marks.
function Wordmark({ size = 18, mono = false }) {
  const c = mono ? 'var(--ink)' : 'var(--accent)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, lineHeight: 1 }}>
      <svg width={size + 4} height={size + 4} viewBox="0 0 28 28" fill="none">
        {/* Inkwell silhouette */}
        <path d="M5 14c0-3 2-5 5-5h8c3 0 5 2 5 5v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-6Z"
              fill={c}/>
        <ellipse cx="14" cy="9" rx="6" ry="1.4" fill={c} opacity=".5"/>
        {/* Quill stroke */}
        <path d="M15 9c1-3 4-6 7-7-1 3-2 5-3 6" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      </svg>
      <span className="serif" style={{
        fontSize: size, fontWeight: 600, letterSpacing: '-0.02em',
        color: 'var(--ink)',
      }}>
        inkfolk
      </span>
    </div>
  );
}

// ─── Desktop top nav ───────────────────────────────────────
function TopNavDesktop({ active = 'home', searchValue, lang = 'EN' }) {
  const links = [
    { id: 'cards', label: 'Cards' },
    { id: 'sets',  label: 'Sets' },
    { id: 'news',  label: 'News' },
    { id: 'draft', label: 'Draft' },
    { id: 'about', label: 'About' },
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 5,
      height: 64,
      background: 'color-mix(in oklab, var(--paper) 86%, transparent)',
      backdropFilter: 'blur(10px) saturate(1.2)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--line)',
      display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center',
      padding: '0 32px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Wordmark size={20}/>
        <nav style={{ display: 'flex', gap: 4 }}>
          {links.map(l => (
            <a key={l.id} href="#" style={{
              fontSize: 14, fontWeight: 500, color: l.id === active ? 'var(--ink)' : 'var(--ink-3)',
              padding: '7px 10px', borderRadius: 8, textDecoration: 'none',
              background: l.id === active ? 'var(--paper-2)' : 'transparent',
              position: 'relative',
            }}>
              {l.label}
              {l.id === active && (
                <span style={{
                  position: 'absolute', left: 10, right: 10, bottom: -1, height: 2,
                  background: 'var(--accent)', borderRadius: 2,
                }}/>
              )}
            </a>
          ))}
        </nav>
      </div>
      {/* Big search */}
      <label style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 999, padding: '9px 14px',
        maxWidth: 520, width: '100%', justifySelf: 'center',
        color: 'var(--ink-3)',
        boxShadow: 'var(--shadow-1)',
      }}>
        <Search size={16}/>
        <input
          defaultValue={searchValue || ''}
          placeholder="Search cards, sets, abilities — try “type:character ink:ruby cost<=3”"
          style={{
            border: 0, outline: 0, background: 'transparent', flex: 1,
            font: '14px var(--font-ui)', color: 'var(--ink)',
          }}
        />
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)',
          background: 'var(--paper-2)', padding: '2px 5px', borderRadius: 4 }}>⌘ K</span>
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="if-btn" style={{ padding: '8px 12px' }}>
          <Globe size={14}/> {lang}
        </button>
        <button className="if-btn if-btn--primary" style={{ padding: '8px 14px' }}>
          Start a draft
        </button>
      </div>
    </header>
  );
}

// ─── Mobile top nav ────────────────────────────────────────
function TopNavMobile({ title, back, action }) {
  return (
    <header style={{
      height: 52, position: 'sticky', top: 0, zIndex: 5,
      background: 'color-mix(in oklab, var(--paper) 88%, transparent)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--line)',
      display: 'grid', gridTemplateColumns: '40px 1fr 40px',
      alignItems: 'center', padding: '0 8px',
    }}>
      <div>
        {back ? (
          <button style={{
            width: 40, height: 40, border: 0, background: 'transparent',
            display: 'grid', placeItems: 'center', borderRadius: 999, cursor: 'pointer',
            color: 'var(--ink)',
          }}>
            <ChevR size={20} style={{ transform: 'rotate(180deg)' }}/>
          </button>
        ) : (
          <div style={{ paddingLeft: 8 }}><Wordmark size={15}/></div>
        )}
      </div>
      <div className="serif" style={{
        textAlign: 'center', fontSize: 15, fontWeight: 600,
        letterSpacing: '-.01em',
      }}>{title || ''}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {action || (
          <button style={{
            width: 40, height: 40, border: 0, background: 'transparent',
            display: 'grid', placeItems: 'center', borderRadius: 999, cursor: 'pointer',
            color: 'var(--ink)',
          }}>
            <Search size={18}/>
          </button>
        )}
      </div>
    </header>
  );
}

// ─── Mobile bottom tab bar ─────────────────────────────────
function MobileTabBar({ active = 'home' }) {
  const tabs = [
    { id: 'home',  label: 'Home',     icon: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 11 12 3l9 8v9a2 2 0 0 1-2 2h-4v-7H10v7H6a2 2 0 0 1-2-2v-9z" stroke="currentColor" strokeWidth="1.8" fill={active === 'home' ? 'currentColor' : 'none'} fillOpacity=".12"/></svg> },
    { id: 'cards', label: 'Cards',    icon: (s) => <Grid size={s}/> },
    { id: 'news',  label: 'News',     icon: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 9h10M7 13h10M7 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { id: 'draft', label: 'Draft',    icon: (s) => <Sparkle size={s}/> },
    { id: 'more',  label: 'More',     icon: (s) => <Menu size={s}/> },
  ];
  return (
    <nav style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4,
      background: 'color-mix(in oklab, var(--paper) 92%, transparent)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--line)',
      paddingBottom: 18,
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <button key={t.id} style={{
            padding: '8px 0 6px', border: 0, background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: isActive ? 'var(--ink)' : 'var(--ink-3)',
          }}>
            {t.icon(22)}
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 500, letterSpacing: '.01em' }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Footer ────────────────────────────────────────────────
function Footer({ compact }) {
  return (
    <footer style={{
      background: 'var(--paper-2)',
      borderTop: '1px solid var(--line)',
      padding: compact ? '24px 20px 28px' : '40px 32px 28px',
      color: 'var(--ink-3)',
    }}>
      {!compact && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
          marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid var(--line)',
        }}>
          <div>
            <Wordmark size={18}/>
            <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.5, maxWidth: 240 }}>
              A fan project by hobbyists. No ads, no analytics, no paywalls — ever.
            </p>
          </div>
          {[
            { title: 'Cards', links: ['Encyclopedia','Advanced search','Recently spoiled','Browse by set'] },
            { title: 'Draft', links: ['Quick start','How it works','Past drafts','Discord help'] },
            { title: 'About', links: ['Who we are','Roadmap','Privacy','Legal'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)',
                            letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" style={{ fontSize: 13, color: 'var(--ink-2)', textDecoration: 'none' }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 12, lineHeight: 1.5,
      }}>
        <p style={{ margin: 0, flex: '1 1 320px', maxWidth: 720 }}>
          This site is an unofficial, non-commercial fan project and is not published,
          endorsed, or specifically approved by Disney or Ravensburger. Card images
          used under Ravensburger's Community Code Policy.
        </p>
        <div style={{ display: 'flex', gap: 18 }}>
          <span>EN · FR</span>
          <span>v0.3 · {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Mobile-frame wrapper ──────────────────────────────────
// Wraps any screen in a rounded 375×812 phone-like container with proper
// status-bar suggestion at the top.
function MobileFrame({ children, statusbarTheme = 'light' }) {
  const fg = statusbarTheme === 'dark' ? '#fff' : '#1F1A12';
  return (
    <div className="if-mobile-frame if-screen" style={{
      background: 'var(--paper)',
    }}>
      {/* Status bar */}
      <div style={{
        height: 44, padding: '0 22px 0 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: fg, fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
        position: 'relative', zIndex: 6,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {/* Signal */}
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
          {/* Wifi */}
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M3.5 7.5a6 6 0 0 1 9 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M.5 4.5a10 10 0 0 1 15 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
          {/* Battery */}
          <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor"/><rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor"/><rect x="23.5" y="4" width="2" height="4" rx="1" fill="currentColor"/></svg>
        </div>
      </div>
      {children}
      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 6, left: 0, right: 0,
        display: 'grid', placeItems: 'center', zIndex: 6, pointerEvents: 'none',
      }}>
        <div style={{ width: 134, height: 5, borderRadius: 999,
          background: statusbarTheme === 'dark' ? 'rgba(255,255,255,.6)' : 'rgba(31,26,18,.4)' }}/>
      </div>
    </div>
  );
}

Object.assign(window, {
  Wordmark, TopNavDesktop, TopNavMobile, MobileTabBar, Footer, MobileFrame,
});
