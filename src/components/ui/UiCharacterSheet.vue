<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import type { Attribute, CharacterSheet, Skill, System } from '@/data/characters/types'
import UiWorkspace from './UiWorkspace.vue'
import UiSheetCard from './UiSheetCard.vue'
import UiApproachRow from './UiApproachRow.vue'
import UiSkillRow from './UiSkillRow.vue'
import UiExpertiseRule from './UiExpertiseRule.vue'
import UiHarmCard from './UiHarmCard.vue'
import UiStressCard from './UiStressCard.vue'
import UiResistanceCard from './UiResistanceCard.vue'
import UiAugmentationsCard from './UiAugmentationsCard.vue'
import UiGearCard from './UiGearCard.vue'
import UiRunnerCard from './UiRunnerCard.vue'
import UiRunnerGuide from './UiRunnerGuide.vue'
import UiRollReferenceCards from './UiRollReferenceCards.vue'
import type { Flavor } from '@/generator/options'

const props = withDefaults(
  defineProps<{
    system: System
    attributes: Attribute[]
    skills: Skill[]
    flavor?: Flavor
    canReset: boolean
  }>(),
  {
    flavor: 'cyberpunk',
  },
)
const showCharacterGuide = inject('showCharacterGuide', ref(false))
const sheet = defineModel<CharacterSheet>({ required: true })
const emit = defineEmits<{ reset: []; applyArchetype: [] }>()
const generation = ref(0)
function applyArchetype() {
  emit('applyArchetype')
  generation.value += 1
}

// Keep row references stable while their fields change; only rebuild after replacing a collection.
const approachRows = computed(() => {
  const ratings = new Map(sheet.value.attributeRatings.map((row) => [row.definitionId, row]))
  const glitches = new Map(sheet.value.glitches.map((row) => [row.attributeId, row]))
  return props.attributes.flatMap((attribute) => {
    const rating = ratings.get(attribute.id)
    const glitch = glitches.get(attribute.id)
    return rating && glitch ? [{ attribute, rating, glitch }] : []
  })
})
const skillRows = computed(() => {
  const ratings = new Map(sheet.value.skillRatings.map((row) => [row.definitionId, row]))
  const expertises = new Map(sheet.value.expertises.map((row) => [row.skillId, row]))
  return props.skills.flatMap((skill) => {
    const rating = ratings.get(skill.id)
    const expertise = expertises.get(skill.id)
    return rating && expertise ? [{ skill, rating, expertise }] : []
  })
})

const desktopMedia = window.matchMedia('(min-width: 56rem)')
const printMedia = window.matchMedia('print')
const desktop = ref(desktopMedia.matches)
const printing = ref(printMedia.matches)
const firstColumn = useTemplateRef('first-column')
const secondColumn = useTemplateRef('second-column')
const columns = computed(() =>
  Boolean(firstColumn.value && secondColumn.value && (desktop.value || printing.value)),
)
function updateMedia() {
  desktop.value = desktopMedia.matches
  printing.value = printMedia.matches
}
async function beforePrint() {
  printing.value = true
  // Vue owns both the cards and their Teleports, including print placement.
  await nextTick()
}
function afterPrint() {
  printing.value = false
}
onMounted(() => {
  desktopMedia.addEventListener('change', updateMedia)
  printMedia.addEventListener('change', updateMedia)
  window.addEventListener('beforeprint', beforePrint)
  window.addEventListener('afterprint', afterPrint)
})
onBeforeUnmount(() => {
  desktopMedia.removeEventListener('change', updateMedia)
  printMedia.removeEventListener('change', updateMedia)
  window.removeEventListener('beforeprint', beforePrint)
  window.removeEventListener('afterprint', afterPrint)
})
</script>

<template>
  <form class="sheet" aria-label="CBR+PNK character sheet" @submit.prevent>
    <UiWorkspace>
      <Transition name="guide">
        <div v-if="showCharacterGuide" class="guide-reveal">
          <div class="guide-clip">
            <UiRunnerGuide id="runner-guide" />
          </div>
        </div>
      </Transition>
      <div ref="first-column" class="sheet-column" :class="{ active: columns }" />
      <div ref="second-column" class="sheet-column" :class="{ active: columns }" />
      <!-- Source order is the phone reading and keyboard order. Teleport preserves each card's state. -->
      <Teleport :to="firstColumn ?? '#sheet-column-unmounted'" :disabled="!columns">
        <UiRunnerCard
          v-model="sheet.runner"
          :flavor="flavor"
          :can-reset="canReset"
          @reset="$emit('reset')"
          @apply-archetype="applyArchetype"
        />
      </Teleport>
      <Teleport
        :to="(printing ? secondColumn : firstColumn) ?? '#sheet-column-unmounted'"
        :disabled="!columns"
      >
        <UiSheetCard
          class="approaches"
          :title="system.attributeLabel"
          heading-id="approaches-heading"
          edge="hot"
        >
          <template #title-extra
            ><span class="print-skills-label"> // {{ system.skillLabel }}</span></template
          >
          <UiApproachRow
            v-for="row in approachRows"
            :key="row.attribute.id"
            :attribute="row.attribute"
            :generation="generation"
            :rating="row.rating"
            :glitch="row.glitch"
          />
          <UiExpertiseRule class="print-expertise-rule" />
        </UiSheetCard>
      </Teleport>
      <Teleport :to="secondColumn ?? '#sheet-column-unmounted'" :disabled="!columns">
        <UiSheetCard
          class="skills"
          :title="system.skillLabel"
          heading-id="skills-heading"
          heading-class="skill-heading"
        >
          <template #heading-extra><UiExpertiseRule /></template>
          <UiSkillRow
            v-for="row in skillRows"
            :key="row.skill.id"
            :skill="row.skill"
            :generation="generation"
            :core-module-id="system.coreModuleId"
            :rating="row.rating"
            :expertise="row.expertise"
          />
        </UiSheetCard>
      </Teleport>
      <Teleport :to="firstColumn ?? '#sheet-column-unmounted'" :disabled="!columns">
        <UiHarmCard v-model="sheet.harm" />
        <UiStressCard v-model="sheet.stress" />
        <UiResistanceCard v-model="sheet.specialArmor" />
      </Teleport>
      <Teleport :to="secondColumn ?? '#sheet-column-unmounted'" :disabled="!columns">
        <UiGearCard v-model="sheet.gear" />
      </Teleport>
      <Teleport
        :to="(printing ? firstColumn : secondColumn) ?? '#sheet-column-unmounted'"
        :disabled="!columns"
      >
        <UiAugmentationsCard v-model="sheet.augmentations" />
      </Teleport>
      <Teleport :to="secondColumn ?? '#sheet-column-unmounted'" :disabled="!columns">
        <UiRollReferenceCards />
      </Teleport>
    </UiWorkspace>
  </form>
</template>

<style scoped>
.guide-reveal {
  display: grid;
  grid-column: 1 / -1;
  grid-template-rows: 1fr;
  overflow: hidden;
}
.guide-clip {
  min-height: 0;
  overflow: hidden;
}
.guide-enter-active,
.guide-leave-active {
  transition: grid-template-rows 180ms ease-out;
}
.guide-enter-from,
.guide-leave-to {
  grid-template-rows: 0fr;
}
.guide-enter-active .guide-clip {
  animation: guide-glitch-in 180ms steps(1, end);
}
.guide-leave-active .guide-clip {
  animation: guide-glitch-in 120ms steps(1, end) reverse;
}
@keyframes guide-glitch-in {
  0% {
    opacity: 0.2;
    transform: translate(-48px, -90px) skewX(-12deg);
    clip-path: inset(0 0 35%);
  }
  20% {
    opacity: 1;
    transform: translate(36px, -52px) skewX(8deg);
    clip-path: inset(15% 0 0);
  }
  40% {
    opacity: 0.25;
    transform: translate(-28px, -28px) skewX(-8deg);
    clip-path: inset(0 0 20%);
  }
  55% {
    opacity: 1;
    transform: translate(20px, -12px) skewX(5deg);
    clip-path: inset(8% 0 0);
  }
  75% {
    transform: translate(-12px, 8px) skewX(-3deg);
    clip-path: inset(0);
  }
  90%,
  100% {
    opacity: 1;
    transform: none;
    clip-path: inset(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .guide-enter-active,
  .guide-leave-active {
    transition: none;
  }
  .guide-enter-active .guide-clip,
  .guide-leave-active .guide-clip {
    animation: none;
  }
}
@media print {
  .guide-reveal {
    display: none;
  }
}
.sheet-column {
  display: none;
}
.sheet-column.active {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  min-width: 0;
}
.print-expertise-rule {
  display: none;
}
</style>
