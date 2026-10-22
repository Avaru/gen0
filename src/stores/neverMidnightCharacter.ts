import { defineStore } from 'pinia'
import { useSheetStorage } from '@/composables/useSheetStorage'
import { givenNameGenders } from '@/generator/options'
import { neverMidnightNameCategories } from '@/generator/definitions/never-midnight'
import { generateNames } from '@/generator/categories'
import { generateStudentDisciplines, generateStudentMeans } from '@/patterns/never-midnight/student'
import { spell } from '@/patterns/never-midnight/spells'
import type { StudentSheet } from '@/data/characters/never-midnight'
import { computed, ref, watch } from 'vue'
import { createStudentSheet, restoreStudentSheet } from '@/data/characters/never-midnight'
import { decodeSheetToken, encodeSheetToken } from '@/helper/sheetToken'

export function encodeStudent(sheet: unknown): string {
  return encodeSheetToken({ version: 1, sheet })
}

export const useNeverMidnightCharacterStore = defineStore('never-midnight-character', () => {
  const storageKey = 'gen0.character.never-midnight'
  const sheet = ref(createStudentSheet())
  const hasContent = computed(
    () => JSON.stringify(sheet.value) !== JSON.stringify(createStudentSheet()),
  )
  try {
    const saved = restoreStudentSheet(JSON.parse(localStorage.getItem(storageKey) ?? 'null'))
    if (saved) sheet.value = saved
  } catch {
    // The sheet remains usable without local storage.
  }
  const { save, scheduleSave } = useSheetStorage(storageKey, () => sheet.value)
  watch(sheet, scheduleSave, { deep: true })
  const generationError = ref('')
  function generateStudent(category: string, field?: 'name' | 'description') {
    generationError.value = ''
    const nationality = neverMidnightNameCategories.find((option) => option.id === category)
      ?.id as StudentSheet['nationality']
    if (!nationality) return
    try {
      const generated = generateNames(nationality, 1, {
        setting: 'never-midnight',
        genders: sheet.value.genders ?? [...givenNameGenders],
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
    } catch {
      generationError.value = 'Could not summon a student. Your current student file has been kept.'
    }
  }
  function rerollSpell(index: number) {
    const entry = sheet.value.spells[index]
    if (entry) entry.description = spell().primary
  }
  function loadCharacterToken(token: string) {
    const data = decodeSheetToken(token) as { version?: unknown; sheet?: unknown } | null
    const restored = data?.version === 1 ? restoreStudentSheet(data.sheet) : undefined
    if (!restored) throw new Error('Invalid character link')
    sheet.value = restored
    save()
  }
  function reset() {
    generationError.value = ''
    sheet.value = createStudentSheet()
    save()
  }
  return {
    sheet,
    hasContent,
    reset,
    loadCharacterToken,
    generationError,
    generateStudent,
    rerollSpell,
  }
})
