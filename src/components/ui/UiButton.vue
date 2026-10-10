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
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-6);
  font-weight: 650;
  overflow-wrap: anywhere;
}
.primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
}
.primary:hover:enabled {
  background: var(--color-accent-hover);
}
.secondary {
  border-color: var(--color-control-border);
  background: var(--color-surface);
  color: var(--color-text);
}
.secondary:hover:enabled {
  background: var(--color-subtle);
}
</style>
