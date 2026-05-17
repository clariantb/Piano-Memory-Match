<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import Card from '../components/Card.svelte';
  import Hud from '../components/Hud.svelte';
  import WaveformViz from '../components/WaveformViz.svelte';
  import PauseMenu from './PauseMenu.svelte';
  import {
    currentScreen,
    selectedInstrument,
    selectedDifficulty,
    game,
    flip,
    resolveBoard,
    pauseGame,
    newGame
  } from '../lib/stores/gameStore';
  import { playNote } from '../lib/stores/audioStore';
  import { settings } from '../lib/stores/settingsStore';
  import { getInstrumentMeta } from '../lib/audio/instruments';
  import { getDifficulty } from '../lib/game/scoring';
  import { saveScore } from '../lib/storage';
  import { starRating } from '../lib/game/scoring';

  $: meta = getInstrumentMeta($selectedInstrument);
  $: config = getDifficulty($selectedDifficulty);

  let resolveTimer: ReturnType<typeof setTimeout> | null = null;
  let lastReplayPair: number[] | null = null;

  function handleCardClick(index: number) {
    const state = get(game);
    if (!state) return;
    if (state.phase !== 'idle' && state.phase !== 'firstFlipped') return;
    const card = state.cards[index];
    if (card.state !== 'face-down') return;

    flip(index);
    playNote(card.note);

    const after = get(game);
    if (after?.phase === 'resolving') {
      lastReplayPair = [after.firstIndex!, after.secondIndex!];
      if (resolveTimer) clearTimeout(resolveTimer);
      const a = after.cards[after.firstIndex!];
      const b = after.cards[after.secondIndex!];
      const isMatch = a.pairId === b.pairId;
      resolveTimer = setTimeout(() => {
        resolveBoard();
        const final = get(game);
        if (final?.phase === 'won') {
          const stars = starRating(final.moves, config.parMoves);
          saveScore({
            instrument: $selectedInstrument,
            difficulty: $selectedDifficulty,
            timeMs: final.elapsedMs,
            moves: final.moves,
            stars,
            recordedAt: Date.now()
          });
          currentScreen.set('win');
        }
      }, isMatch ? 700 : 1100);
    }
  }

  function replayLastPair() {
    const state = get(game);
    if (!state || !lastReplayPair) return;
    const [a, b] = lastReplayPair;
    playNote(state.cards[a].note);
    setTimeout(() => playNote(state.cards[b].note), 450);
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      pauseGame();
    } else if (e.key.toLowerCase() === 'r') {
      replayLastPair();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKey);
  });
  onDestroy(() => {
    window.removeEventListener('keydown', handleKey);
    if (resolveTimer) clearTimeout(resolveTimer);
  });

  function restart() {
    newGame($selectedInstrument, $selectedDifficulty);
  }
</script>

{#if $game}
  <section class="screen game">
    <header>
      <button class="icon-btn" on:click={pauseGame} aria-label="Pause">⏸</button>
      <Hud
        timeMs={$game.elapsedMs}
        moves={$game.moves}
        matched={$game.matchedPairs}
        total={$game.totalPairs}
      />
      <button class="icon-btn" on:click={restart} aria-label="Restart">↻</button>
    </header>

    <div class="board-wrap">
      <div
        class="board"
        style:--cols={config.cols}
        style:--rows={config.rows}
      >
        {#each $game.cards as card, i (card.id)}
          <Card
            {card}
            {meta}
            matchByEar={$settings.matchByEar}
            showLabels={$settings.showNoteLabels}
            disabled={$game.phase === 'resolving' || $game.phase === 'paused'}
            on:click={() => handleCardClick(i)}
          />
        {/each}
      </div>

      <div class="viz">
        <WaveformViz height={60} color={meta.accent} />
      </div>
    </div>

    <div class="hint muted serif italic">
      Press <kbd>R</kbd> to replay last pair · <kbd>Esc</kbd> to pause
    </div>
  </section>

  {#if $game.phase === 'paused'}
    <PauseMenu />
  {/if}
{/if}

<style>
  .game {
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px 16px 60px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    min-height: 100vh;
  }

  header {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    justify-content: space-between;
    max-width: 700px;
  }

  .icon-btn {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: rgba(201, 165, 92, 0.08);
    border: 1px solid var(--gold-dim);
    color: var(--gold);
    font-size: 18px;
    transition: all var(--transition);
    display: flex; align-items: center; justify-content: center;
  }
  .icon-btn:hover {
    background: rgba(201, 165, 92, 0.18);
    border-color: var(--gold);
    color: var(--gold-bright);
  }

  .board-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  .board {
    --gap: 10px;
    --board-max: min(95vw, 1000px);
    --fit-w: calc((var(--board-max) - (var(--cols) - 1) * var(--gap)) / var(--cols));
    --fit-h: calc((88vh - 260px - (var(--rows) - 1) * var(--gap)) / var(--rows));
    --card-size: min(170px, var(--fit-w), var(--fit-h));
    display: grid;
    grid-template-columns: repeat(var(--cols), var(--card-size));
    grid-auto-rows: var(--card-size);
    gap: var(--gap);
    justify-content: center;
  }

  .viz {
    width: 100%;
    max-width: min(1000px, 95vw);
    opacity: 0.7;
  }

  .hint { font-size: 13px; }
  kbd {
    font-family: var(--font-sans);
    background: rgba(201, 165, 92, 0.12);
    border: 1px solid var(--gold-dim);
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 11px;
    color: var(--gold-bright);
    margin: 0 2px;
  }

  @media (max-width: 560px) {
    header { gap: 8px; }
  }
</style>
