<script setup lang="ts">
import UiSheetCard from './UiSheetCard.vue'
import { computed } from 'vue'
import type { CharacterGear } from '@/data/characters/types'
import { cbrPnkGearColumns, cbrPnkLoadLevels } from '@/data/characters/cbr-pnk-sheet'
import UiSegments from './UiSegments.vue'
import UiDiamondChoice from './UiDiamondChoice.vue'

const gear = defineModel<CharacterGear>({ required: true })
const level = computed(() => cbrPnkLoadLevels.find((item) => item.value === gear.value.level)!)
const total = computed(
  () =>
    cbrPnkGearColumns
      .flat()
      .reduce((sum, item) => sum + (gear.value.selected.includes(item.name) ? item.load : 0), 0) +
    gear.value.extra.filter(Boolean).length,
)
const state = computed(() =>
  total.value > level.value.load ? 'red' : total.value === level.value.load ? 'yellow' : 'empty',
)
function selectGear(name: string, selected: boolean) {
  if (name === '+Heavy' && selected) selectGear('Armor', true)
  if (name === 'Armor' && !selected) selectGear('+Heavy', false)
  gear.value.selected = selected
    ? [...gear.value.selected.filter((item) => item !== name), name]
    : gear.value.selected.filter((item) => item !== name)
}
</script>

<template>
  <UiSheetCard
    class="gear-card"
    title="Load/Gear"
    heading-id="gear-heading"
    edge="hot"
    :state="state"
  >
    <p class="rule">
      During the Run you may declare gear on-hand by marking it on your list—up to a number of items
      equal to your LOAD level. If an item is depleted, destroyed, or lost, cross it off the list.
    </p>
    <UiSegments
      v-model="gear.level"
      label="Load level"
      name="gear-load"
      :options="cbrPnkLoadLevels"
    />
    <p class="load-description">
      {{ level.description }}
      <output aria-live="polite" aria-label="Total load">{{ total }} / {{ level.load }}</output>
    </p>
    <div class="gear-columns">
      <div
        v-for="(column, columnIndex) in cbrPnkGearColumns"
        :key="columnIndex"
        class="gear-column"
      >
        <UiDiamondChoice
          v-for="item in column"
          :key="item.name"
          class="gear-item"
          :class="{ 'armor-option': item.name === 'Armor' || item.name === '+Heavy' }"
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
  </UiSheetCard>
</template>

<style scoped>
output {
  margin-left: var(--space-2);
  font-weight: 700;
  white-space: nowrap;
}

.load-description {
  margin-block: var(--space-2);
  font-size: var(--font-sheet-rule-size);
}
.gear-columns {
  display: grid;
  grid-auto-rows: 1fr;
  gap: var(--space-3);
}
.gear-column {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  grid-auto-rows: 1fr;
  column-gap: var(--space-3);
  min-width: 0;
}
.gear-item,
.extra-load {
  grid-column: 1 / -1;
}
.gear-item {
  padding-block: var(--space-1);
}
.armor-option {
  grid-column: auto;
}
.extra-load {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
  min-height: var(--control-height);
  padding-block: 0;
}
.gear-card[data-state='yellow'] {
  --diamond-selected: var(--color-on-accent);
  --diamond-selected-decoration: underline;
}
.extra-load:has(input:checked) .item-text {
  color: var(--color-signal);
}
.gear-card[data-state='yellow'] .extra-load:has(input:checked) .item-text {
  color: var(--color-on-accent);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.gear-card[data-state='yellow'] {
  --segment-selected-fill: transparent;
  --segment-selected-ink: var(--card-ink);
  --segment-selected-decoration: underline;
  --segment-selected-border: currentColor;
}
.item-text {
  min-width: 0;
  font-family: var(--font-display);
  font-weight: var(--theme-name-weight);
  font-size: 1.125rem;
  line-height: 1.15;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
.gear-item :deep(.item-text) {
  line-height: 1.15;
}
small {
  display: block;
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 0.625rem;
  line-height: 1.35;
  margin-top: 0;
}
.extra-marks {
  display: flex;
  gap: var(--space-1);
}
.extra-mark {
  width: calc(var(--diamond-size, 1rem) + 2 * var(--space-1));
}
.gear-card:not([data-state='empty']) {
  --control-label-color: var(--card-ink);
}
@media (min-width: 40rem) {
  .gear-columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
