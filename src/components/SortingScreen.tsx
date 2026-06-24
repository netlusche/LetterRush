import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '../state/GameContext';
import { translations } from '../i18n/translations';
import { shuffleDeckForPlayer } from '../utils/poolGenerator';
import { getCategoryLabel } from '../data/categories';
import { evaluateSwipe, TIME_PENALTY_MS } from '../utils/scoring';
import { Timer } from './Timer';
import { SwipeDeck } from './SwipeDeck';
import { Flame } from 'lucide-react';

interface Stats {
  score: number;
  correct: number;
  wrong: number;
  bestCombo: number;
  streak: number;
}

const INITIAL_STATS: Stats = { score: 0, correct: 0, wrong: 0, bestCombo: 0, streak: 0 };

export const SortingScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const t = translations[state.lang as keyof typeof translations] || translations.en;
  const player = state.players[state.currentPlayerIndex];

  // Each player gets the round's deck reshuffled fresh (anti-memorization).
  const deck = useMemo(
    () => (state.round ? shuffleDeckForPlayer(state.round.phases) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const totalMs = state.settings.roundSeconds * 1000;
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [remainingMs, setRemainingMs] = useState(totalMs);
  const [flash, setFlash] = useState<{ id: number; points: number } | null>(null);
  const [targetFlash, setTargetFlash] = useState(0);
  const prevTargetRef = useRef('');

  const statsRef = useRef(stats);
  const finishedRef = useRef(false);
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const s = statsRef.current;
    dispatch({
      type: 'LOCK_SCORE',
      payload: {
        result: {
          playerId: player.id,
          points: s.score,
          correct: s.correct,
          wrong: s.wrong,
          bestCombo: s.bestCombo,
        },
      },
    });
  };

  // Countdown timer — pure updater; the finish trigger lives in its own effect.
  useEffect(() => {
    const iv = setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - 100));
    }, 100);
    return () => clearInterval(iv);
  }, []);

  // End the turn when time runs out or the deck is exhausted.
  useEffect(() => {
    if (remainingMs <= 0) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs]);

  useEffect(() => {
    if (index >= deck.length) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, deck.length]);

  // Flash "new target" whenever the active (letter + category) goal changes.
  useEffect(() => {
    const cur = deck[index];
    if (!cur) return;
    const key = `${cur.targetCategoryId}:${cur.targetLetter}`;
    if (prevTargetRef.current && prevTargetRef.current !== key) setTargetFlash((f) => f + 1);
    prevTargetRef.current = key;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handleSwipe = (guessBelongs: boolean, elapsedMs: number) => {
    if (finishedRef.current) return;
    const card = deck[index];
    if (!card) return;
    const out = evaluateSwipe(card.belongs, guessBelongs, elapsedMs, stats.streak);
    setStats((s) => ({
      score: s.score + out.points,
      correct: s.correct + (out.correct ? 1 : 0),
      wrong: s.wrong + (out.correct ? 0 : 1),
      bestCombo: Math.max(s.bestCombo, out.newStreak),
      streak: out.newStreak,
    }));
    setFlash({ id: Date.now(), points: out.points });
    if (!out.correct && state.settings.timePenalty) {
      setRemainingMs((r) => Math.max(0, r - TIME_PENALTY_MS));
    }
    setIndex((i) => i + 1);
  };

  if (!state.round) return null;
  const remaining = deck.length - index;
  const current = deck[index];

  return (
    <div className="screen lr-sorting fade-in">
      <div className="lr-hud">
        <span>{player?.name}</span>
        <span style={{ color: 'var(--primary)' }}>{stats.score} {t.pointsShort}</span>
      </div>

      <Timer remainingMs={remainingMs} totalMs={totalMs} />

      <div className="lr-target-wrap">
        {current && (
          <div className="lr-target-banner" key={`${current.targetCategoryId}:${current.targetLetter}`}>
            <span className="lr-target-cat">{getCategoryLabel(current.targetCategoryId, state.lang)}</span>
            <span className="lr-target-letter title-gradient">{current.targetLetter}</span>
          </div>
        )}
        {targetFlash > 0 && <div className="lr-new-target" key={targetFlash}>{t.newTarget}</div>}
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <SwipeDeck cards={deck} index={index} lang={state.lang} onSwipe={handleSwipe} />
        {flash && (
          <div
            key={flash.id}
            className="lr-points-flash"
            style={{ color: flash.points >= 0 ? 'var(--success)' : 'var(--danger)' }}
          >
            {flash.points >= 0 ? `+${flash.points}` : flash.points}
          </div>
        )}
      </div>

      <div className="lr-hud" style={{ marginTop: '0.25rem' }}>
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>
          {remaining} {t.cardsLeft}
        </span>
        {stats.streak >= 3 && (
          <span className="lr-combo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Flame size={16} /> {t.combo} ×{stats.streak}
          </span>
        )}
      </div>
    </div>
  );
};
