import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/GameContext';
import { translations } from '../i18n/translations';
import { getCategoryLabel } from '../data/categories';
import { Trophy, RotateCcw, Medal, Crown, Sparkles } from 'lucide-react';
import { ShareFooter } from './ShareFooter';
import confetti from 'canvas-confetti';
import { getThemeConfettiColors } from '../utils/confettiColors';
import { recordScores, HighscoreEntry } from '../services/highscores';

const medalColor = (index: number): string | null => {
  if (index === 0) return 'var(--gold)';
  if (index === 1) return '#c0c0c0';
  if (index === 2) return '#cd7f32';
  return null;
};

export const WinnerScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const t = translations[state.lang as keyof typeof translations] || translations.en;

  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  const recordedRef = useRef(false);
  const [highscores, setHighscores] = useState<HighscoreEntry[]>([]);
  const [newIds, setNewIds] = useState<string[]>([]);

  // Persist this game's scores into the cross-session high-score table (once).
  useEffect(() => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    const { list, newIds } = recordScores(state.players.map((p) => ({ name: p.name, score: p.score })));
    setHighscores(list);
    setNewIds(newIds);
  }, [state.players]);

  const isNewRecord = highscores.length > 0 && newIds.includes(highscores[0].id);

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = getThemeConfettiColors(state.theme);
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [state.theme]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(state.lang === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
    });

  return (
    <div className="screen final-results fade-in" style={{ gap: '0.5rem' }}>
      <div className="winner-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Trophy size={48} className="icon gold-glow" />
        <h1 className="title-gradient" style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.25rem 0 0 0', lineHeight: 1.1 }}>
          {t.winner}
        </h1>
        <h2 className="winner-name text-gold glow-text" style={{ fontSize: '1.25rem', margin: '0.1rem 0' }}>
          {winner?.name}
        </h2>
        {isNewRecord && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              marginTop: '0.3rem',
              padding: '0.2rem 0.7rem',
              borderRadius: '999px',
              background: 'var(--glow-gold)',
              border: '1px solid var(--gold)',
              color: 'var(--gold)',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <Sparkles size={14} /> {t.newRecord}
          </div>
        )}
        <div className="score-badge" style={{ padding: '0.35rem 1rem', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.4rem' }}>
          <span className="score-value" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{winner?.score}</span>
          <span className="score-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>{t.pointsShort}</span>
        </div>
      </div>

      <div className="leaderboard mt-3">
        {sortedPlayers.map((player, index) => {
          const color = medalColor(index);
          return (
            <div key={player.id} className={`leaderboard-row ${index === 0 ? 'first-place' : ''}`}>
              <div className="rank">
                {color ? (
                  index === 0 ? (
                    <Crown size={24} style={{ color }} />
                  ) : (
                    <Medal size={22} style={{ color }} />
                  )
                ) : (
                  `#${index + 1}`
                )}
              </div>
              <div className="player-info">
                <span className="name">{player.name}</span>
              </div>
              <div className="score">{player.score} {t.pointsShort}</div>
            </div>
          );
        })}
      </div>

      {/* Cross-session high-score table */}
      {highscores.length > 0 && (
        <div className="mt-3 w-full">
          <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crown size={16} className="text-gold" /> {t.highscores}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {highscores.map((h, idx) => {
              const isNew = newIds.includes(h.id);
              return (
                <div
                  key={h.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    background: isNew ? 'var(--glow-primary)' : 'var(--row-bg)',
                    border: `1px solid ${isNew ? 'var(--primary)' : 'transparent'}`,
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: medalColor(idx) ?? 'var(--text-muted)', minWidth: 22 }}>
                    {idx + 1}.
                  </span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem' }}>{h.name}</span>
                  {isNew && (
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '6px', padding: '0.05rem 0.3rem' }}>
                      {t.newTag}
                    </span>
                  )}
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>{fmtDate(h.date)}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)', minWidth: 48, textAlign: 'right' }}>
                    {h.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {state.history.length > 0 && (
        <div className="mt-3 w-full">
          <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{t.roundHistory}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
            {state.history.map((entry) => {
              const ranked = [...entry.results].sort((a, b) => b.points - a.points);
              return (
                <div
                  key={entry.round}
                  style={{ padding: '0.6rem 0.8rem', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                      {t.round} {entry.round}
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.7rem', textAlign: 'right' }}>
                      {entry.targets.map((tg) => `${getCategoryLabel(tg.categoryId, state.lang)}·${tg.letter}`).join('  ·  ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {ranked.map((r) => {
                      const p = state.players.find((pl) => pl.id === r.playerId);
                      return (
                        <div key={r.playerId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span className="text-muted">{p?.name ?? '—'}</span>
                          <span style={{ fontWeight: 600 }}>{r.points} {t.pointsShort}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 w-full">
        <button className="option-button primary large w-full group" onClick={() => dispatch({ type: 'PLAY_AGAIN' })}>
          <RotateCcw size={24} className="group-hover-spin" />
          <span>{t.playAgain}</span>
        </button>
      </div>

      <ShareFooter />
    </div>
  );
};
