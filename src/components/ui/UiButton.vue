<script setup lang="ts">
withDefaults(defineProps<{ type?: 'button' | 'submit'; variant?: 'primary' | 'secondary' }>(), {
  type: 'button',
  variant: 'primary',
})
</script>
<template>
  <button :type="type" :class="variant"><slot /></button>
</template>
<style scoped>
button {
  position: relative;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-6);
  font-family: var(--font-display);
  font-size: 1.375rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 700;
  border-bottom: 4px solid var(--color-on-accent);
  overflow-wrap: anywhere;
}
button::after {
  content: '';
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 0.625rem;
  height: 0.625rem;
  background: var(--theme-button-detail);
  opacity: 0.65;
  pointer-events: none;
}
.primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
}
.primary:hover:enabled {
  background: var(--color-accent-hover);
}
.secondary {
  border-color: var(--color-signal);
  background: var(--color-surface);
  color: var(--color-signal);
}
.secondary:hover:enabled {
  background: var(--color-subtle);
}
[data-theme='cyberpunk2077'] button {
  isolation: isolate;
  border: 0;
  background: transparent;
  font-size: 1.25rem;
  letter-spacing: 0.08em;
  color: var(--color-hot);
}
[data-theme='cyberpunk2077'] .secondary {
  color: var(--color-signal);
}
[data-theme='cyberpunk2077'] button::before,
[data-theme='cyberpunk2077'] button::after {
  content: '';
  position: absolute;
  inset: 0;
  width: auto;
  height: auto;
  opacity: 1;
  pointer-events: none;
  clip-path: var(--theme-action-shape);
}
[data-theme='cyberpunk2077'] button::before {
  z-index: -2;
  background: currentColor;
}
[data-theme='cyberpunk2077'] button::after {
  z-index: -1;
  inset: 1px;
  left: 4px;
  background: color-mix(in srgb, currentColor 8%, var(--color-surface));
}
[data-theme='cyberpunk2077'] button:hover:enabled {
  background: transparent;
}
[data-theme='cyberpunk2077'] button:hover:enabled::after {
  background: color-mix(in srgb, currentColor 20%, var(--color-surface));
}
[data-theme='cyberpunk2077'] button:active:enabled::after {
  background: color-mix(in srgb, currentColor 30%, var(--color-surface));
}
[data-theme='cyberpunk2077'] button:disabled {
  color: var(--color-disabled);
  opacity: 1;
}
@media (forced-colors: active) {
  [data-theme='cyberpunk2077'] button {
    border: 1px solid ButtonText;
  }
}
</style>
