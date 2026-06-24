import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import { translations } from '../i18n/translations';
import { coreCategories, bonusCategories, getCategoryLabel, defaultSelectedIds } from '../data/categories';
import { isCategoryUsable } from '../utils/poolGenerator';
import { Layers, Sparkles, ChevronDown, ChevronUp, ChevronLeft, Play } from 'lucide-react';

const GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
  gap: '0.5rem',
};

const TILE: React.CSSProperties = {
  padding: '0.5rem',
  minHeight: '60px',
  fontSize: '0.85rem',
  lineHeight: 1.15,
  minWidth: 0,
  textAlign: 'center',
  whiteSpace: 'normal',
};

const SECTION_TITLE: React.CSSProperties = {
  fontSize: '1.05rem',
  marginBottom: '0.6rem',
  paddingBottom: '0.4rem',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

export const CategoryScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const t = translations[state.lang as keyof typeof translations] || translations.en;

  const [selected, setSelected] = useState<string[]>(
    state.selectedCategoryIds.length > 0 ? state.selectedCategoryIds : defaultSelectedIds(),
  );
  const [showBonus, setShowBonus] = useState(false);

  const core = coreCategories();
  const bonus = bonusCategories();

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const usableCount = selected.filter((id) => isCategoryUsable(id)).length;
  const canStart = usableCount > 0;

  const handleStart = () => {
    if (!canStart) return;
    dispatch({ type: 'START_GAME', payload: { selectedCategoryIds: selected } });
  };

  return (
    <div className="screen setup-screen fade-in">
      <h1 className="title-gradient gigantic text-center" style={{ margin: 0 }}>{t.categoryStepTitle}</h1>
      <p className="text-muted text-center" style={{ margin: '0.4rem 0 0.75rem 0', fontSize: '0.9rem' }}>
        {t.categoryStepSubtitle}
      </p>

      <div
        className="w-full"
        style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', paddingRight: '0.25rem' }}
      >
        <h2 className="section-title" style={SECTION_TITLE}>
          <Layers className="icon" size={18} /> {t.coreCategories}
        </h2>
        <div style={GRID}>
          {core.map((c) => (
            <button
              key={c.id}
              className={`option-button ${selected.includes(c.id) ? 'active' : 'outline'}`}
              style={TILE}
              onClick={() => toggle(c.id)}
            >
              {getCategoryLabel(c.id, state.lang)}
            </button>
          ))}
        </div>

        <button
          className="option-button outline w-full justify-between"
          style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center' }}
          onClick={() => setShowBonus((v) => !v)}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} /> {t.moreCategories}
          </span>
          {showBonus ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showBonus && (
          <div className="fade-in" style={{ marginTop: '0.75rem' }}>
            <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0 0 0.6rem 0' }}>
              {t.bonusHint}
            </p>
            <div style={GRID}>
              {bonus.map((c) => (
                <button
                  key={c.id}
                  className={`option-button ${selected.includes(c.id) ? 'active' : 'outline'}`}
                  style={TILE}
                  onClick={() => toggle(c.id)}
                >
                  {getCategoryLabel(c.id, state.lang)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full" style={{ marginTop: '0.5rem' }}>
        <div
          className="text-muted"
          style={{
            fontSize: '0.82rem',
            textAlign: 'center',
            marginBottom: '0.75rem',
            color: canStart ? 'var(--text-muted)' : 'var(--danger)',
          }}
        >
          {canStart ? (
            <>
              <strong style={{ color: 'var(--text)' }}>{usableCount}</strong> {t.categoriesReady}
            </>
          ) : (
            t.categoriesWarn
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            className="option-button outline large"
            style={{ flex: '0 0 auto' }}
            onClick={() => dispatch({ type: 'BACK_TO_SETUP' })}
          >
            <ChevronLeft size={22} className="icon" />
            <span>{t.back}</span>
          </button>
          <button
            className={`option-button primary large ${canStart ? '' : 'visually-disabled'}`}
            style={{ flex: 1 }}
            onClick={handleStart}
            disabled={!canStart}
          >
            <Play fill="currentColor" size={22} />
            <span>{t.startGame}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
