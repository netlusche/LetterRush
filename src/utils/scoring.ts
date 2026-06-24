export const BASE_POINTS = 10;
export const SPEED_BONUS = 5;
export const SPEED_BONUS_MS = 2000;
export const WRONG_PENALTY = -5;
export const TIME_PENALTY_MS = 2000;

export interface SwipeOutcome {
  correct: boolean;
  points: number;
  newStreak: number;
}

/**
 * Combo multiplier based on the current consecutive-correct streak.
 * 3+ → ×1.2, 5+ → ×1.5, 7+ → ×2 (per spec).
 */
export const streakMultiplier = (streak: number): number => {
  if (streak >= 7) return 2;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.2;
  return 1;
};

/**
 * Evaluate one swipe.
 * - Correct: +10 base, +5 if decided within SPEED_BONUS_MS, scaled by combo.
 * - Wrong: WRONG_PENALTY and the combo resets.
 */
export const evaluateSwipe = (
  belongs: boolean,
  guessBelongs: boolean,
  elapsedMs: number,
  currentStreak: number,
): SwipeOutcome => {
  const correct = belongs === guessBelongs;
  if (!correct) {
    return { correct: false, points: WRONG_PENALTY, newStreak: 0 };
  }
  const newStreak = currentStreak + 1;
  const speed = elapsedMs < SPEED_BONUS_MS ? SPEED_BONUS : 0;
  const points = Math.round((BASE_POINTS + speed) * streakMultiplier(newStreak));
  return { correct: true, points, newStreak };
};
