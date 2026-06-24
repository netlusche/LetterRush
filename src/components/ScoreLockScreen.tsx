import React from 'react';
import { useGame } from '../state/GameContext';
import { translations } from '../i18n/translations';
import { Lock, ChevronRight } from 'lucide-react';

/**
 * Shown right after a player's turn. The score is intentionally hidden so the
 * next player can't see it — it is revealed for everyone in RoundReveal.
 */
export const ScoreLockScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const t = translations[state.lang as keyof typeof translations] || translations.en;
  const isLastPlayer = state.currentPlayerIndex >= state.players.length - 1;

  return (
    <div className="screen center-content fade-in">
      <div className="icon-container primary-glow mb-4">
        <Lock size={72} className="icon" />
      </div>
      <h1 className="title-gradient text-center" style={{ fontSize: '1.6rem', margin: 0 }}>
        {t.scoreLockTitle}
      </h1>
      <p className="text-muted text-center" style={{ marginTop: '0.5rem', maxWidth: 320 }}>
        {isLastPlayer ? t.scoreLockLast : t.scoreLockPass}
      </p>

      <div className="mt-8 w-full max-w-sm">
        <button
          className="option-button primary large w-full group"
          onClick={() => dispatch({ type: 'CONTINUE_AFTER_LOCK' })}
        >
          <span>{isLastPlayer ? t.revealScores : t.continue}</span>
          <ChevronRight size={24} className="group-hover-translate icon" />
        </button>
      </div>
    </div>
  );
};
