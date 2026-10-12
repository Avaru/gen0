<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    variant?: 'primary' | 'secondary' | 'destructive' | 'destructive-secondary'
    activation?: number
  }>(),
  {
    type: 'button',
    variant: 'primary',
    activation: 0,
  },
)
</script>
<template>
  <button
    :type="type"
    :class="[variant, activation ? (activation % 2 ? 'pulse-a' : 'pulse-b') : undefined]"
  >
    <slot />
  </button>
</template>
<style scoped>
button {
  transition: var(--control-color-transition);
  position: relative;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--button-padding-inline, var(--space-6));
  font-family: var(--font-display);
  font-size: var(--button-font-size, 1.375rem);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 700;
  border-bottom: 4px solid var(--color-on-accent);
  overflow-wrap: anywhere;
  white-space: var(--button-white-space, normal);
  flex: var(--button-flex, 0 1 auto);
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
.destructive {
  --button-feedback-color: var(--color-signal);
  --button-rest-color: var(--color-hot);
  background: var(--color-hot);
  color: var(--color-on-accent);
}
.destructive:hover:enabled {
  --button-rest-color: color-mix(in srgb, var(--color-hot) 85%, white);
  background: var(--button-rest-color);
}
.destructive:active:enabled {
  background: color-mix(in srgb, var(--color-hot) 85%, var(--color-on-accent));
}
.destructive-secondary {
  border-color: var(--color-hot);
  background: var(--color-surface);
  color: var(--color-hot);
}
.destructive-secondary:hover:enabled {
  background: var(--color-subtle);
}
.destructive-secondary:active:enabled {
  background: color-mix(in srgb, var(--color-hot) 16%, var(--color-surface));
}
.pulse-a,
.pulse-b {
  animation-duration: 500ms;
  animation-timing-function: ease-out;
}
.pulse-a {
  animation-name: button-pulse-a;
}
.pulse-b {
  animation-name: button-pulse-b;
}
@keyframes button-pulse-a {
  0%,
  100% {
    background-color: var(--button-rest-color);
  }
  35% {
    background-color: var(--button-feedback-color);
  }
}
@keyframes button-pulse-b {
  0%,
  100% {
    background-color: var(--button-rest-color);
  }
  35% {
    background-color: var(--button-feedback-color);
  }
}
@media (prefers-reduced-motion: reduce) {
  .pulse-a,
  .pulse-b {
    animation: none;
  }
}
</style>
