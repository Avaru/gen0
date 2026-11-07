<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { availableCategories, generateNames } from '@/generator/categories'
import type { Generated } from '@/patterns/types'
import { useGeneratorSettings } from '@/composables/useGeneratorSettings'
import GeneratorControls from '@/components/generator/GeneratorControls.vue'
import GeneratorResults from '@/components/generator/GeneratorResults.vue'
import UiWorkspace from '@/components/ui/UiWorkspace.vue'
import { rollMothershipCharacter } from '@/patterns/mothership/stats'
import type { MothershipSheet } from '@/helper/mothershipCharacterLink'
import { useMothershipCharacterUrl } from '@/composables/useMothershipCharacterUrl'
import UiMothershipMiniSheet from '@/components/ui/UiMothershipMiniSheet.vue'
import UiMothershipSheet from '@/components/ui/UiMothershipSheet.vue'

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
const detailedSheet = useTemplateRef<InstanceType<typeof UiMothershipSheet>>('detailedSheet')
const sourceResult = ref<Generated>()
const sourceSheet = ref<MothershipSheet>()
const openResult = computed<Generated | undefined>(() =>
  miniSheet.value
    ? {
        primary: miniSheet.value.primary,
        pronouns: miniSheet.value.pronouns,
        secondary: miniSheet.value.mothershipCharacter.characterClass,
        mothershipClass: miniSheet.value.mothershipCharacter.characterClass,
        appearance: miniSheet.value.appearance,
        details: miniSheet.value.details,
      }
    : undefined,
)
// Keep a restored character in the list so its document action remains available.
const visibleResults = computed(() => {
  if (!openResult.value) return results.value
  const index =
    sourceSheet.value === miniSheet.value && sourceResult.value
      ? results.value.indexOf(sourceResult.value)
      : -1
  if (index < 0) return [openResult.value, ...results.value]
  return results.value.map((result, position) => (position === index ? openResult.value! : result))
})
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
const characterUrlError = useMothershipCharacterUrl(miniSheet)

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

async function openMothershipSheet(result: Generated, focusCard = true) {
  if (!result.mothershipClass) return
  sourceResult.value = result === openResult.value ? sourceResult.value : result
  miniSheet.value = {
    primary: result.primary,
    pronouns: result.pronouns,
    appearance: result.appearance,
    details: result.details,
    mothershipCharacter: rollMothershipCharacter(result.mothershipClass),
  }
  sourceSheet.value = miniSheet.value
  await nextTick()
  if (focusCard) sidebar.value?.querySelector<HTMLElement>('#mothership-mini-sheet')?.focus()
}
async function openMothershipDetails(result: Generated) {
  if (result !== openResult.value) await openMothershipSheet(result, false)
  await nextTick()
  await detailedSheet.value?.showModal()
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
      <p v-if="characterUrlError" role="alert">{{ characterUrlError }}</p>
      <UiMothershipMiniSheet v-if="miniSheet?.mothershipCharacter" v-model="miniSheet" />
    </div>
    <GeneratorResults
      ref="resultList"
      :results="visibleResults"
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
  <UiMothershipSheet v-if="miniSheet" ref="detailedSheet" v-model="miniSheet" />
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
