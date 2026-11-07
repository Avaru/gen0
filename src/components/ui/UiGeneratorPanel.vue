<script setup lang="ts">
withDefaults(defineProps<{ as?: 'form' | 'section' }>(), { as: 'section' })
</script>

<template>
  <component :is="as" class="generator-panel" :class="{ controls: as === 'form' }"
    ><slot
  /></component>
</template>

<style scoped>
.generator-panel {
  position: relative;
  display: grid;
  gap: var(--space-4);
  padding: var(--generator-panel-padding, var(--space-6));
  border: var(--theme-panel-border-width) solid
    var(--generator-panel-border-color, var(--color-border));
  border-top: var(--theme-panel-rule-width) solid var(--color-signal);
  border-radius: var(--radius-lg);
  box-shadow: var(--theme-panel-shadow);
  background: var(--theme-panel-fill);
  background-image: var(--theme-panel-texture);
}
.controls {
  gap: var(--space-6);
  border-width: var(--generator-controls-border-width, 0);
  border-top: var(--theme-panel-rule-width) solid var(--color-hot);
}
.generator-panel::after {
  content: '';
  position: absolute;
  inset: var(--generator-panel-edge-inset, 7px var(--space-3) auto auto);
  width: var(--generator-panel-edge-width, 3rem);
  height: var(--generator-panel-edge-height, 5px);
  background: var(--generator-panel-edge-fill, var(--theme-panel-edge));
  pointer-events: none;
}
@media (max-width: 24rem) {
  .generator-panel {
    padding: var(--generator-panel-padding, var(--space-4));
  }
}
</style>
<style scoped src="../../styles/themes/never-midnight-panel.css"></style>
