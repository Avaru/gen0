<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { availableCategories, generateNames } from '@/generator/categories'
import type { Generated } from '@/patterns/types'
import { useGeneratorSettings } from '@/composables/useGeneratorSettings'
import GeneratorControls from '@/components/generator/GeneratorControls.vue'
import GeneratorResults from '@/components/generator/GeneratorResults.vue'
import UiWorkspace from '@/components/ui/UiWorkspace.vue'
import { useRouter } from 'vue-router'
import {
  generateMothershipSheet,
  generateMothershipMiniSheet,
} from '@/patterns/mothership/character'
import { encodeMothershipCharacter } from '@/helper/mothershipCharacterLink'
import type { MothershipSheet } from '@/helper/mothershipCharacterLink'
import UiMothershipMiniSheet from '@/components/ui/UiMothershipMiniSheet.vue'

const { settings, update } = useGeneratorSettings()
const showDetails = inject('showDetails', ref(true))
const resultList = useTemplateRef<InstanceType<typeof GeneratorResults>>('resultList')
const category = computed(() =>
  availableCategories({ setting: settings.value.setting, flavor: settings.value.flavor }).find(
    (item) => item.id === settings.value.category,
  ),
)
const results = ref<Generated[]>([])
const sidebar = useTemplateRef<HTMLElement>('sidebar')
const miniSheet = ref<MothershipSheet>()
const router = useRouter()
const sourceResult = ref<Generated>()
const error = ref('')
const busy = ref(false)
let request = 0
onBeforeUnmount(() => {
  request++
})
watch(
  [
    () => settings.value.setting,
    () => settings.value.flavor,
    () => settings.value.category,
    () => settings.value.gender.join(','),
    () => settings.value.size.join(','),
  ],
  () => {
    request++
    results.value = []
    miniSheet.value = undefined
    error.value = ''
    busy.value = false
    void generate()
  },
  { immediate: true, flush: 'sync' },
)

async function generate(append = false, revealFirstName = false) {
  if (busy.value) return
  if (!append) miniSheet.value = undefined
  const current = ++request
  busy.value = true
  error.value = ''
  const selection = settings.value
  try {
    // Flush the busy state before local calculation.
    await nextTick()
    if (current !== request) return
    const generated = generateNames(selection.category, append ? 20 : 10, {
      setting: selection.setting,
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

async function openMothershipSheet(result: Generated) {
  if (!result.mothershipClass) return
  sourceResult.value = result
  miniSheet.value = generateMothershipMiniSheet(result)
  await nextTick()
  sidebar.value?.querySelector<HTMLElement>('#mothership-mini-sheet')?.focus()
}
async function openMothershipDetails(result: Generated) {
  if (!result.mothershipClass) return
  const sheet =
    sourceResult.value === result && miniSheet.value
      ? miniSheet.value
      : generateMothershipSheet(result)
  await router.push({
    path: '/chars/mothership',
    query: { char: encodeMothershipCharacter(sheet) },
  })
}
</script>
<template>
  <UiWorkspace>
    <div ref="sidebar" class="sidebar">
      <GeneratorControls
        :settings="settings"
        :busy="busy"
        @update="update"
        @generate="generate(false, true)"
      />
      <UiMothershipMiniSheet v-if="miniSheet?.mothershipCharacter" :sheet="miniSheet" />
    </div>
    <GeneratorResults
      ref="resultList"
      :results="results"
      :busy="busy"
      :label="category?.label ?? 'Generated names'"
      :category="settings.category"
      :setting="settings.setting"
      :pending-pools="category?.pendingPools"
      :error="error"
      :show-details="showDetails"
      @update:show-details="showDetails = $event"
      @open-mothership-sheet="openMothershipSheet"
      @open-mothership-details="openMothershipDetails"
      @more="generate(true)"
    />
  </UiWorkspace>
</template>
<style scoped>
.sidebar {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-6);
}
@media (min-width: 56rem) {
  .sidebar {
    gap: var(--space-8);
  }
}
</style>
