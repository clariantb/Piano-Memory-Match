interface ToneJsInstrumentOptions {
  minify?: boolean;
  onload?: () => void;
}

declare module 'tonejs-instrument-violin-mp3' {
  import { Sampler } from 'tone';
  export default class InstrumentViolinMp3 extends Sampler {
    constructor(options?: ToneJsInstrumentOptions);
  }
}

declare module 'tonejs-instrument-guitar-acoustic-mp3' {
  import { Sampler } from 'tone';
  export default class InstrumentGuitarAcousticMp3 extends Sampler {
    constructor(options?: ToneJsInstrumentOptions);
  }
}

declare module 'tonejs-instrument-flute-mp3' {
  import { Sampler } from 'tone';
  export default class InstrumentFluteMp3 extends Sampler {
    constructor(options?: ToneJsInstrumentOptions);
  }
}

declare module 'tonejs-instrument-xylophone-mp3' {
  import { Sampler } from 'tone';
  export default class InstrumentXylophoneMp3 extends Sampler {
    constructor(options?: ToneJsInstrumentOptions);
  }
}

declare module 'tonejs-instrument-trumpet-mp3' {
  import { Sampler } from 'tone';
  export default class InstrumentTrumpetMp3 extends Sampler {
    constructor(options?: ToneJsInstrumentOptions);
  }
}

declare module 'tonejs-instrument-harp-mp3' {
  import { Sampler } from 'tone';
  export default class InstrumentHarpMp3 extends Sampler {
    constructor(options?: ToneJsInstrumentOptions);
  }
}

declare module 'tonejs-instrument-saxophone-mp3' {
  import { Sampler } from 'tone';
  export default class InstrumentSaxophoneMp3 extends Sampler {
    constructor(options?: ToneJsInstrumentOptions);
  }
}

declare module 'tonejs-instrument-cello-mp3' {
  import { Sampler } from 'tone';
  export default class InstrumentCelloMp3 extends Sampler {
    constructor(options?: ToneJsInstrumentOptions);
  }
}
