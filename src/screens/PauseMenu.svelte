<script lang="ts">
  import Button from '../components/Button.svelte';
  import {
    currentScreen,
    resumeGame,
    endGame,
    selectedInstrument,
    selectedDifficulty,
    newGame
  } from '../lib/stores/gameStore';
  import { get } from 'svelte/store';

  function restart() {
    newGame(get(selectedInstrument), get(selectedDifficulty));
  }

  function home() {
    endGame();
    currentScreen.set('main-menu');
  }
</script>

<div class="overlay" role="dialog" aria-modal="true" aria-label="Game paused">
  <div class="panel">
    <div class="eyebrow">Intermission</div>
    <h2>Paused</h2>
    <div class="actions">
      <Button variant="primary" fullWidth on:click={resumeGame}>Resume</Button>
      <Button variant="secondary" fullWidth on:click={restart}>Restart</Button>
      <Button variant="ghost" fullWidth on:click={home}>Main Menu</Button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 9, 5, 0.78);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn var(--transition);
  }
  .panel {
    background: linear-gradient(180deg, var(--walnut-light) 0%, var(--walnut) 100%);
    border: 1px solid var(--gold-dim);
    border-radius: 12px;
    padding: 36px 40px;
    text-align: center;
    min-width: 320px;
    box-shadow: 0 24px 60px var(--shadow);
  }
  .eyebrow {
    font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
    color: var(--gold); margin-bottom: 8px;
  }
  h2 {
    font-size: 36px;
    margin: 0 0 24px;
    color: var(--ivory);
  }
  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
