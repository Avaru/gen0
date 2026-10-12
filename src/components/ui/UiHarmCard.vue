<script setup lang="ts">
import UiSheetField from './UiSheetField.vue'
import UiSheetCard from './UiSheetCard.vue'
import { computed } from 'vue'
import UiDiamondChoice from './UiDiamondChoice.vue'
import type { CharacterHarm } from '@/data/characters/types'

const harm = defineModel<CharacterHarm[]>({ required: true })
const state = computed(() => {
  const lowerLevelsFull = [1, 2].every((level) =>
    harm.value.some((row) => row.level === level && row.marks.every(Boolean)),
  )
  if (lowerLevelsFull || harm.value.some((row) => row.level === 3 && row.marks.some(Boolean)))
    return 'red'
  if (harm.value.some((row) => row.level === 2 && row.marks.some(Boolean))) return 'yellow'
  return harm.value.some((row) => row.level === 1 && row.marks.some(Boolean)) ? 'cyan' : 'empty'
})
</script>

<template>
  <UiSheetCard class="harm-card" title="Harm" heading-id="harm-heading" edge="hot" :state="state">
    <p class="rule">
      If you take Harm of a Level already filled, move it on to a greater Harm Level. Whenever a
      HARM would hinder an action, apply its designated PENALTY—when OUT, you can act only if
      ASSISTED or making a PUSH.
    </p>
    <div class="columns" aria-hidden="true">
      <span>Level / Descriptive</span><span>Penalty</span>
    </div>
    <div v-for="row in harm" :key="row.level" class="harm-row">
      <label class="level" :for="`harm-${row.level}`">{{ row.level }}</label>
      <UiSheetField
        :id="`harm-${row.level}`"
        v-model="row.description"
        class="description"
        :aria-label="`Level ${row.level} harm description`"
      />
      <div class="marks" role="group" :aria-label="`Level ${row.level} harm slots`">
        <UiDiamondChoice
          v-for="(_, index) in row.marks"
          :key="index"
          v-model="row.marks[index]!"
          class="mark"
          :label="`Level ${row.level} harm slot ${index + 1}`"
          compact
        />
      </div>
      <span class="penalty">{{ row.level === 1 ? '▼E' : row.level === 2 ? '−' : 'OUT' }}</span>
    </div>
  </UiSheetCard>
</template>

<style scoped>
.harm-card {
  --diamond-selected: var(--card-ink);
}

.columns {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  font-size: 0.625rem;
  text-transform: uppercase;
}
.harm-row {
  display: grid;
  grid-template-columns: 1.25rem minmax(0, 1fr) auto 2rem;
  align-items: center;
  gap: var(--space-1);
  padding-block: var(--space-3);
  border-bottom: 1px solid var(--color-control-border);
}
.level {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
}
.description {
  --field-padding: var(--space-1);
}
.marks {
  display: flex;
  justify-content: flex-end;
  min-width: calc(2 * var(--control-height));
}
.penalty {
  font-size: 0.625rem;
  text-align: right;
  font-weight: 700;
}
</style>
