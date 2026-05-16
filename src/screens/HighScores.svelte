<script lang="ts">
  import Button from '../components/Button.svelte';
  import { currentScreen } from '../lib/stores/gameStore';
  import { loadScores } from '../lib/storage';
  import { INSTRUMENTS } from '../lib/audio/instruments';
  import { DIFFICULTIES, formatTime, findBestScore } from '../lib/game/scoring';

  const scores = loadScores();
</script>

<section class="screen page">
  <header>
    <button class="back" on:click={() => currentScreen.set('main-menu')}>← Menu</button>
    <div class="eyebrow">The Programme</div>
    <h1>High Scores</h1>
    <p class="lede">Best performance per instrument &amp; difficulty.</p>
  </header>

  {#if scores.length === 0}
    <div class="empty">
      <p class="italic serif muted">No performances recorded yet. Play a game to begin the programme.</p>
      <Button variant="primary" on:click={() => currentScreen.set('instrument-select')}>Begin</Button>
    </div>
  {:else}
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Instrument</th>
            {#each DIFFICULTIES as d}
              <th>{d.label}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each INSTRUMENTS as inst}
            <tr>
              <td class="inst">
                <span class="symbol" style:color={inst.accent}>{inst.symbol}</span>
                {inst.name}
              </td>
              {#each DIFFICULTIES as d}
                {@const best = findBestScore(scores, inst.id, d.id)}
                <td>
                  {#if best}
                    <div class="cell">
                      <span class="stars">{'★'.repeat(best.stars)}<span class="dim">{'★'.repeat(3 - best.stars)}</span></span>
                      <span class="time">{formatTime(best.timeMs)}</span>
                      <span class="moves">{best.moves} moves</span>
                    </div>
                  {:else}
                    <span class="dash">—</span>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>

<style>
  .page {
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

  .empty {
    text-align: center;
    padding: 60px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .table-wrap {
    overflow-x: auto;
    background: rgba(15, 9, 5, 0.4);
    border: 1px solid rgba(201, 165, 92, 0.2);
    border-radius: 10px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
  }
  th {
    background: rgba(201, 165, 92, 0.12);
    color: var(--gold-bright);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid var(--gold-dim);
  }
  td {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(201, 165, 92, 0.08);
    color: var(--ivory);
    vertical-align: middle;
  }
  tr:last-child td { border-bottom: none; }

  .inst {
    font-family: var(--font-serif);
    font-size: 16px;
    color: var(--gold-bright);
  }
  .symbol {
    font-family: var(--font-serif);
    font-size: 22px;
    margin-right: 8px;
  }
  .cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 13px;
  }
  .stars { color: var(--gold-bright); }
  .stars .dim { color: rgba(201, 165, 92, 0.2); }
  .time { font-family: var(--font-serif); font-size: 16px; color: var(--ivory); }
  .moves { color: var(--ivory-dim); font-size: 12px; }
  .dash { color: var(--ivory-dim); opacity: 0.4; }
</style>
