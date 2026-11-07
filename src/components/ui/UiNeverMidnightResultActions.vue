<script setup lang="ts">
import { watch } from 'vue'
import type { Generated } from '@/patterns/types'
import { neverMidnightImagePrompt } from '@/helper/neverMidnightImagePrompt'
import UiButton from './UiButton.vue'
import UiResultActions from './UiResultActions.vue'
import { useClipboard } from '@/composables/useClipboard'

const props = defineProps<{ result: Generated }>()
const { error, activation: copyActivation, copy, reset: resetCopy } = useClipboard()
watch(
  () => props.result,
  () => {
    resetCopy()
  },
)

function copyPrompt() {
  return copy(neverMidnightImagePrompt(props.result))
}
</script>

<template>
  <UiResultActions :error="error">
    <UiButton
      appearance="icon"
      icon="portrait"
      variant="secondary"
      feedback="icon"
      :activation="copyActivation"
      :aria-label="`Copy image prompt for ${result.primary}`"
      title="Copy image prompt"
      @click="copyPrompt"
    />
  </UiResultActions>
</template>
