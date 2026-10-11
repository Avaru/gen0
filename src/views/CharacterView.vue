<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/character'
import UiCharacterSheet from '@/components/ui/UiCharacterSheet.vue'

const { system, attributes, skills, sheet } = storeToRefs(useCharacterStore())
</script>

<template>
  <UiCharacterSheet v-model="sheet" :system="system" :attributes="attributes" :skills="skills" />
</template>
