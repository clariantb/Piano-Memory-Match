<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  export let type: 'button' | 'submit' = 'button';
  export let disabled = false;
  export let fullWidth = false;
  export let ariaLabel: string | undefined = undefined;
</script>

<button
  class="btn {variant}"
  class:full={fullWidth}
  {type}
  {disabled}
  aria-label={ariaLabel}
  on:click
  on:keydown
>
  <slot />
</button>

<style>
  .btn {
    font-family: var(--font-sans);
    font-weight: 500;
    letter-spacing: 0.5px;
    padding: 12px 28px;
    border-radius: 6px;
    transition: all var(--transition);
    font-size: 15px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 44px;
  }
  .btn.full { width: 100%; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .primary {
    background: linear-gradient(180deg, var(--gold-bright) 0%, var(--gold) 100%);
    color: var(--walnut-deep);
    border: 1px solid var(--gold-dim);
    box-shadow: 0 4px 14px rgba(201, 165, 92, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    font-weight: 600;
  }
  .primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(201, 165, 92, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  .secondary {
    background: rgba(201, 165, 92, 0.08);
    color: var(--ivory);
    border: 1px solid var(--gold-dim);
  }
  .secondary:hover:not(:disabled) {
    background: rgba(201, 165, 92, 0.15);
    border-color: var(--gold);
    color: var(--gold-bright);
  }

  .ghost {
    background: transparent;
    color: var(--ivory-dim);
    border: 1px solid transparent;
  }
  .ghost:hover:not(:disabled) {
    color: var(--gold-bright);
  }
</style>
