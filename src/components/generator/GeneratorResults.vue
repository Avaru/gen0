<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
import type { Generated } from '@/patterns/types'
import UiButton from '@/components/ui/UiButton.vue'
import UiGeneratorPanel from '@/components/ui/UiGeneratorPanel.vue'
import UiToggle from '@/components/ui/UiToggle.vue'
import UiResultRow from '@/components/ui/UiResultRow.vue'
import UiResultActions from '@/components/ui/UiResultActions.vue'
import UiRunnerResultActions from '@/components/ui/UiRunnerResultActions.vue'
import UiNeverMidnightResultActions from '@/components/ui/UiNeverMidnightResultActions.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { countries } from '@/patterns/never-midnight/names'
import { scrollToContent } from '@/components/ui/scrollToContent'
const preferences = usePreferencesStore()
const props = defineProps<{
  results: Generated[]
  busy: boolean
  label: string
  setting?: string
  category?: string
  error: string
  showDetails: boolean
  pendingPools?: readonly string[]
}>()
const emit = defineEmits<{
  more: []
  'update:showDetails': [value: boolean]
  'open-mothership-sheet': [result: Generated]
  'open-mothership-details': [result: Generated]
}>()
const showNeverMidnightPrompt = computed(
  () =>
    props.setting === 'never-midnight' &&
    (props.category === 'berliner' || countries.some((country) => country === props.category)) &&
    props.showDetails &&
    preferences.soullessCorpMode,
)
const showRunnerActions = computed(
  () =>
    (!props.setting || props.setting === 'cyberpunk') &&
    props.category === 'runners' &&
    props.showDetails,
)
const showMothershipActions = computed(
  () => props.setting === 'mothership' && props.category === 'generic',
)
const hasDetails = computed(() =>
  props.results.some(
    (result) => result.age || result.appearance || result.details || result.rating !== undefined,
  ),
)
const detailFields = computed(() =>
  props.setting === 'mothership'
    ? (['details', 'appearance'] as const)
    : (['appearance', 'details'] as const),
)
const list = useTemplateRef<HTMLOListElement>('list')
let previousScrollY = 0
function loadMoreOnScroll() {
  const scrollingDown = window.scrollY > previousScrollY
  previousScrollY = window.scrollY
  if (!scrollingDown || props.busy || props.error || !props.results.length) return
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) emit('more')
}
onMounted(() => {
  previousScrollY = window.scrollY
  window.addEventListener('scroll', loadMoreOnScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', loadMoreOnScroll))
function revealTiming(index: number) {
  const position = index % 10
  return { duration: position === 0 ? 140 : 260, delay: position * 40 }
}
defineExpose({
  revealFirstName() {
    const name = list.value?.querySelector<HTMLElement>('li strong')
    if (!name) return
    const bounds = name.getBoundingClientRect()
    if (bounds.top < 0 || bounds.bottom > window.innerHeight) scrollToContent(name, 'nearest')
  },
})
</script>
<template>
  <UiGeneratorPanel aria-labelledby="results-heading" :aria-busy="busy">
    <div class="heading">
      <h1 id="results-heading" class="generator-heading">{{ label }}</h1>
      <UiToggle
        v-if="hasDetails"
        class="details-toggle"
        :model-value="showDetails"
        label="details"
        @update:model-value="$emit('update:showDetails', $event)"
      />
    </div>
    <p v-if="pendingPools?.length">
      Some name pools are still TODO: {{ pendingPools.join(', ') }}.
    </p>
    <p class="status" role="status" aria-atomic="true">
      {{ busy ? 'Generating names…' : results.length ? 'Names updated.' : '' }}
    </p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <ol v-if="results.length" ref="list" role="list">
      <UiResultRow
        v-for="(result, index) in results"
        :key="index"
        :result="result"
        :show-details="showDetails"
        :detail-fields="detailFields"
        v-bind="revealTiming(index)"
      >
        <template
          v-if="
            showRunnerActions ||
            showNeverMidnightPrompt ||
            (showMothershipActions && result.mothershipClass)
          "
          #actions
        >
          <UiRunnerResultActions v-if="showRunnerActions" :result="result" />
          <UiNeverMidnightResultActions v-if="showNeverMidnightPrompt" :result="result" />
          <UiResultActions v-if="showMothershipActions && result.mothershipClass">
            <UiButton
              appearance="icon"
              icon="arrow-right"
              variant="secondary"
              :aria-label="`Open character sheet for ${result.primary}`"
              title="Open character sheet"
              @click="emit('open-mothership-sheet', result)"
            />
            <UiButton
              appearance="icon"
              icon="document"
              variant="secondary"
              :aria-label="`Open detailed character sheet for ${result.primary}`"
              title="Open detailed character sheet"
              @click="emit('open-mothership-details', result)"
            />
          </UiResultActions>
        </template>
      </UiResultRow>
    </ol>
  </UiGeneratorPanel>
</template>
<style scoped>
.status {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}
.heading > :last-child:not(:first-child) {
  flex-shrink: 0;
}
h1 {
  min-width: 0;
  font-size: var(--font-result-heading-size, clamp(2rem, 6vw, 3.5rem));
  font-weight: var(--theme-heading-weight);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--theme-title-color);
  overflow-wrap: anywhere;
  text-shadow: var(--theme-heading-shadow);
}
ol {
  margin: 0;
  padding: 0;
  list-style: none;
}
.error {
  color: var(--color-error);
}
</style>
