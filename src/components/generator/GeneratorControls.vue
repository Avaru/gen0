<script setup lang="ts">
import { computed, ref } from 'vue'
import { GENUS } from '@/builders/types'
import { availableCategories } from '@/generator/categories'
import { flavors } from '@/generator/options'
import { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'
import type { GeneratorSettings } from '@/generator/settings'
import UiButton from '@/components/ui/UiButton.vue'
import UiCategoryPicker from '@/components/ui/UiCategoryPicker.vue'
import UiSegments from '@/components/ui/UiSegments.vue'
import UiChecks from '@/components/ui/UiChecks.vue'

const props = defineProps<{ settings: GeneratorSettings; busy: boolean }>()
const emit = defineEmits<{
  update: [patch: Partial<GeneratorSettings>]
  generate: []
}>()
const generationClicks = ref(0)
function generate() {
  if (props.busy) return
  generationClicks.value++
  emit('generate')
}
const available = computed(() => availableCategories({ flavor: props.settings.flavor }))
const category = computed(() => available.value.find((item) => item.id === props.settings.category))
const flavorOptions = flavors.map((item) => ({ value: item.id, label: item.label }))
const genderOptions = [
  { value: GENUS.M, label: 'Masculine' },
  { value: GENUS.F, label: 'Feminine' },
] as const
const sizeOptions = [
  { value: CORPORATION_SIZE.A, label: 'Minor' },
  { value: CORPORATION_SIZE.AA, label: 'Large (AA)' },
  { value: CORPORATION_SIZE.AAA, label: 'Mega (AAA)' },
]
</script>

<template>
  <form aria-label="Generator settings" @submit.prevent="generate">
    <UiSegments
      :model-value="settings.flavor"
      label="Flavor"
      name="flavor"
      :options="flavorOptions"
      @update:model-value="emit('update', { flavor: $event })"
    />
    <UiCategoryPicker
      :model-value="settings.category"
      :options="available"
      @update:model-value="emit('update', { category: $event })"
    />
    <p v-if="category?.pendingPools?.length">
      Some name pools are still TODO: {{ category.pendingPools.join(', ') }}.
    </p>
    <p v-if="category?.coverage">{{ category.coverage }}</p>
    <UiChecks
      v-if="category?.gender"
      :model-value="settings.gender"
      label="Given names"
      name="gender"
      :options="genderOptions"
      @update:model-value="emit('update', { gender: $event })"
    />
    <UiChecks
      v-if="category?.corporationSize"
      :model-value="settings.size"
      label="Corporation size"
      name="size"
      :options="sizeOptions"
      @update:model-value="emit('update', { size: $event })"
    />
    <UiButton type="submit" :disabled="busy" :aria-busy="busy" :activation="generationClicks">
      Generate names
    </UiButton>
  </form>
</template>

<style scoped>
form {
  position: relative;
  display: grid;
  gap: var(--space-6);
  padding: var(--space-6);
  background: var(--theme-panel-fill);
  background-image: var(--theme-panel-texture);
  border-top: var(--theme-panel-rule-width) solid var(--color-hot);
  box-shadow: var(--theme-panel-shadow);
}
form::after {
  content: '';
  position: absolute;
  top: 7px;
  right: var(--space-3);
  width: 3rem;
  height: 5px;
  background: var(--theme-panel-edge);
  pointer-events: none;
}
@media (max-width: 24rem) {
  form {
    padding: var(--space-4);
  }
}
</style>
