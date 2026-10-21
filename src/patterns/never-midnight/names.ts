import { nationalName } from '@/patterns/cyberpunk/nationality/nameParts'
import { namingTraditions } from '@/patterns/cyberpunk/nationality/traditions'
import { givenNameGenders, normalizeSelections, type GenerationOptions } from '@/generator/options'
import { randomFrom } from '@/helper/randomFrom'
import type { Generated } from '@/patterns/types'

export const countries = ['german', 'russian', 'polish'] as const
export { namingTraditions }

/** Reuse personal names without Cyberpunk occupations or character details. */
export function countryName(
  country: (typeof countries)[number],
  options: GenerationOptions = {},
): Generated {
  const gender = options.genders
    ? randomFrom(normalizeSelections(options.genders, givenNameGenders))
    : options.genus
  return { primary: nationalName(country, gender, undefined, options) }
}
