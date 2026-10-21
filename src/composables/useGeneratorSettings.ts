import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  normalizeGeneratorSettings,
  settingsQuery,
  matchesSettingsQuery,
  settingsFromRoute,
  settingsPath,
  type GeneratorSettings,
} from '@/generator/settings'

export function useGeneratorSettings() {
  const route = useRoute()
  const router = useRouter()
  const settings = computed(() => settingsFromRoute(route))

  // Replace incomplete links without adding an extra browser-history entry.
  watch(
    () => route.fullPath,
    () => {
      if (
        route.path === '/chars/cbrpnk' ||
        route.matched.some((record) => record.path.endsWith('/about'))
      )
        return
      const query = settingsQuery(settings.value)
      const path = settingsPath(settings.value)
      if (route.path !== path || !matchesSettingsQuery(route.query, query))
        void router.replace({ path, query })
    },
    { immediate: true },
  )

  function update(patch: Partial<GeneratorSettings>) {
    const next = normalizeGeneratorSettings({ ...settings.value, ...patch })
    return router.push({ path: settingsPath(next), query: settingsQuery(next) })
  }

  return { settings, update }
}
