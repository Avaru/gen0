import { nationalName } from '@/patterns/cyberpunk/nationality/nameParts'
import { namingTraditions } from '@/patterns/cyberpunk/nationality/traditions'
import { givenNameGenders, normalizeSelections, type GenerationOptions } from '@/generator/options'
import { neverMidnightJobs } from '@/data/never-midnight-jobs'
import { capitalize } from '@/helper/capitalize'
import { rng } from '@/helper/rng'
import { randomFrom } from '@/helper/randomFrom'
import { neverMidnightLooks } from './looks'
import type { Generated } from '@/patterns/types'

export const countries = ['german', 'russian', 'polish'] as const
export { namingTraditions }

/** Reuse personal-name rules, with a uniformly selected adult age. */
export function countryName(
  country: (typeof countries)[number],
  options: GenerationOptions = {},
): Generated {
  const age = 18 + Math.floor(rng() * 48)
  const gender = options.genders
    ? randomFrom(normalizeSelections(options.genders, givenNameGenders))
    : options.genus
  return {
    primary: nationalName(country, gender, undefined, options),
    age: `${age} years`,
    appearance: capitalize(neverMidnightLooks(options)),
    secondary: capitalize(randomFrom(neverMidnightJobs)),
  }
}
