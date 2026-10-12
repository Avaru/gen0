<script setup lang="ts">
import type { CharacterSheet, Skill } from '@/data/characters/types'
import { cbrPnkExpertiseOptions } from '@/data/characters/cbr-pnk-sheet'
import UiSheetRatingRow from './UiSheetRatingRow.vue'
import UiRatingChecks from './UiRatingChecks.vue'
import UiExpertiseChoices from './UiExpertiseChoices.vue'
import UiScrambleText from './UiScrambleText.vue'
withDefaults(defineProps<{ skill: Skill; coreModuleId: string; generation?: number }>(), { generation: 0 })
const rating = defineModel<CharacterSheet['skillRatings'][number]>('rating', { required: true })
const expertise = defineModel<CharacterSheet['expertises'][number]>('expertise', { required: true })
</script>
<template>
  <UiSheetRatingRow kind="skill" :state="String(rating.value ?? 0)">
    <div class="skill-stat">
      <label class="skill-name" :for="skill.id"
        ><UiScrambleText :text="skill.name" :replay-key="generation" :duration="generation ? 550 : 0" /><small v-if="skill.requiredModuleIds.some((id) => id !== coreModuleId)"
          >// Weird</small
        ></label
      >
      <UiRatingChecks :id="skill.id" v-model="rating.value" :label="skill.name" />
    </div>
    <UiExpertiseChoices
      v-model="expertise.values"
      v-model:custom="expertise.custom"
      class="expertises"
      :label="skill.name"
      :options="cbrPnkExpertiseOptions[skill.key] ?? []"
    />
  </UiSheetRatingRow>
</template>
<style scoped>
.skill-name {
  --scramble-color: var(--row-name);
  max-width: 7rem;
  font-family: var(--font-display);
  font-weight: var(--theme-name-weight);
  color: var(--row-name);
  font-size: 1.375rem;
  line-height: 1.15;
}
.skill-name:has(small) {
  max-width: none;
  white-space: nowrap;
}
.skill-name small {
  margin-left: var(--space-2);
  font-size: clamp(0.75rem, 2.5vw, 1rem);
}
.skill-stat {
  display: grid;
  min-width: 0;
  gap: var(--space-2);
}
.expertises {
  min-width: 0;
  grid-column: 2;
  align-self: end;
}
@media screen and (min-width: 56rem) {
  .skill-stat {
    display: contents;
  }
  .skill-name {
    grid-column: 1 / -1;
    max-width: none;
  }
  .rating {
    grid-column: 1;
    grid-row: 2;
  }
  .expertises {
    grid-row: 2;
  }
}
</style>
