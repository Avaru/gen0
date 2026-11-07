<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import type { MothershipSheet } from '@/helper/mothershipCharacterLink'
import { mothershipClasses } from '@/data/mothership-classes'
import { mothershipPortraitCount } from '@/data/mothership-portraits'
import {
  mothershipSheetArmor,
  mothershipSheetEquipment,
  mothershipSheetSkills,
  mothershipSheetTrauma,
} from '@/helper/mothershipSheetFields'
import UiModal from './UiModal.vue'
import UiButton from './UiButton.vue'
import UiSheetCard from './UiSheetCard.vue'
import UiSheetField from './UiSheetField.vue'

const sheet = defineModel<MothershipSheet>({ required: true })
const character = computed(() => sheet.value.mothershipCharacter)
const modal = useTemplateRef<InstanceType<typeof UiModal>>('modal')
defineExpose({ showModal: () => modal.value?.showModal() })

function printSheet() {
  window.print()
}

function textField(
  key: 'playerName' | 'pronouns' | 'highScore' | 'appearance' | 'conditions' | 'notes',
) {
  return computed({
    get: () => sheet.value[key] ?? '',
    set: (value: string) => {
      sheet.value[key] = value
    },
  })
}
const playerName = textField('playerName')
const pronouns = textField('pronouns')
const highScore = textField('highScore')
const appearance = textField('appearance')
const portraits = import.meta.glob<string>('../../assets/mothership/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})
const portraitUrl = computed(() =>
  sheet.value.portrait === undefined
    ? undefined
    : portraits[`../../assets/mothership/${String(sheet.value.portrait).padStart(2, '0')}.jpg`],
)
function rollPortrait() {
  const current = sheet.value.portrait
  const pick =
    Math.floor(Math.random() * (mothershipPortraitCount - (current === undefined ? 0 : 1))) + 1
  sheet.value.portrait = current !== undefined && pick >= current ? pick + 1 : pick
}
function removePortrait() {
  delete sheet.value.portrait
}
const conditions = textField('conditions')
const notes = textField('notes')
const skills = computed({
  get: () => mothershipSheetSkills(sheet.value),
  set: (value: string) => {
    sheet.value.skillsText = value
  },
})
const equipment = computed({
  get: () => mothershipSheetEquipment(sheet.value),
  set: (value: string) => {
    sheet.value.equipmentText = value
  },
})
const scoreGroups = [
  {
    title: 'Stats',
    fields: [
      ['Str', 'Strength'],
      ['Spd', 'Speed'],
      ['Int', 'Intellect'],
      ['Cmb', 'Combat'],
    ],
  },
  {
    title: 'Saves',
    fields: [
      ['San', 'Sanity'],
      ['Fea', 'Fear'],
      ['Bod', 'Body'],
    ],
  },
] as const
const resources = [
  ['health', 'Health'],
  ['wounds', 'Wounds'],
  ['stress', 'Stress'],
] as const

function numberValue(event: Event): number | undefined {
  const input = event.target as HTMLInputElement
  return input.value !== '' && Number.isSafeInteger(input.valueAsNumber) && input.valueAsNumber >= 0
    ? input.valueAsNumber
    : undefined
}
function updateScore(key: keyof typeof character.value.scores, event: Event) {
  const value = numberValue(event)
  if (value !== undefined) character.value.scores[key] = value
}
function currentValue(key: 'health' | 'wounds' | 'stress') {
  return sheet.value.filledResources?.includes(key) ? character.value[key].current : ''
}

function updateResource(
  key: 'health' | 'wounds' | 'stress',
  field: 'current' | 'max',
  event: Event,
) {
  const value = numberValue(event)
  const resource = character.value[key]
  if (field === 'current') {
    if (value === undefined) {
      sheet.value.filledResources = sheet.value.filledResources?.filter((filled) => filled !== key)
      return
    }
    sheet.value.filledResources = [...new Set([...(sheet.value.filledResources ?? []), key])]
  }
  if (key === 'stress') {
    if (field === 'max') {
      if (value !== undefined) character.value.stress.min = value
      resource.current = Math.max(resource.current, character.value.stress.min)
    } else if (value !== undefined) resource.current = Math.max(character.value.stress.min, value)
  } else if (value !== undefined) {
    character.value[key][field] = value
  }
  if (key !== 'stress') {
    const limited = character.value[key]
    limited.current = Math.min(limited.current, limited.max)
  }
}
function updateAmount(key: 'credits' | 'armorPoints', event: Event) {
  const value = numberValue(event)
  if (value === undefined) return
  if (key === 'credits') character.value.credits = value
  else sheet.value.armorPoints = value
}
</script>

<template>
  <UiModal
    id="mothership-character-modal"
    ref="modal"
    class="character-modal"
    title="Character sheet"
    close-label="Close character sheet"
  >
    <template #actions>
      <UiButton class="print-button" variant="secondary" @click="printSheet">Print</UiButton>
    </template>
    <div class="sheet-scroll">
      <div class="profile-sheet">
        <div class="sheet-column">
          <UiSheetCard
            title="Mothership Character Profile"
            heading-id="ms-profile-heading"
            class="profile-card"
          >
            <label class="field-label" for="ms-player">Player Name</label>
            <UiSheetField id="ms-player" v-model="playerName" />
          </UiSheetCard>

          <UiSheetCard
            title="Personal Details"
            heading-id="ms-personal-heading"
            class="personal-card"
          >
            <div class="personal-grid">
              <div class="appearance-field">
                <label class="field-label" :for="portraitUrl ? undefined : 'ms-appearance'"
                  >Appearance</label
                >
                <div class="appearance-area">
                  <div v-if="portraitUrl" class="appearance-portrait">
                    <img :src="portraitUrl" :alt="`Portrait of ${sheet.primary}`" />
                  </div>
                  <UiSheetField
                    v-else
                    id="ms-appearance"
                    v-model="appearance"
                    multiline
                    :rows="8"
                    variant="boxed"
                  />
                  <div class="appearance-actions">
                    <UiButton
                      v-if="portraitUrl"
                      class="reroll-image"
                      appearance="icon"
                      icon="reroll"
                      aria-label="Reroll image"
                      title="Reroll image"
                      @click="rollPortrait"
                    />
                    <UiButton
                      v-if="portraitUrl"
                      appearance="icon"
                      icon="close"
                      aria-label="Remove image"
                      title="Remove image"
                      @click="removePortrait"
                    />
                    <UiButton
                      v-else
                      appearance="icon"
                      icon="portrait"
                      aria-label="Image"
                      title="Image"
                      @click="rollPortrait"
                    />
                  </div>
                </div>
              </div>
              <div class="identity-fields">
                <div>
                  <label class="field-label" for="ms-name">Character Name</label>
                  <UiSheetField id="ms-name" v-model="sheet.primary" variant="boxed" />
                </div>
                <div>
                  <label class="field-label" for="ms-pronouns">Pronouns</label>
                  <UiSheetField id="ms-pronouns" v-model="pronouns" variant="boxed" />
                </div>
                <div>
                  <label class="field-label" for="ms-class">Class</label>
                  <span class="print-value">{{ character.characterClass }}</span>
                  <select id="ms-class" v-model="character.characterClass">
                    <option v-for="value in mothershipClasses" :key="value">{{ value }}</option>
                  </select>
                </div>
                <div>
                  <label class="field-label" for="ms-high-score">High Score</label>
                  <UiSheetField id="ms-high-score" v-model="highScore" variant="boxed" />
                </div>
              </div>
            </div>
          </UiSheetCard>

          <UiSheetCard
            v-for="group in scoreGroups"
            :key="group.title"
            :title="group.title"
            :heading-id="`ms-${group.title}-heading`"
            class="score-card"
          >
            <div class="scores" :style="{ '--score-count': group.fields.length }">
              <label v-for="[key, label] in group.fields" :key="key" class="score">
                <span class="print-value">{{ character.scores[key] }}</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputmode="numeric"
                  :aria-label="label"
                  :value="character.scores[key]"
                  @input="updateScore(key, $event)"
                />
                <span>{{ label }}</span>
              </label>
            </div>
          </UiSheetCard>

          <UiSheetCard title="Status Report" heading-id="ms-status-heading" class="status-card">
            <div class="resources">
              <div v-for="[key, label] in resources" :key="key" class="resource">
                <h3 class="field-label">{{ label }}</h3>
                <div class="resource-pair">
                  <label>
                    <span class="print-value">{{ currentValue(key) }}</span>
                    <input
                      type="number"
                      :min="key === 'stress' ? character.stress.min : 0"
                      inputmode="numeric"
                      :aria-label="`Current ${label}`"
                      :value="currentValue(key)"
                      @change="updateResource(key, 'current', $event)"
                    />
                    <span>Current</span>
                  </label>
                  <span class="divider" aria-hidden="true">/</span>
                  <label>
                    <span class="print-value">{{
                      key === 'stress' ? character.stress.min : character[key].max
                    }}</span>
                    <input
                      type="number"
                      min="0"
                      inputmode="numeric"
                      :aria-label="`${key === 'stress' ? 'Minimum' : 'Maximum'} ${label}`"
                      :value="key === 'stress' ? character.stress.min : character[key].max"
                      @change="updateResource(key, 'max', $event)"
                    />
                    <span>{{ key === 'stress' ? 'Minimum' : 'Maximum' }}</span>
                  </label>
                </div>
              </div>
            </div>
            <p class="trauma-response">{{ mothershipSheetTrauma(sheet) }}</p>
            <h3 id="ms-conditions-heading" class="conditions-heading">Conditions</h3>
            <UiSheetField
              v-model="conditions"
              aria-labelledby="ms-conditions-heading"
              multiline
              :rows="3"
              class="ruled-field fixed-lines"
            />
          </UiSheetCard>
        </div>

        <div class="sheet-column">
          <UiSheetCard title="Skills" heading-id="ms-skills-heading" class="skills-card">
            <UiSheetField
              v-model="skills"
              aria-label="Skills"
              multiline
              :rows="8"
              class="ruled-field fixed-lines"
            />
          </UiSheetCard>
          <UiSheetCard title="Equipment" heading-id="ms-equipment-heading" class="equipment-card">
            <UiSheetField
              v-model="equipment"
              aria-label="Equipment"
              multiline
              :rows="10"
              class="ruled-field fixed-lines"
            />
            <div class="amounts">
              <label
                ><span class="field-label">Armor Points</span
                ><span class="print-value">{{ mothershipSheetArmor(sheet) }}</span
                ><input
                  type="number"
                  min="0"
                  inputmode="numeric"
                  aria-label="Armor Points"
                  :value="mothershipSheetArmor(sheet)"
                  @input="updateAmount('armorPoints', $event)"
              /></label>
              <label
                ><span class="field-label">Credits</span
                ><span class="print-value">{{ character.credits }}</span
                ><input
                  type="number"
                  min="0"
                  inputmode="numeric"
                  aria-label="Credits"
                  :value="character.credits"
                  @input="updateAmount('credits', $event)"
              /></label>
            </div>
          </UiSheetCard>
          <UiSheetCard title="Notes" heading-id="ms-notes-heading" class="notes-card">
            <UiSheetField
              v-model="notes"
              aria-label="Notes"
              multiline
              :rows="7"
              class="ruled-field fixed-lines"
            />
          </UiSheetCard>
        </div>
      </div>
    </div>
  </UiModal>
</template>

<style scoped>
.character-modal {
  width: min(76rem, calc(100% - 3rem));
  height: calc(100dvh - 3rem);
  margin: auto;
  border: var(--theme-panel-border-width) solid var(--color-text);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.character-modal :deep(header) {
  flex-shrink: 0;
}
.character-modal :deep(.panel > header) {
  flex-wrap: wrap;
}
.character-modal :deep(.panel > header h2) {
  flex: 1 1 10rem;
  font-size: clamp(1rem, 2.4vw, 1.5rem);
  line-height: 1.4;
}
.sheet-scroll {
  min-height: 0;
  overflow-y: auto;
  padding: 0 var(--space-6) var(--space-6);
}
.profile-sheet {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5, 1.25rem);
  max-width: 68rem;
  margin: auto;
  --font-control-size: 1rem;
  --font-sheet-heading-size: 1rem;
  --sheet-card-padding: var(--space-4);
}
.sheet-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}
.profile-sheet :deep(.sheet-card) {
  border-color: var(--color-text);
  background: var(--color-surface);
}
.profile-sheet :deep(.card-heading) {
  justify-content: center;
}
.profile-sheet :deep(h2) {
  line-height: 1.5;
  text-align: center;
}
.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: var(--space-1);
}
.profile-card :deep(h2) {
  text-align: left;
  font-size: 1.125rem;
}
.profile-card :deep(.card-heading) {
  justify-content: start;
}
.profile-sheet .personal-card {
  background: var(--color-text);
  color: var(--color-surface);
  --card-title: var(--color-surface);
}
.personal-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
  gap: var(--space-4);
}
.appearance-field {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.appearance-field :deep(textarea) {
  flex: 1;
  padding-bottom: calc(var(--control-height) + var(--space-4));
}
.appearance-area {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.appearance-portrait {
  position: relative;
  flex: 1;
  min-height: 12rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
}
.appearance-portrait img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.appearance-actions {
  position: absolute;
  inset: auto var(--space-2) var(--space-2);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
  pointer-events: none;
}
.appearance-actions .reroll-image {
  margin-right: auto;
}
.appearance-actions :deep(button.appearance-icon) {
  margin-inline-start: 0;
  pointer-events: auto;
  background: var(--color-surface);
  color: var(--color-text);
}
.appearance-actions :deep(button.appearance-icon:hover),
.appearance-actions :deep(button.appearance-icon:active) {
  background: var(--color-text);
  color: var(--color-surface);
}
.identity-fields {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
}
select {
  width: 100%;
  min-width: 0;
  min-height: var(--control-height);
  padding: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-choice, inherit);
  font-size: var(--font-choice-size, inherit);
  font-weight: var(--font-choice-weight, inherit);
  line-height: var(--line-height-choice, normal);
}
select:is(:hover, :focus-visible) {
  background: var(--control-hover-fill, var(--color-subtle));
  color: var(--control-hover-ink, var(--color-text));
}
select:active {
  background: var(--control-active-texture, none) var(--control-active-fill, var(--color-subtle));
  color: var(--control-active-ink, var(--color-text));
}
.profile-sheet .score-card {
  background: var(--color-subtle);
  border-color: transparent;
}
.scores {
  display: grid;
  grid-template-columns: repeat(var(--score-count), minmax(0, 1fr));
  gap: var(--space-2);
}
.score {
  display: grid;
  min-width: 0;
  justify-items: center;
  align-content: start;
  gap: var(--space-2);
}
.score span {
  font-family: var(--font-result-name);
  font-size: clamp(0.4375rem, 0.75vw, 0.625rem);
  line-height: 1.8;
  text-align: center;
  overflow-wrap: anywhere;
}
input[type='number'] {
  min-width: 0;
  width: 100%;
  min-height: var(--control-height);
  padding: var(--space-1);
  border: var(--theme-panel-border-width) solid var(--color-text);
  border-radius: 2rem;
  background: var(--color-surface);
  color: var(--color-text);
  font: 700 1.5rem var(--font-body);
  font-variant-numeric: tabular-nums;
  text-align: center;
  appearance: textfield;
}
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  appearance: none;
  margin: 0;
}
.score input {
  max-width: 5rem;
  aspect-ratio: 1;
  border-radius: 50%;
  font-size: 2rem;
}
input:focus-visible,
select:focus-visible {
  outline: var(--control-focus-width) solid var(--color-focus);
  outline-offset: var(--control-focus-offset);
}
.personal-card :deep(:focus-visible) {
  outline-color: var(--color-surface);
}
.status-card {
  --card-heading-gap: var(--space-2);
}
.trauma-response {
  margin-top: var(--space-3);
  font-size: 0.875rem;
  line-height: 1.4;
}
.conditions-heading {
  margin: var(--space-2) 0 var(--space-2);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: var(--theme-heading-weight);
  text-transform: uppercase;
  text-align: center;
}
.resources {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
}
.resource h3 {
  margin: 0 0 var(--space-1);
  text-align: center;
}
.resource-pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: start;
}
.resource-pair label {
  display: grid;
  min-width: 0;
  text-align: center;
  font-size: 0.625rem;
}
.resource-pair input {
  padding-inline: 0;
  border-width: 0;
  border-radius: 0;
  font-size: 1.25rem;
}
.resource-pair {
  border: var(--theme-panel-border-width) solid var(--color-text);
  border-radius: 2rem;
  padding: var(--space-1);
  margin-bottom: var(--space-4);
}
.resource-pair label {
  position: relative;
}
.resource-pair label span {
  position: absolute;
  top: calc(100% + var(--space-2));
  width: 100%;
}
.resource-pair input {
  background: transparent;
}
.divider {
  font-size: 1.75rem;
  line-height: var(--control-height);
}
@media screen {
  .profile-sheet :deep(.ruled-field:hover) {
    background-image: repeating-linear-gradient(
      transparent 0 calc(2rem - 2px),
      var(--color-border) calc(2rem - 2px) 2rem
    );
  }
}
.profile-sheet :deep(.fixed-lines) {
  resize: none;
}
.profile-sheet :deep(.ruled-field) {
  line-height: 2rem;
  font-weight: 400;
  border: 0;
  border-radius: 0;
  padding: 0 var(--space-2);
  background: repeating-linear-gradient(
    transparent 0 calc(2rem - 1px),
    var(--color-border) calc(2rem - 1px) 2rem
  );
}
.amounts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-5, 1.25rem);
  text-align: center;
}
.notes-card :deep(textarea) {
  margin-bottom: var(--space-3);
}
@media screen and (min-width: 50rem) {
  .status-card,
  .notes-card {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
  }
  .status-card :deep(textarea),
  .notes-card :deep(textarea) {
    flex: 1 0 auto;
  }
  .notes-card :deep(textarea) {
    margin-bottom: 0;
  }
}
@media screen and (max-width: 49.999rem) {
  .profile-card :deep(.card-heading),
  .print-button {
    display: none;
  }
}
@media (max-width: 49.999rem) {
  .character-modal {
    width: 100%;
    height: 100dvh;
    margin: 0;
    border-radius: 0;
  }
  .sheet-scroll {
    padding: 0 var(--space-3) var(--space-4);
  }
  .profile-sheet {
    grid-template-columns: minmax(0, 1fr);
    max-width: 36rem;
  }
  .score span {
    font-size: 0.5rem;
  }
}
@media (max-width: 24rem) {
  .personal-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .appearance-field :deep(textarea) {
    min-height: 8rem;
  }
  .resources {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-4);
  }
  .resource-pair {
    max-width: 12rem;
    width: 100%;
    margin-inline: auto;
  }
  .score input {
    font-size: 1.5rem;
  }
}
@media (forced-colors: active) {
  .profile-sheet .score-card {
    border-color: CanvasText;
  }
}
</style>
