import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { GENUS } from '@/builders/types'
import { categories } from '@/generator/categories'
import { flavors, givenNameGenders, corporationSizes, normalizeSelections, type Flavor } from '@/generator/options'
import type { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'

export interface GeneratorSettings {
  flavor: Flavor
  category: string
  gender: GENUS[]
  size: CORPORATION_SIZE[]
  details: boolean
}

function parseSelections<T extends string>(value: unknown, available: readonly T[]): T[] {
  const parts = (Array.isArray(value) ? value : [value])
    .flatMap((item) => typeof item === 'string' ? item.split(',') : [])
  return normalizeSelections(parts, available)
}

export function useGeneratorSettings() {
  const route = useRoute()
  const router = useRouter()
  const settings = computed<GeneratorSettings>(() => {
    const flavor = flavors.find((item) => item.id === route.query.flavor)?.id ?? 'cyberpunk'
    const available = categories.filter((item) => !item.requiresFlavor || flavor !== 'cyberpunk')
    const requested = categories.find((item) => item.id === route.query.category)
    const category =
      available.find((item) => item.id === requested?.id) ??
      categories.find(
        (item) => item.id === (requested?.requiresFlavor ? 'corporations' : 'runners'),
      )!
    return {
      flavor,
      category: category.id,
      details: route.query.details !== 'false',
      gender: category.gender ? parseSelections(route.query.gender, givenNameGenders) : [],
      size: category.corporationSize ? parseSelections(route.query.size, corporationSizes) : [],
    }
  })

  function queryFor(value: GeneratorSettings) {
    return {
      flavor: value.flavor,
      category: value.category,
      ...(!value.details ? { details: 'false' } : {}),
      ...(value.gender.length && value.gender.length < givenNameGenders.length
        ? { gender: value.gender.join(',') } : {}),
      ...(value.size.length && value.size.length < corporationSizes.length
        ? { size: value.size.join(',') } : {}),
    }
  }

  // Normalize incomplete or unsupported links, including flavor-only categories.
  watch(
    () => route.query,
    () => {
      const query = queryFor(settings.value)
      if (JSON.stringify(route.query) !== JSON.stringify(query)) void router.replace({ query })
    },
    { immediate: true },
  )

  function update(patch: Partial<GeneratorSettings>) {
    const next = { ...settings.value, ...patch }
    const category = categories.find((item) => item.id === next.category)
    if (category?.requiresFlavor && next.flavor === 'cyberpunk') next.category = 'corporations'
    const selected = categories.find((item) => item.id === next.category)
    next.gender = selected?.gender ? normalizeSelections(next.gender, givenNameGenders) : []
    next.size = selected?.corporationSize ? normalizeSelections(next.size, corporationSizes) : []
    return router.push({ query: queryFor(next) })
  }

  return { settings, update }
}
