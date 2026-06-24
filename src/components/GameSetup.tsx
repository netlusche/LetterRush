import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../state/GameContext';
import { Player, Language, Theme } from '../types';
import {
  Users,
  Settings,
  Globe,
  ChevronRight,
  UserPlus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Timer as TimerIcon,
  Crown,
} from 'lucide-react';
import { translations } from '../i18n/translations';
import { getHighscores, clearHighscores, HighscoreEntry } from '../services/highscores';
import packageInfo from '../../package.json';

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'plain_white', label: 'Plain White' },
  { value: 'plain_dark', label: 'Plain Dark' },
  { value: 'matrix', label: 'Matrix' },
  { value: 'vaporwave', label: 'Vaporwave' },
  { value: 'westeros', label: 'Westeros' },
  { value: 'sakura', label: 'Sakura' },
  { value: 'lcars', label: 'LCARS' },
  { value: 'frutiger_aero', label: 'Frutiger Aero' },
  { value: 'synthwave', label: 'Synthwave' },
  { value: 'heavy_metal', label: 'Heavy Metal' },
  { value: 'post_punk', label: 'Post Punk' },
  { value: 'rock_legends', label: 'Rock Legends' },
  { value: 'kraftwerk', label: 'Kraftwerk' },
  { value: 'neon_party', label: 'Neon Party' },
];

const ROUND_OPTIONS = [1, 2, 3, 4, 5];
const TIMER_OPTIONS = [45, 50, 60];

export const GameSetup: React.FC = () => {
  const { state, dispatch } = useGame();
  const [lang, setLang] = useState<Language>(state.lang);
  const [rounds, setRounds] = useState<number>(state.totalRounds || 3);
  const [roundSeconds, setRoundSeconds] = useState<number>(state.settings.roundSeconds);
  const [timePenalty, setTimePenalty] = useState<boolean>(state.settings.timePenalty);
  const [players, setPlayers] = useState<Player[]>(
    state.players.length > 0 ? state.players : [{ id: '1', name: 'Player 1', score: 0 }],
  );
  const [showHighscores, setShowHighscores] = useState(false);
  const [highscores, setHighscores] = useState<HighscoreEntry[]>(() => getHighscores());
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddPlayer = () => {
    if (players.length < 6) {
      setPlayers([...players, { id: Date.now().toString(), name: `Player ${players.length + 1}`, score: 0 }]);
    }
  };
  const handleRemovePlayer = (id: string) => {
    if (players.length > 1) setPlayers(players.filter((p) => p.id !== id));
  };
  const handleNameChange = (id: string, name: string) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const handleNext = () => {
    const filledPlayers = players.map((p, idx) => ({
      ...p,
      name: p.name.trim() || `Player ${idx + 1}`,
    }));
    dispatch({
      type: 'CONTINUE_TO_CATEGORIES',
      payload: { players: filledPlayers, totalRounds: rounds, lang, settings: { roundSeconds, timePenalty } },
    });
  };

  const activeThemeLabel =
    THEME_OPTIONS.find((o) => o.value === (state.theme || 'default'))?.label ?? 'Default';

  return (
    <div className="screen setup-screen">
      <div className="flex justify-between items-center w-full" style={{ marginBottom: '0.25rem' }}>
        <h1 className="title-gradient" style={{ margin: 0 }}>{t.title}</h1>
        <div className="theme-select-container" ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="theme-dropdown-trigger"
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '0.4rem 0.8rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{activeThemeLabel}</span>
            {themeDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {themeDropdownOpen && (
            <div
              className="theme-dropdown-menu"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3), 0 0 0 1px var(--border)',
                zIndex: 1000,
                width: '150px',
                maxHeight: '180px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                padding: '4px',
                gap: '2px',
              }}
            >
              {THEME_OPTIONS.map((o) => {
                const isActive = state.theme === o.value || (!state.theme && o.value === 'default');
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'SET_THEME', payload: { theme: o.value } });
                      setThemeDropdownOpen(false);
                    }}
                    className={`theme-dropdown-item ${isActive ? 'active' : ''}`}
                    style={{
                      background: isActive ? 'var(--primary)' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: isActive ? '#fff' : 'var(--text)',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                    }}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <p className="text-muted" style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{t.tagline}</p>

      {/* Players */}
      <div className="setup-section">
        <h2 className="section-title"><Users className="icon" /> {t.setupPlayers} (1-6)</h2>
        <div className="players-list">
          {players.map((player, index) => (
            <div key={player.id} className="player-input-row">
              <input
                type="text"
                value={player.name}
                onChange={(e) => handleNameChange(player.id, e.target.value)}
                onFocus={(e) => {
                  e.target.select();
                  if (player.name === `Player ${index + 1}`) handleNameChange(player.id, '');
                }}
                onBlur={(e) => {
                  if (!e.target.value.trim()) handleNameChange(player.id, `Player ${index + 1}`);
                }}
                className="custom-input"
                placeholder={`${t.player} ${index + 1}`}
              />
              {players.length > 1 && (
                <button className="icon-button danger" onClick={() => handleRemovePlayer(player.id)}>
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          {players.length < 6 && (
            <button className="option-button outline" onClick={handleAddPlayer}>
              <UserPlus size={20} /> {t.addPlayer}
            </button>
          )}
        </div>
      </div>

      {/* Rounds */}
      <div className="setup-section">
        <h2 className="section-title"><Settings className="icon" /> {t.setupRounds}</h2>
        <div className="options-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {ROUND_OPTIONS.map((r) => (
            <button
              key={r}
              className={`option-button ${rounds === r ? 'active' : ''}`}
              onClick={() => setRounds(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Round timer */}
      <div className="setup-section">
        <h2 className="section-title"><TimerIcon className="icon" /> {t.setupTimer}</h2>
        <div className="options-grid horizontal">
          {TIMER_OPTIONS.map((s) => (
            <button
              key={s}
              className={`option-button ${roundSeconds === s ? 'active' : ''}`}
              onClick={() => setRoundSeconds(s)}
            >
              {s}{t.seconds}
            </button>
          ))}
        </div>
        <button
          className={`option-button ${timePenalty ? 'active' : 'outline'}`}
          style={{ marginTop: '0.5rem' }}
          onClick={() => setTimePenalty((v) => !v)}
        >
          {t.timePenalty}
        </button>
      </div>

      {/* Language */}
      <div className="setup-section">
        <h2 className="section-title"><Globe className="icon" /> {t.setupLanguage}</h2>
        <div className="options-grid horizontal">
          <button className={`option-button ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          <button className={`option-button ${lang === 'de' ? 'active' : ''}`} onClick={() => setLang('de')}>DE</button>
        </div>
      </div>

      {/* High scores (between sessions) */}
      {highscores.length > 0 && (
        <div className="setup-section">
          <button
            className="option-button outline w-full justify-between"
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => setShowHighscores((v) => !v)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Crown size={18} className="text-gold" /> {t.highscores}
            </span>
            {showHighscores ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showHighscores && (
            <div className="fade-in" style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {highscores.map((h, idx) => (
                <div
                  key={h.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.45rem 0.7rem',
                    borderRadius: '10px',
                    background: 'var(--row-bg)',
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '0.8rem', color: idx === 0 ? 'var(--gold)' : 'var(--text-muted)', minWidth: 22 }}>
                    {idx + 1}.
                  </span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: '0.88rem' }}>{h.name}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary)' }}>{h.score}</span>
                </div>
              ))}
              <button
                type="button"
                className="option-button danger outline sm"
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', minHeight: '34px', alignSelf: 'flex-end', marginTop: '0.25rem' }}
                onClick={() => {
                  clearHighscores();
                  setHighscores([]);
                  setShowHighscores(false);
                }}
              >
                {t.clearHighscores}
              </button>
            </div>
          )}
        </div>
      )}

      <button className="option-button primary large mt-4 group" onClick={handleNext}>
        <span>{t.continueBtn}</span>
        <ChevronRight size={24} className="group-hover-translate icon" />
      </button>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '2rem',
          color: 'var(--text-muted)',
          width: '100%',
          borderTop: '1px solid var(--border)',
          paddingTop: '1rem',
          fontSize: '0.75rem',
          opacity: 0.6,
        }}
      >
        <div>{t.nonCommercial} • v{packageInfo.version}</div>
      </div>
    </div>
  );
};
