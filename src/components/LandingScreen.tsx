import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useGame } from '../state/GameContext';
import { translations } from '../i18n/translations';
import { ShareFooter } from './ShareFooter';
import packageInfo from '../../package.json';

export const LandingScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const t = translations[state.lang];

  return (
    <div className="screen landing-screen">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%' }}>
        <div className="landing-logo-wrap">
          <img src="pwa-512.png" alt="LetterRush Logo" className="landing-logo" />
        </div>

        <h1 className="title-gradient" style={{ margin: 0, fontSize: 'clamp(2rem, 8vw, 3rem)' }}>
          LetterRush
        </h1>

        <p className="text-muted" style={{ margin: 0, fontSize: '1rem', textAlign: 'center', maxWidth: '260px', lineHeight: 1.4 }}>
          {t.tagline}
        </p>

        <button
          className="option-button primary large group"
          style={{ marginTop: '1.25rem', minWidth: '200px' }}
          onClick={() => dispatch({ type: 'GO_TO_SETUP' })}
        >
          <span>{t.letsPlay}</span>
          <ChevronRight size={22} className="group-hover-translate icon" />
        </button>
      </div>

      <ShareFooter />

      <div style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.72rem', opacity: 0.55, textAlign: 'center' }}>
        {t.nonCommercial} · v{packageInfo.version}
      </div>
    </div>
  );
};
