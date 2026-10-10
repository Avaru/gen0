<script setup lang="ts">
import { computed } from 'vue'
import { GENUS } from '@/builders/types'
import { categories } from '@/generator/categories'
import { flavors } from '@/generator/options'
import { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'
import type { GeneratorSettings } from '@/composables/useGeneratorSettings'
import UiButton from '@/components/ui/UiButton.vue'
import UiField from '@/components/ui/UiField.vue'
import UiSegments from '@/components/ui/UiSegments.vue'
import UiChecks from '@/components/ui/UiChecks.vue'
import UiToggle from '@/components/ui/UiToggle.vue'

const props = defineProps<{ settings: GeneratorSettings; busy: boolean }>()
const emit = defineEmits<{
  update: [patch: Partial<GeneratorSettings>]
  generate: []
}>()
const category = computed(() => categories.find((item) => item.id === props.settings.category))
const available = computed(() =>
  categories.filter((item) => !item.requiresFlavor || props.settings.flavor !== 'cyberpunk'),
)
const groups = [...new Set(categories.map((item) => item.group))]
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
    <UiField label="Category" for-id="category">
      <select
        id="category"
        :value="settings.category"
        @change="emit('update', { category: ($event.target as HTMLSelectElement).value })"
      >
        <optgroup v-for="group in groups" :key="group" :label="group">
          <option
            v-for="item in available.filter((item) => item.group === group)"
            :key="item.id"
            :value="item.id"
          >
            {{ item.label }}
          </option>
        </optgroup>
      </select>
    </UiField>
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
}
</style>
