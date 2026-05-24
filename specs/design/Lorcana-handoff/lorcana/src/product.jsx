// Inkfolk — Product detail (one purchasable item from a set: booster pack,
// box, starter deck, trove). Lives under /sets/{code}/products/{slug}.
// Two artboards: desktop 1280 + mobile 375.

const PRODUCT = {
  slug: 'first-chapter-booster-box',
  setCode: 'TFC',
  setName: 'The First Chapter',
  type: 'Booster box',
  title: 'The First Chapter · Booster Display',
  tagline: '24 booster packs · 288 cards · sealed display',
  art: 'linear-gradient(160deg, #A56FCF 0%, #6B3FA0 45%, #361A5E 100%)',
  icon: '☷',
  releaseDate: '23 Aug 2023',
  contents: [
    { label: 'Booster packs', value: '24' },
    { label: 'Cards per pack', value: '12' },
    { label: 'Foils per pack', value: '1' },
    { label: 'Rare or better', value: '1+' },
  ],
  pullRates: [
    { rarity: 'Common',    per: '6 per pack',     color: 'var(--rarity-common)' },
    { rarity: 'Uncommon',  per: '3 per pack',     color: 'var(--rarity-uncommon)' },
    { rarity: 'Rare',      per: '1–2 per pack',   color: 'var(--rarity-rare)' },
    { rarity: 'Super Rare',per: '1 in 6 packs',   color: 'var(--rarity-super)' },
    { rarity: 'Legendary', per: '1 in 24 packs',  color: 'var(--rarity-legendary)' },
    { rarity: 'Enchanted', per: '~1 in 1,200',    color: 'var(--ink-amber)' },
  ],
};

// Other products in the same set
const OTHER_PRODUCTS = [
  { slug: 'first-chapter-starter-amber-amethyst',  type: 'Starter deck',     title: 'Amber · Amethyst',   sub: '60 cards · 2 booster packs', art: 'linear-gradient(160deg, #F4B042 0%, #B07810 50%, #A56FCF 100%)', icon: '◧' },
  { slug: 'first-chapter-starter-emerald-ruby',    type: 'Starter deck',     title: 'Emerald · Ruby',     sub: '60 cards · 2 booster packs', art: 'linear-gradient(160deg, #3D9F6A 0%, #1F6E47 50%, #D14B4B 100%)', icon: '◧' },
  { slug: 'first-chapter-starter-sapphire-steel',  type: 'Starter deck',     title: 'Sapphire · Steel',   sub: '60 cards · 2 booster packs', art: 'linear-gradient(160deg, #3B7BC4 0%, #1F4F84 50%, #8C9AA3 100%)', icon: '◧' },
  { slug: 'first-chapter-illumineers-trove',       type: "Illumineer's Trove", title: "Illumineer's Trove", sub: '8 boosters + storage box',  art: 'linear-gradient(160deg, #C9A96A 0%, #8A6D2F 50%, #3D2914 100%)', icon: '✦' },
  { slug: 'first-chapter-booster-pack',            type: 'Single booster',   title: 'Single booster pack', sub: '12 cards · 1 foil',         art: 'linear-gradient(160deg, #A56FCF 0%, #6B3FA0 60%, #2A1747 100%)', icon: '☷' },
];

// ─── Pull-rate modal ────────────────────────────────────────
function PullRateModal({ p, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: 'color-mix(in oklab, #000 55%, transparent)',
        display: 'grid', placeItems: 'center', padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(560px, 100%)',
          background: 'var(--paper)',
          border: '1px solid var(--line)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-3)',
          maxHeight: '90%',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <header style={{
          padding: '20px 24px 14px',
          borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
                          textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>
              Per-pack distribution
            </div>
            <h2 className="serif" style={{
              fontSize: 22, fontWeight: 500, letterSpacing: '-.015em', margin: 0,
            }}>Approximate pull rates</h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 32, height: 32, border: '1px solid var(--line)', borderRadius: 999,
            background: 'transparent', color: 'var(--ink-2)', cursor: 'pointer',
            fontSize: 16, lineHeight: 1, flexShrink: 0,
          }}>×</button>
        </header>

        <div style={{ padding: 24, overflow: 'auto' }}>
          {/* Disclaimer */}
          <div style={{
            display: 'flex', gap: 12, padding: '12px 14px',
            background: 'var(--ink-amber-soft)',
            border: '1px solid color-mix(in oklab, var(--ink-amber) 35%, var(--line))',
            borderRadius: 10, marginBottom: 20,
          }}>
            <span style={{ fontSize: 14, lineHeight: 1, marginTop: 2, color: 'var(--ink-amber)' }}>⚠</span>
            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              These rates are <strong>not official</strong>. They're a community-aggregated
              estimate from openings reported by Inkfolk members. Real pack contents may vary —
              Ravensburger doesn't publish exact distributions.
            </p>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)',
                         borderRadius: 10, overflow: 'hidden' }}>
            {p.pullRates.map((r, i) => (
              <div key={r.rarity} style={{
                display: 'grid', gridTemplateColumns: '14px 1fr auto',
                gap: 14, alignItems: 'center', padding: '12px 16px',
                borderTop: i === 0 ? 0 : '1px solid var(--line)',
              }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: r.color }}/>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{r.rarity}</span>
                <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{r.per}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 14, lineHeight: 1.5 }}>
            Sample size: 14,328 packs · last updated 12 Apr 2026 · contribute your openings to
            improve this estimate.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProductHero({ p }) {
  return (
    <div style={{
      position: 'relative', aspectRatio: '4/5', borderRadius: 14, overflow: 'hidden',
      background: p.art, boxShadow: 'var(--shadow-3)',
      display: 'grid', placeItems: 'center', color: '#fff',
    }}>
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ fontSize: 140, lineHeight: 1, fontWeight: 300,
                       letterSpacing: '-.04em', opacity: .85,
                       textShadow: '0 8px 30px rgba(0,0,0,.3)' }}>{p.icon}</div>
        <div className="serif" style={{
          fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase',
          fontWeight: 600, marginTop: 18, opacity: .9,
        }}>{p.setCode} · {p.type}</div>
      </div>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                     background: 'linear-gradient(125deg, transparent 30%, rgba(255,255,255,.18) 50%, transparent 70%)',
                     mixBlendMode: 'overlay' }}/>
    </div>
  );
}

// ─── Other-product card (compact) ───────────────────────────
function OtherProductCard({ op, size = 'desktop' }) {
  const big = size === 'desktop';
  return (
    <a href="#" style={{
      display: 'block', textDecoration: 'none', color: 'inherit',
      background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div style={{
        aspectRatio: '4/5', background: op.art, position: 'relative',
        display: 'grid', placeItems: 'center', color: '#fff',
      }}>
        <span style={{ fontSize: big ? 56 : 42, fontWeight: 300, opacity: .9,
                        textShadow: '0 4px 18px rgba(0,0,0,.3)' }}>{op.icon}</span>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                       background: 'linear-gradient(125deg, transparent 35%, rgba(255,255,255,.15) 55%, transparent 75%)',
                       mixBlendMode: 'overlay' }}/>
      </div>
      <div style={{ padding: big ? '14px 16px' : '10px 12px' }}>
        <div style={{ fontSize: big ? 10 : 9, fontWeight: 700, letterSpacing: '.12em',
                       textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 4 }}>
          {op.type}
        </div>
        <div className="serif" style={{ fontSize: big ? 16 : 13.5, fontWeight: 600,
                                          letterSpacing: '-.01em', lineHeight: 1.15 }}>
          {op.title}
        </div>
        <div style={{ fontSize: big ? 12 : 10.5, color: 'var(--ink-3)', marginTop: 4 }}>
          {op.sub}
        </div>
      </div>
    </a>
  );
}

// ─── Desktop ────────────────────────────────────────────────
function ProductDetailDesktop({ frame = 'subtle' }) {
  const p = PRODUCT;
  const [pullsOpen, setPullsOpen] = React.useState(false);
  const possibleCards = CARDS.slice(0, 6);

  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto', position: 'relative' }}>
      <TopNavDesktop active="sets"/>

      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--line)', background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '14px 32px',
                       fontSize: 12.5, color: 'var(--ink-3)', display: 'flex', gap: 8 }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Sets</a>
          <span>›</span>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{p.setName}</a>
          <span>›</span>
          <span style={{ color: 'var(--ink-2)' }}>{p.type}</span>
        </div>
      </div>

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 32px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 56, alignItems: 'start' }}>
          {/* Left: hero */}
          <div>
            <ProductHero p={p}/>
          </div>

          {/* Right: meta */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
                           textTransform: 'uppercase', color: 'var(--accent)' }}>
              {p.setName} · Set № 01
            </div>
            <h1 className="serif" style={{ fontSize: 48, fontWeight: 500, letterSpacing: '-.025em',
                                            margin: '10px 0 14px', lineHeight: 1.02, textWrap: 'balance' }}>
              {p.title}
            </h1>
            <p style={{ fontSize: 17, color: 'var(--ink-2)', margin: '0 0 28px',
                         lineHeight: 1.5, fontFamily: 'var(--font-display)' }}>
              {p.tagline}
            </p>

            {/* Contents grid */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
                            textTransform: 'uppercase', color: 'var(--ink-3)', margin: '0 0 14px' }}>
                What's inside
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {p.contents.map(c => (
                  <div key={c.label} style={{
                    background: 'var(--surface)', border: '1px solid var(--line)',
                    borderRadius: 10, padding: '14px 16px',
                  }}>
                    <div className="serif" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-.01em' }}>
                      {c.value}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>
                      {c.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* See pull rates button */}
            <button
              onClick={() => setPullsOpen(true)}
              className="if-btn"
              style={{ padding: '11px 18px', fontSize: 13.5, marginBottom: 24 }}
            >
              See pull rates →
            </button>

            {/* Quick facts */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 18,
                           display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px',
                           fontSize: 13 }}>
              <div><span style={{ color: 'var(--ink-3)' }}>Released</span> · <strong>{p.releaseDate}</strong></div>
              <div><span style={{ color: 'var(--ink-3)' }}>Set code</span> · <strong>{p.setCode}</strong></div>
              <div><span style={{ color: 'var(--ink-3)' }}>SKU</span> · <strong>RVB-LCN-{p.setCode}-BD</strong></div>
              <div><span style={{ color: 'var(--ink-3)' }}>Product type</span> · <strong>{p.type}</strong></div>
            </div>
          </div>
        </div>

        {/* Cards you could pull */}
        <section style={{ marginTop: 72 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
                            color: 'var(--accent)', marginBottom: 6 }}>Selected highlights</div>
              <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-.02em', margin: 0 }}>
                Some cards you could pull
              </h2>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '8px 0 0', maxWidth: 540 }}>
                A small sampler of the chase cards drafters get excited about. The full set
                contains 204 cards across six inks.
              </p>
            </div>
            <a href="#" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              See full set checklist →
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
            {possibleCards.map(c => (
              <Card key={c.id} card={c} size="thumb" frame={frame}/>
            ))}
          </div>
        </section>

        {/* Other products in this set */}
        <section style={{ marginTop: 72 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
                            color: 'var(--accent)', marginBottom: 6 }}>Also in {p.setName}</div>
              <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-.02em', margin: 0 }}>
                Other products in this set
              </h2>
            </div>
            <a href="#" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              All products →
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {OTHER_PRODUCTS.map(op => (
              <OtherProductCard key={op.slug} op={op} size="desktop"/>
            ))}
          </div>
        </section>
      </main>

      <Footer compact/>

      {pullsOpen && <PullRateModal p={p} onClose={() => setPullsOpen(false)}/>}
    </div>
  );
}

// ─── Mobile ─────────────────────────────────────────────────
function ProductDetailMobile({ frame = 'subtle' }) {
  const p = PRODUCT;
  const [pullsOpen, setPullsOpen] = React.useState(false);
  const possibleCards = CARDS.slice(0, 4);

  return (
    <MobileFrame>
      <TopNavMobile back title="" action={
        <button style={{ width: 40, height: 40, border: 0, background: 'transparent',
                          display: 'grid', placeItems: 'center', color: 'var(--ink-2)' }}>♡</button>
      }/>
      <div className="if-scroll" style={{ height: 'calc(100% - 52px)', overflow: 'auto', paddingBottom: 32 }}>
        {/* Hero */}
        <div style={{ padding: '8px 18px 0' }}>
          <ProductHero p={p}/>
        </div>

        <div style={{ padding: '20px 18px 0' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                         textTransform: 'uppercase', color: 'var(--accent)' }}>
            {p.setName}
          </div>
          <h1 className="serif" style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-.02em',
                                          margin: '6px 0 8px', lineHeight: 1.08 }}>
            {p.title}
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.45 }}>
            {p.tagline}
          </p>
        </div>

        {/* Contents row */}
        <div style={{ padding: '20px 18px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {p.contents.map(c => (
              <div key={c.label} style={{
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 8, padding: '10px 6px', textAlign: 'center',
              }}>
                <div className="serif" style={{ fontSize: 18, fontWeight: 600 }}>{c.value}</div>
                <div style={{ fontSize: 9.5, color: 'var(--ink-3)', marginTop: 1,
                              lineHeight: 1.15 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* See pull rates */}
        <div style={{ padding: '18px 18px 0' }}>
          <button
            onClick={() => setPullsOpen(true)}
            className="if-btn"
            style={{ width: '100%', padding: '12px', fontSize: 13, justifyContent: 'center' }}
          >
            See pull rates →
          </button>
        </div>

        {/* Cards you could pull */}
        <section style={{ padding: '28px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                         textTransform: 'uppercase', color: 'var(--ink-3)', margin: 0 }}>
              Some cards you could pull
            </h3>
            <a href="#" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              See all →
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {possibleCards.map(c => (
              <Card key={c.id} card={c} size="thumb" frame={frame}/>
            ))}
          </div>
        </section>

        {/* Other products */}
        <section style={{ padding: '28px 0 0 18px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                         marginBottom: 12, paddingRight: 18 }}>
            <h3 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                         textTransform: 'uppercase', color: 'var(--ink-3)', margin: 0 }}>
              Also in this set
            </h3>
            <a href="#" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              All →
            </a>
          </div>
          <div style={{
            display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, paddingRight: 18,
            scrollSnapType: 'x mandatory',
          }}>
            {OTHER_PRODUCTS.map(op => (
              <div key={op.slug} style={{ flex: '0 0 140px', scrollSnapAlign: 'start' }}>
                <OtherProductCard op={op} size="mobile"/>
              </div>
            ))}
          </div>
        </section>
      </div>

      {pullsOpen && <PullRateModal p={p} onClose={() => setPullsOpen(false)}/>}
    </MobileFrame>
  );
}

Object.assign(window, { ProductDetailDesktop, ProductDetailMobile });
