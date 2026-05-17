import * as Tone from 'tone';

interface AudioEngineState {
  gain: Tone.Gain;
  analyser: Tone.Analyser;
  started: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __pmmAudio: AudioEngineState | undefined;
}

function ensureState(): AudioEngineState {
  if (globalThis.__pmmAudio) return globalThis.__pmmAudio;
  const gain = new Tone.Gain(0.7).toDestination();
  const analyser = new Tone.Analyser('waveform', 256);
  gain.connect(analyser);
  const state: AudioEngineState = { gain, analyser, started: false };
  globalThis.__pmmAudio = state;
  return state;
}

export async function ensureAudio(): Promise<void> {
  const state = ensureState();
  if (state.started) return;
  await Tone.start();
  state.started = true;
}

export function getMasterNode(): Tone.Gain {
  return ensureState().gain;
}

export function getAnalyser(): Tone.Analyser {
  return ensureState().analyser;
}

export function setVolume(volume: number, muted: boolean): void {
  const state = ensureState();
  state.gain.gain.rampTo(muted ? 0 : Math.max(0, Math.min(1, volume)), 0.05);
}

export function isStarted(): boolean {
  return ensureState().started;
}
