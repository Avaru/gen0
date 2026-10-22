<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import {
  means,
  disciplines,
  createStudentSheet,
  type StudentSheet,
} from '@/data/characters/never-midnight'
import UiSheetCard from '@/components/ui/UiSheetCard.vue'
import UiSheetField from '@/components/ui/UiSheetField.vue'
import UiShadeRating from '@/components/ui/UiShadeRating.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiStudentEntries from './UiStudentEntries.vue'
import UiChoicePicker from '@/components/ui/UiChoicePicker.vue'
import UiChecks from '@/components/ui/UiChecks.vue'
import { givenNameGenders } from '@/generator/options'
const genderOptions = [
  { value: 'm', label: 'Masculine' },
  { value: 'f', label: 'Feminine' },
] as const
const selectedGenders = computed({
  get: () => sheet.value.genders ?? [...givenNameGenders],
  set: (genders) => {
    sheet.value.genders = genders
  },
})
import { neverMidnightNameCategories as neverMidnightCategories } from '@/generator/definitions/never-midnight'
import { generateNames } from '@/generator/categories'
import { generateStudentDisciplines, generateStudentMeans } from '@/patterns/never-midnight/student'
import { spell } from '@/patterns/never-midnight/spells'
const generationError = ref('')
function generateStudent(category: string, field?: 'name' | 'description') {
  generationError.value = ''
  const nationality = neverMidnightCategories.find((option) => option.id === category)
    ?.id as StudentSheet['nationality']
  if (!nationality) return
  try {
    const generated = generateNames(nationality, 1, {
      setting: 'never-midnight',
      genders: selectedGenders.value,
    })[0]
    if (!generated) return
    const description = [generated.age, generated.appearance, generated.secondary]
      .filter(Boolean)
      .join(' · ')
    const ratings =
      field !== 'name' ? generateStudentDisciplines(generated.secondary ?? '') : undefined
    const generatedMeans = !field ? generateStudentMeans() : undefined
    const generatedSpells = !field
      ? Array.from({ length: 3 }, () => ({ description: spell().primary }))
      : undefined
    if (ratings) Object.assign(sheet.value, ratings)
    if (generatedMeans) sheet.value.means = generatedMeans
    if (generatedSpells) sheet.value.spells = generatedSpells
    if (field) sheet.value.student[field] = field === 'name' ? generated.primary : description
    else {
      sheet.value.student = { name: generated.primary, description, keepsake: '' }
      sheet.value.nationality = nationality
    }
    confirmingReset.value = false
  } catch {
    generationError.value = 'Could not summon a student. Your current student file has been kept.'
  }
}
function rerollSpell(index: number) {
  const entry = sheet.value.spells[index]
  if (!locked.value && entry) entry.description = spell().primary
}
const props = defineProps<{ canReset: boolean }>()
const sheet = defineModel<StudentSheet>({ required: true })
const emit = defineEmits<{ reset: [] }>()
const confirmingReset = ref(false)
const locked = ref(false)
watch(
  () => props.canReset,
  () => {
    confirmingReset.value = false
  },
)
const fields = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Looks / marks / occupation' },
  { key: 'keepsake', label: 'Keepsake' },
] as const
const desktopMedia = window.matchMedia('(min-width: 48rem)')
const desktop = ref(desktopMedia.matches)
const leftColumn = useTemplateRef('left-column')
const rightColumn = useTemplateRef('right-column')
const columns = computed(() => Boolean(desktop.value && leftColumn.value && rightColumn.value))
function updateMedia() {
  desktop.value = desktopMedia.matches
}
onMounted(() => desktopMedia.addEventListener('change', updateMedia))
onBeforeUnmount(() => desktopMedia.removeEventListener('change', updateMedia))
function setSubdomain(discipline: keyof StudentSheet['subdomains'], text: string) {
  sheet.value.subdomains ??= createStudentSheet().subdomains
  sheet.value.subdomains[discipline] = text
}
function reset() {
  confirmingReset.value = false
  generationError.value = ''
  emit('reset')
}
</script>

<template>
  <form class="student-sheet" aria-label="Never Midnight character sheet" @submit.prevent>
    <div ref="left-column" class="sheet-column" :class="{ active: columns }" />
    <div ref="right-column" class="sheet-column" :class="{ active: columns }" />
    <Teleport :to="leftColumn ?? '#student-column-unmounted'" :disabled="!columns">
      <UiSheetCard title="Student file" heading-id="student-file-heading" class="student-file">
        <template #actions>
          <div v-if="!confirmingReset" class="student-actions">
            <UiButton
              v-if="!locked && canReset"
              variant="destructive-secondary"
              @click="confirmingReset = true"
              >Banish</UiButton
            >
            <UiChoicePicker
              v-if="!locked"
              trigger-id="student-summon"
              trigger-label="Summon"
              :show-selection="false"
              :searchable="false"
              :model-value="sheet.nationality ?? 'german'"
              :options="neverMidnightCategories"
              @update:model-value="generateStudent($event)"
            >
              <template #filters>
                <div class="summon-filters">
                  <UiChecks
                    v-model="selectedGenders"
                    label="Given names"
                    hide-label
                    name="student-genders"
                    :options="genderOptions"
                  />
                </div>
              </template>
            </UiChoicePicker>
            <UiButton
              class="lock-sheet"
              variant="secondary"
              :aria-pressed="locked"
              :aria-label="locked ? 'Unlock character sheet' : 'Lock character sheet'"
              :title="locked ? 'Unlock character sheet' : 'Lock character sheet'"
              @click="locked = !locked"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path v-if="locked" d="M8 10V6a4 4 0 0 1 8 0v4" />
                <path v-else d="M8 10V6a4 4 0 0 1 8 0" />
              </svg>
            </UiButton>
          </div>
          <div v-else class="reset-actions">
            <UiButton variant="destructive" @click="reset">Yes</UiButton>
            <UiButton variant="secondary" @click="confirmingReset = false">No</UiButton>
          </div>
        </template>
        <p v-if="generationError" role="alert">{{ generationError }}</p>
        <div class="student-fields">
          <div
            v-for="field in fields"
            :key="field.key"
            class="student-field"
            :class="[field.key, { 'has-reroll': field.key !== 'keepsake' }]"
          >
            <label :for="`student-${field.key}`">{{ field.label }}</label>
            <UiSheetField
              :id="`student-${field.key}`"
              v-model="sheet.student[field.key]"
              :disabled="locked"
              :multiline="field.key !== 'name'"
              :rows="1"
              auto-grow
            />
            <UiButton
              v-if="!locked && field.key !== 'keepsake'"
              class="reroll"
              variant="secondary"
              :aria-label="`Reroll ${field.label.toLowerCase()}`"
              :title="`Reroll ${field.label.toLowerCase()}`"
              @click="generateStudent(sheet.nationality ?? 'german', field.key)"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M20 7v5h-5M20 12a8 8 0 1 0-2.3 5.7" />
              </svg>
            </UiButton>
          </div>
        </div>
      </UiSheetCard>
    </Teleport>
    <Teleport :to="rightColumn ?? '#student-column-unmounted'" :disabled="!columns">
      <UiSheetCard title="Means" heading-id="means-heading">
        <div v-for="name in means" :key="name" class="rating-row">
          <span class="rating-name">{{ name }}</span>
          <UiShadeRating v-model="sheet.means[name]" :label="name" :disabled="locked" />
        </div>
      </UiSheetCard>
      <UiSheetCard title="Disciplines" heading-id="disciplines-heading">
        <div
          v-for="discipline in disciplines"
          :key="discipline.name"
          class="rating-row discipline-row"
        >
          <div class="discipline-title">
            <span class="rating-name">{{ discipline.name }}</span>
            <div class="discipline-subdomains">
              <small>{{ discipline.type }}</small>
              <UiSheetField
                :id="`subdomains-${discipline.name.toLowerCase()}`"
                class="subdomain-field"
                :disabled="locked"
                :model-value="sheet.subdomains?.[discipline.name] ?? ''"
                :aria-label="`${discipline.name} subdomains`"
                @update:model-value="setSubdomain(discipline.name, $event)"
              />
            </div>
          </div>
          <UiShadeRating
            v-model="sheet.disciplines[discipline.name]"
            :label="discipline.name"
            :disabled="locked"
          />
        </div>
      </UiSheetCard>
    </Teleport>
    <Teleport :to="leftColumn ?? '#student-column-unmounted'" :disabled="!columns">
      <UiStudentEntries
        id="spells"
        v-model="sheet.spells"
        title="Spells"
        singular="Spell"
        :locked="locked"
        rerollable
        @reroll="rerollSpell"
      />
      <UiStudentEntries
        id="sacrifices"
        v-model="sheet.sacrifices"
        title="Sacrifices"
        singular="Sacrifice"
        :locked="locked"
      />
    </Teleport>
  </form>
</template>

<style scoped>
.summon-filters {
  padding: 0 var(--space-4) var(--space-4);
}
.student-sheet {
  --font-sheet-heading-size: 1.5rem;
  display: grid;
  gap: var(--space-6);
  align-items: start;
  min-width: 0;
}
.student-sheet :deep(.card-heading > button),
.reset-actions,
.student-actions {
  margin-inline-start: auto;
}
.student-sheet :deep(.card-heading > h2) {
  mask-image: repeating-linear-gradient(176deg, #000 0 7px, #000b 7px 7.5px, #000 7.5px 13px);
}
.student-sheet :deep(.sheet-card)::before {
  content: '';
  position: absolute;
  top: calc(-1 * var(--theme-panel-rule-width));
  left: calc(-1 * var(--theme-panel-border-width));
  right: calc(-1 * var(--theme-panel-border-width));
  height: var(--theme-panel-rule-width);
  background: repeating-linear-gradient(
    174deg,
    transparent 0 37px,
    var(--color-surface) 37px 38px,
    transparent 38px 63px
  );
  opacity: 0.5;
  pointer-events: none;
}
.student-sheet :deep(.card-heading > button),
.student-actions > button,
.student-actions :deep(.picker > button),
.reset-actions > button {
  --button-font-size: 0.75rem;
  --button-padding-inline: var(--space-2);
  min-height: 2rem;
  margin-top: -0.375rem;
  padding-block: var(--space-1);
  line-height: 1.1;
}
.student-sheet :deep(.card-heading > button)::before,
.student-actions > button::before,
.student-actions :deep(.picker > button)::before,
.reset-actions > button::before {
  content: '';
  position: absolute;
  inset: -0.375rem 0;
}
.student-actions > .lock-sheet {
  display: grid;
  place-items: center;
  width: 2rem;
  padding-inline: 0;
}
.lock-sheet svg {
  display: block;
}
.student-sheet :deep(.sheet-field) {
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.4;
  padding-inline: 2px;
  padding-top: calc(var(--control-height) - 1lh - 4px);
  padding-bottom: 2px;
  border-image: linear-gradient(
      90deg,
      currentColor 0 19%,
      color-mix(in srgb, currentColor 60%, transparent) 19% 20%,
      currentColor 20% 63%,
      color-mix(in srgb, currentColor 70%, transparent) 63% 64%,
      currentColor 64%
    )
    1;
}
.student-fields {
  display: grid;
  gap: var(--space-4);
}
.student-field {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
  position: relative;
}
.student-field.has-reroll :deep(.sheet-field) {
  padding-right: calc(1.75rem + var(--space-1));
}
.student-field > .reroll {
  position: absolute;
  bottom: 0;
  right: 0;
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: var(--control-height);
  padding: 0;
  border: 0;
  background: transparent;
}
.student-field > .reroll::before,
.student-field > .reroll::after {
  display: none;
}
.student-field label {
  font-weight: 600;
}
.rating-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-2);
  padding-block: var(--space-2);
  border-bottom: 1px solid var(--color-border);
}
.discipline-row {
  row-gap: var(--space-1);
  border-bottom: 0;
}
.discipline-title {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
}
.rating-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.2;
}
.discipline-title small {
  white-space: nowrap;
}
.discipline-subdomains {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  min-width: 0;
}
.discipline-row :deep(.subdomain-field) {
  flex: 1;
  width: 0;
  min-height: 1.5rem;
  height: 1.5rem;
  padding-block: 2px;
  border-bottom: 1px solid var(--color-muted);
  border-image: none;
}
.discipline-row :deep(.shade-rating) {
  grid-column: 2;
  grid-row: 1;
}
@media (min-width: 36rem) {
  .rating-name {
    font-size: 1.125rem;
  }
}
.rating-row:last-child {
  border-bottom: 0;
}
small {
  display: block;
  color: var(--color-muted);
  font-size: var(--font-small-control-size);
}
.reset-actions,
.student-actions {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: var(--space-2);
}
@media (forced-colors: active) {
  .student-sheet :deep(.card-heading > h2) {
    mask-image: none;
  }
  .student-sheet :deep(.sheet-card)::before {
    display: none;
  }
  .student-sheet :deep(.sheet-field) {
    border-image: none;
  }
}
/* Desktop columns preserve the mobile source and keyboard order via Teleport. */
.sheet-column {
  display: none;
}
.sheet-column.active {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  min-width: 0;
}
@media (min-width: 48rem) {
  .student-sheet {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}
</style>
