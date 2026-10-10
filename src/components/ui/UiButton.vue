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
</style>
