<script setup lang="ts">
import { useId } from 'vue'
import type { StudentRating } from '@/data/characters/never-midnight'
defineProps<{ label: string; disabled?: boolean }>()
const value = defineModel<StudentRating>({ required: true })
const name = useId()
const shades = ['░', '▒', '▓']
</script>

<template>
  <fieldset class="shade-rating" :disabled="disabled">
    <legend class="sr-only">{{ label }}</legend>
    <label v-for="level in [1, 2, 3] as const" :key="level" :class="{ selected: value === level }">
      <input
        v-model="value"
        type="radio"
        :name="name"
        :value="level"
        :aria-label="`${label}: ${level}`"
      />
      <span aria-hidden="true"
        ><span class="shade">{{ shades[level - 1] }}</span> {{ level }}</span
      >
    </label>
  </fieldset>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
.shade-rating {
  display: flex;
  flex-shrink: 0;
  border: 0;
  padding: 0;
  margin: 0;
  gap: 2px;
}
label {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 44px;
  min-height: 44px;
  border: 1px solid transparent;
  border-bottom: 2px solid transparent;
  color: var(--color-muted);
  cursor: pointer;
}
input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
}
.shade {
  font-family: monospace;
  font-size: 1.25rem;
}
.selected {
  background: var(--color-subtle);
  border-bottom-color: currentColor;
  color: var(--color-text);
}
label:hover,
label:active {
  outline: 1px solid var(--color-text);
}
label:has(:focus-visible) {
  outline: var(--control-focus-width) solid var(--color-focus);
  outline-offset: var(--control-focus-offset);
}
.shade-rating:disabled label,
.shade-rating:disabled input {
  cursor: default;
}
.shade-rating:disabled label:hover,
.shade-rating:disabled label:active {
  outline: none;
}
@media (forced-colors: active) {
  input {
    position: static;
    opacity: 1;
    width: auto;
    height: auto;
  }
  label {
    display: flex;
    gap: 2px;
  }
}
</style>
