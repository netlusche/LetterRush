import React from 'react';

interface CardProps {
  wort: string;
  overlay: 'yes' | 'no' | null;
  yesLabel: string;
  noLabel: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  onPointerDown?: React.PointerEventHandler;
  onPointerMove?: React.PointerEventHandler;
  onPointerUp?: React.PointerEventHandler;
  onPointerCancel?: React.PointerEventHandler;
  onTransitionEnd?: React.TransitionEventHandler;
}

/** Presentational swipe card. Positioning/animation is owned by SwipeDeck. */
export const Card: React.FC<CardProps> = ({
  wort,
  overlay,
  yesLabel,
  noLabel,
  style,
  interactive,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onTransitionEnd,
}) => (
  <div
    className="lr-card"
    style={style}
    onPointerDown={interactive ? onPointerDown : undefined}
    onPointerMove={interactive ? onPointerMove : undefined}
    onPointerUp={interactive ? onPointerUp : undefined}
    onPointerCancel={interactive ? onPointerCancel : undefined}
    onTransitionEnd={interactive ? onTransitionEnd : undefined}
  >
    {overlay === 'yes' && <div className="lr-card-overlay yes">{yesLabel}</div>}
    {overlay === 'no' && <div className="lr-card-overlay no">{noLabel}</div>}
    <div className="lr-card-word">{wort}</div>
  </div>
);
