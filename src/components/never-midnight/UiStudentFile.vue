<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { StudentSheet } from '@/data/characters/never-midnight'
import { givenNameGenders } from '@/generator/options'
import { neverMidnightNameCategories as neverMidnightCategories } from '@/generator/definitions/never-midnight'
import UiSheetCard from '@/components/ui/UiSheetCard.vue'
import UiSheetField from '@/components/ui/UiSheetField.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiChoicePicker from '@/components/ui/UiChoicePicker.vue'
import UiChecks from '@/components/ui/UiChecks.vue'
const props = defineProps<{ canReset: boolean; generationError: string }>()
const sheet = defineModel<StudentSheet>({ required: true })
const locked = defineModel<boolean>('locked', { required: true })
const emit = defineEmits<{
  reset: []
  generate: [category: string, field?: 'name' | 'description']
}>()
const confirmingReset = ref(false)
const selectedGenders = computed({
  get: () => sheet.value.genders ?? [...givenNameGenders],
  set: (genders) => {
    sheet.value.genders = genders
  },
})
const genderOptions = [
  { value: 'm', label: 'Masculine' },
  { value: 'f', label: 'Feminine' },
] as const
const fields = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Looks / marks / occupation' },
  { key: 'keepsake', label: 'Keepsake' },
] as const
watch(
  () => props.canReset,
  () => {
    confirmingReset.value = false
  },
)
function generate(category: string, field?: 'name' | 'description') {
  confirmingReset.value = false
  emit('generate', category, field)
}
function reset() {
  confirmingReset.value = false
  emit('reset')
}
</script>

<template>
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
          @update:model-value="generate($event)"
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
          appearance="icon"
          icon="reroll"
          v-if="!locked && field.key !== 'keepsake'"
          class="reroll"
          variant="secondary"
          :aria-label="`Reroll ${field.label.toLowerCase()}`"
          :title="`Reroll ${field.label.toLowerCase()}`"
          @click="generate(sheet.nationality ?? 'german', field.key)"
        />
      </div>
    </div>
  </UiSheetCard>
</template>

<style scoped>
.summon-filters {
  padding: 0 var(--space-4) var(--space-4);
}
.student-actions,
.reset-actions {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: var(--space-2);
  margin-inline-start: auto;
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
.student-field.has-reroll {
  --field-end-padding: calc(1.75rem + var(--space-1));
}
.student-field > .reroll {
  --button-icon-size: 1.75rem;
  position: absolute;
  bottom: 0;
  right: 0;
}
.student-field label {
  font-weight: 600;
}
</style>
