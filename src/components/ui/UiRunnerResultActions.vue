<script setup lang="ts">
import { usePreferencesStore } from '@/stores/preferences'
const preferences = usePreferencesStore()
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Generated } from '@/patterns/types'
import { runnerImagePrompt } from '@/helper/runnerImagePrompt'
import { encodeCharacter } from '@/helper/characterLink'
import { useCharacterStore } from '@/stores/character'
import UiButton from './UiButton.vue'
import { useClipboard } from '@/composables/useClipboard'

const props = defineProps<{ result: Generated }>()
const router = useRouter()
const runner = computed(() => ({
  alias: props.result.primary,
  description: [props.result.details, props.result.appearance].filter(Boolean).join('\n'),
  archetypeId: props.result.archetypeId,
  angle: props.result.angle,
}))
const { error, activation: copyActivation, copy, reset: resetCopy } = useClipboard()
watch(runner, () => {
  resetCopy()
})

async function openCharacter() {
  error.value = ''
  try {
    const character = useCharacterStore()
    character.reset()
    character.sheet.runner = { ...runner.value }
    character.applyArchetype({ flavor: 'cyberpunk' })
    await router.push({
      path: '/chars/cbrpnk',
      query: { char: encodeCharacter(character.sheet) },
    })
  } catch {
    error.value = 'Could not open this runner in the character sheet.'
  }
}

function copyPrompt() {
  return copy(runnerImagePrompt(runner.value))
}
</script>

<template>
  <div class="runner-actions">
    <UiButton
      appearance="icon"
      class="icon-button"
      variant="secondary"
      feedback="icon"
      :aria-label="`Open ${result.primary} in character sheet`"
      title="Open in character sheet"
      @click="openCharacter"
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
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </UiButton>
    <UiButton
      appearance="icon"
      icon="portrait"
      v-if="preferences.soullessCorpMode && runner.description.trim()"
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
.runner-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
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
