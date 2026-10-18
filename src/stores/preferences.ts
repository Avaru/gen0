import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore('preferences', () => {
  const soullessCorpMode = ref(false)
  const storageKey = 'gen0.soullessCorpMode'
  try {
    soullessCorpMode.value = localStorage.getItem(storageKey) === 'true'
  } catch {
    // Storage may be unavailable; the mode stays off by default.
  }
  watch(
    soullessCorpMode,
    (enabled) => {
      try {
        localStorage.setItem(storageKey, String(enabled))
      } catch {
        // The toggle still works for this visit when storage is unavailable.
      }
    },
    { flush: 'sync' },
  )
  return { soullessCorpMode }
})
