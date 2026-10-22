<script setup lang="ts">
import { watch } from 'vue'
import type { Generated } from '@/patterns/types'
import { neverMidnightImagePrompt } from '@/helper/neverMidnightImagePrompt'
import UiButton from './UiButton.vue'
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
  <div class="portrait-actions">
    <UiButton
      appearance="icon"
      icon="portrait"
      class="icon-button"
      variant="secondary"
      feedback="icon"
      :activation="copyActivation"
      :aria-label="`Copy image prompt for ${result.primary}`"
      title="Copy image prompt"
      @click="copyPrompt"
    />
    <span v-if="error" class="error" role="alert">{{ error }}</span>
  </div>
</template>

<style scoped>
.portrait-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  max-width: 100%;
}
.icon-button {
  --button-icon-rest-color: var(--color-muted);
  --button-icon-size: var(--space-8);
  --button-icon-align: end;
}
.error {
  font-size: var(--font-sheet-rule-size);
  color: var(--color-error);
}
</style>
