import { defineStore } from 'pinia'
import { computed, onScopeDispose, ref, watch } from 'vue'
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
  let timer: ReturnType<typeof setTimeout> | undefined
  let pending = false
  function save() {
    clearTimeout(timer)
    pending = false
    try {
      localStorage.setItem(storageKey, JSON.stringify(sheet.value))
    } catch {
      // Storage can be blocked or full; editing and URL sharing still work.
    }
  }
  function flush() {
    if (pending) save()
  }
  watch(
    sheet,
    () => {
      pending = true
      clearTimeout(timer)
      timer = setTimeout(save, 200)
    },
    { deep: true },
  )
  function visibilityChanged() {
    if (document.visibilityState === 'hidden') flush()
  }
  window.addEventListener('pagehide', flush)
  document.addEventListener('visibilitychange', visibilityChanged)
  onScopeDispose(() => {
    flush()
    window.removeEventListener('pagehide', flush)
    document.removeEventListener('visibilitychange', visibilityChanged)
  })
  function loadCharacterToken(token: string) {
    const data = decodeSheetToken(token) as { version?: unknown; sheet?: unknown } | null
    const restored = data?.version === 1 ? restoreStudentSheet(data.sheet) : undefined
    if (!restored) throw new Error('Invalid character link')
    sheet.value = restored
    save()
  }
  function reset() {
    sheet.value = createStudentSheet()
    save()
  }
  return { sheet, hasContent, reset, loadCharacterToken }
})
