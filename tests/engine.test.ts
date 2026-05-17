import { describe, it, expect } from 'vitest';
import {
  createGame,
  flipCard,
  resolve,
  pause,
  resume,
  tick
} from '../src/lib/game/engine';

const NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

function newGame(pairs = 4, seed = 42) {
  return createGame({ notes: NOTES, pairs, seed });
}

function indicesByPair(state: ReturnType<typeof newGame>, pairId: number): [number, number] {
  const idxs = state.cards
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => c.pairId === pairId)
    .map(({ i }) => i);
  return [idxs[0], idxs[1]];
}

describe('createGame', () => {
  it('creates 2N cards for N pairs', () => {
    const s = newGame(4);
    expect(s.cards).toHaveLength(8);
    expect(s.totalPairs).toBe(4);
  });

  it('each pair appears exactly twice', () => {
    const s = newGame(8);
    for (let p = 0; p < 8; p++) {
      expect(s.cards.filter((c) => c.pairId === p)).toHaveLength(2);
    }
  });

  it('is deterministic with a seed', () => {
    const a = newGame(8, 123);
    const b = newGame(8, 123);
    expect(a.cards.map((c) => c.pairId)).toEqual(b.cards.map((c) => c.pairId));
  });

  it('different seeds produce different orderings', () => {
    const a = newGame(8, 1);
    const b = newGame(8, 2);
    expect(a.cards.map((c) => c.pairId)).not.toEqual(b.cards.map((c) => c.pairId));
  });

  it('throws if asking for more pairs than notes', () => {
    expect(() => createGame({ notes: NOTES, pairs: 9 })).toThrow();
  });

  it('starts in idle phase', () => {
    expect(newGame().phase).toBe('idle');
  });
});

describe('flipCard', () => {
  it('moves idle → firstFlipped on first flip', () => {
    const s1 = newGame();
    const s2 = flipCard(s1, 0, 1000);
    expect(s2.phase).toBe('firstFlipped');
    expect(s2.firstIndex).toBe(0);
    expect(s2.cards[0].state).toBe('revealed');
    expect(s2.startedAt).toBe(1000);
  });

  it('moves firstFlipped → resolving on second flip', () => {
    let s = newGame();
    s = flipCard(s, 0, 1000);
    s = flipCard(s, 1, 1100);
    expect(s.phase).toBe('resolving');
    expect(s.secondIndex).toBe(1);
    expect(s.moves).toBe(1);
  });

  it('ignores clicks on the same card twice', () => {
    let s = newGame();
    s = flipCard(s, 0);
    const before = s;
    s = flipCard(s, 0);
    expect(s).toBe(before);
  });

  it('ignores clicks during resolving (race protection)', () => {
    let s = newGame();
    s = flipCard(s, 0);
    s = flipCard(s, 1);
    expect(s.phase).toBe('resolving');
    const before = s;
    s = flipCard(s, 2);
    expect(s).toBe(before);
  });

  it('ignores clicks on matched cards', () => {
    let s = newGame();
    const [a, b] = indicesByPair(s, 0);
    s = flipCard(s, a);
    s = flipCard(s, b);
    s = resolve(s);
    const matchedIndex = s.cards.findIndex((c) => c.state === 'matched');
    const before = s;
    s = flipCard(s, matchedIndex);
    expect(s).toBe(before);
  });

  it('ignores out-of-range indices', () => {
    const s = newGame();
    expect(flipCard(s, -1)).toBe(s);
    expect(flipCard(s, 100)).toBe(s);
  });
});

describe('resolve', () => {
  it('matches identical pairs and clears guess slots', () => {
    let s = newGame();
    const [a, b] = indicesByPair(s, 0);
    s = flipCard(s, a);
    s = flipCard(s, b);
    s = resolve(s);
    expect(s.cards[a].state).toBe('matched');
    expect(s.cards[b].state).toBe('matched');
    expect(s.firstIndex).toBeNull();
    expect(s.secondIndex).toBeNull();
    expect(s.matchedPairs).toBe(1);
    expect(s.phase).toBe('idle');
  });

  it('flips mismatched cards back to face-down', () => {
    let s = newGame();
    const [a] = indicesByPair(s, 0);
    const [b] = indicesByPair(s, 1);
    s = flipCard(s, a);
    s = flipCard(s, b);
    s = resolve(s);
    expect(s.cards[a].state).toBe('face-down');
    expect(s.cards[b].state).toBe('face-down');
    expect(s.matchedPairs).toBe(0);
    expect(s.phase).toBe('idle');
  });

  it('transitions to won when all pairs matched', () => {
    let s = newGame(2);
    for (let p = 0; p < 2; p++) {
      const [a, b] = indicesByPair(s, p);
      s = flipCard(s, a);
      s = flipCard(s, b);
      s = resolve(s);
    }
    expect(s.phase).toBe('won');
    expect(s.matchedPairs).toBe(2);
  });

  it('records elapsedMs at the moment of winning', () => {
    let s = newGame(1);
    const [a, b] = indicesByPair(s, 0);
    s = flipCard(s, a, 1000);
    s = flipCard(s, b, 1500);
    s = resolve(s, 2000);
    expect(s.phase).toBe('won');
    expect(s.elapsedMs).toBe(1000);
  });

  it('is a no-op when not in resolving phase', () => {
    const s = newGame();
    expect(resolve(s)).toBe(s);
  });
});

describe('pause/resume', () => {
  it('paused state ignores flips', () => {
    let s = pause(flipCard(newGame(), 0));
    expect(s.phase).toBe('paused');
    const before = s;
    s = flipCard(s, 1);
    expect(s).toBe(before);
  });

  it('resume restores phase to idle', () => {
    let s = pause(flipCard(newGame(), 0));
    s = resume(s);
    expect(s.phase).toBe('idle');
  });

  it('resume is a no-op if not paused', () => {
    const s = newGame();
    expect(resume(s)).toBe(s);
  });
});

describe('tick', () => {
  it('updates elapsedMs from startedAt', () => {
    let s = newGame();
    s = flipCard(s, 0, 1000);
    s = tick(s, 3500);
    expect(s.elapsedMs).toBe(2500);
  });

  it('does not advance when paused', () => {
    let s = newGame();
    s = flipCard(s, 0, 1000);
    s = tick(s, 2000);
    expect(s.elapsedMs).toBe(1000);
    s = pause(s);
    s = tick(s, 5000);
    expect(s.elapsedMs).toBe(1000);
  });

  it('does not advance after winning', () => {
    let s = newGame(1);
    const [a, b] = indicesByPair(s, 0);
    s = flipCard(s, a, 1000);
    s = flipCard(s, b, 1100);
    s = resolve(s, 1500);
    const won = s.elapsedMs;
    s = tick(s, 5000);
    expect(s.elapsedMs).toBe(won);
  });

  it('is a no-op before the first flip', () => {
    const s = newGame();
    expect(tick(s, 9999)).toBe(s);
  });
});
