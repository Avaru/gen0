<script setup lang="ts">
import type { SheetRating } from '@/data/characters/types'

defineProps<{ label: string; id: string }>()
const value = defineModel<SheetRating>({ required: true })

function change(position: 1 | 2, event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  value.value = checked ? position : position === 1 ? 0 : 1
}
</script>

<template>
  <div class="rating" role="group" :aria-label="`${label} rating`">
    <label v-for="position in [1, 2] as const" :key="position">
      <input
        :id="position === 1 ? id : `${id}-2`"
        type="checkbox"
        :checked="(value ?? 0) >= position"
        :aria-label="`${label} rating ${position}`"
        @change="change(position, $event)"
      />
      <span aria-hidden="true">+</span>
    </label>
  </div>
</template>

<style scoped>
.rating {
  display: flex;
  gap: var(--space-2);
}
label {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--control-height);
  height: var(--control-height);
  cursor: pointer;
}
input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}
span {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-sm);
  background: var(--color-subtle);
  color: var(--color-muted);
  font-size: 1.5rem;
  font-weight: 600;
  transition: var(--control-color-transition);
  pointer-events: none;
}
input:checked + span {
  border-width: 2px 3px 4px 1px;
  border-color: var(--color-on-accent);
  background: var(--color-signal);
  color: var(--color-on-accent);
}
label:hover span {
  outline: 1px solid currentColor;
  outline-offset: 1px;
}
input:focus-visible + span {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
@media screen {
  input:not(:checked) + span {
    opacity: 0.7;
  }
  label:hover input:not(:checked) + span,
  input:not(:checked):focus-visible + span {
    opacity: 1;
  }
}
@media (forced-colors: active) {
  input {
    position: static;
    opacity: 1;
    appearance: auto;
  }
  span {
    display: none;
  }
}
</style>
