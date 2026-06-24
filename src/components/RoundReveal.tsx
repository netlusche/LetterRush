import React from 'react';
import { useGame } from '../state/GameContext';
import { translations } from '../i18n/translations';
import { getCategoryLabel } from '../data/categories';
import { Eye, ChevronRight, Flame } from 'lucide-react';

export const RoundReveal: React.FC = () => {
  const { state, dispatch } = useGame();
  const t = translations[state.lang as keyof typeof translations] || translations.en;
  const isLastRound = state.currentRound >= state.totalRounds;

  const rows = [...state.pendingResults]
    .map((r) => ({ result: r, player: state.players.find((p) => p.id === r.playerId) }))
    .sort((a, b) => b.result.points - a.result.points);

  const targets =
    state.history[state.history.length - 1]?.targets ??
    state.round?.phases.map((p) => ({ letter: p.letter, categoryId: p.categoryId })) ??
    [];
  const targetsLabel = targets
    .map((tg) => `${getCategoryLabel(tg.categoryId, state.lang)}·${tg.letter}`)
    .join('  ·  ');

  return (
    <div className="screen fade-in" style={{ gap: '0.75rem' }}>
      <div className="center-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <Eye size={40} className="icon" />
        <h1 className="title-gradient text-center" style={{ fontSize: '1.5rem', margin: '0.25rem 0 0 0' }}>
          {t.roundResults} {state.currentRound}
        </h1>
        <div className="text-muted text-center" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
          {targetsLabel}
        </div>
      </div>

      <div className="leaderboard mt-3">
        {rows.map(({ result, player }, idx) => (
          <div
            key={result.playerId}
            className={`leaderboard-row ${idx === 0 ? 'first-place' : ''}`}
            style={{ animation: `scaleIn 0.35s ease ${idx * 0.12}s both` }}
          >
            <div className="rank">#{idx + 1}</div>
            <div className="player-info" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="name">{player?.name ?? '—'}</span>
              <span className="text-muted" style={{ fontSize: '0.72rem', display: 'inline-flex', gap: '0.6rem' }}>
                <span>{result.correct} {t.correctShort}</span>
                <span>{result.wrong} {t.wrongShort}</span>
                {result.bestCombo >= 3 && (
                  <span className="lr-combo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Flame size={11} /> ×{result.bestCombo}
                  </span>
                )}
              </span>
            </div>
            <div className="score">{result.points} {t.pointsShort}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 w-full">
        <button
          className="option-button primary large w-full group"
          onClick={() => dispatch({ type: 'NEXT_ROUND' })}
        >
          <span>{isLastRound ? t.showWinner : t.nextRound}</span>
          <ChevronRight size={24} className="group-hover-translate icon" />
        </button>
      </div>
    </div>
  );
};
