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
  position: relative;
  display: grid;
  gap: var(--space-4);
  padding: var(--space-6);
  border: var(--theme-panel-border-width) solid var(--color-border);
  border-top: var(--theme-panel-rule-width) solid var(--color-signal);
  box-shadow: var(--theme-panel-shadow);
  border-radius: var(--radius-lg);
  background: var(--theme-panel-fill);
  background-image: var(--theme-panel-texture);
}
section::after {
  content: '';
  position: absolute;
  top: 7px;
  right: var(--space-3);
  width: 3rem;
  height: 5px;
  background: var(--theme-panel-edge);
  pointer-events: none;
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
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: var(--theme-heading-weight);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--theme-title-color);
  overflow-wrap: anywhere;
  text-shadow: var(--theme-heading-shadow);
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
  position: relative;
  display: flex;
  gap: var(--space-4);
  padding-block: var(--space-4);
  border-top: 1px solid var(--color-border);
}
li::after {
  content: '';
  position: absolute;
  top: -1px;
  right: 0;
  width: 1.75rem;
  height: 3px;
  background: var(--theme-row-mark);
  opacity: 0.55;
  pointer-events: none;
}
.name {
  min-width: 0;
  overflow-wrap: anywhere;
}
strong {
  font-family: var(--font-display);
  font-weight: var(--theme-name-weight);
  color: var(--theme-name-color);
  font-size: 1.625rem;
  line-height: 1.15;
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
