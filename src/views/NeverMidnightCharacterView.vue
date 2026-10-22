<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNeverMidnightCharacterStore, encodeStudent } from '@/stores/neverMidnightCharacter'
import { useCharacterUrl } from '@/composables/useCharacterUrl'
import UiStudentSheet from '@/components/never-midnight/UiStudentSheet.vue'
const character = useNeverMidnightCharacterStore()
const { sheet, hasContent } = storeToRefs(character)
const linkError = useCharacterUrl({
  path: '/chars/never-midnight',
  sheet: () => character.sheet,
  encode: encodeStudent,
  load: character.loadCharacterToken,
})
</script>

<template>
  <p v-if="linkError" role="alert">{{ linkError }}</p>
  <UiStudentSheet
    v-model="sheet"
    :can-reset="hasContent"
    :generation-error="character.generationError"
    @reset="character.reset"
    @generate="character.generateStudent"
    @reroll-spell="character.rerollSpell"
  />
</template>
