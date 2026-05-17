export type InstrumentId = 'piano' | 'guitar' | 'flute' | 'marimba' | 'violin' | 'synth';

export type DifficultyId = 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultyConfig {
  id: DifficultyId;
  label: string;
  pairs: number;
  cols: number;
  rows: number;
  parMoves: number;
}

export interface InstrumentMeta {
  id: InstrumentId;
  name: string;
  tagline: string;
  symbol: string;
  accent: string;
  cardBackGradient: string;
  cardBackMonogram: string;
}

export interface Card {
  id: number;
  note: string;
  pairId: number;
  state: 'face-down' | 'revealed' | 'matched';
}

export type GamePhase =
  | 'idle'
  | 'firstFlipped'
  | 'secondFlipped'
  | 'resolving'
  | 'won'
  | 'paused';

export interface GameState {
  cards: Card[];
  phase: GamePhase;
  firstIndex: number | null;
  secondIndex: number | null;
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  startedAt: number | null;
  elapsedMs: number;
  lastMatch: { firstIndex: number; secondIndex: number } | null;
  matchHistory: number[];
}

export interface ScoreEntry {
  instrument: InstrumentId;
  difficulty: DifficultyId;
  timeMs: number;
  moves: number;
  stars: 1 | 2 | 3;
  recordedAt: number;
}

export interface Settings {
  volume: number;
  muted: boolean;
  reducedMotion: 'auto' | 'on' | 'off';
  matchByEar: boolean;
  showNoteLabels: boolean;
  theme: 'concert-hall' | 'modern-flat';
}

export interface PersistedData {
  schemaVersion: number;
  settings: Settings;
  scores: ScoreEntry[];
}

export type Screen =
  | 'loading'
  | 'main-menu'
  | 'instrument-select'
  | 'difficulty-select'
  | 'game'
  | 'win'
  | 'pause'
  | 'settings'
  | 'high-scores'
  | 'how-to-play'
  | 'free-play';
