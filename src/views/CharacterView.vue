<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, inject } from 'vue'
import { routeLocationKey } from 'vue-router'
import { settingsFromRoute } from '@/generator/settings'
import { useCharacterStore } from '@/stores/character'
import UiCharacterSheet from '@/components/ui/UiCharacterSheet.vue'

const character = useCharacterStore()
const { system, attributes, skills, sheet } = storeToRefs(character)
const route = inject(routeLocationKey, undefined)
const flavor = computed(() => route ? settingsFromRoute(route).flavor : 'cyberpunk')
</script>

<template>
  <UiCharacterSheet v-model="sheet" :system="system" :attributes="attributes" :skills="skills" :flavor="flavor" @reset="character.reset" @apply-archetype="character.applyArchetype({ flavor })" />
</template>
