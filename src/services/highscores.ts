export interface HighscoreEntry {
  id: string;
  name: string;
  score: number;
  date: string; // ISO
}

const KEY = 'letterrush_highscores';
const MAX_ENTRIES = 10;

export const getHighscores = (): HighscoreEntry[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HighscoreEntry[]) : [];
  } catch {
    return [];
  }
};

/**
 * Merge the finished game's player scores into the persisted top-10 list.
 * Returns the updated list plus the ids of entries that made the cut, so the
 * winner screen can highlight what's new.
 */
export const recordScores = (
  players: { name: string; score: number }[],
): { list: HighscoreEntry[]; newIds: string[] } => {
  const now = new Date().toISOString();
  const fresh: HighscoreEntry[] = players.map((p, i) => ({
    id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    name: p.name,
    score: p.score,
    date: now,
  }));
  const merged = [...getHighscores(), ...fresh]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);
  localStorage.setItem(KEY, JSON.stringify(merged));
  const freshIds = new Set(fresh.map((f) => f.id));
  const newIds = merged.filter((m) => freshIds.has(m.id)).map((m) => m.id);
  return { list: merged, newIds };
};

export const clearHighscores = () => localStorage.removeItem(KEY);
