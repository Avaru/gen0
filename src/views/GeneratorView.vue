<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { categories, generateNames } from '@/generator/categories'
import type { Generated } from '@/patterns/types'
import { useGeneratorSettings } from '@/composables/useGeneratorSettings'
import GeneratorControls from '@/components/generator/GeneratorControls.vue'
import GeneratorResults from '@/components/generator/GeneratorResults.vue'
import UiWorkspace from '@/components/ui/UiWorkspace.vue'

const { settings, update } = useGeneratorSettings()
const category = computed(() => categories.find((item) => item.id === settings.value.category))
const results = ref<Generated[]>([])
const error = ref('')
const busy = ref(false)
let request = 0
watch(
  () =>
    JSON.stringify([
      settings.value.flavor,
      settings.value.category,
      settings.value.gender,
      settings.value.size,
    ]),
  () => {
    request++
    results.value = []
    error.value = ''
    busy.value = false
    void generate()
  },
  { immediate: true },
)
async function generate(append = false) {
  if (busy.value) return
  const current = ++request
  busy.value = true
  error.value = ''
  const selection = settings.value
  try {
    const generated = await generateNames(selection.category, 10, {
      flavor: selection.flavor,
      genders: selection.gender,
      corporationSizes: selection.size,
    })
    if (current === request) results.value = append ? [...results.value, ...generated] : generated
  } catch (cause) {
    if (current === request)
      error.value = cause instanceof Error ? cause.message : 'Could not generate names.'
  } finally {
    if (current === request) busy.value = false
  }
}
</script>
<template>
  <UiWorkspace>
    <GeneratorControls :settings="settings" :busy="busy" @update="update" @generate="generate()" />
    <GeneratorResults
      :results="results"
      :busy="busy"
      :label="category?.label ?? 'Generated names'"
      :error="error"
      :show-details="settings.details"
      @more="generate(true)"
    />
  </UiWorkspace>
</template>
