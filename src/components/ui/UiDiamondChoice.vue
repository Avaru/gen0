<script setup lang="ts">
withDefaults(defineProps<{ label: string; count?: number; compact?: boolean; type?: 'checkbox' | 'radio'; name?: string; value?: string }>(), {
  count: 1,
  compact: false,
  type: 'checkbox',
})
const selected = defineModel<boolean>({ required: true })
</script>

<template>
  <label class="diamond-choice" :class="{ compact }">
    <input :checked="selected" :type="type" :name="name" :value="value" :aria-label="label" @change="selected = ($event.target as HTMLInputElement).checked" />
    <span class="diamonds" aria-hidden="true"><span v-for="mark in count" :key="mark" /></span>
    <span v-if="$slots.default" class="item-text"><slot /></span>
  </label>
</template>

<style scoped>
.diamond-choice {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
  min-height: var(--control-height);
  padding-block: var(--space-2);
  cursor: pointer;
  transition: var(--control-color-transition);
}
.compact {
  display: grid;
  place-items: center;
  width: var(--control-height);
  height: var(--control-height);
  padding: 0;
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
.diamonds {
  display: flex;
  flex-shrink: 0;
  gap: var(--space-3);
  padding-inline: var(--space-1);
  pointer-events: none;
}
.diamonds > span {
  width: var(--diamond-size, 1rem);
  height: var(--diamond-size, 1rem);
  border: 2px solid currentColor;
  background: var(--diamond-empty, transparent);
  transform: rotate(45deg);
  outline: var(--diamond-outline, none);
  outline-offset: 4px;
  transition: var(--control-color-transition);
}
input:checked + .diamonds > span {
  background: var(--diamond-selected, var(--color-signal));
}
.item-text {
  min-width: 0;
  font-family: var(--font-display);
  font-weight: var(--theme-name-weight);
  font-size: 1.125rem;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
input:checked ~ .item-text {
  color: var(--diamond-selected, var(--color-signal));
  text-decoration: var(--diamond-selected-decoration, none);
  text-underline-offset: 0.2em;
}
input:focus-visible + .diamonds {
  outline: 3px solid var(--color-focus);
  outline-offset: 4px;
}
@media screen {
  .diamond-choice:hover {
    background-color: color-mix(in srgb, currentColor 12%, transparent);
  }
}
@media print {
  .diamonds > span {
    display: grid;
    place-items: center;
    width: 3mm;
    height: 3mm;
  }
  input:checked + .diamonds > span::after {
    content: '✓';
    transform: rotate(-45deg);
    font: bold 8pt / 1 sans-serif;
  }
}
@media (forced-colors: active) {
  input {
    position: static;
    width: 1.5rem;
    height: 1.5rem;
    min-height: 0;
    opacity: 1;
    appearance: auto;
    flex-shrink: 0;
  }
  .diamonds {
    display: none;
  }
  .diamond-choice:has(input:focus-visible) {
    outline: 3px solid Highlight;
    outline-offset: 4px;
  }
}
</style>
