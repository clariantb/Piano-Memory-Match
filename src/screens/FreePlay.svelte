<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import WaveformViz from '../components/WaveformViz.svelte';
  import { currentScreen, selectedInstrument } from '../lib/stores/gameStore';
  import { selectInstrument, playNote } from '../lib/stores/audioStore';
  import { INSTRUMENTS, getInstrumentMeta } from '../lib/audio/instruments';
  import { CHROMATIC_2_OCT, noteLabel } from '../lib/audio/notes';
  import type { InstrumentId } from '../lib/types';

  $: meta = getInstrumentMeta($selectedInstrument);

  async function pickInstrument(id: InstrumentId) {
    selectedInstrument.set(id);
    await selectInstrument(id);
  }

  function play(note: string) {
    playNote(note);
  }

  const KEY_MAP: Record<string, string> = {
    a: 'C4', w: 'C#4', s: 'D4', e: 'D#4', d: 'E4',
    f: 'F4', t: 'F#4', g: 'G4', y: 'G#4', h: 'A4',
    u: 'A#4', j: 'B4', k: 'C5', o: 'C#5', l: 'D5',
    p: 'D#5'
  };

  function handleKey(e: KeyboardEvent) {
    if (e.repeat) return;
    const note = KEY_MAP[e.key.toLowerCase()];
    if (note) {
      e.preventDefault();
      play(note);
    } else if (e.key === 'Escape') {
      currentScreen.set('main-menu');
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKey);
  });
  onDestroy(() => {
    window.removeEventListener('keydown', handleKey);
  });

  const WHITE_W = 44;
  const BLACK_W = 30;
  const GAP = 4;

  $: whites = CHROMATIC_2_OCT.filter((n) => !n.includes('#'));
  $: sharps = CHROMATIC_2_OCT
    .filter((note) => note.includes('#'))
    .map((note) => {
      const precedingWhite = note.replace(/#/, '');
      const whiteIdx = whites.indexOf(precedingWhite);
      return { note, whiteIdx };
    })
    .filter(({ whiteIdx }) => whiteIdx >= 0 && whiteIdx < whites.length - 1)
    .map(({ note, whiteIdx }) => ({
      note,
      label: noteLabel(note),
      left: (whiteIdx + 1) * WHITE_W + whiteIdx * GAP + GAP / 2 - BLACK_W / 2
    }));
</script>

<section class="screen page">
  <header>
    <button class="back" on:click={() => currentScreen.set('main-menu')}>← Menu</button>
    <div class="eyebrow">Improvise</div>
    <h1>Free Play</h1>
    <p class="lede">Use the keys, mouse, or your computer keyboard (A–K, white keys).</p>
  </header>

  <div class="picker">
    {#each INSTRUMENTS as inst}
      <button
        class="chip"
        class:active={$selectedInstrument === inst.id}
        style:--accent={inst.accent}
        on:click={() => pickInstrument(inst.id)}
      >
        <span class="ico">{inst.symbol}</span>
        {inst.name}
      </button>
    {/each}
  </div>

  <div class="viz-wrap">
    <WaveformViz height={80} color={meta.accent} />
  </div>

  <div class="keyboard">
    <div class="naturals">
      {#each whites as note}
        <button class="key natural" on:mousedown={() => play(note)}>
          <span>{noteLabel(note)}</span>
        </button>
      {/each}
    </div>
    {#each sharps as s}
      <button
        class="key sharp"
        style:left="{s.left}px"
        on:mousedown={() => play(s.note)}
      >
        <span>{s.label}</span>
      </button>
    {/each}
  </div>
</section>

<style>
  .page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px 24px 80px;
    width: 100%;
  }
  header { text-align: center; margin-bottom: 28px; position: relative; }
  .back {
    position: absolute; left: 0; top: 0;
    color: var(--ivory-dim);
    font-size: 14px; padding: 8px 12px; border-radius: 6px;
  }
  .back:hover { color: var(--gold-bright); }
  .eyebrow {
    font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
    color: var(--gold); margin-bottom: 8px;
  }
  h1 { font-size: clamp(32px, 5vw, 44px); margin: 0; }
  .lede {
    font-family: var(--font-serif); font-style: italic; color: var(--ivory-dim);
    margin: 8px 0 0;
  }

  .picker {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 28px;
  }
  .chip {
    --accent: var(--gold);
    background: rgba(42, 26, 15, 0.5);
    border: 1px solid rgba(201, 165, 92, 0.25);
    color: var(--ivory-dim);
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all var(--transition);
  }
  .chip .ico {
    color: var(--accent);
    font-family: var(--font-serif);
    font-size: 16px;
  }
  .chip:hover {
    border-color: var(--accent);
    color: var(--ivory);
  }
  .chip.active {
    background: var(--accent);
    color: var(--walnut-deep);
    border-color: var(--accent);
  }
  .chip.active .ico { color: var(--walnut-deep); }

  .viz-wrap {
    max-width: 700px;
    margin: 0 auto 28px;
    opacity: 0.7;
  }

  .keyboard {
    background: rgba(15, 9, 5, 0.5);
    border: 1px solid var(--gold-dim);
    border-radius: 10px;
    padding: 20px;
    position: relative;
    box-shadow: 0 8px 24px var(--shadow);
    width: max-content;
    margin: 0 auto;
    max-width: 100%;
    overflow-x: auto;
  }
  .naturals {
    display: flex;
    gap: 4px;
    position: relative;
    z-index: 1;
  }

  .key {
    border-radius: 0 0 6px 6px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 12px;
    font-family: var(--font-serif);
    transition: all 80ms;
  }
  .key.natural {
    background: linear-gradient(180deg, var(--ivory) 0%, #e3d4ad 100%);
    border: 1px solid var(--gold-dim);
    color: var(--walnut);
    width: 44px;
    height: 160px;
    font-size: 14px;
    box-shadow: 0 4px 0 var(--gold-dim), 0 6px 14px var(--shadow);
  }
  .key.natural:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 var(--gold-dim);
  }
  .key.sharp {
    position: absolute;
    top: 20px;
    background: linear-gradient(180deg, #2a1a0f 0%, #1a0d04 100%);
    border: 1px solid var(--walnut-deep);
    color: var(--gold-bright);
    width: 30px;
    height: 100px;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 3px 0 #0a0502, 0 5px 12px var(--shadow);
    font-size: 11px;
    z-index: 2;
  }
  .key.sharp:active {
    transform: translateY(1px);
    box-shadow: 0 2px 0 #0a0502;
  }
</style>
