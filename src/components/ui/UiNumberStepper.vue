<script setup lang="ts">
import { ref, watch } from 'vue'
import UiButton from './UiButton.vue'
import UiScrambleText from './UiScrambleText.vue'

const props = defineProps<{
  label: string
  modelValue: number
  min: number
  max?: number
  replayKey?: unknown
}>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
const animateValue = ref(true)
watch(
  () => props.replayKey,
  () => {
    animateValue.value = true
  },
)

function step(amount: number) {
  animateValue.value = false
  emit(
    'update:modelValue',
    Math.min(props.max ?? Infinity, Math.max(props.min, props.modelValue + amount)),
  )
}
</script>

<template>
  <div class="stepper" role="group" :aria-label="label">
    <div class="bubble">
      <div class="current-value">
        <UiButton
          v-if="modelValue > min"
          class="decrease"
          appearance="icon"
          variant="secondary"
          :aria-label="`Decrease ${label}`"
          @click="step(-1)"
          >−</UiButton
        >
        <output :aria-label="`Current ${label}`" aria-live="polite" aria-atomic="true">
          <UiScrambleText
            :text="String(modelValue)"
            :duration="animateValue ? 400 : 0"
            :replay-key="replayKey"
            symbols="0123456789"
          />
        </output>
        <UiButton
          v-if="max === undefined || modelValue < max"
          class="increase"
          appearance="icon"
          variant="secondary"
          :aria-label="`Increase ${label}`"
          @click="step(1)"
          >+</UiButton
        >
      </div>
      <span class="limit" :aria-label="`${max === undefined ? 'Minimum' : 'Maximum'} ${label}`">
        <UiScrambleText :text="String(max ?? min)" :duration="400" symbols="0123456789" />
      </span>
      <div class="captions" aria-hidden="true">
        <span>Current</span>
        <span>{{ max === undefined ? 'Min' : 'Max' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stepper {
  display: grid;
  --control-height: 2rem;
  --button-icon-size: 1.5rem;
  --button-font-size: 0.75rem;
}
.bubble {
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  height: var(--mothership-stat-diameter, 3.5rem);
  padding-inline: var(--space-1);
  border: var(--theme-panel-border-width) solid var(--color-text);
  border-radius: 2rem;
  background: var(--color-surface);
}
.current-value {
  display: grid;
  grid-template-columns: 0.875rem 2ch 0.875rem;
  align-items: center;
  justify-content: center;
  min-width: 0;
  font-size: 1.375rem;
}
.decrease,
.increase {
  border-radius: 0;
  justify-self: center;
  transition: none;
}
@media (forced-colors: none) {
  .stepper .current-value button:enabled:is(:hover, :focus-visible, :active) {
    color: var(--mothership-crt-green);
    background: transparent;
    box-shadow: none;
    animation: none;
  }
}
.stepper .current-value button:enabled:is(:hover, :focus-visible, :active) :deep(.button-text) {
  transform: scale(1.35);
}
.decrease {
  grid-column: 1;
  grid-row: 1;
}
output {
  grid-column: 2;
  grid-row: 1;
}
.increase {
  grid-column: 3;
  grid-row: 1;
}
output,
.limit {
  min-width: 0;
  font-size: 1.375rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: center;
}
.captions {
  position: absolute;
  inset-inline: var(--space-1);
  top: calc(50% + var(--space-3));
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1;
  text-align: center;
}
</style>
