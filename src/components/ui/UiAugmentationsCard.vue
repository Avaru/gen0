<script setup lang="ts">
import type { CharacterSheet } from '@/data/characters/types'
import UiToggle from './UiToggle.vue'

const augmentations = defineModel<CharacterSheet['augmentations']>({ required: true })
</script>

<template>
  <section class="augmentations-card" aria-labelledby="augmentations-heading">
    <h2 id="augmentations-heading">Augmentations</h2>
    <ul class="rules">
      <li>
        Mark ⚡ to activate an enhanced capability
        <em>(e.g. therma-vision, wired reflexes, augmented strength)</em> or produce/conceal an
        specific compact asset <em>(chemicals, blade, nanobots)</em>. Can be combined with a
        <strong>Push</strong>.
      </li>
      <li>
        Mark <strong>Special Resistance</strong> to wield it against a fitting type of Consequence
        <em
          >(e.g. neural firewall, behavioral analyzer, toxin neutralizer, fireproof coating,
          etc)</em
        >.
      </li>
    </ul>
    <div
      v-for="(augmentation, index) in augmentations"
      :key="index"
      class="augmentation-row"
      :class="{ glitched: augmentation.glitched }"
    >
      <span class="marker" aria-hidden="true">▸</span>
      <input
        v-model="augmentation.description"
        :class="{ filled: !!augmentation.description.trim() }"
        type="text"
        :aria-label="`Augmentation ${index + 1}`"
      />
      <UiToggle
        v-model="augmentation.glitched"
        label="Glitched"
        hazard
        :input-label="`Augmentation ${index + 1} glitched`"
      />
    </div>
  </section>
</template>

<style scoped>
.augmentations-card {
  position: relative;
  min-width: 0;
  padding: var(--space-6);
  border: var(--theme-panel-border-width) solid var(--color-border);
  border-top: var(--theme-panel-rule-width) solid var(--color-hot);
  border-radius: var(--radius-lg);
  box-shadow: var(--theme-panel-shadow);
  background: var(--theme-panel-fill);
  background-image: var(--theme-panel-texture);
  color: var(--color-text);
}
.augmentations-card::after {
  content: '';
  position: absolute;
  top: 7px;
  right: var(--space-3);
  width: 3rem;
  height: 5px;
  background: var(--theme-panel-edge);
  pointer-events: none;
}
h2 {
  margin-bottom: var(--space-4);
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: var(--theme-heading-weight);
  color: var(--theme-title-color);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  text-shadow: var(--theme-heading-shadow);
  overflow-wrap: anywhere;
}
.rules {
  margin-bottom: var(--space-6);
  padding-left: var(--space-4);
  font-size: var(--font-small-control-size);
  line-height: 1.5;
  list-style-type: '▸ ';
}
.rules li + li {
  margin-top: var(--space-4);
}
strong {
  text-transform: uppercase;
}
.augmentation-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-3);
  padding-block: var(--space-4);
  border-bottom: 2px solid currentColor;
  transition: var(--control-color-transition);
}
.marker {
  color: var(--color-muted);
}
input {
  width: 100%;
  min-width: 0;
  padding: var(--space-2);
  border: 0;
  border-bottom: 2px solid currentColor;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font-size: var(--font-control-size);
  font-weight: 600;
}
.glitched {
  color: var(--color-hot);
}
input.filled {
  background: var(--color-rating-one);
  border-color: var(--color-rating-one);
  color: var(--color-on-accent);
  font-weight: 600;
}
@media (max-width: 40rem) {
  .augmentation-row {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .augmentation-row > :last-child {
    grid-column: 2;
    justify-self: end;
  }
}
@media (max-width: 24rem) {
  .augmentations-card {
    padding: var(--space-4);
  }
}
</style>
