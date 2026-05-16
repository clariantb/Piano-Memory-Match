import type { PersistedData, ScoreEntry, Settings } from './types';

const KEY = 'piano-memory-match:v1';
const CURRENT_SCHEMA = 1;

export const DEFAULT_SETTINGS: Settings = {
  volume: 0.7,
  muted: false,
  reducedMotion: 'auto',
  matchByEar: false,
  showNoteLabels: true,
  theme: 'concert-hall'
};

const EMPTY: PersistedData = {
  schemaVersion: CURRENT_SCHEMA,
  settings: DEFAULT_SETTINGS,
  scores: []
};

function safeStorage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  } catch {
    return null;
  }
}

export function loadAll(): PersistedData {
  const storage = safeStorage();
  if (!storage) return { ...EMPTY };
  const raw = storage.getItem(KEY);
  if (!raw) return { ...EMPTY };
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedData>;
    return migrate(parsed);
  } catch {
    return { ...EMPTY };
  }
}

export function migrate(data: Partial<PersistedData>): PersistedData {
  const scores = Array.isArray(data.scores) ? data.scores : [];
  const settings: Settings = { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) };
  return {
    schemaVersion: CURRENT_SCHEMA,
    settings,
    scores
  };
}

export function saveAll(data: PersistedData): void {
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.setItem(KEY, JSON.stringify(data));
  } catch {
    // quota exceeded or denied; ignore
  }
}

export function loadSettings(): Settings {
  return loadAll().settings;
}

export function saveSettings(settings: Settings): void {
  const data = loadAll();
  saveAll({ ...data, settings });
}

export function loadScores(): ScoreEntry[] {
  return loadAll().scores;
}

export function saveScore(entry: ScoreEntry): void {
  const data = loadAll();
  saveAll({ ...data, scores: [...data.scores, entry] });
}

export function clearScores(): void {
  const data = loadAll();
  saveAll({ ...data, scores: [] });
}
