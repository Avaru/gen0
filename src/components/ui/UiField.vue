<script setup lang="ts">
defineProps<{ label: string; forId: string }>()
</script>
<template>
  <div class="field">
    <label :for="forId">{{ label }}</label
    ><slot />
  </div>
</template>
<style scoped>
.field {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
}
label {
  color: var(--color-muted);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}
.field :deep(select),
.field :deep(input) {
  width: 100%;
  min-width: 0;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  background: var(--color-surface);
}
</style>
