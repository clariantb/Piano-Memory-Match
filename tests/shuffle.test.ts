import { describe, it, expect } from 'vitest';
import { mulberry32, shuffle, todaySeed } from '../src/lib/game/shuffle';

describe('mulberry32', () => {
  it('produces deterministic output for the same seed', () => {
    const a = mulberry32(7);
    const b = mulberry32(7);
    for (let i = 0; i < 100; i++) {
      expect(a()).toBe(b());
    }
  });

  it('produces different output for different seeds', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    const aOut = Array.from({ length: 10 }, () => a());
    const bOut = Array.from({ length: 10 }, () => b());
    expect(aOut).not.toEqual(bOut);
  });

  it('values are in [0, 1)', () => {
    const rng = mulberry32(99);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('shuffle', () => {
  it('preserves elements (multi-set equality)', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, mulberry32(5));
    expect(out.slice().sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('does not mutate input', () => {
    const input = [1, 2, 3];
    const snapshot = input.slice();
    shuffle(input, mulberry32(1));
    expect(input).toEqual(snapshot);
  });

  it('deterministic with seeded rng', () => {
    const a = shuffle([1, 2, 3, 4, 5, 6, 7, 8], mulberry32(42));
    const b = shuffle([1, 2, 3, 4, 5, 6, 7, 8], mulberry32(42));
    expect(a).toEqual(b);
  });

  it('handles empty arrays', () => {
    expect(shuffle([], mulberry32(1))).toEqual([]);
  });
});

describe('todaySeed', () => {
  it('returns YYYYMMDD-style integer', () => {
    expect(todaySeed(new Date('2026-05-16T00:00:00Z'))).toBe(20260516);
  });

  it('same date → same seed', () => {
    const d1 = new Date('2026-01-01T05:00:00Z');
    const d2 = new Date('2026-01-01T22:00:00Z');
    expect(todaySeed(d1)).toBe(todaySeed(d2));
  });
});
