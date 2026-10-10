<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { availableCategories, generateNames } from '@/generator/categories'
import type { Generated } from '@/patterns/types'
import { useGeneratorSettings } from '@/composables/useGeneratorSettings'
import GeneratorControls from '@/components/generator/GeneratorControls.vue'
import GeneratorResults from '@/components/generator/GeneratorResults.vue'
import UiWorkspace from '@/components/ui/UiWorkspace.vue'
import type { GeneratorSettings } from '@/generator/settings'

const { settings, update } = useGeneratorSettings()
const controls = useTemplateRef<InstanceType<typeof GeneratorControls>>('controls')
const resultList = useTemplateRef<InstanceType<typeof GeneratorResults>>('resultList')
async function updateSettings(patch: Partial<GeneratorSettings>) {
  await update(patch)
  if (patch.category !== undefined && !window.matchMedia('(min-width: 56rem)').matches) {
    await nextTick()
    // Let the native dialog finish restoring focus and release the page's scroll lock.
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    controls.value?.scrollToGenerate()
  }
}
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
  const firstAddition = results.value.length
  try {
    // Flush the busy state before local calculation.
    await nextTick()
    if (current !== request) return
    const generated = generateNames(selection.category, 10, {
      flavor: selection.flavor,
      genders: selection.gender,
      corporationSizes: selection.size,
    })
    if (current === request) {
      results.value = append ? [...results.value, ...generated] : generated
      if ((append || revealFirstName) && generated.length) {
        await nextTick()
        if (current === request) {
          if (append) resultList.value?.scrollToResult(firstAddition)
          else resultList.value?.revealFirstName()
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
    <GeneratorControls ref="controls" :settings="settings" :busy="busy" @update="updateSettings" @generate="generate(false, true)" />
    <GeneratorResults
      ref="resultList"
      :results="results"
      :busy="busy"
      :label="category?.label ?? 'Generated names'"
      :error="error"
      :show-details="settings.details"
      @more="generate(true)"
    />
  </UiWorkspace>
</template>
