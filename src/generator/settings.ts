import type { NameGender } from '@/data/nameTypes'
import { availableCategories } from './categories'
import { getSetting, type SettingId } from './settingRegistry'
import { givenNameGenders, corporationSizes, normalizeSelections, type Flavor } from './options'
import type { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface GeneratorSettings {
  setting: SettingId
  flavor: Flavor
  category: string
  gender: NameGender[]
  size: CORPORATION_SIZE[]
}

type SettingsInput = { [Key in keyof GeneratorSettings]?: unknown }

function parseSelections<Value extends string>(
  input: unknown,
  available: readonly Value[],
): Value[] {
  const values = (Array.isArray(input) ? input : [input]).flatMap((item) =>
    typeof item === 'string' ? item.split(',') : [],
  )
  return normalizeSelections(values, available)
}

/** Apply the same defaults and category rules to links and control updates. */
export function normalizeGeneratorSettings(input: SettingsInput): GeneratorSettings {
  const setting = getSetting(input.setting)
  const flavor =
    setting.flavors.find((item) => item.id === input.flavor)?.id ?? setting.defaultFlavor
  const available = availableCategories({ setting: setting.id as SettingId, flavor })
  const requested = setting.categories.find((item) => item.id === input.category)
  const fallback = requested?.fallbackCategory ?? setting.defaultCategory
  const category =
    available.find((item) => item.id === requested?.id) ??
    available.find((item) => item.id === fallback)
  if (!category) throw new Error('No default category is available.')
  return {
    setting: setting.id as SettingId,
    flavor,
    category: category.id,
    gender: category.gender ? parseSelections(input.gender, givenNameGenders) : [],
    size: category.corporationSize ? parseSelections(input.size, corporationSizes) : [],
  }
}

export function settingsQuery(settings: GeneratorSettings): Record<string, string> {
  return {
    ...(settings.gender.length && settings.gender.length < givenNameGenders.length
      ? { gender: settings.gender.join(',') }
      : {}),
    ...(settings.size.length && settings.size.length < corporationSizes.length
      ? { size: settings.size.join(',') }
      : {}),
  }
}

export function settingsFromRoute(route: RouteLocationNormalizedLoaded): GeneratorSettings {
  return normalizeGeneratorSettings({
    ...route.query,
    setting: route.meta.setting ?? route.params.setting ?? route.query.setting,
    flavor: route.meta.flavor ?? route.params.flavor ?? route.query.flavor,
    category: route.params.category ?? route.query.category,
  })
}

export function settingsPath(settings: GeneratorSettings): string {
  return `/settings/${settings.setting}/${settings.flavor}/${settings.category}`
}

/** Compare query contents; their property order has no meaning. */
export function matchesSettingsQuery(
  query: Record<string, unknown>,
  canonical: Record<string, string>,
): boolean {
  return (
    Object.keys(query).length === Object.keys(canonical).length &&
    Object.entries(canonical).every(([key, value]) => query[key] === value)
  )
}
