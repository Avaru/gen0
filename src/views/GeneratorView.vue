<script setup lang="ts">
import { computed, inject, nextTick, ref, useTemplateRef, watch } from 'vue'
import { availableCategories, generateNames } from '@/generator/categories'
import type { Generated } from '@/patterns/types'
import { useGeneratorSettings } from '@/composables/useGeneratorSettings'
import GeneratorControls from '@/components/generator/GeneratorControls.vue'
import GeneratorResults from '@/components/generator/GeneratorResults.vue'
import UiWorkspace from '@/components/ui/UiWorkspace.vue'

const { settings, update } = useGeneratorSettings()
const showDetails = inject('showDetails', ref(true))
const resultList = useTemplateRef<InstanceType<typeof GeneratorResults>>('resultList')
const category = computed(() =>
  availableCategories({ flavor: settings.value.flavor }).find(
    (item) => item.id === settings.value.category,
  ),
)
const results = ref<Generated[]>([])
const error = ref('')
const busy = ref(false)
let request = 0
watch(
  [
    () => settings.value.flavor,
    () => settings.value.category,
    () => settings.value.gender.join(','),
    () => settings.value.size.join(','),
  ],
  () => {
    request++
    results.value = []
    error.value = ''
    busy.value = false
    void generate()
  },
  { immediate: true },
)
async function generate(append = false, revealFirstName = false) {
  if (busy.value) return
  const current = ++request
  busy.value = true
  error.value = ''
  const selection = settings.value
  try {
    // Flush the busy state before local calculation.
    await nextTick()
    if (current !== request) return
    const generated = generateNames(selection.category, append ? 20 : 10, {
      flavor: selection.flavor,
      genders: selection.gender,
      corporationSizes: selection.size,
    })
    if (current === request) {
      results.value = append ? [...results.value, ...generated] : generated
      if (revealFirstName && generated.length) {
        await nextTick()
        if (current === request) {
          resultList.value?.revealFirstName()
        }
      }
    }
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
    <GeneratorControls :settings="settings" :busy="busy" @update="update" @generate="generate(false, true)" />
    <GeneratorResults
      ref="resultList"
      :results="results"
      :busy="busy"
      :label="category?.label ?? 'Generated names'"
      :error="error"
      :show-details="showDetails"
      @update:show-details="showDetails = $event"
      @more="generate(true)"
    />
  </UiWorkspace>
</template>
