<script lang="ts">
  import type { Card } from '../lib/types';
  import type { InstrumentMeta } from '../lib/types';
  import { noteLabel } from '../lib/audio/notes';

  export let card: Card;
  export let meta: InstrumentMeta;
  export let matchByEar = false;
  export let showLabels = true;
  export let disabled = false;

  $: revealed = card.state === 'revealed';
  $: matched = card.state === 'matched';
  $: hideFace = matchByEar && !matched;
  $: faceText = hideFace ? meta.symbol : showLabels ? noteLabel(card.note) : '·';
</script>

<button
  class="card"
  class:flipped={revealed || matched}
  class:matched
  class:hide-face={hideFace}
  disabled={disabled || matched}
  aria-label={`Card ${card.id + 1}${matched ? ', matched' : revealed ? ', revealed' : ''}`}
  on:click
  on:keydown
>
  <div class="inner">
    <div class="face back" style:background={meta.cardBackGradient}>
      <span class="monogram" style:color={meta.accent}>{meta.cardBackMonogram}</span>
      <span class="filigree top">◆</span>
      <span class="filigree bot">◆</span>
    </div>
    <div class="face front">
      <span class="note">{faceText}</span>
      {#if matched}
        <span class="match-mark">✓</span>
      {/if}
    </div>
  </div>
</button>

<style>
  .card {
    aspect-ratio: 3 / 4;
    width: 100%;
    padding: 0;
    background: none;
    perspective: 1000px;
    border-radius: 10px;
    cursor: pointer;
    transition: transform var(--transition);
  }
  .card:disabled { cursor: default; }
  .card:not(:disabled):hover .inner { transform: translateY(-2px) scale(1.01); }
  .card.flipped .inner { transform: rotateY(180deg); }

  .inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform var(--flip-duration) cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }

  .face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 16px var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .back {
    border: 1px solid var(--gold-dim);
    overflow: hidden;
    position: relative;
  }

  .back::before {
    content: '';
    position: absolute;
    inset: 6px;
    border: 1px solid rgba(201, 165, 92, 0.25);
    border-radius: 6px;
    pointer-events: none;
  }

  .monogram {
    font-family: var(--font-serif);
    font-size: clamp(28px, 4vw, 42px);
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
    z-index: 1;
  }

  .filigree {
    position: absolute;
    font-size: 8px;
    color: var(--gold-dim);
    opacity: 0.6;
  }
  .filigree.top { top: 10px; right: 10px; }
  .filigree.bot { bottom: 10px; left: 10px; }

  .front {
    background: linear-gradient(180deg, var(--ivory) 0%, #ede0c2 100%);
    color: var(--walnut);
    border: 1px solid var(--gold);
    transform: rotateY(180deg);
    flex-direction: column;
    gap: 4px;
  }

  .front .note {
    font-family: var(--font-serif);
    font-weight: 600;
    font-size: clamp(28px, 5vw, 48px);
  }

  .hide-face.flipped .front {
    background: linear-gradient(180deg, #2a1a0f 0%, #1a0f08 100%);
    color: var(--gold-bright);
    border-color: var(--gold);
  }
  .hide-face .front .note { font-family: var(--font-serif); }

  .matched .front {
    background: linear-gradient(180deg, #f5ecd9 0%, #d4c894 100%);
    border-color: var(--gold-bright);
    box-shadow: 0 0 0 2px var(--gold-bright), 0 8px 24px rgba(201, 165, 92, 0.35);
  }

  .match-mark {
    position: absolute;
    top: 8px;
    right: 10px;
    color: var(--emerald);
    font-size: 16px;
    font-weight: 600;
  }
</style>
