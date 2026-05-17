import { readable, derived } from 'svelte/store';
import { settings } from './settingsStore';

function systemReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const systemReducedMotionStore = readable<boolean>(systemReducedMotion(), (set) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => undefined;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const listener = (e: MediaQueryListEvent) => set(e.matches);
  mq.addEventListener('change', listener);
  return () => mq.removeEventListener('change', listener);
});

export const effectiveReducedMotion = derived(
  [settings, systemReducedMotionStore],
  ([$settings, $system]) => {
    if ($settings.reducedMotion === 'on') return true;
    if ($settings.reducedMotion === 'off') return false;
    return $system;
  }
);

export const scoresStore = readable<unknown>(null);
