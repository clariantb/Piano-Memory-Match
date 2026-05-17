import { describe, it, expect } from 'vitest';
import {
  starRating,
  formatTime,
  isBetterScore,
  findBestScore,
  getDifficulty,
  DIFFICULTIES
} from '../src/lib/game/scoring';
import type { ScoreEntry } from '../src/lib/types';

describe('starRating', () => {
  it('3 stars at or under par', () => {
    expect(starRating(10, 10)).toBe(3);
    expect(starRating(5, 10)).toBe(3);
  });

  it('2 stars up to 1.5x par', () => {
    expect(starRating(11, 10)).toBe(2);
    expect(starRating(15, 10)).toBe(2);
  });

  it('1 star beyond 1.5x par', () => {
    expect(starRating(16, 10)).toBe(1);
    expect(starRating(99, 10)).toBe(1);
  });
});

describe('formatTime', () => {
  it('formats milliseconds as M:SS', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(5000)).toBe('0:05');
    expect(formatTime(65000)).toBe('1:05');
    expect(formatTime(125000)).toBe('2:05');
  });

  it('pads single-digit seconds', () => {
    expect(formatTime(61000)).toBe('1:01');
  });
});

const sample = (overrides: Partial<ScoreEntry> = {}): ScoreEntry => ({
  instrument: 'piano',
  difficulty: 'medium',
  timeMs: 30000,
  moves: 12,
  stars: 3,
  recordedAt: 0,
  ...overrides
});

describe('isBetterScore', () => {
  it('any candidate beats undefined current', () => {
    expect(isBetterScore(sample(), undefined)).toBe(true);
  });

  it('more stars wins', () => {
    expect(isBetterScore(sample({ stars: 3 }), sample({ stars: 2 }))).toBe(true);
    expect(isBetterScore(sample({ stars: 2 }), sample({ stars: 3 }))).toBe(false);
  });

  it('on tied stars, fewer moves wins', () => {
    expect(
      isBetterScore(sample({ stars: 3, moves: 10 }), sample({ stars: 3, moves: 12 }))
    ).toBe(true);
  });

  it('on tied stars and moves, faster time wins', () => {
    expect(
      isBetterScore(
        sample({ stars: 3, moves: 10, timeMs: 20000 }),
        sample({ stars: 3, moves: 10, timeMs: 25000 })
      )
    ).toBe(true);
  });
});

describe('findBestScore', () => {
  it('returns undefined when no entries match', () => {
    expect(findBestScore([], 'piano', 'medium')).toBeUndefined();
  });

  it('filters by instrument and difficulty', () => {
    const scores = [
      sample({ instrument: 'piano', difficulty: 'easy', moves: 5, stars: 3 }),
      sample({ instrument: 'piano', difficulty: 'medium', moves: 30, stars: 1 }),
      sample({ instrument: 'guitar', difficulty: 'medium', moves: 10, stars: 3 })
    ];
    const best = findBestScore(scores, 'piano', 'medium');
    expect(best?.instrument).toBe('piano');
    expect(best?.difficulty).toBe('medium');
  });

  it('returns the best entry by stars then moves then time', () => {
    const scores: ScoreEntry[] = [
      sample({ moves: 20, stars: 2, timeMs: 30000 }),
      sample({ moves: 15, stars: 3, timeMs: 50000 }),
      sample({ moves: 12, stars: 3, timeMs: 40000 }),
      sample({ moves: 12, stars: 3, timeMs: 35000 })
    ];
    const best = findBestScore(scores, 'piano', 'medium');
    expect(best?.moves).toBe(12);
    expect(best?.timeMs).toBe(35000);
  });
});

describe('DIFFICULTIES', () => {
  it('all four are defined', () => {
    expect(DIFFICULTIES.map((d) => d.id)).toEqual(['easy', 'medium', 'hard', 'expert']);
  });

  it('pairs match cols × rows / 2', () => {
    for (const d of DIFFICULTIES) {
      expect(d.pairs * 2).toBe(d.cols * d.rows);
    }
  });

  it('getDifficulty throws on unknown id', () => {
    expect(() => getDifficulty('insane')).toThrow();
  });
});
