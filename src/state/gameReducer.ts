import { GameState, Language, Theme, Player, GameSettings, PlayerRoundResult, RoundHistoryEntry } from '../types';
import { defaultSelectedIds } from '../data/categories';
import { buildRound } from '../utils/poolGenerator';

export type GameAction =
  | {
      type: 'CONTINUE_TO_CATEGORIES';
      payload: {
        players: Player[];
        totalRounds: number;
        lang: Language;
        settings: GameSettings;
      };
    }
  | { type: 'BACK_TO_SETUP' }
  | { type: 'START_GAME'; payload: { selectedCategoryIds: string[] } }
  | { type: 'BEGIN_SORTING' }
  | { type: 'LOCK_SCORE'; payload: { result: PlayerRoundResult } }
  | { type: 'CONTINUE_AFTER_LOCK' }
  | { type: 'NEXT_ROUND' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'SET_THEME'; payload: { theme: Theme } }
  | { type: 'GO_TO_SETUP' }
  | { type: 'RESET_GAME' };

export const initialState: GameState = {
  lang: 'de',
  theme: 'default',
  players: [],
  currentPlayerIndex: 0,
  currentRound: 1,
  totalRounds: 3,
  phase: 'LANDING',
  selectedCategoryIds: defaultSelectedIds(),
  settings: { roundSeconds: 50, timePenalty: false },
  round: null,
  pendingResults: [],
  history: [],
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'CONTINUE_TO_CATEGORIES': {
      const { players, totalRounds, lang, settings } = action.payload;
      return {
        ...state,
        players,
        totalRounds,
        lang,
        settings,
        phase: 'CATEGORY_SELECTION',
      };
    }
    case 'BACK_TO_SETUP':
      return { ...state, phase: 'SETUP' };
    case 'START_GAME': {
      const { selectedCategoryIds } = action.payload;
      const built = buildRound(selectedCategoryIds);
      return {
        ...state,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        selectedCategoryIds,
        currentPlayerIndex: 0,
        currentRound: 1,
        phase: 'PASS_DEVICE',
        round: built ? built.config : null,
        pendingResults: [],
        history: [],
      };
    }
    case 'BEGIN_SORTING':
      return { ...state, phase: 'SORTING' };
    case 'LOCK_SCORE':
      return {
        ...state,
        pendingResults: [...state.pendingResults, action.payload.result],
        phase: 'SCORE_LOCK',
      };
    case 'CONTINUE_AFTER_LOCK': {
      const nextIndex = state.currentPlayerIndex + 1;
      // More players still have to play this round.
      if (nextIndex < state.players.length) {
        return { ...state, currentPlayerIndex: nextIndex, phase: 'PASS_DEVICE' };
      }
      // Last player done: apply round scores to totals, record history, reveal.
      const players = state.players.map((p) => {
        const r = state.pendingResults.find((x) => x.playerId === p.id);
        return r ? { ...p, score: p.score + r.points } : p;
      });
      const historyEntry: RoundHistoryEntry = {
        round: state.currentRound,
        targets: (state.round?.phases ?? []).map((p) => ({ letter: p.letter, categoryId: p.categoryId })),
        results: state.pendingResults,
      };
      return {
        ...state,
        players,
        history: [...state.history, historyEntry],
        phase: 'ROUND_REVEAL',
      };
    }
    case 'NEXT_ROUND': {
      if (state.currentRound >= state.totalRounds) {
        return { ...state, phase: 'FINAL_RESULTS', pendingResults: [] };
      }
      const built = buildRound(state.selectedCategoryIds);
      return {
        ...state,
        currentRound: state.currentRound + 1,
        currentPlayerIndex: 0,
        round: built ? built.config : null,
        pendingResults: [],
        phase: built ? 'PASS_DEVICE' : 'FINAL_RESULTS',
      };
    }
    case 'PLAY_AGAIN': {
      const built = buildRound(state.selectedCategoryIds);
      return {
        ...state,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        currentRound: 1,
        currentPlayerIndex: 0,
        round: built ? built.config : null,
        pendingResults: [],
        history: [],
        phase: built ? 'PASS_DEVICE' : 'SETUP',
      };
    }
    case 'SET_THEME':
      return { ...state, theme: action.payload.theme };
    case 'GO_TO_SETUP':
      return { ...state, phase: 'SETUP' };
    case 'RESET_GAME':
      return { ...initialState, theme: state.theme, lang: state.lang };
    default:
      return state;
  }
};
