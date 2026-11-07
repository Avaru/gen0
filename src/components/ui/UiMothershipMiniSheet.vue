<script setup lang="ts">
import UiScrambleText from './UiScrambleText.vue'
import UiSheetCard from './UiSheetCard.vue'
import UiNumberStepper from './UiNumberStepper.vue'
import { computed } from 'vue'
import type { MothershipSheet } from '@/helper/mothershipCharacterLink'
import {
  mothershipSheetEquipment,
  mothershipSheetSkills,
  mothershipSheetTrauma,
} from '@/helper/mothershipSheetFields'
import { mothershipSkills } from '@/data/characters/mothership-skills'

const sheet = defineModel<MothershipSheet>({ required: true })
const character = computed(() => sheet.value.mothershipCharacter)
const resources = [
  ['stress', 'Stress'],
  ['health', 'Health'],
  ['wounds', 'Wounds'],
] as const

function updateCurrent(key: 'health' | 'wounds' | 'stress', current: number) {
  character.value[key].current = current
  sheet.value.filledResources = [...new Set([...(sheet.value.filledResources ?? []), key])]
}

const groups = [
  [
    ['Str', 'Str'],
    ['Spd', 'Speed'],
    ['Int', 'Int'],
    ['Cmb', 'Combat'],
  ],
  [
    ['San', 'Sanity'],
    ['Fea', 'Fear'],
    ['Bod', 'Body'],
  ],
] as const
</script>

<template>
  <UiSheetCard
    id="mothership-mini-sheet"
    class="mini-sheet"
    :title="sheet.primary"
    heading-id="mothership-mini-sheet-heading"
    heading-class="mini-sheet-heading"
    tabindex="-1"
  >
    <p class="character-identity">
      <span class="character-class">{{ character.characterClass }}</span
      ><span v-if="sheet.pronouns"> · {{ sheet.pronouns }}</span>
    </p>
    <dl v-for="(group, index) in groups" :key="index" class="scores">
      <div v-for="[key, label] in group" :key="key" class="score">
        <dt>{{ label }}</dt>
        <dd>
          <UiScrambleText
            :text="String(character.scores[key])"
            :replay-key="character.scores"
            :duration="400"
            symbols="0123456789"
          />
        </dd>
      </div>
    </dl>
    <dl class="resources">
      <div v-for="[key, label] in resources" :key="key" class="resource" :class="key">
        <dt>
          <span class="field-label">{{ label }}</span>
        </dt>
        <dd>
          <UiNumberStepper
            :label="label"
            :model-value="character[key].current"
            :replay-key="character.scores"
            :min="key === 'stress' ? character.stress.min : 0"
            :max="key === 'stress' ? undefined : character[key].max"
            @update:model-value="updateCurrent(key, $event)"
          />
        </dd>
      </div>
    </dl>
    <div class="skills">
      <h3 class="field-label">Skills</h3>
      <ul v-if="sheet.skillsText !== undefined">
        <li
          v-for="(skill, index) in mothershipSheetSkills(sheet).split('\n').filter(Boolean)"
          :key="index"
        >
          <span>{{ skill }}</span>
        </li>
      </ul>
      <ul v-else>
        <li v-for="id in character.skills" :key="id">
          <span>{{ mothershipSkills[id].name }}</span>
          <span class="skill-tier">{{ mothershipSkills[id].tier }}</span>
        </li>
      </ul>
    </div>
    <div class="starting-gear">
      <h3 class="field-label">Equipment</h3>
      <ul>
        <li
          v-for="(entry, index) in mothershipSheetEquipment(sheet).split('\n').filter(Boolean)"
          :key="index"
        >
          {{ entry }}
        </li>
      </ul>
    </div>
    <div class="trauma-response">
      <h3 class="field-label">Trauma Response</h3>
      <p>{{ mothershipSheetTrauma(sheet) }}</p>
    </div>
    <div v-if="sheet.appearance" class="appearance">
      <h3 class="field-label">Appearance</h3>
      <p>{{ sheet.appearance }}</p>
    </div>
    <dl class="resource credits">
      <dt class="field-label">Credits</dt>
      <dd>
        <UiScrambleText :text="String(character.credits)" :duration="400" symbols="0123456789" />
      </dd>
    </dl>
  </UiSheetCard>
</template>

<style scoped>
.mini-sheet {
  container-type: inline-size;
  --mothership-stat-diameter: min(3.5rem, calc((100cqi - 3 * var(--space-2)) / 4));
  --card-heading-gap: var(--space-1);
  border-color: var(--color-text);
  background-color: var(--color-surface);
}
.mini-sheet :deep(.mini-sheet-heading h2) {
  font-family: var(--font-result-name);
  font-size: var(--font-result-name-size);
  font-size-adjust: from-font;
  font-weight: var(--theme-name-weight);
  line-height: 1.5;
  letter-spacing: normal;
  text-transform: none;
  color: var(--theme-name-color);
  text-box-trim: none;
}
.character-identity {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
}
.scores {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin: var(--space-3) 0 0;
}
.score {
  display: grid;
  flex: 0 1 3.75rem;
  min-width: 0;
  align-content: start;
  justify-items: center;
  gap: var(--space-1);
}
.score dt {
  font-family: var(--font-result-name);
  font-size: clamp(0.4375rem, 2.65vw, 0.625rem);
  text-align: center;
  overflow-wrap: anywhere;
}
.score dd {
  display: grid;
  place-items: center;
  width: var(--mothership-stat-diameter);
  aspect-ratio: 1;
  margin: 0;
  border: var(--theme-panel-border-width) solid var(--color-text);
  border-radius: 50%;
  font-size: 1.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.resources {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
  margin: var(--space-3) 0 0;
}
.resource {
  display: grid;
  min-width: 0;
  gap: 2px;
}
.stress {
  grid-column: 1 / -1;
  justify-self: center;
  width: calc((100% - var(--space-2)) / 2);
}
.resource dt {
  min-width: 0;
  text-align: center;
}
.field-label {
  font-family: var(--font-result-name);
  font-size: 0.625rem;
  font-weight: 400;
  overflow-wrap: anywhere;
}
.resource dd {
  min-width: 0;
  margin: 0;
}
.credits {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--space-4) 0 0;
}
.credits dd {
  font-size: 1.5rem;
  font-weight: 700;
}
.skills,
.starting-gear,
.trauma-response,
.appearance {
  margin-top: var(--space-4);
}
.skills ul {
  display: grid;
  gap: var(--space-2);
  margin: var(--space-2) 0 0;
  padding: 0;
  list-style: none;
}
.skills li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-2);
  font-size: 0.875rem;
  overflow-wrap: anywhere;
}
.skill-tier {
  flex-shrink: 0;
  color: var(--color-muted);
  font-size: 0.75rem;
  text-transform: capitalize;
}
.starting-gear ul {
  margin: var(--space-2) 0 0;
  padding-left: var(--space-4);
  font-size: 0.875rem;
  overflow-wrap: anywhere;
}
.starting-gear li + li {
  margin-top: var(--space-1);
}
.trauma-response p,
.appearance p {
  margin: var(--space-2) 0 0;
  font-size: 0.875rem;
}
.appearance {
  overflow-wrap: anywhere;
}
</style>
