<script setup lang="ts">
defineProps<{ error?: string }>()
</script>

<template>
  <div class="result-actions">
    <slot />
    <span v-if="error" class="error" role="alert">{{ error }}</span>
  </div>
</template>

<style scoped>
.result-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  --button-icon-rest-color: var(--color-muted);
}
.error {
  flex-basis: 100%;
  max-width: calc(2 * var(--control-height));
  font-size: var(--font-sheet-rule-size);
  color: var(--color-error);
  overflow-wrap: anywhere;
}
</style>
