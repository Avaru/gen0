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
import UiResultActions from './UiResultActions.vue'
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
  <UiResultActions :error="error">
    <UiButton
      appearance="icon"
      variant="secondary"
      feedback="icon"
      :aria-label="`Open ${result.primary} in character sheet`"
      title="Open in character sheet"
      @click="openCharacter"
      icon="arrow-right"
    />
    <UiButton
      appearance="icon"
      icon="portrait"
      v-if="preferences.soullessCorpMode && runner.description.trim()"
      variant="secondary"
      feedback="icon"
      :activation="copyActivation"
      :aria-label="`Copy image prompt for ${result.primary}`"
      title="Copy image prompt"
      @click="copyPrompt"
    />
  </UiResultActions>
</template>
