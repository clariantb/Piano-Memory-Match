import { writable, derived, get } from 'svelte/store';
import type { DifficultyId, GameState, InstrumentId, Screen } from '../types';
import { createGame, flipCard, resolve, pause, resume, tick } from '../game/engine';
import { getDifficulty } from '../game/scoring';
import { notesForPairs } from '../audio/notes';

export const currentScreen = writable<Screen>('loading');

export const selectedInstrument = writable<InstrumentId>('piano');
export const selectedDifficulty = writable<DifficultyId>('medium');

export const game = writable<GameState | null>(null);

export const elapsedMs = derived(game, ($g) => $g?.elapsedMs ?? 0);

let tickHandle: ReturnType<typeof setInterval> | null = null;

function startTicker(): void {
  if (tickHandle !== null) return;
  tickHandle = setInterval(() => {
    game.update((g) => (g ? tick(g) : g));
  }, 200);
}

function stopTicker(): void {
  if (tickHandle !== null) {
    clearInterval(tickHandle);
    tickHandle = null;
  }
}

export function newGame(instrument: InstrumentId, difficulty: DifficultyId, seed?: number): void {
  const config = getDifficulty(difficulty);
  const notes = notesForPairs(config.pairs);
  selectedInstrument.set(instrument);
  selectedDifficulty.set(difficulty);
  game.set(createGame({ notes, pairs: config.pairs, seed }));
  startTicker();
}

export function flip(index: number): void {
  game.update((g) => (g ? flipCard(g, index) : g));
}

export function resolveBoard(): void {
  game.update((g) => (g ? resolve(g) : g));
  const current = get(game);
  if (current?.phase === 'won') stopTicker();
}

export function pauseGame(): void {
  game.update((g) => (g ? pause(g) : g));
  stopTicker();
}

export function resumeGame(): void {
  game.update((g) => (g ? resume(g) : g));
  startTicker();
}

export function endGame(): void {
  stopTicker();
  game.set(null);
}
