import * as Tone from 'tone';
import type { InstrumentId, InstrumentMeta } from '../types';
import { getMasterNode } from './engine';

export interface InstrumentNode {
  id: InstrumentId;
  play(note: string, when?: number, duration?: string): void;
  ready(): Promise<void>;
  dispose(): void;
}

export const INSTRUMENTS: readonly InstrumentMeta[] = [
  {
    id: 'piano',
    name: 'Grand Piano',
    tagline: 'Warm samples from a recital hall',
    symbol: '𝄞',
    accent: '#c9a55c',
    cardBackGradient: 'linear-gradient(135deg, #2a1605 0%, #1a0d04 100%)',
    cardBackMonogram: '𝄞'
  },
  {
    id: 'guitar',
    name: 'Acoustic Guitar',
    tagline: 'Plucked nylon strings',
    symbol: '𝄢',
    accent: '#b8753a',
    cardBackGradient: 'linear-gradient(135deg, #3a2410 0%, #1f1306 100%)',
    cardBackMonogram: '♪'
  },
  {
    id: 'flute',
    name: 'Silver Flute',
    tagline: 'Pure breath, floating tone',
    symbol: '𝄐',
    accent: '#a8c6d4',
    cardBackGradient: 'linear-gradient(135deg, #1a2a30 0%, #0d1518 100%)',
    cardBackMonogram: '♭'
  },
  {
    id: 'marimba',
    name: 'Marimba',
    tagline: 'Soft mallets on rosewood',
    symbol: '𝅗𝅥',
    accent: '#d4a574',
    cardBackGradient: 'linear-gradient(135deg, #2a1c0d 0%, #1a1108 100%)',
    cardBackMonogram: '♩'
  },
  {
    id: 'violin',
    name: 'Violin',
    tagline: 'Singing strings with vibrato',
    symbol: '𝅘𝅥',
    accent: '#c47a5e',
    cardBackGradient: 'linear-gradient(135deg, #2a1208 0%, #180a04 100%)',
    cardBackMonogram: '♬'
  },
  {
    id: 'synth',
    name: 'Polysynth',
    tagline: 'Bright modern timbre',
    symbol: '⏦',
    accent: '#b89bd4',
    cardBackGradient: 'linear-gradient(135deg, #1a142e 0%, #0d0a18 100%)',
    cardBackMonogram: '※'
  }
];

export function getInstrumentMeta(id: InstrumentId): InstrumentMeta {
  const meta = INSTRUMENTS.find((i) => i.id === id);
  if (!meta) throw new Error(`Unknown instrument: ${id}`);
  return meta;
}

function pianoNode(): InstrumentNode {
  const sampler = new Tone.Sampler({
    urls: {
      A4: 'A.mp3',
      B4: 'B.mp3',
      C4: 'C.mp3',
      C5: 'C2.mp3',
      D4: 'D.mp3',
      E4: 'E.mp3',
      F4: 'F.mp3',
      G4: 'G.mp3'
    },
    baseUrl: '/sounds/piano/',
    release: 1.2
  }).connect(getMasterNode());
  return {
    id: 'piano',
    play: (note, when, duration = '2n') => sampler.triggerAttackRelease(note, duration, when),
    ready: () => Tone.loaded(),
    dispose: () => sampler.dispose()
  };
}

function guitarNode(): InstrumentNode {
  const pluck = new Tone.PluckSynth({
    attackNoise: 0.8,
    dampening: 4000,
    resonance: 0.9,
    release: 0.6
  }).connect(getMasterNode());
  return {
    id: 'guitar',
    play: (note, when, duration = '4n') => pluck.triggerAttackRelease(note, duration, when),
    ready: async () => undefined,
    dispose: () => pluck.dispose()
  };
}

function fluteNode(): InstrumentNode {
  const synth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.08, decay: 0.1, sustain: 0.7, release: 0.5 },
    volume: -8
  }).connect(getMasterNode());
  const vibrato = new Tone.Vibrato(5, 0.04).connect(getMasterNode());
  synth.connect(vibrato);
  return {
    id: 'flute',
    play: (note, when, duration = '2n') => synth.triggerAttackRelease(note, duration, when),
    ready: async () => undefined,
    dispose: () => {
      synth.dispose();
      vibrato.dispose();
    }
  };
}

function marimbaNode(): InstrumentNode {
  const synth = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.6, release: 0.4 },
    harmonicity: 3.1,
    modulationIndex: 16,
    resonance: 4000,
    octaves: 0.5,
    volume: -22
  }).connect(getMasterNode());
  return {
    id: 'marimba',
    play: (note, when, duration = '8n') => synth.triggerAttackRelease(note, duration, when),
    ready: async () => undefined,
    dispose: () => synth.dispose()
  };
}

function violinNode(): InstrumentNode {
  const synth = new Tone.AMSynth({
    harmonicity: 2.5,
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.3, decay: 0.2, sustain: 0.8, release: 0.6 },
    modulation: { type: 'sine' },
    modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 },
    volume: -10
  }).connect(getMasterNode());
  const vibrato = new Tone.Vibrato(6, 0.06).connect(getMasterNode());
  synth.connect(vibrato);
  return {
    id: 'violin',
    play: (note, when, duration = '2n') => synth.triggerAttackRelease(note, duration, when),
    ready: async () => undefined,
    dispose: () => {
      synth.dispose();
      vibrato.dispose();
    }
  };
}

function polysynthNode(): InstrumentNode {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'fatsawtooth', count: 3, spread: 30 },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.6, release: 0.4 },
    volume: -14
  }).connect(getMasterNode());
  return {
    id: 'synth',
    play: (note, when, duration = '4n') => synth.triggerAttackRelease(note, duration, when),
    ready: async () => undefined,
    dispose: () => synth.dispose()
  };
}

const FACTORIES: Record<InstrumentId, () => InstrumentNode> = {
  piano: pianoNode,
  guitar: guitarNode,
  flute: fluteNode,
  marimba: marimbaNode,
  violin: violinNode,
  synth: polysynthNode
};

export function createInstrument(id: InstrumentId): InstrumentNode {
  return FACTORIES[id]();
}
