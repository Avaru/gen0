<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
import type { Generated } from '@/patterns/types'
import UiToggle from '@/components/ui/UiToggle.vue'
import UiScrambleText from '@/components/ui/UiScrambleText.vue'
import UiRunnerResultActions from '@/components/ui/UiRunnerResultActions.vue'
import { scrollToContent } from '@/components/ui/scrollToContent'
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
const emit = defineEmits<{ more: []; 'update:showDetails': [value: boolean] }>()
const hasDetails = computed(() =>
  props.results.some(
    (result) =>
      result.age ||
      result.appearance ||
      result.details ||
      result.rating !== undefined ||
      (props.category !== 'runners' && result.secondary),
  ),
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
  <section aria-labelledby="results-heading" :aria-busy="busy">
    <div class="heading">
      <h1 id="results-heading">{{ label }}</h1>
      <UiToggle
        v-if="hasDetails"
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
      <li v-for="(result, index) in results" :key="index">
        <div class="name" :class="{ 'runner-name': category === 'runners' && showDetails }">
          <strong
            ><UiScrambleText
              :text="result.primary"
              :replay-key="result"
              v-bind="revealTiming(index)"
          /></strong>
          <div
            v-if="result.secondary && (category === 'runners' || showDetails)"
            class="secondary"
            :class="{ 'runner-secondary': category === 'runners' }"
          >
            <UiScrambleText
              :text="result.secondary"
              :replay-key="result"
              v-bind="revealTiming(index)"
            />
          </div>
          <template v-if="showDetails">
            <div v-if="result.age">
              <UiScrambleText
                :text="result.age"
                :replay-key="result"
                v-bind="revealTiming(index)"
              />
            </div>
            <div v-if="result.appearance">
              <UiScrambleText
                :text="result.appearance"
                :replay-key="result"
                v-bind="revealTiming(index)"
              />
            </div>
            <div v-if="result.details" class="details">
              <UiScrambleText
                :text="result.details"
                :replay-key="result"
                v-bind="revealTiming(index)"
              />
            </div>
            <div v-if="result.rating !== undefined">
              <UiScrambleText
                :text="`Rating: ${result.rating.toFixed(1)} / 5`"
                :replay-key="result"
                v-bind="revealTiming(index)"
              />
            </div>
          </template>
        </div>
        <UiRunnerResultActions
          v-if="(!setting || setting === 'cyberpunk') && category === 'runners' && showDetails"
          :result="result"
        />
      </li>
    </ol>
  </section>
</template>
<style scoped>
section {
  position: relative;
  display: grid;
  gap: var(--space-4);
  padding: var(--generator-panel-padding, var(--space-6));
  border: var(--theme-panel-border-width) solid var(--color-border);
  border-top: var(--theme-panel-rule-width) solid var(--color-signal);
  box-shadow: var(--theme-panel-shadow);
  border-radius: var(--radius-lg);
  background: var(--theme-panel-fill);
  background-image: var(--theme-panel-texture);
}
section::after {
  content: '';
  position: absolute;
  top: 7px;
  right: var(--space-3);
  width: 3rem;
  height: 5px;
  background: var(--theme-panel-edge);
  pointer-events: none;
}
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
.details {
  white-space: pre-line;
}
.name div {
  color: var(--color-muted);
}
ol {
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  position: relative;
  display: flex;
  gap: var(--space-4);
  padding-block: var(--generator-row-padding, var(--space-4));
  border-top: 1px solid var(--color-border);
}
li::after {
  content: '';
  position: absolute;
  top: -1px;
  right: 0;
  width: 1.75rem;
  height: 3px;
  background: var(--theme-row-mark);
  opacity: 0.55;
  pointer-events: none;
}
.name {
  min-width: 0;
  overflow-wrap: anywhere;
}
.runner-name > strong,
.runner-name > .runner-secondary {
  display: block;
  padding-right: calc(var(--space-8) * 2 + var(--space-2));
}
strong {
  font-family: var(--font-result-name, var(--font-display));
  font-weight: var(--theme-name-weight);
  color: var(--theme-name-color);
  font-size: var(--font-result-name-size, 1.625rem);
  line-height: 1.15;
}
.name div {
  margin-top: var(--space-1);
  font-size: 0.9375rem;
}
.name .runner-secondary {
  font-family: var(--font-runner-secondary);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0.025em;
  color: var(--color-signal);
}
.error {
  color: var(--color-error);
}
@media (max-width: 24rem) {
  section {
    padding: var(--generator-panel-padding, var(--space-4));
  }
}
h1:where([data-theme='never-midnight'] *) {
  padding: var(--space-2) var(--space-3);
  background: var(--color-text);
  color: var(--color-on-accent);
}
</style>
