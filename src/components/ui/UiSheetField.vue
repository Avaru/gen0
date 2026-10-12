<script setup lang="ts">
defineOptions({ inheritAttrs: false })
withDefaults(
  defineProps<{
    multiline?: boolean
    rows?: number
    variant?: 'boxed' | 'line'
    filled?: boolean
    printClass?: string
  }>(),
  {
    variant: 'line',
    rows: 7,
  },
)
const value = defineModel<string>({ required: true })
</script>

<template>
  <span class="print-value" :class="printClass">{{ value }}</span>
  <textarea
    v-if="multiline"
    v-bind="$attrs"
    v-model="value"
    class="sheet-field"
    :class="[variant, { filled }]"
    :rows="rows"
  />
  <input
    v-else
    v-bind="$attrs"
    v-model="value"
    class="sheet-field"
    :class="[variant, { filled }]"
    type="text"
  />
</template>

<style scoped>
.sheet-field {
  width: 100%;
  min-width: 0;
  min-height: var(--control-height);
  padding: var(--field-padding, var(--space-2));
  padding-right: var(--field-end-padding, var(--field-padding, var(--space-2)));
  border: 0;
  border-bottom: 2px solid currentColor;
  border-radius: var(--radius-sm);
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: var(--font-control-size);
  font-weight: 600;
  transition: var(--control-color-transition);
}
.boxed {
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text);
  font: inherit;
}
.filled {
  background-color: var(--color-rating-one);
  border-color: var(--color-rating-one);
  color: var(--color-on-accent);
}
textarea {
  resize: vertical;
}
@media screen {
  .sheet-field:hover {
    background-image: repeating-linear-gradient(
      135deg,
      color-mix(in srgb, currentColor 10%, transparent) 0 8px,
      transparent 8px 16px
    );
  }
}
.sheet-field:focus-visible {
  outline: var(--control-focus-width) solid var(--control-focus-color, var(--color-focus));
  outline-offset: var(--control-focus-offset);
}
</style>
