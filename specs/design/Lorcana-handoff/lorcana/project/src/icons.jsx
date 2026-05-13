// Inkfolk — game iconography
// Hand-drawn SVG glyphs that hint at Lorcana's stat symbols
// (ink drop, strength burst, willpower shield, lore diamond, exert arrow,
// cost gem). Sized via the `size` prop, color via currentColor.

const Icon = ({ size = 16, children, viewBox = '0 0 24 24', ...rest }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...rest}>
    {children}
  </svg>
);

// Ink drop — the resource. Used in cost contexts.
const InkDrop = ({ size = 16, color, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M12 2.5c-1.6 3-6 7.6-6 11.4a6 6 0 0 0 12 0c0-3.8-4.4-8.4-6-11.4Z"
          fill={color || 'currentColor'} />
    <path d="M9.2 12.5c-.5 1.3-.4 2.5.4 3.5"
          stroke="rgba(255,255,255,.55)" strokeWidth="1.4" strokeLinecap="round" />
  </Icon>
);

// Strength — a four-pointed burst (suggests an attack/star)
const Strength = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M12 2.5 14 9.3l6.5 1L15.7 14.3l1.3 6.7L12 17.6 6 21l1.3-6.7L3.5 10.3l6.5-1L12 2.5Z"
          fill="currentColor" />
  </Icon>
);

// Willpower — heart-shield hybrid
const Willpower = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M12 3c1.8-1.2 4-1.1 5.4.3 1.7 1.7 1.7 4.5 0 6.2L12 15 6.6 9.5C4.9 7.8 4.9 5 6.6 3.3 8 1.9 10.2 1.8 12 3Z"
          fill="currentColor" />
    <path d="M6 12c0 4 3 7 6 9 3-2 6-5 6-9"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </Icon>
);

// Lore — diamond/quest-marker shape
const Lore = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z" fill="currentColor" />
    <path d="M12 7 17 12 12 17 7 12 12 7Z" fill="rgba(255,255,255,.35)" />
  </Icon>
);

// Exert — curved arrow ↻
const Exert = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M20 12a8 8 0 1 1-3.2-6.4"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M21 4v5h-5" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Icon>
);

// Cost — hex gem (for the cost in card frames)
const CostGem = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z"
          fill="currentColor" />
    <path d="M12 5 18 8.5v7L12 19 6 15.5v-7L12 5Z"
          fill="rgba(255,255,255,.25)" />
  </Icon>
);

// Card type glyphs
const TypeCharacter = ({ size = 14, ...rest }) => (
  <Icon size={size} {...rest}>
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="currentColor" />
  </Icon>
);
const TypeAction = ({ size = 14, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M13 2 4 14h6l-2 8 10-14h-6l1-6Z" fill="currentColor" />
  </Icon>
);
const TypeItem = ({ size = 14, ...rest }) => (
  <Icon size={size} {...rest}>
    <rect x="3" y="7" width="18" height="13" rx="2" fill="currentColor" />
    <path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="2" fill="none" />
  </Icon>
);
const TypeLocation = ({ size = 14, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M12 2C7 2 3 6 3 11c0 6 9 11 9 11s9-5 9-11c0-5-4-9-9-9Z" fill="currentColor"/>
    <circle cx="12" cy="11" r="3" fill="rgba(255,255,255,.55)"/>
  </Icon>
);
const TypeSong = ({ size = 14, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M9 18V6l11-3v12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
    <circle cx="7" cy="18" r="3" fill="currentColor"/>
    <circle cx="18" cy="15" r="3" fill="currentColor"/>
  </Icon>
);

// Search / UI
const Search = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </Icon>
);
const Filter = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M3 5h18l-7 9v6l-4-2v-4L3 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
  </Icon>
);
const Grid = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor"/>
    <rect x="13" y="3" width="8" height="8" rx="1.5" fill="currentColor"/>
    <rect x="3" y="13" width="8" height="8" rx="1.5" fill="currentColor"/>
    <rect x="13" y="13" width="8" height="8" rx="1.5" fill="currentColor"/>
  </Icon>
);
const List = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </Icon>
);
const ChevR = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </Icon>
);
const ChevD = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="m5 9 7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </Icon>
);
const Close = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </Icon>
);
const Menu = ({ size = 18, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M3 7h18M3 17h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </Icon>
);
const Heart = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M12 21s-7-4.6-9-9c-1.4-3 .6-7 4.5-7 2 0 3.5 1 4.5 2.5C13 6 14.5 5 16.5 5 20.4 5 22.4 9 21 12c-2 4.4-9 9-9 9Z"
          stroke="currentColor" strokeWidth="1.8" fill="none"/>
  </Icon>
);
const External = ({ size = 14, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M14 4h6v6M20 4 10 14M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
  </Icon>
);
const Globe = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"
          stroke="currentColor" strokeWidth="1.4" fill="none"/>
  </Icon>
);
const Sparkle = ({ size = 16, ...rest }) => (
  <Icon size={size} {...rest}>
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M12 7c0 3 2 5 5 5-3 0-5 2-5 5 0-3-2-5-5-5 3 0 5-2 5-5Z" fill="currentColor"/>
  </Icon>
);

// Generic chevron with `dir` ('left'|'right'|'up'|'down'). Defaults to right.
function Chevron({ size = 14, dir = 'right', style }) {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[dir] || 0;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
         style={{ transform: `rotate(${rot}deg)`, ...style }}>
      <path d="M6 3 L11 8 L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Link({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M9 4h2.5a2.5 2.5 0 1 1 0 5H9 M7 12H4.5a2.5 2.5 0 1 1 0-5H7 M5.5 8h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function Share({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2v8 M8 2L5.5 4.5 M8 2l2.5 2.5 M3 9v3.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

Object.assign(window, {
  InkDrop, Strength, Willpower, Lore, Exert, CostGem,
  TypeCharacter, TypeAction, TypeItem, TypeLocation, TypeSong,
  Search, Filter, Grid, List, ChevR, ChevD, Chevron, Close, Menu, Heart,
  External, Globe, Sparkle, Link, Share,
});
