export type Language = 'en' | 'de';

// Identical theme set as MelodyMatch / PicSnap — ported 1:1.
export type Theme =
  | 'default'
  | 'plain_white'
  | 'plain_dark'
  | 'matrix'
  | 'vaporwave'
  | 'westeros'
  | 'sakura'
  | 'lcars'
  | 'frutiger_aero'
  | 'synthwave'
  | 'heavy_metal'
  | 'post_punk'
  | 'rock_legends'
  | 'kraftwerk'
  | 'neon_party';

export type CategoryTier = 'core' | 'bonus';

/** A single dictionary entry inside a category master list. */
export interface WordEntry {
  wort: string;
  anfangsbuchstabe: string; // single uppercase letter, e.g. "B"
}

/** Raw shape of a category JSON data file. */
export interface CategoryData {
  kategorie: string;
  eintraege: WordEntry[];
}

/** Static metadata describing a selectable category (no word data). */
export interface CategoryMeta {
  id: string;
  tier: CategoryTier;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

/**
 * A single card shown in the swipe deck.
 * `belongs` is the ground truth: true = the word matches letter + category
 * ("passt"), false = trap word ("passt nicht").
 */
/** A card inside a phase. `belongs` = matches the phase's letter AND category. */
export interface PhaseCard {
  id: string;
  wort: string;
  belongs: boolean;
}

/** The (letter + category) goal that applies to one phase of a turn. */
export interface RoundTarget {
  letter: string;
  categoryId: string;
}

/** A phase: one target plus the cards shown while it is active. */
export interface RoundPhase extends RoundTarget {
  cards: PhaseCard[];
}

/** A card as shown to the player — carries the active target for the banner. */
export interface DeckCard {
  id: string;
  wort: string;
  belongs: boolean;
  targetLetter: string;
  targetCategoryId: string;
}

/**
 * Per-round configuration, identical for all players of the round.
 * Each player's deck is derived by reshuffling within phases (anti-memorization).
 */
export interface RoundConfig {
  phases: RoundPhase[];
}

/** Score result of one player's sorting turn, hidden until the reveal. */
export interface PlayerRoundResult {
  playerId: string;
  points: number;
  correct: number;
  wrong: number;
  bestCombo: number;
}

/** One completed round, kept for the winner-screen history. */
export interface RoundHistoryEntry {
  round: number;
  targets: RoundTarget[];
  results: PlayerRoundResult[];
}

export type GamePhase =
  | 'LANDING'
  | 'SETUP'
  | 'CATEGORY_SELECTION'
  | 'PASS_DEVICE'
  | 'SORTING'
  | 'SCORE_LOCK'
  | 'ROUND_REVEAL'
  | 'FINAL_RESULTS';

export interface GameSettings {
  /** Round timer in seconds (45–60 per spec). */
  roundSeconds: number;
  /** Apply -2s time penalty on a wrong swipe. */
  timePenalty: boolean;
}

export interface GameState {
  lang: Language;
  theme: Theme;
  players: Player[];
  currentPlayerIndex: number;
  currentRound: number;
  totalRounds: number;
  phase: GamePhase;
  /** Active categories chosen in setup (core + optional bonus). */
  selectedCategoryIds: string[];
  settings: GameSettings;
  /** Config of the round currently in progress. */
  round: RoundConfig | null;
  /** Locked results of the current round, revealed after the last player. */
  pendingResults: PlayerRoundResult[];
  history: RoundHistoryEntry[];
}
