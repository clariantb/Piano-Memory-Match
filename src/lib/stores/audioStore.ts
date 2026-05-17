import { writable, get } from 'svelte/store';
import type { InstrumentId } from '../types';
import { createInstrument, type InstrumentNode } from '../audio/instruments';
import { ensureAudio, setVolume } from '../audio/engine';

interface AudioStoreState {
  current: InstrumentNode | null;
  loading: boolean;
}

export const audioState = writable<AudioStoreState>({ current: null, loading: false });

export async function selectInstrument(id: InstrumentId): Promise<void> {
  await ensureAudio();
  const state = get(audioState);
  if (state.current?.id === id) return;
  state.current?.dispose();
  audioState.set({ current: null, loading: true });
  const next = createInstrument(id);
  await next.ready();
  audioState.set({ current: next, loading: false });
}

export function playNote(note: string, when?: number, duration?: string): void {
  const state = get(audioState);
  state.current?.play(note, when, duration);
}

export function applyVolume(volume: number, muted: boolean): void {
  setVolume(volume, muted);
}

export function disposeAudio(): void {
  const state = get(audioState);
  state.current?.dispose();
  audioState.set({ current: null, loading: false });
}
