<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Generated } from '@/patterns/types'
import { neverMidnightImagePrompt } from '@/helper/neverMidnightImagePrompt'
import UiButton from './UiButton.vue'

const props = defineProps<{ result: Generated }>()
const error = ref('')
const copyActivation = ref(0)
watch(
  () => props.result,
  () => {
    error.value = ''
    copyActivation.value = 0
  },
)

async function copyPrompt() {
  error.value = ''
  try {
    await navigator.clipboard.writeText(neverMidnightImagePrompt(props.result))
    copyActivation.value++
  } catch {
    error.value = 'Could not copy the image prompt. Please allow clipboard access and try again.'
  }
}
</script>

<template>
  <div class="portrait-actions">
    <UiButton
      class="icon-button"
      variant="secondary"
      feedback="icon"
      :activation="copyActivation"
      :aria-label="`Copy image prompt for ${result.primary}`"
      title="Copy image prompt"
      @click="copyPrompt"
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
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    </UiButton>
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
  display: grid;
  place-items: center;
  justify-items: end;
  width: var(--space-8);
  height: var(--control-height);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-muted);
}
.icon-button::before,
.icon-button::after {
  display: none;
}
.icon-button:hover:enabled,
.icon-button:active:enabled {
  background: transparent;
  color: var(--color-accent);
}
.error {
  font-size: var(--font-sheet-rule-size);
  color: var(--color-error);
}
</style>
