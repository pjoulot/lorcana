// Inkfolk — Tokens + Components reference artboards
// Plain visual reference of the foundations so a developer / reviewer
// can scan colors, type, icons, card sizes, chips, etc.

function TokensSheet() {
  const swatchCols = (groups) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
      {groups.map(s => (
        <div key={s.name}>
          <div style={{ height: 84, borderRadius: 12, background: s.value,
                         border: '1px solid var(--line)' }}/>
          <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>{s.name}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.hex}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="if-screen" style={{ width: 1200, padding: 40, background: 'var(--paper)' }}>
      <header style={{ marginBottom: 32 }}>
        <Wordmark size={22}/>
        <h1 className="serif" style={{ fontSize: 42, fontWeight: 500, letterSpacing: '-.02em',
                                        margin: '20px 0 6px', lineHeight: 1.05 }}>
          Design tokens
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, maxWidth: 720 }}>
          The full token system used by every Inkfolk surface. Export as CSS variables or JSON; light mode shown.
        </p>
      </header>

      <section style={{ marginBottom: 36 }}>
        <SubHead title="Ink — the six game colors" sub="Accents only. Never the dominant page color."/>
        {swatchCols([
          { name: 'Amber',    value: 'var(--ink-amber)',    hex: '#F4B042' },
          { name: 'Amethyst', value: 'var(--ink-amethyst)', hex: '#A56FCF' },
          { name: 'Emerald',  value: 'var(--ink-emerald)',  hex: '#3D9F6A' },
          { name: 'Ruby',     value: 'var(--ink-ruby)',     hex: '#D14B4B' },
          { name: 'Sapphire', value: 'var(--ink-sapphire)', hex: '#3B7BC4' },
          { name: 'Steel',    value: 'var(--ink-steel)',    hex: '#8C9AA3' },
        ])}
        <div style={{ height: 14 }}/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
          {[
            { c: 'var(--ink-amber-soft)',    h: 'Amber · soft' },
            { c: 'var(--ink-amethyst-soft)', h: 'Amethyst · soft' },
            { c: 'var(--ink-emerald-soft)',  h: 'Emerald · soft' },
            { c: 'var(--ink-ruby-soft)',     h: 'Ruby · soft' },
            { c: 'var(--ink-sapphire-soft)', h: 'Sapphire · soft' },
            { c: 'var(--ink-steel-soft)',    h: 'Steel · soft' },
          ].map(s => (
            <div key={s.h}>
              <div style={{ height: 56, borderRadius: 10, background: s.c,
                             border: '1px solid var(--line)' }}/>
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-3)' }}>{s.h}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <SubHead title="Neutrals" sub="Warm off-white paper palette."/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 14 }}>
          {[
            { n: 'paper',       v: 'var(--paper)',       h: '#FAF6EF' },
            { n: 'paper-2',     v: 'var(--paper-2)',     h: '#F4EEE4' },
            { n: 'surface',     v: 'var(--surface)',     h: '#FFFFFF' },
            { n: 'line',        v: 'var(--line)',        h: '#E7DFD2' },
            { n: 'ink-3',       v: 'var(--ink-3)',       h: '#7B7160' },
            { n: 'ink-2',       v: 'var(--ink-2)',       h: '#4A4233' },
            { n: 'ink',         v: 'var(--ink)',         h: '#1F1A12' },
          ].map(s => (
            <div key={s.n}>
              <div style={{ height: 64, borderRadius: 10, background: s.v,
                             border: '1px solid var(--line)' }}/>
              <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600 }}>{s.n}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{s.h}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <SubHead title="Type" sub="Newsreader (display) · Inter Tight (UI) · JetBrains Mono (numeric, stats)."/>
        <div style={{ display: 'grid', gap: 14 }}>
          {[
            { tag: 'Display / H1', cls: 'serif', size: 56, weight: 500, sample: 'Every Lorcana card, at a glance.' },
            { tag: 'Display / H2', cls: 'serif', size: 36, weight: 500, sample: 'Reign of Jafar — full set list' },
            { tag: 'Display / H3', cls: 'serif', size: 24, weight: 600, sample: 'Popular cards this week' },
            { tag: 'Body / Large', cls: '',      size: 17, weight: 400, sample: 'A fan-made, ad-free database for searching cards, planning decks, and drafting with friends.' },
            { tag: 'Body / Default', cls: '',    size: 14, weight: 400, sample: 'When you play this character, you may remove up to 2 damage from each of your Amber characters.' },
            { tag: 'Caption',      cls: '',      size: 12, weight: 500, sample: 'Margot Lemaire · 8 May · 12 min read' },
            { tag: 'Mono / Stat',  cls: 'mono',  size: 16, weight: 600, sample: '5 / 5 · 3 lore' },
          ].map(r => (
            <div key={r.tag} style={{
              display: 'grid', gridTemplateColumns: '160px 60px 1fr', gap: 20, alignItems: 'baseline',
              padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10,
            }}>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>{r.tag}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{r.size}/{r.weight}</div>
              <div className={r.cls} style={{ fontSize: r.size, fontWeight: r.weight, lineHeight: 1.15, letterSpacing: r.cls === 'serif' ? '-.02em' : '-.005em' }}>
                {r.sample}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <SubHead title="Iconography — game glyphs" sub="Hand-drawn SVG approximations of Lorcana's stat symbols. Render inline at any size; color via currentColor."/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
          {[
            { n: 'Ink (drop)',   c: <InkDrop size={36} color="var(--ink-amber)"/>, u: 'Cost / resource' },
            { n: 'Cost (gem)',   c: <CostGem size={36} color="var(--ink-ruby)" style={{ color: 'var(--ink-ruby)' }}/>, u: 'Cost on card frames' },
            { n: 'Strength',     c: <Strength size={36}/>, u: 'Character combat' },
            { n: 'Willpower',    c: <Willpower size={36}/>, u: 'Character defense' },
            { n: 'Lore',         c: <Lore size={36} style={{ color: 'var(--accent)' }}/>, u: 'Win condition' },
            { n: 'Exert',        c: <Exert size={36}/>, u: 'Tap action' },
          ].map(g => (
            <div key={g.n} style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 10, padding: '18px 14px', textAlign: 'center',
            }}>
              <div style={{ display: 'grid', placeItems: 'center', height: 56, color: 'var(--ink)' }}>{g.c}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 10 }}>{g.n}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{g.u}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginTop: 14 }}>
          {[
            { n: 'Character', c: <TypeCharacter size={26}/> },
            { n: 'Action',    c: <TypeAction size={26}/> },
            { n: 'Item',      c: <TypeItem size={26}/> },
            { n: 'Location',  c: <TypeLocation size={26}/> },
            { n: 'Song',      c: <TypeSong size={26}/> },
          ].map(g => (
            <div key={g.n} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--paper-2)', borderRadius: 10, padding: '12px 16px',
            }}>
              <div style={{ color: 'var(--accent)' }}>{g.c}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{g.n}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Card type</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SubHead title="Radii, shadows, spacing" sub="Scale tightly — six radius steps, three shadow levels."/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[6, 10, 14, 20].map((r, i) => (
            <div key={r} style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: r,
              height: 88, display: 'grid', placeItems: 'center',
              boxShadow: i === 0 ? 'var(--shadow-1)' : i === 1 ? 'var(--shadow-2)' : i === 2 ? 'var(--shadow-3)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>r-{i+1}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{r}px</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SubHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 className="serif" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.01em', margin: '0 0 4px' }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0, lineHeight: 1.4 }}>{sub}</p>}
    </div>
  );
}

function ComponentsSheet() {
  return (
    <div className="if-screen" style={{ width: 1200, padding: 40, background: 'var(--paper)' }}>
      <header style={{ marginBottom: 32 }}>
        <Wordmark size={22}/>
        <h1 className="serif" style={{ fontSize: 42, fontWeight: 500, letterSpacing: '-.02em',
                                        margin: '20px 0 6px', lineHeight: 1.05 }}>
          Components
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, maxWidth: 720 }}>
          The atoms used across every screen. The card component leads — everything else stays out of its way.
        </p>
      </header>

      {/* Cards — three sizes */}
      <section style={{ marginBottom: 36 }}>
        <SubHead title="Card · three sizes" sub="Thumb (110w) for dense grids and lists · Normal (220w) is the default · Large (320w+) on the card detail page. Cost top-left, ink swatch top-right, name + stats at the bottom. Rare-and-up gets a foil overlay."/>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, padding: '14px 18px',
                       background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <Card card={CARDS[0]} size="thumb" frame="subtle"/>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8 }}>thumb · 110×154</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Card card={CARDS[0]} size="normal" frame="subtle"/>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8 }}>normal · 220×308</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Card card={CARDS[0]} size="large" frame="subtle"/>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8 }}>large · 320×448</div>
          </div>
        </div>
      </section>

      {/* Card frame treatments */}
      <section style={{ marginBottom: 36 }}>
        <SubHead title="Card frame · three treatments" sub="The 'frame' tweak controls whether cards get no border, a subtle one, or a rarity-tinted stroke."/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { f: 'none', label: 'None', sub: 'Pure image. Cleanest, but rarity gets harder to scan.' },
            { f: 'subtle', label: 'Subtle', sub: '1px hairline + tiny drop shadow. The default.' },
            { f: 'rarity', label: 'Rarity-tinted', sub: 'Stroke takes the rarity color. Most scannable.' },
          ].map(t => (
            <div key={t.f} style={{ background: 'var(--surface)', border: '1px solid var(--line)',
                                     borderRadius: 14, padding: '20px 18px', textAlign: 'center' }}>
              <Card card={CARDS[1 % CARDS.length]} size="normal" frame={t.f}/>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 14 }}>{t.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.4 }}>{t.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* List row + Chips */}
      <section style={{ marginBottom: 36, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        <div>
          <SubHead title="Card list row" sub="Alternative to grid view in the encyclopedia."/>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)',
                         borderRadius: 12, overflow: 'hidden' }}>
            {CARDS.slice(0, 4).map(c => <CardListRow key={c.id} card={c}/>)}
          </div>
        </div>
        <div>
          <SubHead title="Chips + facets" sub="Filter chips, active state, ink swatch chips."/>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            <span className="if-chip">Type</span>
            <span className="if-chip">Rarity</span>
            <span className="if-chip" style={{ background: 'var(--accent-soft)', borderColor: 'transparent', color: 'var(--accent-ink)', fontWeight: 600 }}>
              Ink: Ruby <Close size={11}/>
            </span>
            <span className="if-chip" style={{ background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)', fontWeight: 600 }}>
              <Filter size={12}/> 4 active
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {Object.entries(INK).map(([k, v]) => (
              <span key={k} className="if-chip">
                <span style={{ width: 9, height: 9, borderRadius: 999, background: v.c }}/>
                {v.name}
              </span>
            ))}
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)',
                         borderRadius: 12, padding: '12px 16px' }}>
            <FacetCheck label="Common" count={480} checked={false} swatch="var(--rarity-common)"/>
            <FacetCheck label="Rare" count={312} checked={true} swatch="var(--rarity-rare)"/>
            <FacetCheck label="Legendary" count={84} checked={true} swatch="var(--rarity-legendary)"/>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section style={{ marginBottom: 36 }}>
        <SubHead title="Buttons" sub="Three weights — default, primary (ink), accent (amber-ink). Sized via padding; corners are pill."/>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
                       padding: '20px 22px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12 }}>
          <button className="if-btn">Cancel</button>
          <button className="if-btn if-btn--primary">Save changes</button>
          <button className="if-btn if-btn--accent">Start a draft</button>
          <button className="if-btn" style={{ padding: '8px 12px', fontSize: 13 }}>
            <Heart size={14}/> Save
          </button>
          <button className="if-btn" disabled style={{ opacity: .4, cursor: 'not-allowed' }}>Disabled</button>
        </div>
      </section>

      {/* Rarity gauge */}
      <section>
        <SubHead title="Rarity indicator" sub="Used in card thumbnails and list rows. Letter on list, dot on thumb, color on frame."/>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {Object.entries(RARITY).map(([k, r]) => (
            <div key={k} style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center',
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 999,
                background: r.enchanted ? 'var(--rarity-enchanted)' : r.color,
                border: '1.5px solid #fff', boxShadow: '0 0 0 1px var(--line)',
              }}/>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.full}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{r.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { TokensSheet, ComponentsSheet });
