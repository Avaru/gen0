<script setup lang="ts">
withDefaults(defineProps<{ type?: 'button' | 'submit'; variant?: 'primary' | 'secondary'; activation?: number }>(), {
  type: 'button',
  variant: 'primary',
  activation: 0,
})
</script>
<template>
  <button :type="type" :class="[variant, activation ? (activation % 2 ? 'pulse-a' : 'pulse-b') : undefined]"><slot /></button>
</template>
<style scoped>
button {
  transition: var(--control-color-transition);
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
  transition: var(--control-color-transition);
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
  --button-feedback-color: var(--color-signal);
  --button-rest-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-on-accent);
}
.primary:hover:enabled {
  --button-rest-color: var(--color-accent-hover);
  background: var(--color-accent-hover);
}
.primary:active:enabled {
  background: color-mix(in srgb, var(--color-accent-hover) 85%, var(--color-on-accent));
}
.secondary {
  border-color: var(--color-signal);
  background: var(--color-surface);
  color: var(--color-signal);
}
.secondary:hover:enabled {
  background: var(--color-subtle);
}
.secondary:active:enabled {
  background: color-mix(in srgb, var(--color-signal) 16%, var(--color-surface));
}
[data-theme='cyberpunk2077'] button {
  --button-feedback-color: color-mix(in srgb, currentColor 32%, var(--color-surface));
  --button-rest-color: color-mix(in srgb, currentColor 8%, var(--color-surface));
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
  transition: var(--control-color-transition);
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
[data-theme='cyberpunk2077'] button:hover:enabled,
[data-theme='cyberpunk2077'] button:active:enabled {
  background: transparent;
}
[data-theme='cyberpunk2077'] button:hover:enabled::after {
  --button-rest-color: color-mix(in srgb, currentColor 20%, var(--color-surface));
  background: color-mix(in srgb, currentColor 20%, var(--color-surface));
}
[data-theme='cyberpunk2077'] button:active:enabled::after {
  background: color-mix(in srgb, currentColor 30%, var(--color-surface));
}
[data-theme='cyberpunk2077'] button:disabled {
  color: var(--color-disabled);
  opacity: 1;
}
.pulse-a,
.pulse-b {
  animation-duration: 500ms;
  animation-timing-function: ease-out;
}
.pulse-a { animation-name: button-pulse-a; }
.pulse-b { animation-name: button-pulse-b; }
[data-theme='cyberpunk2077'] .pulse-a,
[data-theme='cyberpunk2077'] .pulse-b {
  animation-name: none;
}
[data-theme='cyberpunk2077'] .pulse-a::after,
[data-theme='cyberpunk2077'] .pulse-b::after {
  animation-duration: 500ms;
  animation-timing-function: ease-out;
}
[data-theme='cyberpunk2077'] .pulse-a::after { animation-name: button-pulse-a; }
[data-theme='cyberpunk2077'] .pulse-b::after { animation-name: button-pulse-b; }
@keyframes button-pulse-a {
  0%, 100% { background-color: var(--button-rest-color); }
  35% { background-color: var(--button-feedback-color); }
}
@keyframes button-pulse-b {
  0%, 100% { background-color: var(--button-rest-color); }
  35% { background-color: var(--button-feedback-color); }
}
@media (prefers-reduced-motion: reduce) {
  .pulse-a,
  .pulse-b,
  [data-theme='cyberpunk2077'] .pulse-a::after,
  [data-theme='cyberpunk2077'] .pulse-b::after {
    animation: none;
  }
}
@media (forced-colors: active) {
  [data-theme='cyberpunk2077'] button {
    border: 1px solid ButtonText;
  }
}
</style>
