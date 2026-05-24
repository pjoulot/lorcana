// Inkfolk — Card component
// Three sizes: thumb (~120w), normal (~220w), large (any width)
// The card is built as a stand-in "frame" — the inner art area is a slot
// the real licensed card image will plug into. A foil treatment overlays
// rare and above. Costs/types/stats/rarity all wire through.

const INK = {
  amber:    { c: 'var(--ink-amber)',    soft: 'var(--ink-amber-soft)',    name: 'Amber'    },
  amethyst: { c: 'var(--ink-amethyst)', soft: 'var(--ink-amethyst-soft)', name: 'Amethyst' },
  emerald:  { c: 'var(--ink-emerald)',  soft: 'var(--ink-emerald-soft)',  name: 'Emerald'  },
  ruby:     { c: 'var(--ink-ruby)',     soft: 'var(--ink-ruby-soft)',     name: 'Ruby'     },
  sapphire: { c: 'var(--ink-sapphire)', soft: 'var(--ink-sapphire-soft)', name: 'Sapphire' },
  steel:    { c: 'var(--ink-steel)',    soft: 'var(--ink-steel-soft)',    name: 'Steel'    },
};

const RARITY = {
  common:     { label: 'C',  full: 'Common',     color: 'var(--rarity-common)',     dot: '○' },
  uncommon:   { label: 'U',  full: 'Uncommon',   color: 'var(--rarity-uncommon)',   dot: '◐' },
  rare:       { label: 'R',  full: 'Rare',       color: 'var(--rarity-rare)',       dot: '●' },
  super:      { label: 'SR', full: 'Super Rare', color: 'var(--rarity-super)',      dot: '★' },
  legendary:  { label: 'L',  full: 'Legendary',  color: 'var(--rarity-legendary)',  dot: '✦' },
  enchanted:  { label: 'E',  full: 'Enchanted',  color: 'transparent',              dot: '✦', enchanted: true },
};

// Stylized art placeholder — a soft painterly silhouette in the ink color.
// Replaceable with <img src> when real images land.
function CardArtPlaceholder({ ink, seed = 0, name }) {
  const ic = INK[ink] || INK.steel;
  // Vary the silhouette by seed
  const v = seed % 4;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        radial-gradient(120% 90% at 60% 30%, ${ic.c}33, transparent 60%),
        radial-gradient(80% 60% at 20% 80%, ${ic.c}22, transparent 65%),
        linear-gradient(180deg, ${ic.c}1a 0%, ${ic.c}0d 40%, transparent 80%),
        var(--surface-2)
      `,
      overflow: 'hidden',
    }}>
      <svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice"
           style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .55 }}>
        <defs>
          <linearGradient id={`g-${seed}-${ink}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ic.c} stopOpacity=".7"/>
            <stop offset="1" stopColor={ic.c} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {v === 0 && (
          <>
            <circle cx="50" cy="55" r="22" fill={`url(#g-${seed}-${ink})`} />
            <path d="M20 130 Q50 80 80 130 Z" fill={`url(#g-${seed}-${ink})`} />
          </>
        )}
        {v === 1 && (
          <>
            <ellipse cx="50" cy="50" rx="28" ry="22" fill={`url(#g-${seed}-${ink})`} />
            <path d="M22 120 Q50 70 78 120 L78 140 L22 140 Z" fill={`url(#g-${seed}-${ink})`} />
          </>
        )}
        {v === 2 && (
          <>
            <path d="M50 18 L70 70 L50 100 L30 70 Z" fill={`url(#g-${seed}-${ink})`} />
            <path d="M15 130 Q50 90 85 130 Z" fill={`url(#g-${seed}-${ink})`} opacity=".6"/>
          </>
        )}
        {v === 3 && (
          <>
            <rect x="30" y="40" width="40" height="50" rx="20" fill={`url(#g-${seed}-${ink})`}/>
            <circle cx="50" cy="35" r="14" fill={`url(#g-${seed}-${ink})`}/>
          </>
        )}
        {/* subtle grain */}
        <rect width="100" height="140" fill="url(#noise)" opacity=".06"/>
      </svg>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="noise">
            <feTurbulence baseFrequency=".9" numOctaves="2"/>
          </filter>
          <pattern id="noise" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" filter="url(#noise)"/>
          </pattern>
        </defs>
      </svg>
    </div>
  );
}

// Cost cluster — ink-drop background with the number
function CostBadge({ cost, ink, size = 32 }) {
  const ic = INK[ink] || INK.steel;
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.25))',
    }}>
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M12 1.5C10 5 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-5-10-7-13.5Z"
              fill={ic.c} stroke="rgba(0,0,0,.18)" strokeWidth="0.5"/>
        <path d="M9 13c-.6 1.4-.5 3 .6 4.2" stroke="rgba(255,255,255,.5)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      </svg>
      <div className="serif" style={{
        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
        color: '#fff', fontWeight: 700, fontSize: size * 0.46,
        textShadow: '0 1px 1px rgba(0,0,0,.3)', letterSpacing: '-.02em',
        paddingTop: size * 0.08,
      }}>{cost}</div>
    </div>
  );
}

// Single Card — three sizes: thumb | normal | large
function Card({
  card,
  size = 'normal',
  frame,                  // 'none' | 'subtle' | 'rarity'
  onClick,
  href,
  selected,
  className = '',
  style = {},
}) {
  const ic = INK[card.ink] || INK.steel;
  const ra = RARITY[card.rarity] || RARITY.common;
  const widths = { thumb: 110, normal: 220, large: 320 };
  const w = widths[size] ?? widths.normal;
  // 2.5 × 3.5 = standard TCG card ratio. Use aspectRatio so callers that
  // override width: '100%' don't end up with a card whose height is still
  // the default — the art would crop badly.
  const cardAspect = '5 / 7';

  const showStats = card.type === 'Character';
  const isFoil = card.rarity === 'legendary' || card.rarity === 'enchanted' || card.rarity === 'super';

  const frameClass = frame ? `if-cardframe--${frame}` : 'if-cardframe--subtle';

  const Tag = href ? 'a' : 'div';

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={`${frameClass} ${className}`}
      style={{
        position: 'relative',
        width: w, aspectRatio: cardAspect,
        flexShrink: 0,
        textDecoration: 'none',
        color: 'inherit',
        cursor: (onClick || href) ? 'pointer' : 'default',
        ...style,
      }}
    >
      {/* The "image" slot — what real card art will replace */}
      <div
        className={`if-card-image ${isFoil ? 'if-foil' : ''}`}
        style={{
          position: 'absolute', inset: 0,
          borderRadius: size === 'thumb' ? 8 : 12,
          overflow: 'hidden',
          background: 'var(--surface)',
          '--rarity-color': ra.color,
        }}
      >
        {/* art — real image only; if missing, render a neutral card-back, never fake chrome */}
        {card.image
          ? <img src={card.image} alt={card.name} loading="lazy" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
            }}/>
          : <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(160deg, var(--bg-2) 0%, var(--surface) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--ink-3)', fontSize: size === 'thumb' ? 10 : 12,
              letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 500,
            }}>
              <div style={{ width: size === 'thumb' ? 14 : 22, height: size === 'thumb' ? 14 : 22,
                            borderRadius: 999, background: (INK[card.ink]||INK.steel).c, opacity: .25 }}/>
            </div>
        }

        {/* overlay UI — only on placeholder cards; real card images already carry cost/ink/name/stats */}
        {!card.image && <>
        {/* top-left: cost */}
        <div style={{ position: 'absolute', top: size === 'thumb' ? 6 : 8, left: size === 'thumb' ? 6 : 8 }}>
          <CostBadge cost={card.cost} ink={card.ink}
                     size={size === 'thumb' ? 22 : size === 'normal' ? 30 : 38}/>
        </div>

        {/* top-right: ink swatch */}
        <div style={{
          position: 'absolute', top: size === 'thumb' ? 6 : 8, right: size === 'thumb' ? 6 : 8,
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(15,10,5,.5)', color: '#fff',
          padding: size === 'thumb' ? '2px 5px' : '3px 7px',
          borderRadius: 999,
          fontSize: size === 'thumb' ? 9 : 10, fontWeight: 600, letterSpacing: '.04em',
          textTransform: 'uppercase', backdropFilter: 'blur(4px)',
        }}>
          <span style={{
            width: size === 'thumb' ? 6 : 8, height: size === 'thumb' ? 6 : 8,
            borderRadius: 999, background: ic.c,
            boxShadow: '0 0 0 1px rgba(255,255,255,.4)',
          }}/>
          {size !== 'thumb' && ic.name}
        </div>

        </>}

        {/* bottom: name + type — placeholder only */}
        {!card.image && (
        <>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: size === 'thumb' ? '6px 8px 8px' : '10px 12px 12px',
          color: '#fff',
        }}>
          {card.subtitle && size !== 'thumb' && (
            <div style={{ fontSize: 10, opacity: .78, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 2 }}>
              {card.subtitle}
            </div>
          )}
          <div className="serif" style={{
            fontSize: size === 'thumb' ? 11 : size === 'normal' ? 15 : 19,
            fontWeight: 600, lineHeight: 1.1, letterSpacing: '-.01em',
            textShadow: '0 1px 2px rgba(0,0,0,.4)',
            display: '-webkit-box', WebkitLineClamp: size === 'thumb' ? 2 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{card.name}</div>

          {/* stats row for characters */}
          {showStats && size !== 'thumb' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginTop: 8,
              fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
              fontSize: size === 'normal' ? 12 : 14, fontWeight: 600,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#ffb37a' }}>
                <Strength size={size === 'normal' ? 12 : 14}/>{card.strength}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#ff8888' }}>
                <Willpower size={size === 'normal' ? 12 : 14}/>{card.willpower}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginLeft: 'auto', color: 'var(--ink-amber)' }}>
                <Lore size={size === 'normal' ? 12 : 14}/>{card.lore}
              </span>
            </div>
          )}
        </div>

        </>
        )}

        {/* rarity gem (small, bottom-right for thumb) — placeholder only */}
        {size === 'thumb' && !card.image && (
          <div style={{
            position: 'absolute', bottom: 6, right: 6,
            width: 14, height: 14, borderRadius: 999,
            background: ra.enchanted ? 'var(--rarity-enchanted)' : ra.color,
            border: '1.5px solid rgba(255,255,255,.7)',
            boxShadow: '0 1px 2px rgba(0,0,0,.3)',
          }}/>
        )}

        {selected && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            boxShadow: 'inset 0 0 0 3px var(--accent)',
            pointerEvents: 'none',
          }}/>
        )}
      </div>
    </Tag>
  );
}

// Compact list row variant — used in Encyclopedia list view
function CardListRow({ card, onClick }) {
  const ic = INK[card.ink] || INK.steel;
  const ra = RARITY[card.rarity] || RARITY.common;
  return (
    <button onClick={onClick} style={{
      display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 14,
      alignItems: 'center', padding: '10px 14px',
      background: 'transparent', border: 0, borderBottom: '1px solid var(--line)',
      textAlign: 'left', cursor: 'pointer', width: '100%',
    }}>
      <div style={{ width: 48, height: 68, position: 'relative', borderRadius: 6, overflow: 'hidden', background: 'var(--surface)' }}>
        {card.image
          ? <img src={card.image} alt="" loading="lazy" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
          : <>
              <CardArtPlaceholder ink={card.ink} seed={card.seed ?? 0}/>
              <div style={{ position: 'absolute', top: 2, left: 2 }}>
                <CostBadge cost={card.cost} ink={card.ink} size={16}/>
              </div>
            </>
        }
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="serif" style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, color: 'var(--ink)' }}>
          {card.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: ic.c }}/>
            {ic.name}
          </span>
          <span>·</span>
          <span>{card.type}</span>
          {card.type === 'Character' && (
            <>
              <span>·</span>
              <span className="mono" style={{ fontWeight: 600 }}>{card.strength}/{card.willpower} · {card.lore}<Lore size={10} style={{ marginLeft: 2, verticalAlign: '-1px' }}/></span>
            </>
          )}
        </div>
      </div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '.08em',
        color: ra.color, textTransform: 'uppercase',
      }}>{ra.label}</div>
    </button>
  );
}

Object.assign(window, { Card, CardListRow, CardArtPlaceholder, CostBadge, INK, RARITY });
