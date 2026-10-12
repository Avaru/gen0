<script setup lang="ts">
import { ref, watch } from 'vue'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import type { CharacterSheet } from '@/data/characters/types'
import type { Flavor } from '@/generator/options'
import { generateNames } from '@/generator/categories'
import UiButton from './UiButton.vue'
import UiChoicePicker from './UiChoicePicker.vue'
const archetypes = cbrPnkCatalogue.archetypes.map(item => ({ id: item.id, label: item.name, group: '' }))

const props = defineProps<{ flavor: Flavor; canReset: boolean }>()
const runner = defineModel<CharacterSheet['runner']>({ required: true })
const error = ref('')
const confirmingReset = ref(false)
watch(() => props.canReset, (canReset) => {
  if (!canReset) confirmingReset.value = false
})
const emit = defineEmits<{ reset: []; applyArchetype: [] }>()

function reset() {
  confirmingReset.value = false
  emit('reset')
  error.value = ''
}

function generate(archetypeId: string) {
  confirmingReset.value = false
  error.value = ''
  try {
    const result = generateNames('runners', 1, { flavor: props.flavor, runnerArchetypeId: archetypeId })[0]
    if (!result) return
    runner.value = {
      alias: result.primary,
      archetypeId,
      description: [result.details, result.title, result.appearance].filter(Boolean).join('\n'),
    }
    emit('applyArchetype')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not generate a runner.'
  }
}

function regenerate(field: 'alias' | 'description') {
  error.value = ''
  try {
    const result = generateNames('runners', 1, { flavor: props.flavor })[0]
    if (!result) return
    runner.value[field] = field === 'alias'
      ? result.primary
      : [result.details, result.title, result.appearance].filter(Boolean).join('\n')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not generate a runner.'
  }
}
</script>

<template>
  <section class="runner-card" aria-labelledby="runner-heading">
    <header class="runner-header">
      <h2 id="runner-heading">Runner</h2>
      <div class="actions">
        <UiChoicePicker :searchable="false" trigger-id="runner-generate" trigger-label="Generate" label="Archetype" plural="archetypes" :model-value="runner.archetypeId ?? ''" :options="archetypes" @update:model-value="generate" />
        <UiButton v-if="canReset && confirmingReset" variant="destructive" @click="reset">really?</UiButton>
        <UiButton v-if="canReset" variant="secondary" @click="confirmingReset = !confirmingReset">{{ confirmingReset ? 'nah.' : 'Reset' }}</UiButton>
      </div>
    </header>
    <label for="runner-alias">Alias</label>
    <div class="runner-field">
      <span class="print-value">{{ runner.alias }}</span>
      <input id="runner-alias" v-model="runner.alias" type="text" />
      <UiButton class="regenerate" variant="secondary" aria-label="Regenerate alias" title="Regenerate alias" @click="regenerate('alias')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M20 7v5h-5M20 12a8 8 0 1 0-2.3 5.7" />
        </svg>
      </UiButton>
    </div>
    <label for="runner-description">Name &amp; description</label>
    <div class="runner-field">
      <span class="print-value runner-description">{{ runner.description }}</span>
      <textarea id="runner-description" v-model="runner.description" rows="7" />
      <UiButton class="regenerate" variant="secondary" aria-label="Regenerate name and description" title="Regenerate name and description" @click="regenerate('description')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M20 7v5h-5M20 12a8 8 0 1 0-2.3 5.7" />
        </svg>
      </UiButton>
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
  </section>
</template>

<style scoped>
.runner-card {
  position: relative;
  display: grid;
  gap: var(--space-2);
  min-width: 0;
  padding: var(--space-4);
  color: var(--color-text);
  background: var(--theme-panel-fill);
  background-image: var(--theme-panel-texture);
  border: var(--theme-panel-border-width) solid var(--color-border);
  border-top: var(--theme-panel-rule-width) solid var(--color-signal);
  box-shadow: var(--theme-panel-shadow);
  border-radius: var(--radius-lg);
}
.runner-card::after {
  content: '';
  position: absolute;
  top: 7px;
  right: var(--space-3);
  width: 3rem;
  height: 5px;
  background: var(--theme-panel-edge);
  pointer-events: none;
}
.runner-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}
h2 {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 5vw, 2rem);
  font-weight: var(--theme-heading-weight);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--theme-title-color);
  text-shadow: var(--theme-heading-shadow);
  overflow-wrap: anywhere;
}
label {
  font-family: var(--font-display);
  font-size: var(--font-small-control-size);
  text-transform: uppercase;
}
.runner-field {
  position: relative;
  min-width: 0;
}
.runner-field > .regenerate {
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
}
.runner-field > .regenerate::before,
.runner-field > .regenerate::after {
  display: none;
}
.runner-card .runner-field > .regenerate:hover:enabled,
.runner-card .runner-field > .regenerate:active:enabled {
  background: transparent;
  color: var(--color-accent);
}
@media print {
  .regenerate {
    display: none !important;
  }
}
input,
textarea {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: var(--space-2);
  padding-right: calc(44px + var(--space-2));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
}
textarea {
  resize: vertical;
}
.actions {
  display: flex;
  margin-left: auto;
  gap: var(--space-2);
}
.actions :deep(button.primary),
.actions > button {
  flex: 0 0 auto;
  min-height: 44px;
  padding-inline: var(--space-2);
  font-size: 0.875rem;
  white-space: nowrap;
}
</style>
