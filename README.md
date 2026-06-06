# Piano Memory Match

A music memory match game. Flip pairs of cards and match them by sound — across ten sampled instruments, four difficulties, and an optional ear-training mode where labels are hidden and you match by listening alone.


## Features

- **Ten instruments** — piano (sampled), guitar, flute, marimba, violin, etc. 
- **Four difficulties** — 4, 8, 12, or 16 pairs (Expert spans two chromatic octaves)
- **Main menu** with Play, Free Play, High Scores, Settings, and How to Play
- **Match by Ear mode** — cards stay face-down even when flipped; identify pairs by sound
- **Free Play** — virtual keyboard with the chosen instrument, no game loop
- **Waveform visualization** synced to the master audio output
- **Star rating** (3/2/1) based on moves vs. par, with personal-best tracking per instrument + difficulty
- **3D card flip** that respects `prefers-reduced-motion`
- **Pause menu** with resume/restart/main menu, Esc-bindable
- **Confetti + fanfare** on win, with a "replay matched notes" melody button
- **Keyboard navigation** — Tab/Space to flip, R to replay last pair, Esc to pause
- **Persistent settings + scores** via `localStorage`
- **Mobile-friendly** layout with ≥44px touch targets

## Development

```bash
npm install
npm run dev          # vite dev server at http://localhost:5173
npm run test         # vitest unit tests (56 tests across engine / shuffle / scoring / storage)
npm run check        # svelte-check + typescript
npm run build        # type-check + production build to dist/
npm run preview      # preview the production build
```

## Architecture

```
src/
├── lib/
│   ├── game/      — pure FSM, scoring, seeded shuffle (unit-tested)
│   ├── audio/     — Tone.js engine singleton, instrument factory, note tables
│   ├── stores/    — Svelte stores for game / audio / settings / prefs
│   ├── storage.ts — localStorage facade with schema versioning
│   └── types.ts
├── screens/       — one Svelte component per top-level screen
├── components/    — Card, Hud, Button, WaveformViz, Confetti
└── App.svelte     — store-driven screen router
```

The match logic lives in `src/lib/game/engine.ts` as a pure finite state machine (`idle → firstFlipped → secondFlipped → resolving → won`), which is what makes it unit-testable and what eliminates the race-condition bug in the v1 click handler.

Audio is a single Tone.js `AudioContext` unlocked on first interaction. Piano uses `Tone.Sampler` over the original mp3s (pitch-shifting to fill chromatic notes); the rest are synthesized so no new sample files are required.

## Tech

- [Svelte 4](https://svelte.dev) + TypeScript
- [Vite 5](https://vitejs.dev)
- [Tone.js 15](https://tonejs.github.io) for audio
- [canvas-confetti](https://www.kirilv.com/canvas-confetti/) for the win effect
- [Vitest](https://vitest.dev) for unit tests

## License

MIT.
