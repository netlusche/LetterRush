import { DeckCard, PhaseCard, RoundConfig, RoundPhase, WordEntry } from '../types';
import { CATEGORIES, getCategoryData } from '../data/categories';
import { shuffleArray } from './arrayUtils';

/** A letter must have at least this many words in a category to be a valid target. */
export const MIN_HITS_PER_LETTER = 5;

/** Phases per turn and cards per phase (the target rotates every phase). */
export const PHASES_PER_ROUND = 4;
export const CARDS_PER_PHASE = 5;

const normalizeLetter = (s: string): string => (s || '').trim().charAt(0).toUpperCase();

const entriesFor = (categoryId: string): WordEntry[] => getCategoryData(categoryId)?.eintraege ?? [];

/** Words in a category that start with the given letter. */
const hitsFor = (categoryId: string, letter: string): WordEntry[] => {
  const L = normalizeLetter(letter);
  return entriesFor(categoryId).filter((e) => normalizeLetter(e.anfangsbuchstabe) === L);
};

/** Letters that have >= minHits words in a single category. */
export const validLettersForCategory = (
  categoryId: string,
  minHits: number = MIN_HITS_PER_LETTER,
): string[] => {
  const counts: Record<string, number> = {};
  for (const e of entriesFor(categoryId)) {
    const L = normalizeLetter(e.anfangsbuchstabe);
    counts[L] = (counts[L] || 0) + 1;
  }
  return Object.entries(counts)
    .filter(([, n]) => n >= minHits)
    .map(([l]) => l)
    .sort();
};

/** A category is usable if at least one letter clears the threshold. */
export const isCategoryUsable = (categoryId: string, minHits: number = MIN_HITS_PER_LETTER): boolean =>
  validLettersForCategory(categoryId, minHits).length > 0;

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

let cardSeq = 0;
const makeCard = (wort: string, belongs: boolean): PhaseCard => ({
  id: `c${cardSeq++}-${Math.random().toString(36).slice(2, 7)}`,
  wort,
  belongs,
});

/**
 * Build the cards for one phase target (letter + category):
 * ~half hits (right letter + right category) and ~half traps. Traps are mixed,
 * but biased toward the tricky "right letter / wrong category" kind.
 */
const buildPhaseCards = (letter: string, categoryId: string): PhaseCard[] => {
  const L = normalizeLetter(letter);
  const hitsWanted = 2 + Math.floor(Math.random() * 2); // 2–3 hits
  const trapsWanted = CARDS_PER_PHASE - hitsWanted;

  const used = new Set<string>();
  const take = (pool: string[], n: number): string[] => {
    const out: string[] = [];
    for (const w of pool) {
      if (out.length >= n) break;
      const key = w.toLowerCase();
      if (used.has(key)) continue;
      used.add(key);
      out.push(w);
    }
    return out;
  };

  const hitWords = take(shuffleArray(hitsFor(categoryId, letter).map((e) => e.wort)), hitsWanted);

  // Trap pools.
  const sameCatWrongLetter = shuffleArray(
    entriesFor(categoryId).filter((e) => normalizeLetter(e.anfangsbuchstabe) !== L).map((e) => e.wort),
  );
  const otherCatSameLetter = shuffleArray(
    CATEGORIES.filter((c) => c.id !== categoryId)
      .flatMap((c) => c.data.eintraege)
      .filter((e) => normalizeLetter(e.anfangsbuchstabe) === L)
      .map((e) => e.wort),
  );
  const otherCatOtherLetter = shuffleArray(
    CATEGORIES.filter((c) => c.id !== categoryId)
      .flatMap((c) => c.data.eintraege)
      .filter((e) => normalizeLetter(e.anfangsbuchstabe) !== L)
      .map((e) => e.wort),
  );

  // Favour the tricky "right letter, wrong category" traps, then fill.
  const trapWords: string[] = [];
  trapWords.push(...take(otherCatSameLetter, Math.ceil(trapsWanted * 0.6)));
  trapWords.push(...take(sameCatWrongLetter, trapsWanted - trapWords.length));
  if (trapWords.length < trapsWanted) {
    trapWords.push(...take(otherCatOtherLetter, trapsWanted - trapWords.length));
  }

  const cards = [
    ...hitWords.map((w) => makeCard(w, true)),
    ...trapWords.map((w) => makeCard(w, false)),
  ];
  return shuffleArray(cards);
};

export interface RoundBuildResult {
  config: RoundConfig;
  /** Set when the selection had to be widened to find usable categories. */
  widened?: boolean;
}

/**
 * Build a round as a sequence of (letter + category) phases. Targets are drawn
 * from the selected categories; if none are usable, fall back to the full
 * registry. Avoids two identical consecutive targets.
 */
export const buildRound = (selectedCategoryIds: string[]): RoundBuildResult | null => {
  let pool = selectedCategoryIds.filter((id) => isCategoryUsable(id));
  let widened = false;
  if (pool.length === 0) {
    pool = CATEGORIES.filter((c) => isCategoryUsable(c.id)).map((c) => c.id);
    widened = true;
  }
  if (pool.length === 0) return null;

  const phases: RoundPhase[] = [];
  let prevKey = '';
  for (let i = 0; i < PHASES_PER_ROUND; i++) {
    // Try a few times to avoid repeating the exact previous target.
    let categoryId = '';
    let letter = '';
    for (let attempt = 0; attempt < 8; attempt++) {
      categoryId = pick(pool);
      const letters = validLettersForCategory(categoryId);
      if (letters.length === 0) continue;
      letter = pick(letters);
      if (`${categoryId}:${letter}` !== prevKey) break;
    }
    if (!letter) continue;
    prevKey = `${categoryId}:${letter}`;
    phases.push({ letter, categoryId, cards: buildPhaseCards(letter, categoryId) });
  }

  if (phases.length === 0) return null;
  return { config: { phases }, widened };
};

/**
 * Flatten a round's phases into a player's deck: shuffle phase order, shuffle
 * cards within each phase, and stamp each card with its phase's target so the
 * banner can follow along.
 */
export const shuffleDeckForPlayer = (phases: RoundPhase[]): DeckCard[] => {
  const deck: DeckCard[] = [];
  for (const phase of shuffleArray(phases)) {
    for (const card of shuffleArray(phase.cards)) {
      deck.push({
        id: card.id,
        wort: card.wort,
        belongs: card.belongs,
        targetLetter: phase.letter,
        targetCategoryId: phase.categoryId,
      });
    }
  }
  return deck;
};
