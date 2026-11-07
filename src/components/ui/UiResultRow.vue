<script setup lang="ts">
import type { Generated } from '@/patterns/types'
import UiScrambleText from './UiScrambleText.vue'

withDefaults(
  defineProps<{
    result: Generated
    showDetails: boolean
    detailFields?: readonly ('appearance' | 'details')[]
    duration: number
    delay: number
  }>(),
  { detailFields: () => ['appearance', 'details'] },
)
</script>

<template>
  <li class="result-row">
    <div class="name">
      <div class="result-heading">
        <div class="identity">
          <strong
            ><UiScrambleText
              :text="result.primary"
              :replay-key="result"
              :duration="duration"
              :delay="delay"
          /></strong>
          <div v-if="result.secondary" class="secondary">
            <UiScrambleText
              :text="result.secondary"
              :replay-key="result"
              :duration="duration"
              :delay="delay"
            />
          </div>
        </div>
        <div v-if="$slots.actions" class="actions"><slot name="actions" /></div>
      </div>
      <template v-if="showDetails">
        <div v-if="result.age" class="age">
          <UiScrambleText
            :text="result.age"
            :replay-key="result"
            :duration="duration"
            :delay="delay"
          />
        </div>
        <template v-for="field in detailFields" :key="field">
          <div v-if="result[field]" :class="field">
            <UiScrambleText
              :text="result[field]"
              :replay-key="result"
              :duration="duration"
              :delay="delay"
            />
          </div>
        </template>
        <div v-if="result.rating !== undefined" class="rating">
          <UiScrambleText
            :text="`Rating: ${result.rating.toFixed(1)} / 5`"
            :replay-key="result"
            :duration="duration"
            :delay="delay"
          />
        </div>
      </template>
    </div>
  </li>
</template>

<style scoped>
li {
  position: relative;
  padding-block: var(--generator-row-padding, var(--space-4));
  border-top: 1px var(--generator-row-border-style, solid) var(--color-border);
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
  color: var(--color-muted);
  font-size: 0.9375rem;
}
.result-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2);
}
.identity {
  min-width: 0;
}
.actions {
  flex: none;
}
strong {
  display: block;
  font-family: var(--font-result-name, var(--font-display));
  font-weight: var(--theme-name-weight);
  color: var(--theme-name-color);
  font-size: var(--font-result-name-size, 1.625rem);
  font-size-adjust: var(--font-result-name-adjust, none);
  line-height: var(--line-height-result-name, 1.15);
}
.secondary,
.name > :not(:first-child) {
  margin-top: var(--space-1);
}
.secondary {
  font-family: var(--font-result-secondary, var(--font-body));
  font-size: var(--font-result-secondary-size, 0.9375rem);
  font-weight: 700;
  line-height: var(--line-height-result-secondary, 1.5);
  letter-spacing: var(--letter-spacing-result-secondary, normal);
  color: var(--color-result-secondary, var(--color-muted));
}
.details {
  white-space: pre-line;
}
</style>
