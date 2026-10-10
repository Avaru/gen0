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
  font-weight: 650;
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
