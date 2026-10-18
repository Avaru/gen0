<script setup lang="ts">
import UiSheetSymbol from './UiSheetSymbol.vue'
import UiSheetField from './UiSheetField.vue'
import UiSheetCard from './UiSheetCard.vue'
import type { CharacterSheet } from '@/data/characters/types'
import UiToggle from './UiToggle.vue'
import UiButton from './UiButton.vue'
import { ref } from 'vue'
import { generateNames } from '@/generator/categories'
import type { Flavor } from '@/generator/options'

const props = withDefaults(defineProps<{ flavor?: Flavor }>(), { flavor: 'cyberpunk' })
const error = ref('')
function regenerate(index: number) {
  error.value = ''
  try {
    const result = generateNames('augmentations', 1, { flavor: props.flavor })[0]
    if (!result) return
    augmentations.value[index]!.description = [result.primary, result.details]
      .filter(Boolean)
      .join(' · ')
      .replace(/\n/g, ' · ')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not generate an augmentation.'
  }
}

const augmentations = defineModel<CharacterSheet['augmentations']>({ required: true })
</script>

<template>
  <UiSheetCard
    class="augmentations-card"
    title="Augmentations"
    heading-id="augmentations-heading"
    edge="hot"
  >
    <div class="rules">
      <p>
        Mark <UiSheetSymbol kind="stress" label="stress" /> to activate an enhanced capability
        <em>(e.g. therma-vision, wired reflexes, augmented strength)</em> or produce/conceal an
        specific compact asset <em>(chemicals, blade, nanobots)</em>. Can be combined with a
        <strong>Push</strong>.
      </p>
      <p>
        Mark <strong>Special Resistance</strong> to wield it against a fitting type of Consequence
        <em
          >(e.g. neural firewall, behavioral analyzer, toxin neutralizer, fireproof coating,
          etc)</em
        >.
      </p>
      <p>
        <em
          >you may declare additional Augmentations or extra functionalities of existing ones as
          <strong>UPGRADES</strong></em
        >
      </p>
    </div>
    <div
      v-for="(augmentation, index) in augmentations"
      :key="index"
      class="augmentation-row"
      :class="{ glitched: augmentation.glitched }"
    >
      <div class="augmentation-field">
        <UiSheetField
          v-model="augmentation.description"
          multiline
          :rows="1"
          :filled="!!augmentation.description.trim()"
          :aria-label="`Augmentation ${index + 1}`"
        />
        <UiButton
          class="regenerate"
          variant="secondary"
          :aria-label="`Regenerate augmentation ${index + 1}`"
          :title="`Regenerate augmentation ${index + 1}`"
          @click="regenerate(index)"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M20 7v5h-5M20 12a8 8 0 1 0-2.3 5.7" />
          </svg>
        </UiButton>
      </div>
      <UiToggle
        v-model="augmentation.glitched"
        label="Glitched"
        hazard
        :input-label="`Augmentation ${index + 1} glitched`"
      />
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
  </UiSheetCard>
</template>

<style scoped>
.rules p + p {
  margin-top: var(--space-2);
}
strong {
  text-transform: uppercase;
}
.augmentation-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--space-2);
  padding-block: var(--space-4);
  transition: var(--control-color-transition);
}

.augmentation-field {
  --regenerate-width: 1.75rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--regenerate-width);
  align-items: start;
  gap: var(--space-1);
  min-width: 0;
}
.regenerate {
  display: grid;
  place-items: center;
  width: var(--regenerate-width);
  height: var(--control-height);
  padding: 0;
  border: 0;
  background: transparent;
}
.regenerate::before,
.regenerate::after {
  display: none;
}
.regenerate :deep(.button-text) {
  display: grid;
  place-items: center;
}
@media print {
  .augmentation-field {
    display: block;
  }
  .regenerate {
    display: none !important;
  }
}
.glitched {
  color: var(--color-hot);
}

.augmentation-row :deep(textarea.sheet-field) {
  display: block;
  field-sizing: content;
  line-height: 1.1;
  padding-block: max(var(--space-2), calc((var(--control-height) - 1.1em - 2px) / 2));
}

@media (max-width: 40rem) {
  .augmentation-row {
    grid-template-columns: minmax(0, 1fr);
  }
  .augmentation-row > :last-child {
    grid-column: 1;
    justify-self: end;
  }
}
</style>
