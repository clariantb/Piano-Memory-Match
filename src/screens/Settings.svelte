<script lang="ts">
  import Button from '../components/Button.svelte';
  import { currentScreen } from '../lib/stores/gameStore';
  import { settings } from '../lib/stores/settingsStore';
  import { clearScores } from '../lib/storage';
  import type { Settings as SettingsT } from '../lib/types';

  function patch<K extends keyof SettingsT>(key: K, value: SettingsT[K]) {
    settings.patch({ [key]: value } as Partial<SettingsT>);
  }

  function setReducedMotion(value: string) {
    patch('reducedMotion', value as SettingsT['reducedMotion']);
  }

  function resetScores() {
    if (confirm('Clear all saved scores? This cannot be undone.')) {
      clearScores();
    }
  }
</script>

<section class="screen settings-page">
  <header>
    <button class="back" on:click={() => currentScreen.set('main-menu')}>← Menu</button>
    <div class="eyebrow">Adjust the Hall</div>
    <h1>Settings</h1>
  </header>

  <div class="group">
    <h3>Sound</h3>
    <div class="row">
      <label for="volume">Master Volume</label>
      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={$settings.volume}
        on:input={(e) => patch('volume', parseFloat(e.currentTarget.value))}
      />
      <span class="value">{Math.round($settings.volume * 100)}%</span>
    </div>
    <div class="row">
      <label for="mute">Mute</label>
      <input
        id="mute"
        type="checkbox"
        checked={$settings.muted}
        on:change={(e) => patch('muted', e.currentTarget.checked)}
      />
    </div>
  </div>

  <div class="group">
    <h3>Gameplay</h3>
    <div class="row">
      <label for="ear">
        Match by Ear
        <span class="hint">Cards stay face-down — match by listening alone</span>
      </label>
      <input
        id="ear"
        type="checkbox"
        checked={$settings.matchByEar}
        on:change={(e) => patch('matchByEar', e.currentTarget.checked)}
      />
    </div>
    <div class="row">
      <label for="labels">
        Show Note Labels
        <span class="hint">Display the letter (C, D, …) on revealed cards</span>
      </label>
      <input
        id="labels"
        type="checkbox"
        checked={$settings.showNoteLabels}
        on:change={(e) => patch('showNoteLabels', e.currentTarget.checked)}
      />
    </div>
  </div>

  <div class="group">
    <h3>Display</h3>
    <div class="row">
      <label for="motion">Reduced Motion</label>
      <select
        id="motion"
        value={$settings.reducedMotion}
        on:change={(e) => setReducedMotion(e.currentTarget.value)}
      >
        <option value="auto">Auto (system)</option>
        <option value="off">Off</option>
        <option value="on">On</option>
      </select>
    </div>
  </div>

  <div class="group danger">
    <h3>Data</h3>
    <div class="row">
      <label for="reset-btn">Clear all saved scores</label>
      <button id="reset-btn" class="reset" on:click={resetScores}>Reset</button>
    </div>
  </div>

  <footer>
    <Button variant="primary" on:click={() => currentScreen.set('main-menu')}>Done</Button>
  </footer>
</section>

<style>
  .settings-page {
    max-width: 600px;
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

  .group {
    background: rgba(42, 26, 15, 0.5);
    border: 1px solid rgba(201, 165, 92, 0.2);
    border-radius: 10px;
    padding: 20px 24px;
    margin-bottom: 16px;
  }
  .group h3 {
    font-family: var(--font-sans);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--gold);
    margin: 0 0 14px;
    font-weight: 600;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(201, 165, 92, 0.08);
    gap: 16px;
  }
  .row:last-child { border-bottom: none; }
  label {
    color: var(--ivory);
    font-size: 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .hint {
    color: var(--ivory-dim);
    font-size: 12px;
    font-style: italic;
    font-family: var(--font-serif);
  }
  input[type='range'] {
    flex: 0 1 200px;
    accent-color: var(--gold);
  }
  input[type='checkbox'] {
    width: 20px; height: 20px;
    accent-color: var(--gold);
  }
  select {
    background: rgba(15, 9, 5, 0.6);
    border: 1px solid var(--gold-dim);
    color: var(--ivory);
    padding: 8px 12px;
    border-radius: 5px;
    font-family: var(--font-sans);
    font-size: 14px;
  }
  .value {
    font-family: var(--font-serif);
    color: var(--gold-bright);
    min-width: 48px;
    text-align: right;
  }
  .reset {
    color: #d99;
    border: 1px solid #6b2c2c;
    background: rgba(107, 44, 44, 0.2);
    padding: 6px 14px;
    border-radius: 5px;
    font-size: 13px;
  }
  .reset:hover {
    background: rgba(107, 44, 44, 0.4);
  }

  footer {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }
</style>
