<script setup lang="ts">
import { ref, watch } from 'vue'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import { cbrPnkAngles } from '@/data/characters/cbr-pnk-sheet'
import type { CharacterSheet } from '@/data/characters/types'
import type { Flavor } from '@/generator/options'
import { generateNames } from '@/generator/categories'
import { randomFrom } from '@/helper/randomFrom'
import UiButton from './UiButton.vue'
import UiChoicePicker from './UiChoicePicker.vue'
import UiDiamondChoice from './UiDiamondChoice.vue'
const archetypes = cbrPnkCatalogue.archetypes.map(item => ({ id: item.id, label: item.name, group: '' }))

const props = defineProps<{ flavor: Flavor; canReset: boolean }>()
const runner = defineModel<CharacterSheet['runner']>({ required: true })
const error = ref('')
const confirmingReset = ref(false)
watch(() => props.canReset, (canReset) => {
  if (!canReset) confirmingReset.value = false
})
const emit = defineEmits<{ reset: []; applyArchetype: [] }>()

function reset() {
  confirmingReset.value = false
  emit('reset')
  error.value = ''
}

function generate(archetypeId: string) {
  confirmingReset.value = false
  error.value = ''
  try {
    const result = generateNames('runners', 1, { flavor: props.flavor, runnerArchetypeId: archetypeId })[0]
    if (!result) return
    runner.value = {
      ...runner.value,
      angle: randomFrom(cbrPnkAngles),
      alias: result.primary,
      archetypeId,
      description: [result.details, result.title, result.appearance].filter(Boolean).join('\n'),
    }
    emit('applyArchetype')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not generate a runner.'
  }
}

function regenerate(field: 'alias' | 'description') {
  error.value = ''
  try {
    const result = generateNames('runners', 1, { flavor: props.flavor })[0]
    if (!result) return
    runner.value[field] = field === 'alias'
      ? result.primary
      : [result.details, result.title, result.appearance].filter(Boolean).join('\n')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not generate a runner.'
  }
}
</script>

<template>
  <section class="runner-card" aria-labelledby="runner-heading">
    <header class="runner-header">
      <h2 id="runner-heading">Runner</h2>
      <div class="actions">
        <UiChoicePicker v-if="!confirmingReset" :searchable="false" trigger-id="runner-generate" trigger-label="Generate" label="Archetype" plural="archetypes" :model-value="runner.archetypeId ?? ''" :options="archetypes" @update:model-value="generate">
          <section class="file-runner" aria-labelledby="file-runner-heading">
            <h3 id="file-runner-heading">Or file a runner</h3>
            <ol>
              <li>Enter a <strong>Handle</strong>—what they call you on the Grid and streets alike.</li>
              <li>Enter a few evocative words to describe your <strong>Look</strong>.</li>
              <li>You risk it all for a reason. What’s in it for you? Choose an <strong>Angle</strong> and detail it briefly.</li>
              <li>Assign <span class="approach-rating" aria-label="two pluses"><span aria-hidden="true">⊞⊞</span></span>, <span class="approach-rating" aria-label="one plus"><span aria-hidden="true">⊞</span></span>, and <span class="approach-rating" aria-label="one plus"><span aria-hidden="true">⊞</span></span> in any order to three of your <strong>Approaches</strong>.</li>
              <li>Distribute <strong>8 dice</strong> over your <strong>Skills</strong>. To assign an <strong>Expertise</strong>, spend a third die on a particular Skill—choose or write the Expertise down aside.</li>
              <li>
                <p>Body modifications of all types—Cybernetics, Biotech and others—are widely adopted among Runners. Define your starting <strong>Signature Augmentation</strong> by writing down its model/brand and an outline of its primary feature, <em>e.g. Ashide™ Racing Legs.</em></p>
                <p>While taking action or resisting Consequences, you can mark <span aria-label="stress"><span aria-hidden="true">ϟ</span></span> or <strong>SPECIAL RESISTANCE</strong> to leverage your Augmentation into it.</p>
                <p><em>During the Run, you may declare additional Augmentations or extra functionalities of existing ones as <strong>UPGRADES</strong> (panel 8).</em></p>
              </li>
              <li>Don’t pick your <strong>Gear</strong> just yet—you’ll decide what you are carrying on the fly during the Run. For now, just circle on the list the ones you are interested in, for easy referencing later.</li>
            </ol>
          </section>
        </UiChoicePicker>
        <UiButton v-if="canReset && confirmingReset" variant="destructive" @click="reset">really?</UiButton>
        <UiButton v-if="canReset" variant="secondary" @click="confirmingReset = !confirmingReset">{{ confirmingReset ? 'nah.' : 'Reset' }}</UiButton>
      </div>
    </header>
    <label for="runner-alias">Handle</label>
    <div class="runner-field">
      <span class="print-value">{{ runner.alias }}</span>
      <input id="runner-alias" v-model="runner.alias" type="text" />
      <UiButton class="regenerate" variant="secondary" aria-label="Regenerate handle" title="Regenerate handle" @click="regenerate('alias')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M20 7v5h-5M20 12a8 8 0 1 0-2.3 5.7" />
        </svg>
      </UiButton>
    </div>
    <label for="runner-description">Details and looks</label>
    <div class="runner-field">
      <span class="print-value runner-description">{{ runner.description }}</span>
      <textarea id="runner-description" v-model="runner.description" rows="7" />
      <UiButton class="regenerate" variant="secondary" aria-label="Regenerate details and looks" title="Regenerate details and looks" @click="regenerate('description')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M20 7v5h-5M20 12a8 8 0 1 0-2.3 5.7" />
        </svg>
      </UiButton>
    </div>
    <fieldset class="angle">
      <legend>Angle</legend>
      <p>Convey what ultimately you run for:</p>
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
        >{{ option }}</UiDiamondChoice>
      </div>
    </fieldset>
    <p v-if="error" role="alert">{{ error }}</p>
  </section>
</template>

<style scoped>
.file-runner {
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.file-runner h3 {
  margin-bottom: var(--space-4);
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-signal);
  text-transform: uppercase;
}
.file-runner ol {
  margin: 0;
  padding-left: 2rem;
  list-style-type: decimal-leading-zero;
}
.file-runner li + li,
.file-runner p + p {
  margin-top: var(--space-4);
}
.approach-rating {
  white-space: nowrap;
}
.runner-card {
  position: relative;
  display: grid;
  gap: var(--space-2);
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
.runner-card::after {
  content: '';
  position: absolute;
  top: 7px;
  right: var(--space-3);
  width: 3rem;
  height: 5px;
  background: var(--theme-panel-edge);
  pointer-events: none;
}
.runner-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2);
}
h2 {
  min-width: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: var(--theme-heading-weight);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--theme-title-color);
  text-shadow: var(--theme-heading-shadow);
  overflow-wrap: anywhere;
}
label,
legend {
  font-family: var(--font-display);
  font-size: var(--font-small-control-size);
  text-transform: uppercase;
}
.angle {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.angle p {
  margin-block: var(--space-2);
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
}
.angle-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--space-3);
}
@media screen and (max-width: 24rem) {
  .runner-card {
    padding: var(--space-4);
  }
}
@media screen and (max-width: 380px) {
  .angle-options {
    grid-template-columns: minmax(0, 1fr);
  }
}
.runner-field {
  position: relative;
  min-width: 0;
}
.runner-field > .regenerate {
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
}
.runner-field > .regenerate::before,
.runner-field > .regenerate::after {
  display: none;
}
.runner-card .runner-field > .regenerate:hover:enabled,
.runner-card .runner-field > .regenerate:active:enabled {
  background: transparent;
  color: var(--color-accent);
}
@media print {
  .regenerate {
    display: none !important;
  }
}
input,
textarea {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: var(--space-2);
  padding-right: calc(44px + var(--space-2));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
}
textarea {
  resize: vertical;
}
.actions {
  display: flex;
  margin-left: auto;
  gap: var(--space-2);
}
.actions :deep(button.primary),
.actions > button {
  flex: 0 0 auto;
  min-height: 44px;
  padding-inline: var(--space-2);
  font-size: 0.875rem;
  white-space: nowrap;
}
</style>
