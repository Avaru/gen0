import { ref } from 'vue'

export function useClipboard() {
  const error = ref('')
  const activation = ref(0)
  function reset() {
    error.value = ''
    activation.value = 0
  }
  async function copy(text: string) {
    error.value = ''
    try {
      await navigator.clipboard.writeText(text)
      activation.value++
    } catch {
      error.value = 'Could not copy the image prompt. Please allow clipboard access and try again.'
    }
  }
  return { error, activation, copy, reset }
}
