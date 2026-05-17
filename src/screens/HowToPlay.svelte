<script lang="ts">
  import { currentScreen } from '../lib/stores/gameStore';
</script>

<section class="screen page">
  <header>
    <button class="back" on:click={() => currentScreen.set('main-menu')}>← Menu</button>
    <div class="eyebrow">Programme Notes</div>
    <h1>How to Play</h1>
  </header>

  <div class="content">
    <ol class="steps">
      <li>
        <h3>Choose your instrument</h3>
        <p>Six voices, each with its own timbre — piano, guitar, flute, marimba, violin, polysynth.</p>
      </li>
      <li>
        <h3>Pick a difficulty</h3>
        <p>Easy starts you at four pairs. Expert raises the bar to sixteen pairs across two chromatic octaves.</p>
      </li>
      <li>
        <h3>Flip two cards</h3>
        <p>Each card plays a note. Find pairs that sound the same to clear them from the board.</p>
      </li>
      <li>
        <h3>Earn stars</h3>
        <p>Three stars for matching at or under par moves. Two for a little under-par leeway. One for finishing.</p>
      </li>
    </ol>

    <aside class="tip">
      <h3>Try Match by Ear</h3>
      <p>
        Toggle <em>Match by Ear</em> in Settings to hide the note labels entirely. You'll match
        pairs by listening alone — the standout challenge of a music memory game.
      </p>
    </aside>

    <aside class="tip">
      <h3>Keyboard shortcuts</h3>
      <ul>
        <li><kbd>Tab</kbd> &amp; <kbd>Space</kbd> — navigate and flip cards</li>
        <li><kbd>R</kbd> — replay the most recent pair you flipped</li>
        <li><kbd>Esc</kbd> — pause the game</li>
      </ul>
    </aside>
  </div>
</section>

<style>
  .page {
    max-width: 680px;
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

  .content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .steps {
    list-style: none;
    padding: 0;
    margin: 0;
    counter-reset: ord;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .steps li {
    position: relative;
    padding: 20px 24px 20px 70px;
    counter-increment: ord;
    background: rgba(42, 26, 15, 0.5);
    border: 1px solid rgba(201, 165, 92, 0.2);
    border-radius: 10px;
  }
  .steps li::before {
    content: counter(ord, upper-roman);
    position: absolute;
    left: 20px;
    top: 20px;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 24px;
    color: var(--gold);
    min-width: 32px;
  }
  .steps h3 {
    font-size: 17px;
    margin: 0 0 4px;
    color: var(--gold-bright);
    font-family: var(--font-serif);
  }
  .steps p {
    margin: 0;
    color: var(--ivory-dim);
    font-size: 14px;
  }

  .tip {
    background: rgba(15, 9, 5, 0.5);
    border-left: 3px solid var(--gold);
    padding: 18px 24px;
    border-radius: 6px;
  }
  .tip h3 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--gold);
    margin: 0 0 8px;
    font-family: var(--font-sans);
    font-weight: 600;
  }
  .tip p, .tip ul {
    margin: 0;
    color: var(--ivory-dim);
    font-size: 14px;
  }
  .tip ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .tip ul li::before {
    content: '◆';
    color: var(--gold-dim);
    margin-right: 8px;
    font-size: 10px;
  }
  kbd {
    font-family: var(--font-sans);
    background: rgba(201, 165, 92, 0.12);
    border: 1px solid var(--gold-dim);
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 11px;
    color: var(--gold-bright);
  }
</style>
