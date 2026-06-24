import React, { useEffect, useRef, useState } from 'react';
import { DeckCard, Language } from '../types';
import { translations } from '../i18n/translations';
import { Card } from './Card';
import { Check, X } from 'lucide-react';

const SWIPE_THRESHOLD = 110;
const EXIT_DISTANCE = 600;
const MAX_STACK = 3;

interface SwipeDeckProps {
  cards: DeckCard[];
  index: number;
  lang: Language;
  /** Called once a card leaves the deck. elapsedMs = time the card was on top. */
  onSwipe: (guessBelongs: boolean, elapsedMs: number) => void;
}

/**
 * Tinder-style card stack driven by native Pointer Events (no extra deps).
 * Swipe right / tap ✓ = "passt" (true), swipe left / tap ✗ = "passt nicht".
 */
export const SwipeDeck: React.FC<SwipeDeckProps> = ({ cards, index, lang, onSwipe }) => {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null);
  const startXRef = useRef(0);
  const shownAtRef = useRef(Date.now());

  // Reset per-card state and the speed-bonus timer whenever a new card surfaces.
  useEffect(() => {
    shownAtRef.current = Date.now();
    setDx(0);
    setDragging(false);
    setExiting(null);
  }, [index]);

  // Once a card starts exiting, advance after the fly-out animation. Using a
  // timer (not `transitionend`) keeps this deterministic across renderers.
  useEffect(() => {
    if (!exiting) return;
    const dir = exiting;
    const elapsed = Date.now() - shownAtRef.current;
    const id = window.setTimeout(() => onSwipe(dir === 'right', elapsed), 260);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting]);

  const topCard = cards[index];

  const onPointerDown: React.PointerEventHandler = (e) => {
    if (exiting) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    startXRef.current = e.clientX;
    setDragging(true);
  };
  const onPointerMove: React.PointerEventHandler = (e) => {
    if (!dragging || exiting) return;
    setDx(e.clientX - startXRef.current);
  };
  const endDrag = () => {
    if (exiting) return;
    setDragging(false);
    if (dx > SWIPE_THRESHOLD) setExiting('right');
    else if (dx < -SWIPE_THRESHOLD) setExiting('left');
    else setDx(0);
  };

  const trigger = (dir: 'left' | 'right') => {
    if (exiting) return;
    setDragging(false);
    setExiting(dir);
  };

  const overlay: 'yes' | 'no' | null = exiting === 'right' || dx > 40
    ? 'yes'
    : exiting === 'left' || dx < -40
      ? 'no'
      : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%' }}>
      <div className="lr-deck-area">
        {(() => {
          const stack: React.ReactNode[] = [];
          const last = Math.min(index + MAX_STACK - 1, cards.length - 1);
          for (let i = last; i >= index; i--) {
            const card = cards[i];
            if (!card) continue;
            const depth = i - index;
            const isTop = depth === 0;

            let transform: string;
            let transition: string;
            if (isTop) {
              if (exiting) {
                const sign = exiting === 'right' ? 1 : -1;
                transform = `translateX(${sign * EXIT_DISTANCE}px) rotate(${sign * 18}deg)`;
                transition = 'transform 0.28s ease-in';
              } else {
                transform = `translateX(${dx}px) rotate(${dx * 0.05}deg)`;
                transition = dragging ? 'none' : 'transform 0.25s ease';
              }
            } else {
              transform = `scale(${1 - depth * 0.05}) translateY(${depth * 14}px)`;
              transition = 'transform 0.25s ease';
            }

            stack.push(
              <Card
                key={card.id}
                wort={card.wort}
                overlay={isTop ? overlay : null}
                yesLabel={t.swipeYes}
                noLabel={t.swipeNo}
                interactive={isTop}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                style={{
                  transform,
                  transition,
                  zIndex: MAX_STACK - depth,
                  cursor: isTop ? 'grab' : 'default',
                  touchAction: 'none',
                }}
              />,
            );
          }
          return stack;
        })()}
      </div>

      <div className="lr-swipe-actions">
        <button
          type="button"
          className="lr-swipe-btn no"
          aria-label={t.swipeNo}
          onClick={() => trigger('left')}
          disabled={!topCard || !!exiting}
        >
          <X size={30} strokeWidth={3} />
        </button>
        <button
          type="button"
          className="lr-swipe-btn yes"
          aria-label={t.swipeYes}
          onClick={() => trigger('right')}
          disabled={!topCard || !!exiting}
        >
          <Check size={30} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
