<script setup lang="ts">
import { usePreferencesStore } from '@/stores/preferences'
const preferences = usePreferencesStore()
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Generated } from '@/patterns/types'
import { runnerImagePrompt } from '@/helper/runnerImagePrompt'
import { encodeCharacter } from '@/helper/characterLink'
import { useCharacterStore } from '@/stores/character'
import UiButton from './UiButton.vue'

const props = defineProps<{ result: Generated }>()
const router = useRouter()
const runner = computed(() => ({
  alias: props.result.primary,
  description: [props.result.details, props.result.appearance].filter(Boolean).join('\n'),
  archetypeId: props.result.archetypeId,
  angle: props.result.angle,
}))
const error = ref('')
const copyActivation = ref(0)
watch(runner, () => {
  error.value = ''
  copyActivation.value = 0
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
      query: { character: encodeCharacter(character.sheet) },
    })
  } catch {
    error.value = 'Could not open this runner in the character sheet.'
  }
}

async function copyPrompt() {
  error.value = ''
  try {
    await navigator.clipboard.writeText(runnerImagePrompt(runner.value))
    copyActivation.value++
  } catch {
    error.value = 'Could not copy the image prompt. Please allow clipboard access and try again.'
  }
}
</script>

<template>
  <div class="runner-actions">
    <UiButton
      class="icon-button"
      variant="secondary"
      feedback="icon"
      :aria-label="`Open ${result.primary} in character sheet`"
      title="Open in character sheet"
      @click="openCharacter"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false">
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </UiButton>
    <UiButton
      v-if="preferences.soullessCorpMode && runner.description.trim()"
      class="icon-button"
      variant="secondary"
      feedback="icon"
      :activation="copyActivation"
      :aria-label="`Copy image prompt for ${result.primary}`"
      title="Copy image prompt"
      @click="copyPrompt"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    </UiButton>
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
