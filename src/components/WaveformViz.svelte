<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getAnalyser } from '../lib/audio/engine';

  export let height = 80;
  export let color = '#c9a55c';

  let canvas: HTMLCanvasElement | undefined;
  let raf: number | undefined;

  function draw() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }
    ctx.clearRect(0, 0, w, h);

    let data: Float32Array;
    try {
      data = getAnalyser().getValue() as Float32Array;
    } catch {
      raf = requestAnimationFrame(draw);
      return;
    }

    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, 'rgba(201,165,92,0)');
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, 'rgba(201,165,92,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const mid = h / 2;
    for (let i = 0; i < data.length; i++) {
      const x = (i / (data.length - 1)) * w;
      const y = mid + data[i] * mid * 0.85;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    raf = requestAnimationFrame(draw);
  }

  onMount(() => {
    raf = requestAnimationFrame(draw);
  });
  onDestroy(() => {
    if (raf !== undefined) cancelAnimationFrame(raf);
  });
</script>

<canvas bind:this={canvas} style:height="{height}px"></canvas>

<style>
  canvas {
    display: block;
    width: 100%;
  }
</style>
