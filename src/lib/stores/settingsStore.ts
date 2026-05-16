import { writable } from 'svelte/store';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '../storage';
import { applyVolume } from './audioStore';

function createSettingsStore() {
  const initial: Settings =
    typeof window === 'undefined' ? { ...DEFAULT_SETTINGS } : loadSettings();
  const { subscribe, set, update } = writable<Settings>(initial);

  return {
    subscribe,
    set: (value: Settings) => {
      set(value);
      saveSettings(value);
      applyVolume(value.volume, value.muted);
    },
    update: (fn: (s: Settings) => Settings) =>
      update((current) => {
        const next = fn(current);
        saveSettings(next);
        applyVolume(next.volume, next.muted);
        return next;
      }),
    patch: (patch: Partial<Settings>) =>
      update((current) => {
        const next = { ...current, ...patch };
        saveSettings(next);
        applyVolume(next.volume, next.muted);
        return next;
      })
  };
}

export const settings = createSettingsStore();
