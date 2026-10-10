import type { NameGender } from '@/data/nameTypes'
import { categories, availableCategories } from './categories'
import {
  flavors,
  givenNameGenders,
  corporationSizes,
  normalizeSelections,
  type Flavor,
} from './options'
import type { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'

export interface GeneratorSettings {
  flavor: Flavor
  category: string
  gender: NameGender[]
  size: CORPORATION_SIZE[]
  details: boolean
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
  const flavor = flavors.find((item) => item.id === input.flavor)?.id ?? 'cyberpunk'
  const available = availableCategories({ flavor })
  const requested = categories.find((item) => item.id === input.category)
  const fallback = requested?.requiresFlavor ? 'corporations' : 'runners'
  const category =
    available.find((item) => item.id === requested?.id) ??
    available.find((item) => item.id === fallback)
  if (!category) throw new Error('No default category is available.')
  return {
    flavor,
    category: category.id,
    details: input.details !== false && input.details !== 'false',
    gender: category.gender ? parseSelections(input.gender, givenNameGenders) : [],
    size: category.corporationSize ? parseSelections(input.size, corporationSizes) : [],
  }
}

export function settingsQuery(settings: GeneratorSettings): Record<string, string> {
  return {
    flavor: settings.flavor,
    category: settings.category,
    ...(!settings.details ? { details: 'false' } : {}),
    ...(settings.gender.length && settings.gender.length < givenNameGenders.length
      ? { gender: settings.gender.join(',') }
      : {}),
    ...(settings.size.length && settings.size.length < corporationSizes.length
      ? { size: settings.size.join(',') }
      : {}),
  }
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
