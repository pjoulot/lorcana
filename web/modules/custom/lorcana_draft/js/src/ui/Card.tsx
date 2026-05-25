// Image-first card. The licensed art carries name/cost/stats, so we render
// just the <img> in the theme's card frame (.if-lcard / .if-card-image, see
// the theme's card.css) — no overlay chrome. Width comes from the parent grid;
// the 5/7 aspect ratio is locked by the theme.
import type { CSSProperties } from 'react';
import type { CardData } from '../types';

type Size = 'thumb' | 'normal' | 'large';

interface CardProps {
  card: CardData;
  size?: Size;
  className?: string;
  style?: CSSProperties;
}

export function Card({ card, size = 'normal', className = '', style }: CardProps) {
  const src = size === 'large' ? card.imageLarge ?? card.image : card.image ?? card.imageLarge;
  const classes = [
    'if-lcard',
    'if-cardframe--subtle',
    !src ? 'if-lcard--no-art' : '',
    card.foil ? 'if-foil' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style} aria-label={card.name}>
      <div className="if-card-image">
        {src && <img src={src} alt={card.name} loading="lazy" />}
      </div>
    </div>
  );
}
