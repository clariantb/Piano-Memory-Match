<script lang="ts">
  import { formatTime } from '../lib/game/scoring';

  export let timeMs: number;
  export let moves: number;
  export let matched: number;
  export let total: number;
</script>

<div class="hud">
  <div class="stat">
    <span class="label">Time</span>
    <span class="value">{formatTime(timeMs)}</span>
  </div>
  <div class="divider"></div>
  <div class="stat">
    <span class="label">Moves</span>
    <span class="value">{moves}</span>
  </div>
  <div class="divider"></div>
  <div class="stat">
    <span class="label">Matched</span>
    <span class="value">{matched} <span class="of">/ {total}</span></span>
  </div>
</div>

<style>
  .hud {
    display: inline-flex;
    align-items: center;
    gap: 0;
    background: rgba(15, 9, 5, 0.5);
    border: 1px solid rgba(201, 165, 92, 0.3);
    border-radius: 999px;
    padding: 12px 8px;
    box-shadow: 0 6px 20px var(--shadow-soft), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 22px;
    min-width: 88px;
  }

  .label {
    font-family: var(--font-sans);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--gold);
    margin-bottom: 2px;
  }

  .value {
    font-family: var(--font-serif);
    font-size: 22px;
    font-weight: 600;
    color: var(--ivory);
  }

  .value .of {
    color: var(--ivory-dim);
    font-size: 16px;
  }

  .divider {
    width: 1px;
    height: 28px;
    background: rgba(201, 165, 92, 0.3);
  }

  @media (max-width: 560px) {
    .stat { padding: 0 14px; min-width: 64px; }
    .value { font-size: 18px; }
  }
</style>
