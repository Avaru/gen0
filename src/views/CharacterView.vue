<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, inject } from 'vue'
import { routeLocationKey } from 'vue-router'
import { settingsFromRoute } from '@/generator/settings'
import { useCharacterStore } from '@/stores/character'
import { useCharacterUrl } from '@/composables/useCharacterUrl'
import UiCharacterSheet from '@/components/ui/UiCharacterSheet.vue'

const character = useCharacterStore()
const { system, attributes, skills, sheet, hasContent } = storeToRefs(character)
const route = inject(routeLocationKey, undefined)
const linkError = useCharacterUrl()
const flavor = computed(() => (route ? settingsFromRoute(route).flavor : 'cyberpunk'))
</script>

<template>
  <p v-if="linkError" role="alert">{{ linkError }}</p>
  <UiCharacterSheet
    v-model="sheet"
    :system="system"
    :attributes="attributes"
    :skills="skills"
    :flavor="flavor"
    :can-reset="hasContent"
    @reset="character.reset"
    @apply-archetype="character.applyArchetype({ flavor, bitRandom: $event })"
  />
</template>
