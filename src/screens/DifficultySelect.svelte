<script lang="ts">
  import Button from '../components/Button.svelte';
  import { DIFFICULTIES } from '../lib/game/scoring';
  import { currentScreen, selectedDifficulty, selectedInstrument, newGame } from '../lib/stores/gameStore';
  import { get } from 'svelte/store';
  import type { DifficultyId } from '../lib/types';

  function pick(id: DifficultyId) {
    selectedDifficulty.set(id);
  }

  function start() {
    newGame(get(selectedInstrument), get(selectedDifficulty));
    currentScreen.set('game');
  }
</script>

<section class="screen">
  <header>
    <button class="back" on:click={() => currentScreen.set('instrument-select')}>← Back</button>
    <div class="eyebrow">Set the Tempo</div>
    <h1>Difficulty</h1>
    <p class="lede">More pairs, more notes, more memory.</p>
  </header>

  <div class="grid">
    {#each DIFFICULTIES as d}
      <button
        class="diff"
        class:selected={$selectedDifficulty === d.id}
        on:click={() => pick(d.id)}
        aria-pressed={$selectedDifficulty === d.id}
      >
        <div class="num">{d.pairs}</div>
        <div class="label">{d.label}</div>
        <div class="grid-preview" style:--cols={d.cols} style:--rows={d.rows}>
          {#each Array(d.cols * d.rows) as _, i (i)}
            <span></span>
          {/each}
        </div>
        <div class="par">par: {d.parMoves} moves</div>
      </button>
    {/each}
  </div>

  <footer>
    <Button variant="primary" on:click={start}>Begin →</Button>
  </footer>
</section>

<style>
  .screen {
    max-width: 980px;
    margin: 0 auto;
    padding: 32px 24px 80px;
    width: 100%;
  }
  header { text-align: center; margin-bottom: 36px; position: relative; }
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

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 36px;
  }

  .diff {
    background: rgba(42, 26, 15, 0.5);
    border: 1px solid rgba(201, 165, 92, 0.2);
    border-radius: 10px;
    padding: 24px 20px;
    color: var(--ivory);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    transition: all var(--transition);
  }
  .diff:hover {
    border-color: var(--gold);
    transform: translateY(-2px);
  }
  .diff.selected {
    border-color: var(--gold-bright);
    box-shadow: 0 0 0 1px var(--gold-bright), 0 8px 24px rgba(201, 165, 92, 0.25);
  }

  .num {
    font-family: var(--font-serif);
    font-size: 48px;
    font-weight: 600;
    color: var(--gold-bright);
    line-height: 1;
  }
  .label {
    font-size: 16px;
    font-family: var(--font-sans);
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--gold);
  }
  .grid-preview {
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
    gap: 2px;
    width: 64px;
    height: 64px;
    margin: 8px 0;
  }
  .grid-preview span {
    background: rgba(201, 165, 92, 0.35);
    border-radius: 1px;
  }
  .par {
    font-size: 11px;
    color: var(--ivory-dim);
    font-family: var(--font-sans);
    letter-spacing: 1px;
  }

  footer {
    display: flex;
    justify-content: center;
  }
</style>
