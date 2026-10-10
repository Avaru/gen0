import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  normalizeGeneratorSettings,
  settingsQuery,
  matchesSettingsQuery,
  type GeneratorSettings,
} from '@/generator/settings'

export function useGeneratorSettings() {
  const route = useRoute()
  const router = useRouter()
  const settings = computed(() => normalizeGeneratorSettings(route.query))

  // Replace incomplete links without adding an extra browser-history entry.
  watch(
    () => route.query,
    () => {
      const query = settingsQuery(settings.value)
      if (!matchesSettingsQuery(route.query, query)) void router.replace({ query })
    },
    { immediate: true },
  )

  function update(patch: Partial<GeneratorSettings>) {
    const next = normalizeGeneratorSettings({ ...settings.value, ...patch })
    return router.push({ query: settingsQuery(next) })
  }

  return { settings, update }
}
