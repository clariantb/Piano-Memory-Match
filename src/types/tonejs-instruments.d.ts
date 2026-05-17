declare module 'tonejs-instrument-violin-mp3' {
  import { Sampler } from 'tone';
  interface InstrumentViolinMp3Options {
    minify?: boolean;
    onload?: () => void;
  }
  export default class InstrumentViolinMp3 extends Sampler {
    constructor(options?: InstrumentViolinMp3Options);
  }
}
