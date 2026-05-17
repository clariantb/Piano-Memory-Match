<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import confetti from 'canvas-confetti';

  export let active = false;

  let stopped = false;

  function burst() {
    if (stopped) return;
    confetti({
      particleCount: 90,
      spread: 70,
      startVelocity: 38,
      origin: { y: 0.6 },
      colors: ['#c9a55c', '#e8c98a', '#f5ecd9', '#8a6f3d']
    });
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#c9a55c', '#e8c98a']
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#c9a55c', '#e8c98a']
    });
  }

  $: if (active) burst();

  onMount(() => {
    if (active) burst();
  });
  onDestroy(() => {
    stopped = true;
  });
</script>
