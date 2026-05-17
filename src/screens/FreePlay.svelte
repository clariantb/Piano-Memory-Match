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

  $: keys = CHROMATIC_2_OCT.map((note) => ({
    note,
    label: noteLabel(note),
    sharp: note.includes('#')
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
    <div class="row sharps">
      {#each keys as k}
        {#if k.sharp}
          <button class="key sharp" on:mousedown={() => play(k.note)}>
            <span>{k.label}</span>
          </button>
        {:else}
          <span class="key-spacer" class:wide={k.label === 'E' || k.label === 'B'}></span>
        {/if}
      {/each}
    </div>
    <div class="row naturals">
      {#each keys.filter((k) => !k.sharp) as k}
        <button class="key natural" on:mousedown={() => play(k.note)}>
          <span>{k.label}</span>
        </button>
      {/each}
    </div>
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
  }
  .row { display: flex; gap: 4px; justify-content: center; }
  .sharps {
    height: 100px;
    margin-bottom: -100px;
    z-index: 2;
    position: relative;
    padding: 0 22px;
  }
  .naturals { z-index: 1; position: relative; }

  .key {
    background: linear-gradient(180deg, var(--ivory) 0%, #e3d4ad 100%);
    border: 1px solid var(--gold-dim);
    border-radius: 0 0 6px 6px;
    color: var(--walnut);
    width: 44px;
    height: 160px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 12px;
    font-family: var(--font-serif);
    font-size: 14px;
    transition: all 80ms;
    box-shadow: 0 4px 0 var(--gold-dim), 0 6px 14px var(--shadow);
  }
  .key.natural:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 var(--gold-dim);
  }
  .key.sharp {
    background: linear-gradient(180deg, #2a1a0f 0%, #1a0d04 100%);
    color: var(--gold-bright);
    width: 30px;
    height: 100px;
    border-radius: 0 0 4px 4px;
    border-color: var(--walnut-deep);
    box-shadow: 0 3px 0 #0a0502, 0 5px 12px var(--shadow);
    font-size: 11px;
  }
  .key.sharp:active {
    transform: translateY(1px);
    box-shadow: 0 2px 0 #0a0502;
  }
  .key-spacer { width: 30px; flex-shrink: 0; }
  .key-spacer.wide { margin-right: 4px; }
</style>
