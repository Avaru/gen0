<script setup lang="ts">
import { computed } from 'vue'
import type { CharacterGear } from '@/data/characters/types'
import { cbrPnkGearColumns, cbrPnkLoadLevels } from '@/data/characters/cbr-pnk-sheet'
import UiSegments from './UiSegments.vue'
import UiDiamondChoice from './UiDiamondChoice.vue'

const gear = defineModel<CharacterGear>({ required: true })
const level = computed(() => cbrPnkLoadLevels.find((item) => item.value === gear.value.level)!)
const total = computed(() =>
  cbrPnkGearColumns.flat().reduce((sum, item) =>
    sum + (gear.value.selected.includes(item.name) ? item.load : 0), 0) +
  gear.value.extra.filter(Boolean).length,
)
const state = computed(() =>
  total.value > level.value.load ? 'red' : total.value === level.value.load ? 'yellow' : 'empty')
function selectGear(name: string, selected: boolean) {
  gear.value.selected = selected
    ? [...gear.value.selected.filter((item) => item !== name), name]
    : gear.value.selected.filter((item) => item !== name)
}
</script>

<template>
  <section class="gear-card" :data-state="state" aria-labelledby="gear-heading">
    <div class="heading">
      <h2 id="gear-heading">Load/Gear</h2>
      <output aria-live="polite" aria-label="Total load">{{ total }} / {{ level.load }}</output>
    </div>
    <p class="rule">
      During the Run you may declare gear on-hand by marking it on your list—up to a number of
      items equal to your LOAD level. If an item is depleted, destroyed, or lost, cross it off the list.
    </p>
    <UiSegments v-model="gear.level" label="Load level" name="gear-load" :options="cbrPnkLoadLevels" />
    <p class="load-description">{{ level.description }}</p>
    <div class="gear-columns">
      <div v-for="(column, columnIndex) in cbrPnkGearColumns" :key="columnIndex" class="gear-column">
        <UiDiamondChoice
          v-for="item in column"
          :key="item.name"
          class="gear-item"
          :model-value="gear.selected.includes(item.name)"
          :label="item.name"
          :count="item.load"
          @update:model-value="selectGear(item.name, $event)"
        >
          {{ item.name }}<small v-if="item.description">{{ item.description }}</small>
        </UiDiamondChoice>
        <div v-if="columnIndex === 1" class="extra-load" role="group" aria-label="Extra load">
          <div class="extra-marks">
            <UiDiamondChoice
              v-for="(_, index) in gear.extra"
              :key="index"
              v-model="gear.extra[index]!"
              class="extra-mark"
              :label="`Extra load ${index + 1}`"
              compact
            />
          </div>
          <span class="item-text">Extra load</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gear-card {
  --gear-fill: var(--theme-panel-fill);
  --gear-ink: var(--color-text);
  position: relative;
  min-width: 0;
  padding: var(--space-6);
  border: var(--theme-panel-border-width) solid var(--color-border);
  border-top: var(--theme-panel-rule-width) solid var(--color-hot);
  border-radius: var(--radius-lg);
  box-shadow: var(--theme-panel-shadow);
  background: var(--gear-fill);
  background-image: var(--theme-panel-texture);
  color: var(--gear-ink);
  transition: var(--control-color-transition);
}
.gear-card[data-state='yellow'] {
  --gear-fill: var(--color-rating-one);
  --gear-ink: var(--color-on-accent);
}
.gear-card[data-state='red'] {
  --gear-fill: var(--color-hot);
  --gear-ink: var(--color-on-accent);
}
.gear-card::after {
  content: '';
  position: absolute;
  top: 7px;
  right: var(--space-3);
  width: 3rem;
  height: 5px;
  background: var(--theme-panel-edge);
  pointer-events: none;
}
.heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: var(--theme-heading-weight);
  color: var(--theme-title-color);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  text-shadow: var(--theme-heading-shadow);
  overflow-wrap: anywhere;
}
.gear-card:not([data-state='empty']) h2 {
  color: var(--gear-ink);
  text-shadow: none;
}
output { font-weight: 700; white-space: nowrap; }
.rule { margin-bottom: var(--space-4); font-size: 0.625rem; line-height: 1.35; }
.load-description { margin-block: var(--space-2) var(--space-4); font-size: 0.75rem; }
.gear-columns { display: grid; gap: var(--space-3); }
.gear-column { min-width: 0; }
.extra-load {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--control-height);
  padding-block: var(--space-2);
}
.gear-card[data-state='yellow'] {
  --diamond-selected: var(--color-on-accent);
  --diamond-selected-decoration: underline;
}
.extra-load:has(input:checked) .item-text { color: var(--color-signal); }
.gear-card[data-state='yellow'] .extra-load:has(input:checked) .item-text {
  color: var(--color-on-accent);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.gear-card[data-state='yellow'] :deep(.segments input:checked + span) {
  background: transparent;
  color: var(--color-on-accent);
  border-bottom-color: currentColor;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.item-text { min-width: 0; font-family: var(--font-display); font-weight: var(--theme-name-weight); font-size: 1.125rem; text-transform: uppercase; overflow-wrap: anywhere; }
small { display: block; font-family: var(--font-body); font-weight: 400; font-size: 0.625rem; line-height: 1.35; margin-top: var(--space-1); }
.extra-load { flex-wrap: wrap; gap: var(--space-2); }
.extra-marks { display: flex; }
.gear-card:not([data-state='empty']) :deep(legend) { color: var(--gear-ink); }
@media (min-width: 40rem) { .gear-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 24rem) { .gear-card { padding: var(--space-4); } }
</style>
