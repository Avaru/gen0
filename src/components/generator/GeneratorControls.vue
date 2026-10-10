<script setup lang="ts">
import { computed } from 'vue'
import { GENUS } from '@/builders/types'
import { availableCategories } from '@/generator/categories'
import { flavors } from '@/generator/options'
import { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'
import type { GeneratorSettings } from '@/composables/useGeneratorSettings'
import UiButton from '@/components/ui/UiButton.vue'
import UiCategoryPicker from '@/components/ui/UiCategoryPicker.vue'
import UiSegments from '@/components/ui/UiSegments.vue'
import UiChecks from '@/components/ui/UiChecks.vue'
import UiToggle from '@/components/ui/UiToggle.vue'

const props = defineProps<{ settings: GeneratorSettings; busy: boolean }>()
const emit = defineEmits<{
  update: [patch: Partial<GeneratorSettings>]
  generate: []
}>()
const available = computed(() =>
  availableCategories({ flavor: props.settings.flavor }),
)
const category = computed(() => available.value.find((item) => item.id === props.settings.category))
const flavorOptions = flavors.map((item) => ({ value: item.id, label: item.label }))
const genderOptions = [
  { value: GENUS.M, label: 'Masculine' },
  { value: GENUS.F, label: 'Feminine' },
]
const sizeOptions = [
  { value: CORPORATION_SIZE.A, label: 'Minor' },
  { value: CORPORATION_SIZE.AA, label: 'Large (AA)' },
  { value: CORPORATION_SIZE.AAA, label: 'Mega (AAA)' },
]
</script>

<template>
  <form aria-label="Generator settings" @submit.prevent="emit('generate')">
    <UiSegments
      :model-value="settings.flavor"
      label="Flavor"
      name="flavor"
      :options="flavorOptions"
      @update:model-value="emit('update', { flavor: $event as GeneratorSettings['flavor'] })"
    />
    <UiCategoryPicker
      :model-value="settings.category"
      :options="available"
      @update:model-value="emit('update', { category: $event })"
    />
    <p v-if="category?.pendingPools?.length">
      Some name pools are still TODO: {{ category.pendingPools.join(', ') }}.
    </p>
    <UiChecks
      v-if="category?.gender"
      :model-value="settings.gender"
      label="Given names"
      name="gender"
      :options="genderOptions"
      @update:model-value="emit('update', { gender: $event as GeneratorSettings['gender'] })"
    />
    <UiChecks
      v-if="category?.corporationSize"
      :model-value="settings.size"
      label="Corporation size"
      name="size"
      :options="sizeOptions"
      @update:model-value="emit('update', { size: $event as GeneratorSettings['size'] })"
    />
    <UiToggle
      :model-value="settings.details"
      label="Show details"
      @update:model-value="emit('update', { details: $event })"
    />
    <UiButton type="submit" :disabled="busy">{{
      busy ? 'Generating…' : 'Generate names'
    }}</UiButton>
  </form>
</template>

<style scoped>
form {
  display: grid;
  gap: var(--space-6);
  padding: var(--space-6);
  background: var(--color-surface);
  border-top: 5px solid var(--color-hot);
  box-shadow: var(--theme-panel-shadow);
}
@media (max-width: 24rem) {
  form {
    padding: var(--space-4);
  }
}
</style>
