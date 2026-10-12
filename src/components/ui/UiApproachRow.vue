<script setup lang="ts">
import type { Attribute, CharacterSheet } from '@/data/characters/types'
import { cbrPnkApproachLabels } from '@/data/characters/cbr-pnk-sheet'
import UiSheetRatingRow from './UiSheetRatingRow.vue'
import UiRatingChecks from './UiRatingChecks.vue'
import UiToggle from './UiToggle.vue'
defineProps<{ attribute: Attribute }>()
const rating = defineModel<CharacterSheet['attributeRatings'][number]>('rating', { required: true })
const glitch = defineModel<CharacterSheet['glitches'][number]>('glitch', { required: true })
</script>
<template>
  <UiSheetRatingRow kind="approach" :state="glitch.marked ? 'glitched' : String(rating.value ?? 0)">
    <div class="approach-panel">
      <div class="approach-title">
        <label class="approach-name" :for="attribute.id">{{ attribute.name }}</label>
        <span class="approach-negative" :class="{ visible: glitch.marked }"
          >// {{ cbrPnkApproachLabels[attribute.key]?.glitch }}</span
        >
      </div>
      <span class="description">{{ cbrPnkApproachLabels[attribute.key]?.description }}</span>
    </div>
    <div class="approach-rating">
      <UiRatingChecks :id="attribute.id" v-model="rating.value" :label="attribute.name" />
      <UiToggle
        v-model="glitch.marked"
        label="Glitched"
        hazard
        :input-label="`${attribute.name} glitched`"
      />
    </div>
  </UiSheetRatingRow>
</template>
<style scoped>
.approach-panel {
  display: grid;
  gap: var(--space-2);
}
.approach-title {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}
.approach-title > * {
  white-space: nowrap;
}
.approach-name {
  font-family: var(--font-display);
  font-weight: var(--theme-name-weight);
  color: var(--row-name);
  font-size: 1.625rem;
  line-height: 1.15;
}
.approach-negative {
  visibility: hidden;
  font-family: var(--font-display);
  font-size: clamp(0.75rem, 2.5vw, 1rem);
  font-weight: var(--theme-name-weight);
}
.approach-negative.visible {
  visibility: visible;
}
.description {
  color: var(--row-muted);
  font-size: var(--font-small-control-size);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.approach-rating {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
@media screen and (max-width: 24rem) {
  .approach-rating {
    gap: var(--space-2);
  }
}
</style>
