<script setup lang="ts">
import UiSheetSymbol from './UiSheetSymbol.vue'
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
      <span aria-hidden="true"><UiSheetSymbol class="rating-symbol" kind="dice" :framed="false" /></span>
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
  --sheet-symbol-ink: currentColor;
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
  --sheet-symbol-ink: #fff;
}
label:hover span {
  background-image: repeating-linear-gradient(
    135deg,
    color-mix(in srgb, currentColor 10%, transparent) 0 8px,
    transparent 8px 16px
  );
}
input:focus-visible + span {
  outline: var(--control-focus-width) solid var(--control-focus-color, var(--color-focus));
  outline-offset: 3px;
}
@media screen {
  .rating-symbol {
    transform: rotate(-45deg);
    transition: transform 180ms ease-out;
  }
  input:checked + span .rating-symbol {
    transform: rotate(0deg);
  }
  input:checked + span {
    background: color-mix(in srgb, var(--color-signal) 75%, var(--color-on-accent));
  }
  input:not(:checked) + span {
    opacity: 0.7;
  }
  label:hover input:not(:checked) + span,
  input:not(:checked):focus-visible + span {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .rating-symbol {
    transition: none;
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
