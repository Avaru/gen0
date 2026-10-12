<script setup lang="ts">
import type { Attribute, CharacterSheet, Skill, System } from '@/data/characters/types'
import { cbrPnkApproachLabels, cbrPnkExpertiseOptions } from '@/data/characters/cbr-pnk-sheet'
import UiExpertiseChoices from './UiExpertiseChoices.vue'
import UiRatingChecks from './UiRatingChecks.vue'
import UiWorkspace from './UiWorkspace.vue'
import UiToggle from './UiToggle.vue'
import UiHarmCard from './UiHarmCard.vue'
import UiStressCard from './UiStressCard.vue'
import UiAugmentationsCard from './UiAugmentationsCard.vue'
import UiGearCard from './UiGearCard.vue'
import UiRunnerCard from './UiRunnerCard.vue'
import type { Flavor } from '@/generator/options'

withDefaults(defineProps<{ system: System; attributes: Attribute[]; skills: Skill[]; flavor?: Flavor }>(), {
  flavor: 'cyberpunk',
})
const sheet = defineModel<CharacterSheet>({ required: true })
defineEmits<{ reset: []; applyArchetype: [] }>()
function isGlitched(id: string) {
  return sheet.value.glitches.find((item) => item.attributeId === id)?.marked ?? false
}
function approachState(id: string) {
  return isGlitched(id)
    ? 'glitched'
    : String(sheet.value.attributeRatings.find((item) => item.definitionId === id)?.value ?? 0)
}
</script>

<template>
  <form class="sheet" aria-label="CBR+PNK character sheet" @submit.prevent>
    <UiWorkspace>
      <div class="sheet-column">
        <UiRunnerCard v-model="sheet.runner" :flavor="flavor" @reset="$emit('reset')" @apply-archetype="$emit('applyArchetype')" />
        <section class="approaches" aria-labelledby="approaches-heading">
          <h2 id="approaches-heading">{{ system.attributeLabel }}</h2>
          <div
            v-for="attribute in attributes"
            :key="attribute.id"
            class="approach"
            :data-state="approachState(attribute.id)"
          >
            <div class="approach-panel">
              <div class="approach-title">
                <label class="approach-name" :for="attribute.id">{{ attribute.name }}</label>
                <span class="approach-negative" :class="{ visible: isGlitched(attribute.id) }">
                  // {{ cbrPnkApproachLabels[attribute.key]?.glitch }}
                </span>
              </div>
              <span class="description">{{
                cbrPnkApproachLabels[attribute.key]?.description
              }}</span>
            </div>
            <div
              v-if="sheet.attributeRatings.find((item) => item.definitionId === attribute.id)"
              class="approach-rating"
            >
              <UiRatingChecks
                :id="attribute.id"
                v-model="
                  sheet.attributeRatings.find((item) => item.definitionId === attribute.id)!.value
                "
                :label="attribute.name"
              />
              <UiToggle
                v-if="sheet.glitches.find((item) => item.attributeId === attribute.id)"
                v-model="sheet.glitches.find((item) => item.attributeId === attribute.id)!.marked"
                label="Glitched"
                hazard
                :input-label="`${attribute.name} glitched`"
              />
            </div>
          </div>
        </section>
        <UiHarmCard v-model="sheet.harm" />
        <UiStressCard v-model="sheet.stress" />
      </div>
      <div class="sheet-column">
        <section class="skills" aria-labelledby="skills-heading">
          <div class="skill-heading">
            <h2 id="skills-heading">{{ system.skillLabel }}</h2>
            <p class="expertise-rule">
              Expertises don’t add + to a roll, but allow you to trade + for an EDGE—and vice
              versa—when they are applicable.
            </p>
          </div>
          <div
            v-for="skill in skills"
            :key="skill.id"
            class="skill"
            :data-state="
              String(sheet.skillRatings.find((item) => item.definitionId === skill.id)?.value ?? 0)
            "
          >
            <label class="skill-name" :for="skill.id">
              {{ skill.name }}
              <small v-if="skill.requiredModuleIds.some((id) => id !== system.coreModuleId)"
                >Weird</small
              >
            </label>
            <UiRatingChecks
              v-if="sheet.skillRatings.find((item) => item.definitionId === skill.id)"
              :id="skill.id"
              v-model="sheet.skillRatings.find((item) => item.definitionId === skill.id)!.value"
              :label="skill.name"
            />
            <UiExpertiseChoices
              v-if="sheet.expertises.find((item) => item.skillId === skill.id)"
              v-model="sheet.expertises.find((item) => item.skillId === skill.id)!.values"
              class="expertises"
              :label="skill.name"
              :options="cbrPnkExpertiseOptions[skill.key] ?? []"
            />
          </div>
        </section>
        <UiGearCard v-model="sheet.gear" />
        <UiAugmentationsCard v-model="sheet.augmentations" />
      </div>
    </UiWorkspace>
  </form>
</template>

<style scoped>
.description {
  font-size: var(--font-small-control-size);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
section {
  position: relative;
  min-width: 0;
  padding: var(--space-6);
  color: var(--color-text);
  background: var(--theme-panel-fill);
  background-image: var(--theme-panel-texture);
  border: var(--theme-panel-border-width) solid var(--color-border);
  border-top: var(--theme-panel-rule-width) solid var(--color-signal);
  box-shadow: var(--theme-panel-shadow);
  border-radius: var(--radius-lg);
}
.approaches {
  border-top-color: var(--color-hot);
}
section::after {
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
  min-width: 0;
  margin-bottom: var(--space-4);
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: var(--theme-heading-weight);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--theme-title-color);
  text-shadow: var(--theme-heading-shadow);
  overflow-wrap: anywhere;
}
.approach,
.skill {
  position: relative;
  display: grid;
  gap: var(--space-3);
  padding-block: var(--space-4);
  border-top: 1px solid var(--color-border);
}
.approach::after,
.skill::after {
  content: '';
  position: absolute;
  top: -1px;
  right: 0;
  width: 1.75rem;
  height: 3px;
  background: var(--theme-row-mark);
  opacity: 0.55;
  pointer-events: none;
}
.approach-panel {
  display: grid;
  gap: var(--space-2);
}
.approach-name,
.skill-name {
  font-family: var(--font-display);
  font-weight: var(--theme-name-weight);
  color: var(--theme-name-color);
  font-size: 1.625rem;
  line-height: 1.15;
}
.description {
  color: var(--color-muted);
}
.approach-title {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: var(--space-2);
}
.approach-title > * {
  white-space: nowrap;
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
.approach,
.skill {
  --rating-fill: var(--color-surface);
  padding: var(--space-4);
  background: var(--rating-fill);
  border: 1px solid var(--color-border);
  margin-top: var(--space-3);
  transition: var(--control-color-transition);
}
.approach[data-state='1'],
.skill[data-state='1'] {
  --rating-fill: var(--color-rating-one);
}
.approach[data-state='2'],
.skill[data-state='2'] {
  --rating-fill: var(--color-signal);
}
.approach[data-state='glitched'] {
  --rating-fill: var(--color-hot);
}
.approach:not([data-state='0']),
.approach:not([data-state='0']) .approach-name,
.approach:not([data-state='0']) .description,
.skill:not([data-state='0']),
.skill:not([data-state='0']) .skill-name,
.skill:not([data-state='0']) .skill-name small {
  color: var(--color-on-accent);
}
.approach:not([data-state='0']),
.skill:not([data-state='0']) {
  border-color: var(--rating-fill);
}
.approach-rating {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.skill-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-4);
  padding-right: calc(var(--space-2) + 1px);
}
.expertise-rule {
  flex: 1 1 10rem;
  max-width: 19rem;
  margin-left: auto;
  padding-top: var(--space-4);
  text-align: right;
  color: var(--color-muted);
  font-size: 0.625rem;
  line-height: 1.35;
}
.skill {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--space-2);
  padding: var(--space-2);
  margin-top: var(--space-2);
}
.skill::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: -1px;
  width: 0.5rem;
  height: 0.5rem;
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  opacity: 0.45;
  pointer-events: none;
}
.skill::after {
  width: 2.5rem;
  height: 4px;
  opacity: 0.8;
}
.skill:nth-of-type(3n)::after {
  width: 1.5rem;
}
.skill:not([data-state='0'])::after {
  background: repeating-linear-gradient(
    90deg,
    currentColor 0 1px,
    transparent 1px 4px,
    currentColor 4px 6px,
    transparent 6px 9px
  );
}
.skill-name {
  font-size: 1.375rem;
}
.skill-name small {
  display: block;
  color: var(--color-muted);
  font-family: var(--font-body);
  font-size: 0.65rem;
  text-transform: uppercase;
}
.expertises {
  min-width: 0;
  grid-column: 1 / -1;
}
@media (min-width: 40rem) {
  .skill {
    grid-template-columns: minmax(7rem, 1fr) auto minmax(0, 1.5fr);
    gap: var(--space-2);
  }
  .expertises {
    grid-column: auto;
  }
}
/* Contents keep the existing single-column order on phones. */
.sheet-column {
  display: contents;
}
.runner-card {
  order: 0;
}
.approaches {
  order: 1;
}
.skills {
  order: 2;
}
.harm-card {
  order: 3;
}
.stress-card {
  order: 4;
}
.augmentations-card {
  order: 6;
}
.gear-card {
  order: 5;
}
@media (min-width: 56rem) {
  .sheet-column {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    min-width: 0;
  }
}
@media (max-width: 24rem) {
  section {
    padding: var(--space-4);
  }
  .approach {
    padding-inline: var(--space-2);
  }
  .approach-rating {
    gap: var(--space-2);
  }
  .approach-rating :deep(label.hazard) {
    padding-inline: var(--space-1);
    white-space: nowrap;
  }
  .approach-rating :deep(label.hazard .track) {
    width: 2rem;
  }
}
</style>
