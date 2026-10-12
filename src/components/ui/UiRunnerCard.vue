<script setup lang="ts">
import { ref } from 'vue'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import type { CharacterSheet } from '@/data/characters/types'
import type { Flavor } from '@/generator/options'
import { generateNames } from '@/generator/categories'
import UiButton from './UiButton.vue'
import UiChoicePicker from './UiChoicePicker.vue'
const archetypes = cbrPnkCatalogue.archetypes.map(item => ({ id: item.id, label: item.name, group: '' }))

const props = defineProps<{ flavor: Flavor }>()
const runner = defineModel<CharacterSheet['runner']>({ required: true })
const error = ref('')
const emit = defineEmits<{ reset: []; applyArchetype: [] }>()

function reset() {
  emit('reset')
  error.value = ''
}

function generate(archetypeId: string) {
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
</script>

<template>
  <section class="runner-card" aria-labelledby="runner-heading">
    <header class="runner-header">
      <h2 id="runner-heading">Runner</h2>
      <div class="actions">
        <UiChoicePicker :searchable="false" trigger-id="runner-generate" trigger-label="Generate" label="Archetype" plural="archetypes" :model-value="runner.archetypeId ?? ''" :options="archetypes" @update:model-value="generate" />
        <UiButton variant="secondary" @click="reset">Reset</UiButton>
      </div>
    </header>
    <label for="runner-alias">Alias</label>
    <input id="runner-alias" v-model="runner.alias" type="text" />
    <label for="runner-description">Name &amp; description</label>
    <textarea id="runner-description" v-model="runner.description" rows="5" />
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
input,
textarea {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: var(--space-2);
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
