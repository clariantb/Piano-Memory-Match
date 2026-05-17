import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadAll,
  loadSettings,
  saveAll,
  saveSettings,
  saveScore,
  loadScores,
  clearScores,
  migrate,
  DEFAULT_SETTINGS
} from '../src/lib/storage';
import type { PersistedData, ScoreEntry } from '../src/lib/types';

beforeEach(() => {
  localStorage.clear();
});

const sampleScore: ScoreEntry = {
  instrument: 'piano',
  difficulty: 'medium',
  timeMs: 30000,
  moves: 12,
  stars: 3,
  recordedAt: 1700000000000
};

describe('loadAll', () => {
  it('returns defaults when storage is empty', () => {
    const data = loadAll();
    expect(data.schemaVersion).toBe(1);
    expect(data.settings).toEqual(DEFAULT_SETTINGS);
    expect(data.scores).toEqual([]);
  });

  it('survives corrupt JSON', () => {
    localStorage.setItem('piano-memory-match:v1', '{not json');
    const data = loadAll();
    expect(data.settings).toEqual(DEFAULT_SETTINGS);
    expect(data.scores).toEqual([]);
  });

  it('roundtrips settings + scores', () => {
    saveSettings({ ...DEFAULT_SETTINGS, volume: 0.3, muted: true });
    saveScore(sampleScore);
    const data = loadAll();
    expect(data.settings.volume).toBe(0.3);
    expect(data.settings.muted).toBe(true);
    expect(data.scores).toEqual([sampleScore]);
  });
});

describe('migrate', () => {
  it('fills in missing settings with defaults', () => {
    const migrated = migrate({ scores: [], settings: { volume: 0.1 } as any });
    expect(migrated.settings.volume).toBe(0.1);
    expect(migrated.settings.muted).toBe(DEFAULT_SETTINGS.muted);
  });

  it('rejects non-array scores', () => {
    const migrated = migrate({ scores: 'oops' as any });
    expect(migrated.scores).toEqual([]);
  });
});

describe('saveScore', () => {
  it('appends without clobbering previous scores', () => {
    saveScore(sampleScore);
    saveScore({ ...sampleScore, moves: 8 });
    const scores = loadScores();
    expect(scores).toHaveLength(2);
    expect(scores[1].moves).toBe(8);
  });
});

describe('clearScores', () => {
  it('removes all scores but keeps settings', () => {
    saveSettings({ ...DEFAULT_SETTINGS, volume: 0.5 });
    saveScore(sampleScore);
    clearScores();
    expect(loadScores()).toEqual([]);
    expect(loadSettings().volume).toBe(0.5);
  });
});

describe('safety', () => {
  it('saveAll silently no-ops when localStorage throws', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const data: PersistedData = {
      schemaVersion: 1,
      settings: DEFAULT_SETTINGS,
      scores: []
    };
    expect(() => saveAll(data)).not.toThrow();
    setItemSpy.mockRestore();
  });
});
