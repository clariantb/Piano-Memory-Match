<script lang="ts">
  import Button from '../components/Button.svelte';
  import { INSTRUMENTS } from '../lib/audio/instruments';
  import { currentScreen, selectedInstrument } from '../lib/stores/gameStore';
  import { selectInstrument, playNote, audioState } from '../lib/stores/audioStore';
  import type { InstrumentId } from '../lib/types';

  async function pick(id: InstrumentId) {
    selectedInstrument.set(id);
    await selectInstrument(id);
    playNote('C4');
  }

  function next() {
    currentScreen.set('difficulty-select');
  }
</script>

<section class="screen">
  <header>
    <button class="back" on:click={() => currentScreen.set('main-menu')}>← Menu</button>
    <div class="eyebrow">Choose your Voice</div>
    <h1>Instrument</h1>
    <p class="lede">Click a card to preview the timbre.</p>
  </header>

  <div class="grid">
    {#each INSTRUMENTS as inst}
      <button
        class="instrument"
        class:selected={$selectedInstrument === inst.id}
        on:click={() => pick(inst.id)}
        aria-pressed={$selectedInstrument === inst.id}
      >
        <div class="card-back" style:background={inst.cardBackGradient}>
          <span class="mono" style:color={inst.accent}>{inst.symbol}</span>
        </div>
        <div class="meta">
          <h3 style:color={inst.accent}>{inst.name}</h3>
          <p>{inst.tagline}</p>
        </div>
        {#if $selectedInstrument === inst.id}
          <span class="check">✓</span>
        {/if}
      </button>
    {/each}
  </div>

  <footer>
    <Button variant="primary" on:click={next} disabled={$audioState.loading}>
      {$audioState.loading ? 'Tuning…' : 'Continue →'}
    </Button>
  </footer>
</section>

<style>
  .screen {
    max-width: 980px;
    margin: 0 auto;
    padding: 32px 24px 80px;
    width: 100%;
  }
  header {
    text-align: center;
    margin-bottom: 36px;
    position: relative;
  }
  .back {
    position: absolute;
    left: 0;
    top: 0;
    color: var(--ivory-dim);
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 6px;
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
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    margin-bottom: 36px;
  }

  .instrument {
    position: relative;
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 16px;
    background: rgba(42, 26, 15, 0.5);
    border: 1px solid rgba(201, 165, 92, 0.2);
    border-radius: 10px;
    text-align: left;
    color: var(--ivory);
    transition: all var(--transition);
  }
  .instrument:hover {
    border-color: var(--gold);
    transform: translateY(-2px);
    background: rgba(42, 26, 15, 0.7);
  }
  .instrument.selected {
    border-color: var(--gold-bright);
    box-shadow: 0 0 0 1px var(--gold-bright), 0 8px 24px rgba(201, 165, 92, 0.25);
  }

  .card-back {
    width: 64px; height: 84px;
    border-radius: 6px;
    border: 1px solid var(--gold-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px var(--shadow);
  }
  .mono {
    font-family: var(--font-serif);
    font-size: 28px;
  }
  .meta { flex: 1; }
  .meta h3 {
    font-size: 18px;
    margin: 0 0 4px;
    font-family: var(--font-serif);
  }
  .meta p {
    margin: 0;
    font-size: 13px;
    color: var(--ivory-dim);
  }
  .check {
    position: absolute;
    top: 12px; right: 14px;
    color: var(--gold-bright);
    font-size: 14px;
  }

  footer {
    display: flex;
    justify-content: center;
  }
</style>
