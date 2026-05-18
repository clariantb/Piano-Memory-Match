<script lang="ts">
  import Button from '../components/Button.svelte';
  import { currentScreen } from '../lib/stores/gameStore';
  import { ensureAudio } from '../lib/audio/engine';
  import { selectInstrument } from '../lib/stores/audioStore';
  import { selectedInstrument } from '../lib/stores/gameStore';
  import { get } from 'svelte/store';

  async function start(target: 'instrument-select' | 'free-play') {
    await ensureAudio();
    await selectInstrument(get(selectedInstrument));
    currentScreen.set(target);
  }
</script>

<section class="screen menu">
  <header>
    <div class="eyebrow">Curtain Up</div>
    <h1>Piano Memory<br /><em>Match</em></h1>
    <p class="subtitle">
      A music memory game — match pairs of notes by sight or by ear, across ten instruments.
    </p>
    <div class="flourish">𝄞</div>
  </header>

  <nav class="actions">
    <Button variant="primary" fullWidth on:click={() => start('instrument-select')}>
      Play
    </Button>
    <Button variant="secondary" fullWidth on:click={() => start('free-play')}>
      Free Play
    </Button>
    <Button variant="secondary" fullWidth on:click={() => currentScreen.set('high-scores')}>
      High Scores
    </Button>
    <Button variant="secondary" fullWidth on:click={() => currentScreen.set('settings')}>
      Settings
    </Button>
    <Button variant="ghost" fullWidth on:click={() => currentScreen.set('how-to-play')}>
      How to Play
    </Button>
  </nav>
</section>

<style>
  .menu {
    max-width: 420px;
    margin: 0 auto;
    padding: 56px 24px 80px;
    display: flex;
    flex-direction: column;
    gap: 48px;
    align-items: stretch;
    text-align: center;
    min-height: 100vh;
    justify-content: center;
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }

  .eyebrow {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 4px;
    color: var(--gold);
    margin-bottom: 8px;
  }

  h1 {
    font-size: clamp(40px, 9vw, 56px);
    line-height: 1.05;
    color: var(--ivory);
    letter-spacing: -0.5px;
  }
  h1 em {
    color: var(--gold-bright);
    font-style: italic;
    font-weight: 400;
  }

  .subtitle {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 17px;
    color: var(--ivory-dim);
    max-width: 32ch;
    margin: 0;
  }

  .flourish {
    font-size: 36px;
    color: var(--gold);
    margin-top: 8px;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
