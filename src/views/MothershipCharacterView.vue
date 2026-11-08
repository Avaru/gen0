<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMothershipCharacterStore } from '@/stores/mothershipCharacter'
import { useCharacterUrl } from '@/composables/useCharacterUrl'
import { encodeMothershipCharacter } from '@/helper/mothershipCharacterLink'
import UiMothershipSheet from '@/components/ui/UiMothershipSheet.vue'

const character = useMothershipCharacterStore()
const { sheet } = storeToRefs(character)
const linkError = useCharacterUrl({
  path: '/chars/mothership',
  sheet: () => character.sheet,
  encode: encodeMothershipCharacter,
  load: character.loadCharacterToken,
})
</script>
<template>
  <p v-if="linkError" role="alert">{{ linkError }}</p>
  <UiMothershipSheet v-model="sheet" @reroll="character.reroll" />
</template>
