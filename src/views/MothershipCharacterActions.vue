<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMothershipCharacterStore } from '@/stores/mothershipCharacter'
import UiButton from '@/components/ui/UiButton.vue'

const character = useMothershipCharacterStore()
const { hasContent } = storeToRefs(character)
const confirmingReset = ref(false)
watch(hasContent, (canReset) => {
  if (!canReset) confirmingReset.value = false
})
function generate() {
  confirmingReset.value = false
  character.generate()
}
function reset() {
  confirmingReset.value = false
  character.reset()
}
function printSheet() {
  window.print()
}
</script>

<template>
  <div class="sheet-toolbar">
    <UiButton v-if="!confirmingReset" @click="generate">Generate</UiButton>
    <UiButton v-if="hasContent && confirmingReset" variant="destructive" @click="reset"
      >really?</UiButton
    >
    <UiButton v-if="hasContent" variant="secondary" @click="confirmingReset = !confirmingReset">{{
      confirmingReset ? 'nah.' : 'Reset'
    }}</UiButton>
    <UiButton class="print-button" variant="secondary" @click="printSheet">Print</UiButton>
  </div>
</template>

<style scoped>
.sheet-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-2);
  --button-font-size: 0.75rem;
  --button-padding-inline: var(--space-1);
}
</style>
