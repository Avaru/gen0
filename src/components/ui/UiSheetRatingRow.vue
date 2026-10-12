<script setup lang="ts">
defineProps<{ kind: 'approach' | 'skill'; state: string }>()
</script>
<template>
  <div class="sheet-rating-row" :class="kind" :data-state="state"><slot /></div>
</template>
<style scoped>
.sheet-rating-row {
  --rating-fill: var(--color-surface);
  --row-name: var(--theme-name-color);
  --row-muted: var(--color-muted);
  position: relative;
  display: grid;
  min-width: 0;
  gap: var(--space-3);
  padding: var(--space-4);
  margin-top: var(--space-3);
  background: var(--rating-fill);
  border: 1px solid var(--color-border);
  transition: var(--control-color-transition);
}
[data-state='1'] {
  --rating-fill: var(--color-rating-one);
}
[data-state='2'] {
  --rating-fill: var(--color-signal);
}
[data-state='glitched'] {
  --rating-fill: var(--color-hot);
}
.sheet-rating-row:not([data-state='0']) {
  --row-name: var(--color-on-accent);
  --row-muted: var(--color-on-accent);
  --control-focus-color: var(--color-on-accent);
  color: var(--color-on-accent);
  border-color: var(--rating-fill);
}
.sheet-rating-row::after {
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
.skill {
  grid-template-columns: minmax(6rem, max-content) minmax(0, 1fr);
  align-items: end;
  gap: var(--space-2);
  padding: var(--space-2);
  margin-top: var(--space-2);
}
.skill::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: -1px;
  width: 0.5rem;
  height: 0.5rem;
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  opacity: 0.45;
  pointer-events: none;
}
.skill::after {
  width: 2.5rem;
  height: 4px;
  opacity: 0.8;
}
.skill:nth-of-type(3n)::after {
  width: 1.5rem;
}
.skill:not([data-state='0'])::after {
  background: repeating-linear-gradient(
    90deg,
    currentColor 0 1px,
    transparent 1px 4px,
    currentColor 4px 6px,
    transparent 6px 9px
  );
}
@media screen and (max-width: 24rem) {
  .approach {
    padding-inline: var(--space-2);
  }
}
</style>
