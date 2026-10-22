<script setup lang="ts">
import { usePreferencesStore } from '@/stores/preferences'
const preferences = usePreferencesStore()
import UiSheetField from './UiSheetField.vue'
import UiSheetCard from './UiSheetCard.vue'
import { ref, watch } from 'vue'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import {
  cbrPnkAngles,
  cbrPnkExpertiseAliases,
  cbrPnkExpertiseOptions,
} from '@/data/characters/cbr-pnk-sheet'
import type { CharacterSheet } from '@/data/characters/types'
import type { Flavor } from '@/generator/options'
import { generateNames } from '@/generator/categories'
import { randomFrom } from '@/helper/randomFrom'
import { runnerImagePrompt } from '@/helper/runnerImagePrompt'
import UiButton from './UiButton.vue'
import UiChoicePicker from './UiChoicePicker.vue'
import UiDiamondChoice from './UiDiamondChoice.vue'
import UiToggle from './UiToggle.vue'
import { useClipboard } from '@/composables/useClipboard'
const archetypes = cbrPnkCatalogue.archetypes.map((item) => {
  const profile = cbrPnkCatalogue.archetypeSystemProfiles.find(
    (entry) => entry.archetypeId === item.id && entry.systemId === 'cbr-pnk',
  )
  const ratings = (
    rows: { definitionId: string; value: number }[],
    definitions: { id: string; name: string }[],
  ) =>
    rows
      .filter((row) => row.value > 0)
      .map(
        (row) =>
          `${definitions.find((definition) => definition.id === row.definitionId)?.name}\u00a0${Math.min(row.value, 2)}`,
      )
      .join(', ')
  const expertises =
    profile?.expertiseSuggestions.flatMap((suggestion) => {
      if (
        !profile.skillRatings.some(
          (row) => row.definitionId === suggestion.skillId && row.value === 3,
        )
      )
        return []
      const skill = cbrPnkCatalogue.skills.find((entry) => entry.id === suggestion.skillId)
      if (!skill) return []
      const choices = [
        ...new Set(
          suggestion.options
            .map((option) => cbrPnkExpertiseAliases[skill.key]?.[option] ?? option)
            .filter((option) => cbrPnkExpertiseOptions[skill.key]?.includes(option)),
        ),
      ]
      return choices.length ? [choices.join(' / ')] : []
    }) ?? []
  return {
    id: item.id,
    label: item.name,
    group: '',
    description: profile
      ? [
          ratings(profile.attributeRatings, cbrPnkCatalogue.attributes),
          ratings(profile.skillRatings, cbrPnkCatalogue.skills),
          expertises.join(', '),
        ]
          .filter(Boolean)
          .join('\n')
      : undefined,
  }
})

const props = defineProps<{ flavor: Flavor; canReset: boolean }>()
const runner = defineModel<CharacterSheet['runner']>({ required: true })
const { error, activation: copyActivation, copy } = useClipboard()
function copyImagePrompt() {
  return copy(runnerImagePrompt(runner.value))
}
const confirmingReset = ref(false)
const bitRandom = ref(false)
watch(
  () => props.canReset,
  (canReset) => {
    if (!canReset) confirmingReset.value = false
  },
)
const emit = defineEmits<{ reset: []; applyArchetype: [bitRandom: boolean] }>()

function reset() {
  confirmingReset.value = false
  emit('reset')
  error.value = ''
}

function generate(archetypeId: string) {
  confirmingReset.value = false
  error.value = ''
  try {
    const result = generateNames('runners', 1, {
      flavor: props.flavor,
      runnerArchetypeId: archetypeId,
    })[0]
    if (!result) return
    runner.value = {
      ...runner.value,
      angle: result.angle ?? randomFrom(cbrPnkAngles),
      alias: result.primary,
      archetypeId,
      description: [result.details, result.appearance].filter(Boolean).join('\n'),
    }
    emit('applyArchetype', bitRandom.value)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not generate a runner.'
  }
}

function regenerate(field: 'alias' | 'description') {
  error.value = ''
  try {
    const result = generateNames('runners', 1, { flavor: props.flavor })[0]
    if (!result) return
    runner.value[field] =
      field === 'alias'
        ? result.primary
        : [result.details, result.appearance].filter(Boolean).join('\n')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not generate a runner.'
  }
}
</script>

<template>
  <UiSheetCard
    class="runner-card"
    title="Runner"
    heading-id="runner-heading"
    edge="signal"
    heading-class="runner-header"
  >
    <template #actions>
      <div class="actions">
        <UiChoicePicker
          v-if="!confirmingReset"
          :searchable="false"
          :show-selection="false"
          trigger-id="runner-generate"
          trigger-label="Generate"
          label="Archetype"
          description="Picking this will create a random name, details, approaches, skills and augmentations as per CBR+PNK char gen rules"
          plural="archetypes"
          :model-value="runner.archetypeId ?? ''"
          :options="archetypes"
          @update:model-value="generate"
        >
          <template #actions>
            <UiToggle v-model="bitRandom" label="bit random" />
          </template>
        </UiChoicePicker>
        <UiButton v-if="canReset && confirmingReset" variant="destructive" @click="reset"
          >really?</UiButton
        >
        <UiButton v-if="canReset" variant="secondary" @click="confirmingReset = !confirmingReset">{{
          confirmingReset ? 'nah.' : 'Reset'
        }}</UiButton>
      </div>
    </template>
    <div class="runner-field">
      <UiSheetField id="runner-alias" v-model="runner.alias" variant="runner" label="Handle" />
      <UiButton
        appearance="icon"
        icon="reroll"
        class="regenerate"
        variant="secondary"
        aria-label="Regenerate handle"
        title="Regenerate handle"
        @click="regenerate('alias')"
      />
    </div>
    <div class="runner-field">
      <UiSheetField
        id="runner-description"
        v-model="runner.description"
        variant="runner"
        label="Details and looks"
        multiline
        print-class="runner-description"
      />
      <UiButton
        appearance="icon"
        icon="reroll"
        class="regenerate"
        variant="secondary"
        aria-label="Regenerate details and looks"
        title="Regenerate details and looks"
        @click="regenerate('description')"
      />
      <UiButton
        appearance="icon"
        icon="portrait"
        v-if="preferences.soullessCorpMode && runner.description.trim()"
        class="regenerate copy-prompt"
        variant="secondary"
        feedback="icon"
        :activation="copyActivation"
        aria-label="Copy image prompt"
        title="Copy image prompt"
        @click="copyImagePrompt"
      />
    </div>
    <fieldset class="angle">
      <legend>Angle // Convey what ultimately you run for:</legend>
      <div class="angle-options">
        <UiDiamondChoice
          v-for="option in cbrPnkAngles"
          :key="option"
          type="radio"
          name="runner-angle"
          :value="option"
          :label="option"
          :model-value="runner.angle === option"
          @update:model-value="runner.angle = option"
          >{{ option }}</UiDiamondChoice
        >
      </div>
    </fieldset>
    <p v-if="error" role="alert">{{ error }}</p>
  </UiSheetCard>
</template>

<style scoped>
.runner-card {
  --card-heading-gap: var(--space-3);
  --field-end-padding: calc(var(--control-height) + var(--space-2));
  display: grid;
  gap: var(--space-2);
}

.angle {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.angle legend {
  margin-block: var(--space-2);
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
}
.angle-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--space-3);
}

@media screen and (max-width: 380px) {
  .angle-options {
    grid-template-columns: minmax(0, 1fr);
  }
}
.runner-field {
  position: relative;
  min-width: 0;
  display: grid;
  gap: var(--space-1);
}
.runner-field > .regenerate {
  position: absolute;
  top: 0;
  right: 0;
}
.runner-field > .copy-prompt {
  top: calc(var(--control-height) + var(--space-1));
}
@media print {
  .regenerate {
    display: none !important;
  }
}

.actions {
  --button-flex: 0 0 auto;
  --button-padding-inline: var(--space-2);
  --button-font-size: var(--font-control-size);
  --button-white-space: nowrap;
  display: flex;
  margin-left: auto;
  gap: var(--space-2);
}
</style>
