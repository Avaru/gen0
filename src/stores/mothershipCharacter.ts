import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useSheetStorage } from '@/composables/useSheetStorage'
import {
  decodeMothershipCharacter,
  encodeMothershipCharacter,
} from '@/helper/mothershipCharacterLink'
import {
  createBlankMothershipSheet,
  generateMothershipSheet,
  rerollMothershipField,
  type MothershipReroll,
} from '@/patterns/mothership/character'

export const useMothershipCharacterStore = defineStore('mothership-character', () => {
  const storageKey = 'gen0.character.mothership'
  const sheet = ref(createBlankMothershipSheet())
  const hasContent = computed(
    () => JSON.stringify(sheet.value) !== JSON.stringify(createBlankMothershipSheet()),
  )
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (saved) sheet.value = decodeMothershipCharacter(encodeMothershipCharacter(saved))
  } catch {
    // Keep the blank sheet when local storage is unavailable or invalid.
  }
  const { save, scheduleSave } = useSheetStorage(storageKey, () => sheet.value)
  watch(sheet, scheduleSave, { deep: true })
  function loadCharacterToken(token: string) {
    sheet.value = decodeMothershipCharacter(token)
    save()
  }
  function generate() {
    sheet.value = generateMothershipSheet()
  }
  function reset() {
    sheet.value = createBlankMothershipSheet()
    save()
  }
  function reroll(field: MothershipReroll) {
    rerollMothershipField(sheet.value, field)
  }
  return { sheet, hasContent, loadCharacterToken, generate, reset, reroll }
})
