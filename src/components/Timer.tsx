import React from 'react';

interface TimerProps {
  /** Remaining time in milliseconds. */
  remainingMs: number;
  /** Total round time in milliseconds. */
  totalMs: number;
}

/** Visual countdown bar with a seconds readout. Turns red in the final 10s. */
export const Timer: React.FC<TimerProps> = ({ remainingMs, totalMs }) => {
  const fraction = Math.max(0, Math.min(1, remainingMs / totalMs));
  const seconds = Math.ceil(remainingMs / 1000);
  const danger = remainingMs <= 10000;

  return (
    <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.85rem', fontWeight: 700, color: danger ? 'var(--danger)' : 'var(--text-muted)' }}>
        {seconds}s
      </div>
      <div className="lr-timer">
        <div
          className={`lr-timer-fill ${danger ? 'danger' : ''}`}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
    </div>
  );
};
