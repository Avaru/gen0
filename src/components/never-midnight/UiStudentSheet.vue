<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import type { StudentSheet } from '@/data/characters/never-midnight'
import UiStudentFile from './UiStudentFile.vue'
import UiStudentRatings from './UiStudentRatings.vue'
import UiStudentEntries from './UiStudentEntries.vue'
defineProps<{ canReset: boolean; generationError: string }>()
const sheet = defineModel<StudentSheet>({ required: true })
const emit = defineEmits<{
  reset: []
  generate: [category: string, field?: 'name' | 'description']
  rerollSpell: [index: number]
}>()
const locked = ref(false)
const desktopMedia = window.matchMedia('(min-width: 48rem)')
const desktop = ref(desktopMedia.matches)
const leftColumn = useTemplateRef('left-column')
const rightColumn = useTemplateRef('right-column')
const columns = computed(() => Boolean(desktop.value && leftColumn.value && rightColumn.value))
function updateMedia() {
  desktop.value = desktopMedia.matches
}
onMounted(() => desktopMedia.addEventListener('change', updateMedia))
onBeforeUnmount(() => desktopMedia.removeEventListener('change', updateMedia))
</script>

<template>
  <form class="student-sheet" aria-label="Never Midnight character sheet" @submit.prevent>
    <div ref="left-column" class="sheet-column" :class="{ active: columns }" />
    <div ref="right-column" class="sheet-column" :class="{ active: columns }" />
    <Teleport :to="leftColumn ?? '#student-column-unmounted'" :disabled="!columns">
      <UiStudentFile
        v-model="sheet"
        v-model:locked="locked"
        :can-reset="canReset"
        :generation-error="generationError"
        @reset="emit('reset')"
        @generate="(category, field) => emit('generate', category, field)"
      />
    </Teleport>
    <Teleport :to="rightColumn ?? '#student-column-unmounted'" :disabled="!columns">
      <UiStudentRatings v-model="sheet" :locked="locked" />
    </Teleport>
    <Teleport :to="leftColumn ?? '#student-column-unmounted'" :disabled="!columns">
      <UiStudentEntries
        id="spells"
        v-model="sheet.spells"
        title="Spells"
        singular="Spell"
        :locked="locked"
        rerollable
        @reroll="!locked && emit('rerollSpell', $event)"
      />
      <UiStudentEntries
        id="sacrifices"
        v-model="sheet.sacrifices"
        title="Sacrifices"
        singular="Sacrifice"
        :locked="locked"
      />
    </Teleport>
  </form>
</template>

<style scoped>
.student-sheet {
  --font-sheet-heading-size: 1.5rem;
  display: grid;
  gap: var(--space-6);
  align-items: start;
  min-width: 0;
}
/* Teleports retain the phone reading order and preserve card state on resize. */
.sheet-column {
  display: none;
}
.sheet-column.active {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  min-width: 0;
}
@media (min-width: 48rem) {
  .student-sheet {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}
</style>
