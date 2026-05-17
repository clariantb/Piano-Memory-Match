<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import Button from '../components/Button.svelte';
  import Confetti from '../components/Confetti.svelte';
  import {
    currentScreen,
    selectedInstrument,
    selectedDifficulty,
    game,
    newGame,
    endGame
  } from '../lib/stores/gameStore';
  import { playNote } from '../lib/stores/audioStore';
  import { getInstrumentMeta } from '../lib/audio/instruments';
  import { getDifficulty, starRating, formatTime, findBestScore } from '../lib/game/scoring';
  import { loadScores } from '../lib/storage';

  $: meta = getInstrumentMeta($selectedInstrument);
  $: config = getDifficulty($selectedDifficulty);
  $: stars = $game ? starRating($game.moves, config.parMoves) : 1;
  $: best = findBestScore(loadScores(), $selectedInstrument, $selectedDifficulty);

  let confettiActive = false;

  onMount(() => {
    confettiActive = true;
    playFanfare();
  });

  function playFanfare() {
    const fanfare = ['C4', 'E4', 'G4', 'C5'];
    fanfare.forEach((n, i) => {
      setTimeout(() => playNote(n, undefined, '4n'), i * 220);
    });
  }

  function replayMelody() {
    const state = get(game);
    if (!state) return;
    state.matchHistory.forEach((pairId, i) => {
      const card = state.cards.find((c) => c.pairId === pairId);
      if (card) setTimeout(() => playNote(card.note), i * 360);
    });
  }

  function playAgain() {
    newGame($selectedInstrument, $selectedDifficulty);
    currentScreen.set('game');
  }

  function home() {
    endGame();
    currentScreen.set('main-menu');
  }
</script>

{#if $game}
  <Confetti bind:active={confettiActive} />
  <section class="screen win">
    <div class="eyebrow">Bravo</div>
    <h1>Encore!</h1>
    <p class="subtitle italic serif">
      You matched all {$game.totalPairs} pairs on the <span style:color={meta.accent}>{meta.name}</span>.
    </p>

    <div class="stars" aria-label="{stars} of 3 stars">
      {#each Array(3) as _, i}
        <span class="star" class:lit={i < stars}>★</span>
      {/each}
    </div>

    <dl class="stats">
      <div>
        <dt>Time</dt>
        <dd>{formatTime($game.elapsedMs)}</dd>
      </div>
      <div>
        <dt>Moves</dt>
        <dd>{$game.moves} <span class="par">/ par {config.parMoves}</span></dd>
      </div>
      <div>
        <dt>Difficulty</dt>
        <dd>{config.label}</dd>
      </div>
    </dl>

    {#if best && (best.timeMs !== $game.elapsedMs || best.moves !== $game.moves)}
      <p class="best">Personal best: <strong>{formatTime(best.timeMs)}</strong> · <strong>{best.moves}</strong> moves · {best.stars}★</p>
    {/if}

    <div class="actions">
      <Button variant="secondary" on:click={replayMelody}>♪ Replay melody</Button>
      <Button variant="primary" on:click={playAgain}>Play Again</Button>
      <Button variant="ghost" on:click={home}>Main Menu</Button>
    </div>
  </section>
{/if}

<style>
  .win {
    max-width: 540px;
    margin: 0 auto;
    padding: 56px 24px 80px;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    min-height: 100vh;
    justify-content: center;
  }
  .eyebrow {
    font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
    color: var(--gold);
  }
  h1 {
    font-size: clamp(48px, 9vw, 72px);
    margin: 0;
    color: var(--gold-bright);
  }
  .subtitle {
    font-size: 18px;
    color: var(--ivory-dim);
    margin: 0;
  }
  .stars {
    display: flex;
    gap: 12px;
    margin: 16px 0;
  }
  .star {
    font-size: 48px;
    color: rgba(201, 165, 92, 0.2);
    transition: all 0.4s ease;
  }
  .star.lit {
    color: var(--gold-bright);
    text-shadow: 0 0 24px rgba(232, 201, 138, 0.6);
    animation: pop 0.5s ease;
  }
  @keyframes pop {
    0% { transform: scale(0.5); opacity: 0; }
    60% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }

  .stats {
    display: flex;
    gap: 32px;
    background: rgba(15, 9, 5, 0.4);
    border: 1px solid rgba(201, 165, 92, 0.2);
    border-radius: 10px;
    padding: 20px 28px;
    margin: 8px 0;
  }
  .stats > div { display: flex; flex-direction: column; align-items: center; }
  dt {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--gold);
    margin-bottom: 4px;
  }
  dd {
    font-family: var(--font-serif);
    font-size: 22px;
    font-weight: 600;
    color: var(--ivory);
    margin: 0;
  }
  .par { color: var(--ivory-dim); font-size: 14px; }

  .best {
    font-family: var(--font-serif);
    font-style: italic;
    color: var(--ivory-dim);
    font-size: 14px;
  }
  .best strong { color: var(--gold-bright); font-weight: 600; }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 280px;
    margin-top: 12px;
  }
</style>
