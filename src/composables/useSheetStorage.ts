import { onScopeDispose } from 'vue'

/** Shared save scheduling; each sheet decides which edits save immediately. */
export function useSheetStorage(key: string, sheet: () => unknown) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let pending = false
  function save() {
    clearTimeout(timer)
    timer = undefined
    pending = false
    try {
      localStorage.setItem(key, JSON.stringify(sheet()))
    } catch {
      // Editing and URL sharing remain available when storage is blocked or full.
    }
  }
  function scheduleSave() {
    pending = true
    clearTimeout(timer)
    timer = setTimeout(save, 200)
  }
  function flush() {
    if (pending) save()
  }
  function visibilityChanged() {
    if (document.visibilityState === 'hidden') flush()
  }
  window.addEventListener('pagehide', flush)
  document.addEventListener('visibilitychange', visibilityChanged)
  onScopeDispose(() => {
    flush()
    clearTimeout(timer)
    window.removeEventListener('pagehide', flush)
    document.removeEventListener('visibilitychange', visibilityChanged)
  })
  return { save, scheduleSave }
}
