import * as Tone from 'tone';
import ViolinMp3 from 'tonejs-instrument-violin-mp3';
import GuitarMp3 from 'tonejs-instrument-guitar-acoustic-mp3';
import FluteMp3 from 'tonejs-instrument-flute-mp3';
import XylophoneMp3 from 'tonejs-instrument-xylophone-mp3';
import TrumpetMp3 from 'tonejs-instrument-trumpet-mp3';
import HarpMp3 from 'tonejs-instrument-harp-mp3';
import SaxophoneMp3 from 'tonejs-instrument-saxophone-mp3';
import CelloMp3 from 'tonejs-instrument-cello-mp3';
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
    id: 'violin',
    name: 'Violin',
    tagline: 'Singing strings with vibrato',
    symbol: '𝅘𝅥',
    accent: '#c47a5e',
    cardBackGradient: 'linear-gradient(135deg, #2a1208 0%, #180a04 100%)',
    cardBackMonogram: '♬'
  },
  {
    id: 'cello',
    name: 'Cello',
    tagline: 'Deep bowed resonance',
    symbol: '𝅗𝅥',
    accent: '#a14a4a',
    cardBackGradient: 'linear-gradient(135deg, #2a1010 0%, #180808 100%)',
    cardBackMonogram: '♬'
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
    id: 'trumpet',
    name: 'Trumpet',
    tagline: 'Bright brass call',
    symbol: '♫',
    accent: '#e0a04d',
    cardBackGradient: 'linear-gradient(135deg, #3a2208 0%, #1f1204 100%)',
    cardBackMonogram: '♫'
  },
  {
    id: 'saxophone',
    name: 'Saxophone',
    tagline: 'Smoky reed, jazz at midnight',
    symbol: '♬',
    accent: '#d49b5a',
    cardBackGradient: 'linear-gradient(135deg, #2e1a08 0%, #1a0e04 100%)',
    cardBackMonogram: '♫'
  },
  {
    id: 'harp',
    name: 'Concert Harp',
    tagline: 'Plucked strings, ethereal',
    symbol: '𝄐',
    accent: '#c9b8d4',
    cardBackGradient: 'linear-gradient(135deg, #1d1830 0%, #100c1a 100%)',
    cardBackMonogram: '♪'
  },
  {
    id: 'xylophone',
    name: 'Xylophone',
    tagline: 'Bright wooden bars',
    symbol: '𝅗𝅥',
    accent: '#d4b074',
    cardBackGradient: 'linear-gradient(135deg, #2a1c0d 0%, #1a1108 100%)',
    cardBackMonogram: '♩'
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

function sampledNode(
  id: InstrumentId,
  sampler: Tone.Sampler,
  duration = '2n'
): InstrumentNode {
  sampler.connect(getMasterNode());
  return {
    id,
    play: (note, when, dur = duration) => sampler.triggerAttackRelease(note, dur, when),
    ready: () => Tone.loaded(),
    dispose: () => sampler.dispose()
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
  guitar: () => sampledNode('guitar', new GuitarMp3(), '2n'),
  violin: () => sampledNode('violin', new ViolinMp3(), '2n'),
  cello: () => sampledNode('cello', new CelloMp3(), '2n'),
  flute: () => sampledNode('flute', new FluteMp3(), '2n'),
  trumpet: () => sampledNode('trumpet', new TrumpetMp3(), '2n'),
  saxophone: () => sampledNode('saxophone', new SaxophoneMp3(), '2n'),
  harp: () => sampledNode('harp', new HarpMp3(), '1n'),
  xylophone: () => sampledNode('xylophone', new XylophoneMp3(), '4n'),
  synth: polysynthNode
};

export function createInstrument(id: InstrumentId): InstrumentNode {
  return FACTORIES[id]();
}
