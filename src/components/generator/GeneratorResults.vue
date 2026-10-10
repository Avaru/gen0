<script setup lang="ts">
import type { Generated } from '@/patterns/types'
import UiButton from '@/components/ui/UiButton.vue'
defineProps<{
  results: Generated[]
  busy: boolean
  label: string
  error: string
  showDetails: boolean
}>()
defineEmits<{ more: [] }>()
</script>
<template>
  <section aria-labelledby="results-heading" :aria-busy="busy">
    <h1 id="results-heading">{{ label }}</h1>
    <p class="status" role="status" aria-atomic="true">
      {{ busy ? 'Generating names…' : results.length ? 'Names updated.' : '' }}
    </p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <ol v-if="results.length" role="list">
      <li v-for="(result, index) in results" :key="index">
        <div class="name">
          <strong>{{ result.primary }}</strong>
          <template v-if="showDetails">
            <div v-if="result.title">{{ result.title }}</div>
            <div v-if="result.age">{{ result.age }}</div>
            <div v-if="result.appearance">{{ result.appearance }}</div>
            <div v-if="result.details">{{ result.details }}</div>
            <div v-if="result.rating !== undefined">Rating: {{ result.rating.toFixed(1) }} / 5</div>
          </template>
        </div>
      </li>
    </ol>
    <UiButton v-if="results.length" variant="secondary" :disabled="busy" @click="$emit('more')"
      >Generate more</UiButton
    >
  </section>
</template>
<style scoped>
section {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}
.status {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
h1 {
  font-size: 1.25rem;
  letter-spacing: normal;
}
.name div {
  color: var(--color-muted);
}
ol {
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  display: flex;
  gap: var(--space-4);
  padding-block: var(--space-4);
  border-top: 1px solid var(--color-border);
}
.name {
  min-width: 0;
  overflow-wrap: anywhere;
}
strong {
  font-size: 1.125rem;
}
.name div {
  margin-top: var(--space-1);
  font-size: 0.9375rem;
}
.error {
  color: var(--color-error);
}
@media (max-width: 24rem) {
  section {
    padding: var(--space-4);
  }
}
</style>
