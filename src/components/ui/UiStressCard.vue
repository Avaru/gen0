<script setup lang="ts">
import UiSheetSymbol from './UiSheetSymbol.vue'
import UiSheetCard from './UiSheetCard.vue'
import UiDiamondChoice from './UiDiamondChoice.vue'
import { cbrPnkStressComplications } from '@/data/characters/cbr-pnk-sheet'

const stress = defineModel<number>({ required: true })
function change(position: number, selected: boolean) {
  stress.value = selected ? position : position - 1
}
</script>

<template>
  <UiSheetCard class="stress-card" title="Stress" heading-id="stress-heading" edge="hot">
    <p class="costs">
      <span
        >Push: <UiSheetSymbol kind="stress" label="stress" /><UiSheetSymbol
          kind="stress"
          label="stress" /></span
      ><span aria-hidden="true">/</span>
      <span>Assist: <UiSheetSymbol kind="stress" label="stress" /></span
      ><span aria-hidden="true">/</span>
      <span
        >Flashback: <UiSheetSymbol kind="stress" label="stress" /> or
        <UiSheetSymbol kind="stress" label="stress" /><UiSheetSymbol
          kind="stress"
          label="stress"
        />+</span
      >
    </p>
    <div class="track" role="group" aria-label="Stress slots">
      <UiDiamondChoice
        v-for="position in 7"
        :key="position"
        :class="{ last: position === 7 }"
        :model-value="stress >= position"
        :label="`Stress slot ${position}`"
        compact
        @update:model-value="change(position, $event)"
      />
    </div>
    <div class="overload" :class="{ active: stress === 7 }">
      <p>
        <strong>Overload</strong> When you mark your last
        <UiSheetSymbol kind="stress" label="stress" />, an Approach of your choosing becomes
        permanently <strong>Glitched</strong> and immediately incurs a complication, such as:
      </p>
      <ul>
        <li v-for="complication in cbrPnkStressComplications" :key="complication">
          {{ complication }}
        </li>
      </ul>
      <p>
        While <strong>overloaded</strong> you can’t perform actions that would require
        <UiSheetSymbol kind="stress" label="stress" />. <strong>Take a breather</strong> to relieve
        <UiSheetSymbol kind="stress" label="stress" /> and clear this status.
      </p>
    </div>
  </UiSheetCard>
</template>

<style scoped>
.costs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  font-size: var(--font-sheet-rule-size);
  text-transform: uppercase;
}
.track {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  position: relative;
  margin-block: var(--space-6);
  padding-block: var(--space-2);
}
.track::before {
  content: '';
  position: absolute;
  top: 50%;
  left: calc(100% / 14);
  right: calc(100% / 14);
  height: 2px;
  background: var(--color-text);
}
.track {
  --diamond-size: 1.25rem;
  --diamond-empty: var(--theme-panel-fill);
}
.track > .diamond-choice {
  width: 100%;
}
.track .last {
  --diamond-outline: 2px solid var(--color-muted);
  --diamond-selected: var(--color-hot);
}
.overload {
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
}
.overload strong {
  text-transform: uppercase;
}
.overload.active strong {
  color: var(--color-hot);
}
ul {
  margin-block: var(--space-4);
  padding-left: var(--space-6);
  list-style-type: '▸ ';
}
li + li {
  margin-top: var(--space-1);
}
@media (max-width: 24rem) {
  .track {
    grid-template-columns: repeat(7, var(--control-height));
    overflow-x: auto;
  }
  .track::before {
    left: calc(var(--control-height) / 2);
    right: auto;
    width: calc(6 * var(--control-height));
  }
}
@media (forced-colors: active) {
  .track::before {
    display: none;
  }
}
</style>
