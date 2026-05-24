// Inkfolk — Card detail screens (mobile + desktop)
// Anchored to one hero card. Stats panel, rules text with inline icons,
// flavor text, set + collector number, illustrator, where-to-buy,
// related news, related cards.

const HERO_CARD = CARDS.find(c => c.id === 'mickey-brave-tailor') || CARDS[0];

// ─── Inline rules text with iconography ──────────────────
// Render the rules text. Tokens:
//   {ink}    -> ink drop
//   {exert}  -> exert arrow
//   {lore}   -> lore diamond
//   {strength} -> strength burst
//   {willpower} -> willpower shield
//   **bold** -> bold
function RulesText({ text, size = 15 }) {
  const TOK = {
    ink: <InkDrop size={size}/>,
    exert: <Exert size={size}/>,
    lore: <Lore size={size}/>,
    strength: <Strength size={size}/>,
    willpower: <Willpower size={size}/>,
  };
  const parts = text.split(/(\{[a-z]+\}|\*\*[^*]+\*\*)/g);
  return (
    <span style={{ lineHeight: 1.55 }}>
      {parts.map((p, i) => {
        if (!p) return null;
        const m = p.match(/^\{([a-z]+)\}$/);
        if (m && TOK[m[1]]) {
          return (
            <span key={i} style={{ display: 'inline-flex', verticalAlign: 'middle',
                                    transform: 'translateY(-1px)', margin: '0 1px' }}>
              {TOK[m[1]]}
            </span>
          );
        }
        const b = p.match(/^\*\*([^*]+)\*\*$/);
        if (b) return <strong key={i}>{b[1]}</strong>;
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </span>
  );
}

// Rules text for Mickey Mouse — Brave Little Tailor (fan-archive style flavor;
// shaped so the inline icons get to show.)
const MICKEY_RULES = [
  { kind: 'keyword', name: 'Evasive', body: 'Only characters with Evasive can challenge this character.' },
  { kind: 'ability', name: 'AND TWO FOR TEA!', body: 'When you play this character, you may deal 2 damage to chosen damaged character.' },
  { kind: 'rules', body: 'While this character is at a location, gain {lore} {lore} {lore} at the start of your turn instead of the location\u2019s normal lore.' },
];
const MICKEY_FLAVOR = '"You\u2019d be amazed at how much trouble a brave tailor can find."';
const MICKEY_ILLUSTRATOR = 'Matthew Oates';

function StatBlock({ icon, value, label }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '34px 1fr', gridTemplateRows: 'auto auto',
      gap: '2px 12px', alignItems: 'center', padding: '14px 0',
    }}>
      <div style={{ gridRow: '1 / span 2', display: 'grid', placeItems: 'center',
                     width: 34, height: 34, color: 'var(--ink-2)' }}>
        {icon}
      </div>
      <div className="mono" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em',
                     textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between',
                   padding: '10px 0', borderTop: '1px solid var(--line)', fontSize: 13 }}>
      <span style={{ color: 'var(--ink-3)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{value}</span>
    </div>
  );
}

// ─── Card detail — Desktop ─────────────────────────────────
function CardDetailDesktop({ frame = 'subtle' }) {
  const c = HERO_CARD;
  const ink = INK[c.ink];
  const rarity = RARITY[c.rarity];

  // Related cards = same ink, different cards
  const related = CARDS.filter(x => x.ink === c.ink && x.id !== c.id).slice(0, 6);

  return (
    <div className="if-screen if-scroll" style={{ width: 1280, height: '100%', overflow: 'auto' }}>
      <TopNavDesktop active="cards"/>

      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--line)', background: 'var(--paper-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 32px',
                       display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-3)' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cards</a>
          <Chevron size={11}/>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>The First Chapter</a>
          <Chevron size={11}/>
          <span style={{ color: 'var(--ink-2)' }}>Mickey Mouse — Brave Little Tailor</span>
          <div style={{ flex: 1 }}/>
          <button className="if-btn" style={{ padding: '4px 10px', fontSize: 12 }}><Chevron size={11} dir="left"/> Prev</button>
          <button className="if-btn" style={{ padding: '4px 10px', fontSize: 12 }}>Next <Chevron size={11}/></button>
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 48px',
                      display: 'grid', gridTemplateColumns: '380px 1fr', gap: 56, alignItems: 'flex-start' }}>
        {/* Card column */}
        <aside style={{ position: 'sticky', top: 88 }}>
          <Card card={c} size="large" frame={frame} style={{ width: '100%', height: 'auto', aspectRatio: '5/7' }}/>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="if-btn if-btn--primary" style={{ flex: 1, justifyContent: 'center' }}>
              <Heart size={14}/> Save to collection
            </button>
            <button className="if-btn" title="Copy link">
              <Link size={14}/>
            </button>
            <button className="if-btn" title="Share">
              <Share size={14}/>
            </button>
          </div>

          {/* Where to buy */}
          <div style={{ marginTop: 18, background: 'var(--surface)', border: '1px solid var(--line)',
                         borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em',
                           textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
              Where to buy
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { name: 'TCGplayer', price: '$24.50', stock: '38 listings' },
                { name: 'Cardmarket (EU)', price: '€21.80', stock: '52 listings' },
                { name: 'CardKingdom', price: '$28.99', stock: 'In stock' },
              ].map(s => (
                <a key={s.name} href="#" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 10px', borderRadius: 8, background: 'var(--paper-2)',
                  textDecoration: 'none', color: 'inherit', fontSize: 13,
                }}>
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mono" style={{ fontWeight: 700 }}>{s.price}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.stock}</span>
                    <Chevron size={11}/>
                  </span>
                </a>
              ))}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 10, lineHeight: 1.4 }}>
              Inkfolk receives no commission. Prices via partner APIs.
            </div>
          </div>
        </aside>

        {/* Detail column */}
        <div>
          {/* Name + chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span className="if-chip" style={{
              background: ink.softer, borderColor: 'transparent', color: ink.deep,
              fontWeight: 600, fontSize: 12,
            }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: ink.c }}/>
              {ink.name}
            </span>
            <span className="if-chip" style={{ fontSize: 12 }}>{c.type}</span>
            <span className="if-chip" style={{ fontSize: 12 }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: `var(--rarity-${c.rarity})` }}/>
              {rarity.full}
            </span>
            {(c.cls || []).map(cls => (
              <span key={cls} className="if-chip" style={{ fontSize: 12, background: 'transparent' }}>{cls}</span>
            ))}
          </div>
          <h1 className="serif" style={{ fontSize: 52, fontWeight: 500, letterSpacing: '-.025em',
                                          margin: '0 0 4px', lineHeight: 1.02 }}>
            {c.name}
          </h1>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, fontStyle: 'italic',
                                          color: 'var(--ink-3)', margin: 0, letterSpacing: '-.005em' }}>
            {c.subtitle}
          </h2>

          {/* Stat strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
            marginTop: 28, padding: '0 24px',
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14,
          }}>
            <StatBlock icon={<CostGem size={26} color={ink.c}/>} value={c.cost} label="Cost"/>
            <div style={{ borderLeft: '1px solid var(--line)' }}>
              <StatBlock icon={<Strength size={24}/>} value={c.strength} label="Strength"/>
            </div>
            <div style={{ borderLeft: '1px solid var(--line)' }}>
              <StatBlock icon={<Willpower size={24}/>} value={c.willpower} label="Willpower"/>
            </div>
            <div style={{ borderLeft: '1px solid var(--line)' }}>
              <StatBlock icon={<Lore size={24} style={{ color: 'var(--accent)' }}/>} value={c.lore} label="Lore"/>
            </div>
          </div>

          {/* Rules */}
          <section style={{ marginTop: 32 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em',
                           textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
              Rules text
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)',
                           borderRadius: 14, padding: '22px 26px',
                           fontFamily: 'var(--font-display)', fontSize: 17, lineHeight: 1.5 }}>
              {MICKEY_RULES.map((r, i) => (
                <div key={i} style={{ marginBottom: i === MICKEY_RULES.length - 1 ? 0 : 14 }}>
                  {r.kind === 'keyword' && (
                    <div>
                      <strong style={{ color: 'var(--ink)' }}>{r.name}</strong>{' '}
                      <span style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>({r.body})</span>
                    </div>
                  )}
                  {r.kind === 'ability' && (
                    <div>
                      <span style={{
                        display: 'inline-block', padding: '2px 9px', borderRadius: 999,
                        background: ink.softer, color: ink.deep, fontWeight: 700,
                        fontSize: 11, letterSpacing: '.08em', marginRight: 8, verticalAlign: '2px',
                      }}>{r.name}</span>
                      <RulesText text={r.body} size={16}/>
                    </div>
                  )}
                  {r.kind === 'rules' && <RulesText text={r.body} size={16}/>}
                </div>
              ))}

              {/* Flavor */}
              <div style={{
                marginTop: 18, paddingTop: 16, borderTop: '1px dashed var(--line)',
                fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 15,
              }}>
                {MICKEY_FLAVOR}
              </div>
            </div>
          </section>

          {/* Set + collector + meta */}
          <section style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)',
                           borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em',
                             textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                Printing details
              </div>
              <MetaRow label="Set" value="The First Chapter"/>
              <MetaRow label="Collector №" value="151 / 204"/>
              <MetaRow label="Released" value="Aug 18, 2023"/>
              <MetaRow label="Languages" value="EN · FR · DE · IT · JP"/>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)',
                           borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em',
                             textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                Credits
              </div>
              <MetaRow label="Illustrator" value={MICKEY_ILLUSTRATOR}/>
              <MetaRow label="Inkable" value="Yes"/>
              <MetaRow label="Reprints" value="2 — Foiled, Enchanted"/>
              <MetaRow label="Format" value="Standard · Infinity"/>
            </div>
          </section>

          {/* Variants */}
          <section style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.01em', margin: 0 }}>
                Printings
              </h3>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>3 variants in this set</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { label: 'Standard',   sub: 'Common pull',    swatch: 'matte',     selected: true },
                { label: 'Cold foil',  sub: '1 in 24 packs',  swatch: 'cold' },
                { label: 'Enchanted',  sub: '~1 in 1,000',    swatch: 'rainbow' },
              ].map(v => (
                <button key={v.label} style={{
                  display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  border: '1px solid ' + (v.selected ? 'var(--ink)' : 'var(--line-strong)'),
                  background: v.selected ? 'var(--surface)' : 'transparent',
                  boxShadow: v.selected ? 'var(--shadow-1)' : 'none',
                  font: 'inherit', color: 'var(--ink)',
                }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                    border: '1px solid var(--line-strong)',
                    background: v.swatch === 'matte'
                      ? 'var(--paper-2)'
                      : v.swatch === 'cold'
                        ? 'linear-gradient(125deg, #DCE3EB 0%, #FFFFFF 45%, #B9C5D3 55%, #ECEFF3 100%)'
                        : 'linear-gradient(125deg, #F4B042, #A56FCF 45%, #3B7BC4 75%, #3D9F6A)',
                  }}/>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: 'block', fontSize: 13, fontWeight: 600, letterSpacing: '-.005em' }}>{v.label}</span>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{v.sub}</span>
                  </span>
                  {v.selected && (
                    <span aria-hidden style={{
                      width: 16, height: 16, borderRadius: 999, background: 'var(--ink)',
                      color: 'var(--paper)', fontSize: 10, display: 'grid', placeItems: 'center',
                      flexShrink: 0,
                    }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Continue in the set */}
          <section style={{ marginTop: 36 }}>
            <a href="#" style={{
              display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, alignItems: 'center',
              textDecoration: 'none', color: 'inherit',
              background: 'linear-gradient(135deg, var(--ink-amber-soft), var(--ink-amethyst-soft))',
              border: '1px solid var(--line)', borderRadius: 16, padding: 24,
            }}>
              <div className="serif" style={{
                fontSize: 72, fontWeight: 500, color: '#fff', textAlign: 'center', lineHeight: 1,
                letterSpacing: '-.04em', textShadow: '0 2px 8px rgba(0,0,0,.25)',
              }}>①</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                              color: 'var(--ink-2)', marginBottom: 4 }}>From the set</div>
                <h3 className="serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-.02em',
                                                margin: '0 0 6px', lineHeight: 1.1 }}>
                  The First Chapter
                </h3>
                <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>
                  204 cards · Aug 2023 · The original Lorcana expansion
                </div>
              </div>
              <div className="if-btn if-btn--primary">Browse set →</div>
            </a>
          </section>
        </div>
      </main>

      <Footer compact/>
    </div>
  );
}

// ─── Card detail — Mobile ──────────────────────────────────
function CardDetailMobile({ frame = 'subtle' }) {
  const c = HERO_CARD;
  const ink = INK[c.ink];
  const rarity = RARITY[c.rarity];
  const related = CARDS.filter(x => x.ink === c.ink && x.id !== c.id).slice(0, 6);

  return (
    <MobileFrame>
      {/* Ink-tinted gradient backdrop */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 360, zIndex: 0,
        background: `linear-gradient(180deg, ${ink.softer} 0%, var(--paper) 78%)`,
      }}/>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <TopNavMobile back title="" action={
          <div style={{ display: 'flex' }}>
            <button style={{ width: 40, height: 40, border: 0, background: 'transparent',
                              display: 'grid', placeItems: 'center', color: 'var(--ink-2)' }}>
              <Share size={18}/>
            </button>
            <button style={{ width: 40, height: 40, border: 0, background: 'transparent',
                              display: 'grid', placeItems: 'center', color: 'var(--ink-2)' }}>
              <Heart size={18}/>
            </button>
          </div>
        }/>
      </div>

      <div className="if-scroll" style={{
        position: 'absolute', top: 44, left: 0, right: 0, bottom: 0,
        overflow: 'auto', paddingBottom: 90, zIndex: 2,
      }}>
        {/* Hero card */}
        <div style={{ padding: '8px 32px 16px', display: 'grid', placeItems: 'center' }}>
          <Card card={c} size="large" frame={frame} style={{
            width: 240, height: 336, transform: 'rotate(-1.5deg)',
            boxShadow: '0 18px 40px rgba(35,25,10,.18)',
          }}/>
        </div>

        {/* Chip strip */}
        <div className="if-scroll" style={{
          display: 'flex', gap: 6, padding: '0 16px 12px',
          overflowX: 'auto',
        }}>
          <span className="if-chip" style={{
            flexShrink: 0, background: ink.softer, borderColor: 'transparent',
            color: ink.deep, fontWeight: 600,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: ink.c }}/>
            {ink.name}
          </span>
          <span className="if-chip" style={{ flexShrink: 0 }}>{c.type}</span>
          <span className="if-chip" style={{ flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: `var(--rarity-${c.rarity})` }}/>
            {rarity.full}
          </span>
          {(c.cls || []).map(cls => (
            <span key={cls} className="if-chip" style={{ flexShrink: 0 }}>{cls}</span>
          ))}
        </div>

        {/* Title */}
        <div style={{ padding: '0 18px 6px' }}>
          <h1 className="serif" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-.02em',
                                          margin: '0 0 2px', lineHeight: 1.05 }}>
            {c.name}
          </h1>
          <h2 className="serif" style={{ fontSize: 17, fontWeight: 400, fontStyle: 'italic',
                                          color: 'var(--ink-3)', margin: 0, letterSpacing: '-.005em' }}>
            {c.subtitle}
          </h2>
        </div>

        {/* Stat strip */}
        <div style={{ padding: '14px 18px' }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '8px 0', textAlign: 'center',
          }}>
            {[
              { i: <CostGem size={20} color={ink.c}/>, v: c.cost, l: 'Cost' },
              { i: <Strength size={18}/>, v: c.strength, l: 'STR' },
              { i: <Willpower size={18}/>, v: c.willpower, l: 'WIL' },
              { i: <Lore size={18} style={{ color: 'var(--accent)' }}/>, v: c.lore, l: 'Lore' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '4px 0',
                                     borderLeft: i === 0 ? 'none' : '1px solid var(--line)' }}>
                <div style={{ display: 'grid', placeItems: 'center', height: 22, color: 'var(--ink-2)' }}>
                  {s.i}
                </div>
                <div className="mono" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1, marginTop: 4 }}>{s.v}</div>
                <div style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '.06em',
                               textTransform: 'uppercase', fontWeight: 600, marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div style={{ padding: '8px 18px 0' }}>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em',
                         textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
            Rules text
          </div>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12,
            padding: '14px 16px', fontFamily: 'var(--font-display)', fontSize: 14.5, lineHeight: 1.5,
          }}>
            {MICKEY_RULES.map((r, i) => (
              <div key={i} style={{ marginBottom: i === MICKEY_RULES.length - 1 ? 0 : 10 }}>
                {r.kind === 'keyword' && (
                  <div>
                    <strong>{r.name}</strong>{' '}
                    <span style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>({r.body})</span>
                  </div>
                )}
                {r.kind === 'ability' && (
                  <div>
                    <span style={{
                      display: 'inline-block', padding: '1px 7px', borderRadius: 999,
                      background: ink.softer, color: ink.deep, fontWeight: 700,
                      fontSize: 10, letterSpacing: '.08em', marginRight: 6, verticalAlign: '2px',
                    }}>{r.name}</span>
                    <RulesText text={r.body} size={14}/>
                  </div>
                )}
                {r.kind === 'rules' && <RulesText text={r.body} size={14}/>}
              </div>
            ))}
            <div style={{
              marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--line)',
              fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 13,
            }}>
              {MICKEY_FLAVOR}
            </div>
          </div>
        </div>

        {/* Variants — horizontal */}
        <section style={{ padding: '18px 0 6px' }}>
          <div style={{ padding: '0 18px', display: 'flex', alignItems: 'baseline',
                         justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 className="serif" style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Variants</h3>
            <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>3 printings</span>
          </div>
          <div className="if-scroll" style={{ display: 'flex', gap: 10, padding: '0 18px', overflowX: 'auto' }}>
            {[
              { label: 'Standard', foil: 'none' },
              { label: 'Cold-foil', foil: 'cold' },
              { label: 'Enchanted', foil: 'enchanted' },
            ].map((v, i) => (
              <div key={v.label} style={{
                width: 96, flexShrink: 0,
                ...(i === 0 ? { outline: '2px solid var(--accent)', outlineOffset: 2, borderRadius: 10 } : {}),
              }}>
                <div style={{ aspectRatio: '5/7', borderRadius: 6, padding: 4, position: 'relative',
                               background: v.foil === 'enchanted'
                                 ? 'linear-gradient(135deg, #F4B042, #A56FCF, #3B7BC4)' : ink.c }}>
                  <div style={{ background: 'var(--paper)', width: '100%', height: '100%',
                                 borderRadius: 3, display: 'grid', placeItems: 'center',
                                 color: 'var(--ink-3)', fontSize: 9 }}>
                    {v.label}
                  </div>
                  {v.foil !== 'none' && (
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                                   background: v.foil === 'cold'
                                     ? 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,.55) 50%, transparent 60%)'
                                     : 'linear-gradient(115deg, rgba(255,255,255,.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,.5) 100%)',
                                   mixBlendMode: 'overlay' }}/>
                  )}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', marginTop: 6 }}>{v.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Meta */}
        <div style={{ padding: '14px 18px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)',
                         borderRadius: 12, padding: '4px 16px' }}>
            <MetaRow label="Set" value="The First Chapter"/>
            <MetaRow label="Collector №" value="151 / 204"/>
            <MetaRow label="Illustrator" value={MICKEY_ILLUSTRATOR}/>
            <MetaRow label="Inkable" value="Yes"/>
            <MetaRow label="Released" value="Aug 18, 2023"/>
          </div>
        </div>

        {/* Where to buy */}
        <div style={{ padding: '8px 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em',
                         textTransform: 'uppercase', fontWeight: 700, margin: '8px 0 8px' }}>
            Where to buy
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            {[
              { name: 'TCGplayer', price: '$24.50' },
              { name: 'Cardmarket', price: '€21.80' },
              { name: 'CardKingdom', price: '$28.99' },
            ].map(s => (
              <a key={s.name} href="#" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 14px', borderRadius: 10, background: 'var(--surface)',
                border: '1px solid var(--line)', textDecoration: 'none', color: 'inherit', fontSize: 13,
              }}>
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="mono" style={{ fontWeight: 700 }}>{s.price}</span>
                  <Chevron size={11}/>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Continue in the set */}
        <div style={{ padding: '16px 18px 0' }}>
          <a href="#" style={{
            display: 'block', textDecoration: 'none', color: 'inherit',
            background: 'linear-gradient(135deg, var(--ink-amber-soft), var(--ink-amethyst-soft))',
            border: '1px solid var(--line)', borderRadius: 14, padding: '16px 16px 14px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                          color: 'var(--ink-2)', marginBottom: 4 }}>From the set</div>
            <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.02em',
                                            margin: '0 0 4px', lineHeight: 1.1 }}>
              The First Chapter
            </h3>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginBottom: 10 }}>
              204 cards · Aug 2023
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
              Browse all cards in The First Chapter →
            </div>
          </a>
        </div>
      </div>

      {/* Sticky bottom action */}
      <div style={{
        position: 'absolute', bottom: 44, left: 0, right: 0, padding: '10px 16px',
        background: 'color-mix(in oklab, var(--paper) 92%, transparent)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--line)', zIndex: 5,
      }}>
        <button className="if-btn if-btn--primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
          Where to buy
        </button>
      </div>

      <MobileTabBar active="cards"/>
    </MobileFrame>
  );
}

Object.assign(window, { CardDetailDesktop, CardDetailMobile });
