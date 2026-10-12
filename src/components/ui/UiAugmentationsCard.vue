<script setup lang="ts">
import UiSheetField from './UiSheetField.vue'
import UiSheetCard from './UiSheetCard.vue'
import type { CharacterSheet } from '@/data/characters/types'
import UiToggle from './UiToggle.vue'

const augmentations = defineModel<CharacterSheet['augmentations']>({ required: true })
</script>

<template>
  <UiSheetCard
    class="augmentations-card"
    title="Augmentations"
    heading-id="augmentations-heading"
    edge="hot"
  >
    <div class="rules">
      <p>
        Mark ⚡ to activate an enhanced capability
        <em>(e.g. therma-vision, wired reflexes, augmented strength)</em> or produce/conceal an
        specific compact asset <em>(chemicals, blade, nanobots)</em>. Can be combined with a
        <strong>Push</strong>.
      </p>
      <p>
        Mark <strong>Special Resistance</strong> to wield it against a fitting type of Consequence
        <em
          >(e.g. neural firewall, behavioral analyzer, toxin neutralizer, fireproof coating,
          etc)</em
        >.
      </p>
    </div>
    <div
      v-for="(augmentation, index) in augmentations"
      :key="index"
      class="augmentation-row"
      :class="{ glitched: augmentation.glitched }"
    >
      <UiSheetField
        v-model="augmentation.description"
        :filled="!!augmentation.description.trim()"
        :aria-label="`Augmentation ${index + 1}`"
      />
      <UiToggle
        v-model="augmentation.glitched"
        label="Glitched"
        hazard
        :input-label="`Augmentation ${index + 1} glitched`"
      />
    </div>
  </UiSheetCard>
</template>

<style scoped>
.rules p + p {
  margin-top: var(--space-2);
}
strong {
  text-transform: uppercase;
}
.augmentation-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-3);
  padding-block: var(--space-4);
  transition: var(--control-color-transition);
}

.glitched {
  color: var(--color-hot);
}

@media (max-width: 40rem) {
  .augmentation-row {
    grid-template-columns: minmax(0, 1fr);
  }
  .augmentation-row > :last-child {
    grid-column: 1;
    justify-self: end;
  }
}
</style>
