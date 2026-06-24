import React from 'react';
import { useGame } from '../state/GameContext';
import { translations } from '../i18n/translations';
import { getCategoryLabel } from '../data/categories';
import { Smartphone, Play } from 'lucide-react';

export const PassDeviceScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const t = translations[state.lang as keyof typeof translations] || translations.en;
  const player = state.players[state.currentPlayerIndex];
  const round = state.round;

  if (!player) return null;

  return (
    <div className="screen center-content fade-in">
      <div
        className="text-muted text-center font-bold glow-text w-full"
        style={{ fontSize: '1.2rem', marginBottom: '0.5rem', marginTop: '-1rem' }}
      >
        {t.round} {state.currentRound} / {state.totalRounds}
      </div>
      <div className="icon-container primary-glow mb-4">
        <Smartphone size={80} className="icon active-bounce" />
      </div>
      <h2 className="subtitle">{t.passTo}</h2>
      <h1 className="title-gradient gigantic text-center">{player.name}</h1>

      {round && (
        <div className="text-muted text-center" style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
          {[...new Set(round.phases.map((p) => p.categoryId))]
            .map((id) => getCategoryLabel(id, state.lang))
            .join(' · ')}
        </div>
      )}

      <div className="mt-8 w-full max-w-sm">
        <button
          className="option-button primary large w-full pulse-animation"
          onClick={() => dispatch({ type: 'BEGIN_SORTING' })}
        >
          <Play fill="currentColor" size={24} />
          <span>{t.beginTurn}</span>
        </button>
        <p className="text-muted text-center" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
          {t.tapToStart}
        </p>
      </div>
    </div>
  );
};
