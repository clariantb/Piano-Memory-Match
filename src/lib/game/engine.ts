import type { Card, GameState } from '../types';
import { mulberry32, shuffle } from './shuffle';

export interface CreateGameInput {
  notes: readonly string[];
  pairs: number;
  seed?: number;
}

export function createGame({ notes, pairs, seed }: CreateGameInput): GameState {
  if (pairs > notes.length) {
    throw new Error(`Need at least ${pairs} unique notes, got ${notes.length}`);
  }
  const rng = seed === undefined ? Math.random : mulberry32(seed);
  const chosen = shuffle(notes, rng).slice(0, pairs);
  const deck: Card[] = chosen.flatMap((note, pairId) => [
    { id: pairId * 2, note, pairId, state: 'face-down' as const },
    { id: pairId * 2 + 1, note, pairId, state: 'face-down' as const }
  ]);
  return {
    cards: shuffle(deck, rng),
    phase: 'idle',
    firstIndex: null,
    secondIndex: null,
    moves: 0,
    matchedPairs: 0,
    totalPairs: pairs,
    startedAt: null,
    elapsedMs: 0,
    lastMatch: null,
    matchHistory: []
  };
}

export function flipCard(state: GameState, index: number, now: number = Date.now()): GameState {
  if (index < 0 || index >= state.cards.length) return state;
  if (state.phase === 'resolving' || state.phase === 'won' || state.phase === 'paused') return state;
  const card = state.cards[index];
  if (card.state !== 'face-down') return state;

  const cards = state.cards.map((c, i) => (i === index ? { ...c, state: 'revealed' as const } : c));
  const startedAt = state.startedAt ?? now;

  if (state.phase === 'idle') {
    return { ...state, cards, phase: 'firstFlipped', firstIndex: index, startedAt };
  }
  if (state.phase === 'firstFlipped') {
    if (state.firstIndex === index) return state;
    return {
      ...state,
      cards,
      phase: 'resolving',
      secondIndex: index,
      moves: state.moves + 1,
      startedAt
    };
  }
  return state;
}

export function resolve(state: GameState, now: number = Date.now()): GameState {
  if (state.phase !== 'resolving') return state;
  if (state.firstIndex === null || state.secondIndex === null) return state;

  const a = state.cards[state.firstIndex];
  const b = state.cards[state.secondIndex];
  const isMatch = a.pairId === b.pairId;

  if (isMatch) {
    const cards = state.cards.map((c, i) =>
      i === state.firstIndex || i === state.secondIndex ? { ...c, state: 'matched' as const } : c
    );
    const matchedPairs = state.matchedPairs + 1;
    const won = matchedPairs === state.totalPairs;
    return {
      ...state,
      cards,
      phase: won ? 'won' : 'idle',
      firstIndex: null,
      secondIndex: null,
      matchedPairs,
      lastMatch: { firstIndex: state.firstIndex, secondIndex: state.secondIndex },
      matchHistory: [...state.matchHistory, a.pairId],
      elapsedMs: won && state.startedAt !== null ? now - state.startedAt : state.elapsedMs
    };
  }

  const cards = state.cards.map((c, i) =>
    i === state.firstIndex || i === state.secondIndex ? { ...c, state: 'face-down' as const } : c
  );
  return {
    ...state,
    cards,
    phase: 'idle',
    firstIndex: null,
    secondIndex: null,
    lastMatch: null
  };
}

export function pause(state: GameState): GameState {
  if (state.phase === 'won' || state.phase === 'paused') return state;
  return { ...state, phase: 'paused' };
}

export function resume(state: GameState): GameState {
  if (state.phase !== 'paused') return state;
  return { ...state, phase: 'idle' };
}

export function tick(state: GameState, now: number = Date.now()): GameState {
  if (state.startedAt === null) return state;
  if (state.phase === 'won' || state.phase === 'paused') return state;
  return { ...state, elapsedMs: now - state.startedAt };
}
