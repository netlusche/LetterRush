import React from 'react';
import { GameProvider, useGame } from './state/GameContext';
import { useWakeLock } from './hooks/useWakeLock';
import { GameSetup } from './components/GameSetup';
import { CategoryScreen } from './components/CategoryScreen';
import { PassDeviceScreen } from './components/PassDeviceScreen';
import { SortingScreen } from './components/SortingScreen';
import { ScoreLockScreen } from './components/ScoreLockScreen';
import { RoundReveal } from './components/RoundReveal';
import { WinnerScreen } from './components/WinnerScreen';
import { BackgroundEffects } from './components/BackgroundEffects';
import { LandingScreen } from './components/LandingScreen';
import { translations } from './i18n/translations';

const MainContent: React.FC = () => {
  const { state } = useGame();
  switch (state.phase) {
    case 'LANDING':
      return <LandingScreen />;
    case 'SETUP':
      return <GameSetup />;
    case 'CATEGORY_SELECTION':
      return <CategoryScreen />;
    case 'PASS_DEVICE':
      return <PassDeviceScreen />;
    case 'SORTING':
      return <SortingScreen />;
    case 'SCORE_LOCK':
      return <ScoreLockScreen />;
    case 'ROUND_REVEAL':
      return <RoundReveal />;
    case 'FINAL_RESULTS':
      return <WinnerScreen />;
    default:
      return <GameSetup />;
  }
};

const MainApp: React.FC = () => {
  const { state, dispatch } = useGame();
  const t = translations[state.lang as keyof typeof translations] || translations.en;
  const [showStartOverConfirm, setShowStartOverConfirm] = React.useState(false);

  const inGame = state.phase !== 'LANDING' && state.phase !== 'SETUP' && state.phase !== 'CATEGORY_SELECTION';
  useWakeLock(inGame);

  React.useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${state.theme || 'default'}`);
  }, [state.theme]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BackgroundEffects />
      <MainContent />

      {inGame && (
        <button onClick={() => setShowStartOverConfirm(true)} className="start-over-btn">
          {t.startOver}
        </button>
      )}

      {showStartOverConfirm && (
        <div className="modal-overlay" onClick={() => setShowStartOverConfirm(false)}>
          <div
            style={{
              background: 'var(--card)',
              border: '1.5px dashed var(--danger)',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '320px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--danger)', fontSize: '1.2rem', fontWeight: 800 }}>
              {t.confirmRestart}
            </h3>
            <p className="text-muted" style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', lineHeight: '1.4' }}>
              {t.restartLost}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <button
                type="button"
                className="option-button outline w-full"
                style={{ minHeight: '40px', fontSize: '0.9rem' }}
                onClick={() => setShowStartOverConfirm(false)}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className="option-button danger w-full"
                style={{ minHeight: '40px', fontSize: '0.9rem' }}
                onClick={() => {
                  dispatch({ type: 'RESET_GAME' });
                  setShowStartOverConfirm(false);
                }}
              >
                {t.yesStartOver}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <GameProvider>
    <MainApp />
  </GameProvider>
);

export default App;
