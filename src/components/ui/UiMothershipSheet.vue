<script setup lang="ts">
import { computed } from 'vue'
import type { MothershipSheet } from '@/helper/mothershipCharacterLink'
import { mothershipClasses } from '@/data/mothership-classes'
import { mothershipPortraitCount } from '@/data/mothership-portraits'
import {
  mothershipSheetArmor,
  mothershipSheetEquipment,
  mothershipSheetSkills,
  mothershipSheetTrauma,
} from '@/helper/mothershipSheetFields'
import type { MothershipReroll } from '@/patterns/mothership/character'
import UiButton from './UiButton.vue'
import UiSheetCard from './UiSheetCard.vue'
import UiSheetField from './UiSheetField.vue'

const sheet = defineModel<MothershipSheet>({ required: true })
const character = computed(() => sheet.value.mothershipCharacter)
const emit = defineEmits<{ reroll: [field: MothershipReroll] }>()

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
  <form id="mothership-character-sheet" aria-label="Mothership character sheet" @submit.prevent>
    <div class="sheet-scroll">
      <div class="profile-sheet">
        <div class="sheet-column">
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
                    class="ruled-field"
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
                      v-if="!portraitUrl"
                      appearance="icon"
                      icon="reroll"
                      aria-label="Reroll appearance"
                      title="Reroll appearance"
                      @click="emit('reroll', 'appearance')"
                    />
                    <UiButton
                      v-if="!portraitUrl"
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
                  <div class="name-control">
                    <UiSheetField
                      id="ms-name"
                      v-model="sheet.primary"
                      variant="boxed"
                      multiline
                      auto-grow
                      :rows="1"
                    />
                    <UiButton
                      appearance="icon"
                      icon="reroll"
                      aria-label="Reroll character name"
                      title="Reroll character name"
                      @click="emit('reroll', 'name')"
                    />
                  </div>
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
                <div>
                  <label class="field-label" for="ms-player">Player Name</label>
                  <UiSheetField id="ms-player" v-model="playerName" variant="boxed" />
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
            <template #actions>
              <UiButton
                appearance="icon"
                icon="reroll"
                class="card-reroll"
                :aria-label="`Reroll ${group.title.toLowerCase()}`"
                :title="`Reroll ${group.title.toLowerCase()}`"
                @click="emit('reroll', group.title === 'Stats' ? 'stats' : 'saves')"
              />
            </template>
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
                <div class="field-heading resource-heading">
                  <h3 class="field-label">{{ label }}</h3>
                  <UiButton
                    v-if="key === 'health'"
                    appearance="icon"
                    icon="reroll"
                    aria-label="Reroll maximum health"
                    title="Reroll maximum health"
                    @click="emit('reroll', 'health')"
                  />
                </div>
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
              auto-grow
              :rows="3"
              class="ruled-field fixed-lines"
            />
          </UiSheetCard>
        </div>

        <div class="sheet-column">
          <UiSheetCard title="Skills" heading-id="ms-skills-heading" class="skills-card">
            <template #actions>
              <UiButton
                appearance="icon"
                icon="reroll"
                class="card-reroll"
                aria-label="Reroll skills"
                title="Reroll skills"
                @click="emit('reroll', 'skills')"
              />
            </template>
            <UiSheetField
              v-model="skills"
              aria-label="Skills"
              multiline
              auto-grow
              :rows="8"
              class="ruled-field fixed-lines"
            />
          </UiSheetCard>
          <UiSheetCard title="Equipment" heading-id="ms-equipment-heading" class="equipment-card">
            <template #actions>
              <UiButton
                appearance="icon"
                icon="reroll"
                class="card-reroll"
                aria-label="Reroll equipment"
                title="Reroll equipment"
                @click="emit('reroll', 'equipment')"
              />
            </template>
            <UiSheetField
              v-model="equipment"
              aria-label="Equipment"
              multiline
              auto-grow
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
              <div>
                <span class="field-heading"
                  ><label class="field-label" for="ms-credits">Credits</label
                  ><UiButton
                    appearance="icon"
                    icon="reroll"
                    aria-label="Reroll credits"
                    title="Reroll credits"
                    @click="emit('reroll', 'credits')" /></span
                ><span class="print-value">{{ character.credits }}</span
                ><input
                  type="number"
                  min="0"
                  inputmode="numeric"
                  id="ms-credits"
                  aria-label="Credits"
                  :value="character.credits"
                  @input="updateAmount('credits', $event)"
                />
              </div>
            </div>
          </UiSheetCard>
          <UiSheetCard title="Notes" heading-id="ms-notes-heading" class="notes-card">
            <UiSheetField
              v-model="notes"
              aria-label="Notes"
              multiline
              auto-grow
              :rows="7"
              class="ruled-field fixed-lines"
            />
          </UiSheetCard>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
.field-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  min-width: 0;
}
.field-heading .field-label {
  margin: 0;
}
.field-heading > button {
  flex: 0 0 auto;
}
.field-heading {
  margin-bottom: var(--space-2);
}
.resource-heading {
  justify-content: center;
}
.resource-heading button {
  --button-min-height: 1.75rem;
  --button-padding-block: 0;
}
.sheet-scroll {
  min-width: 0;
}
.profile-sheet {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6);
  max-width: none;
  margin: auto;
  --font-control-size: 1rem;
  --font-sheet-heading-size: 1rem;
  --sheet-card-padding: var(--space-4);
  --card-heading-gap: var(--space-2);
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
  .profile-sheet :deep(.ruled-field) {
    resize: vertical;
    line-height: 1.75rem;
    font-weight: 400;
    border: 0;
    border-radius: 0;
    padding: 0 var(--space-2);
    color: var(--color-text);
    background-color: var(--color-surface);
    background-image:
      repeating-linear-gradient(to right, transparent 0 5px, var(--color-surface) 5px 9px),
      repeating-linear-gradient(
        to bottom,
        transparent 0 calc(1lh - 1px),
        color-mix(in srgb, currentColor 18%, transparent) calc(1lh - 1px) 1lh
      );
    background-attachment: local;
  }
  .profile-sheet :deep(.sheet-field:not(:focus):not(:hover)) {
    border-color: transparent;
  }
  .personal-card :deep(.sheet-field),
  .personal-card select {
    font-family: var(--font-choice, inherit);
    font-size: var(--font-choice-size, inherit);
    font-weight: var(--font-choice-weight, inherit);
    line-height: var(--line-height-choice, normal);
  }
  .name-control {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: var(--space-1);
  }
  .name-control :deep(textarea) {
    resize: none;
  }
  .profile-sheet :deep(.card-heading) {
    justify-content: start;
    align-items: start;
    gap: var(--space-2);
  }
  .score-card :deep(.card-heading),
  .skills-card :deep(.card-heading),
  .equipment-card :deep(.card-heading) {
    padding-inline-end: var(--control-height);
  }
  .card-reroll {
    position: absolute;
    top: var(--space-1);
    right: var(--space-1);
  }
  .profile-sheet :deep(h2) {
    text-align: left;
    text-box-trim: none;
  }
  .score span {
    font-family: var(--font-result-name);
    font-size: clamp(0.5625rem, 0.9vw, 0.75rem);
    line-height: 1.4;
  }
  .field-heading {
    position: relative;
    min-height: 1.5rem;
    margin-bottom: var(--space-1);
    padding-inline-end: 2rem;
  }
  .field-heading > button {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    min-height: 2rem;
  }
  .amounts > label > .field-label {
    min-height: 1.5rem;
    margin-bottom: var(--space-1);
    align-content: center;
  }
  .notes-card :deep(textarea) {
    min-height: 17.5rem;
  }
}
@media screen and (min-width: 64rem) {
  .name-control {
    display: block;
  }
  .name-control :deep(textarea) {
    padding-inline-end: calc(var(--control-height) + var(--space-2));
  }
  .name-control > button {
    position: absolute;
    top: 0;
    right: 0;
    color: var(--color-text);
  }
}
.amounts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-3);
  text-align: center;
}
.notes-card :deep(textarea) {
  margin-bottom: var(--space-3);
}
@media screen and (min-width: 50rem) {
  .notes-card :deep(textarea) {
    margin-bottom: 0;
  }
}
@media (max-width: 49.999rem) {
  .profile-sheet {
    grid-template-columns: minmax(0, 1fr);
    max-width: 42rem;
    gap: var(--space-4);
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
