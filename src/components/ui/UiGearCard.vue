<script setup lang="ts">
import { computed } from 'vue'
import type { CharacterGear } from '@/data/characters/types'
import { cbrPnkGearColumns, cbrPnkLoadLevels } from '@/data/characters/cbr-pnk-sheet'
import UiSegments from './UiSegments.vue'

const gear = defineModel<CharacterGear>({ required: true })
const level = computed(() => cbrPnkLoadLevels.find((item) => item.value === gear.value.level)!)
const total = computed(() =>
  cbrPnkGearColumns.flat().reduce((sum, item) =>
    sum + (gear.value.selected.includes(item.name) ? item.load : 0), 0) +
  gear.value.extra.filter(Boolean).length,
)
const state = computed(() =>
  total.value > level.value.load ? 'red' : total.value === level.value.load ? 'yellow' : 'empty')
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
        <label v-for="item in column" :key="item.name" class="gear-item">
          <input v-model="gear.selected" type="checkbox" :value="item.name" :aria-label="item.name" />
          <span class="diamonds" aria-hidden="true"><span v-for="mark in item.load" :key="mark" /></span>
          <span class="item-text">{{ item.name }}<small v-if="item.description">{{ item.description }}</small></span>
        </label>
        <div v-if="columnIndex === 1" class="extra-load" role="group" aria-label="Extra load">
          <div class="extra-marks">
            <label v-for="(_, index) in gear.extra" :key="index" class="extra-mark">
              <input v-model="gear.extra[index]" type="checkbox" :aria-label="`Extra load ${index + 1}`" />
              <span class="diamonds" aria-hidden="true"><span /></span>
            </label>
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
.gear-item, .extra-load {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--control-height);
  padding-block: var(--space-2);
}
.gear-item, .extra-mark { position: relative; cursor: pointer; }
input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}
.diamonds { display: flex; flex-shrink: 0; gap: var(--space-3); padding-inline: var(--space-1); }
.diamonds > span { width: 1rem; height: 1rem; border: 2px solid currentColor; transform: rotate(45deg); }
input:checked + .diamonds > span { background: var(--color-signal); }
.gear-item:has(input:checked) .item-text, .extra-load:has(input:checked) .item-text { color: var(--color-signal); }
.gear-card[data-state='yellow'] input:checked + .diamonds > span {
  background: var(--color-on-accent);
}
.gear-card[data-state='yellow'] .gear-item:has(input:checked) .item-text,
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
input:focus-visible + .diamonds { outline: 3px solid var(--color-focus); outline-offset: 4px; }
.gear-item:hover .diamonds > span, .extra-mark:hover .diamonds > span { box-shadow: 0 0 0 2px currentColor; }
.item-text { min-width: 0; font-family: var(--font-display); font-weight: var(--theme-name-weight); font-size: 1.125rem; text-transform: uppercase; overflow-wrap: anywhere; }
small { display: block; font-family: var(--font-body); font-weight: 400; font-size: 0.625rem; line-height: 1.35; margin-top: var(--space-1); }
.extra-load { flex-wrap: wrap; gap: var(--space-2); }
.extra-marks { display: flex; }
.extra-mark { display: grid; align-items: center; justify-items: start; width: var(--control-height); height: var(--control-height); }
.gear-card:not([data-state='empty']) :deep(legend) { color: var(--gear-ink); }
@media (min-width: 40rem) { .gear-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 24rem) { .gear-card { padding: var(--space-4); } }
@media (forced-colors: active) {
  input { position: static; width: 1.5rem; height: 1.5rem; min-height: 0; opacity: 1; appearance: auto; flex-shrink: 0; }
  .diamonds { display: none; }
}
</style>
