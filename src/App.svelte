<script lang="ts">
  import { onMount } from 'svelte';
  import { currentScreen } from './lib/stores/gameStore';
  import { settings } from './lib/stores/settingsStore';
  import { effectiveReducedMotion } from './lib/stores/prefsStore';
  import { applyVolume } from './lib/stores/audioStore';

  import MainMenu from './screens/MainMenu.svelte';
  import InstrumentSelect from './screens/InstrumentSelect.svelte';
  import DifficultySelect from './screens/DifficultySelect.svelte';
  import Game from './screens/Game.svelte';
  import WinScreen from './screens/WinScreen.svelte';
  import Settings from './screens/Settings.svelte';
  import HighScores from './screens/HighScores.svelte';
  import HowToPlay from './screens/HowToPlay.svelte';
  import FreePlay from './screens/FreePlay.svelte';

  onMount(() => {
    applyVolume($settings.volume, $settings.muted);
    currentScreen.set('main-menu');
  });

  $: if (typeof document !== 'undefined') {
    document.documentElement.dataset.reducedMotion = String($effectiveReducedMotion);
    document.documentElement.dataset.theme = $settings.theme;
  }
</script>

<main>
  {#if $currentScreen === 'main-menu'}
    <MainMenu />
  {:else if $currentScreen === 'instrument-select'}
    <InstrumentSelect />
  {:else if $currentScreen === 'difficulty-select'}
    <DifficultySelect />
  {:else if $currentScreen === 'game'}
    <Game />
  {:else if $currentScreen === 'win'}
    <WinScreen />
  {:else if $currentScreen === 'settings'}
    <Settings />
  {:else if $currentScreen === 'high-scores'}
    <HighScores />
  {:else if $currentScreen === 'how-to-play'}
    <HowToPlay />
  {:else if $currentScreen === 'free-play'}
    <FreePlay />
  {/if}
</main>

<style>
  main {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
