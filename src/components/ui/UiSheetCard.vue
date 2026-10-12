<script setup lang="ts">
import UiScrambleText from './UiScrambleText.vue'

withDefaults(
  defineProps<{
    title: string
    headingId: string
    headingClass?: string
    edge?: 'signal' | 'hot'
    state?: 'empty' | 'cyan' | 'yellow' | 'red'
  }>(),
  { edge: 'signal', state: 'empty' },
)
</script>

<template>
  <section class="sheet-card" :data-state="state" :data-edge="edge" :aria-labelledby="headingId">
    <header class="card-heading" :class="headingClass">
      <h2 :id="headingId"><UiScrambleText :text="title" /><slot name="title-extra" /></h2>
      <slot name="actions" />
      <slot name="heading-extra" />
    </header>
    <slot />
  </section>
</template>

<style scoped>
.sheet-card {
  --card-fill: var(--theme-panel-fill);
  --card-ink: var(--color-text);
  --card-title: var(--theme-title-color);
  --card-title-shadow: var(--theme-heading-shadow);
  position: relative;
  min-width: 0;
  padding: var(--sheet-card-padding);
  color: var(--card-ink);
  background: var(--card-fill);
  background-image: var(--theme-panel-texture);
  border: var(--theme-panel-border-width) solid var(--color-border);
  border-top: var(--theme-panel-rule-width) solid var(--color-signal);
  border-radius: var(--radius-lg);
  box-shadow: var(--theme-panel-shadow);
  transition: var(--control-color-transition);
}
[data-edge='hot'] {
  border-top-color: var(--color-hot);
}
[data-state='cyan'] {
  --card-fill: var(--color-signal);
}
[data-state='yellow'] {
  --card-fill: var(--color-rating-one);
}
[data-state='red'] {
  --card-fill: var(--color-hot);
}
.sheet-card:not([data-state='empty']) {
  --card-ink: var(--color-on-accent);
  --sheet-symbol-ink: #000;
  --sheet-symbol-square: #000;
  --card-title: var(--card-ink);
  --card-title-shadow: none;
  --control-focus-color: var(--color-on-accent);
}
.sheet-card::after {
  content: '';
  position: absolute;
  top: var(--sheet-card-edge-offset);
  right: var(--space-3);
  width: var(--sheet-card-edge-width);
  height: var(--sheet-card-edge-height);
  background: var(--theme-panel-edge);
  pointer-events: none;
}
/* Rules passed into a card share typography without styling child component internals. */
:slotted(.rule),
:slotted(.rules) {
  margin-bottom: var(--space-4);
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
}
.card-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-4);
  margin-bottom: var(--card-heading-gap, var(--space-4));
  min-width: 0;
}
h2 {
  --scramble-color: var(--card-title);
  min-width: 0;
  font-family: var(--font-display);
  font-size: var(--font-sheet-heading-size);
  font-weight: var(--theme-heading-weight);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--card-title);
  text-shadow: var(--card-title-shadow);
  overflow-wrap: anywhere;
}
@media screen {
  h2 {
    line-height: 1;
    text-box-trim: trim-start;
    text-box-edge: cap alphabetic;
  }
}
</style>
