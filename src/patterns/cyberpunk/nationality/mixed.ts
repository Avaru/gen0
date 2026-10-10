import { randomGenus } from '@/helper/randomGenus'
import { randomFrom } from '@/helper/randomFrom'
import type { GenerationOptions } from '@/generator/options'
import type { Generated } from '@/patterns/types'
import { getNamePools, type NamePools } from '@/builders/namePools'
import type { NameGender } from '@/data/nameTypes'
import { characters } from '../_secondary/characters'
import { nationalName } from './nameParts'
import { traditionIds, type NameNationality } from './traditions'
import { canComposeName } from './availability'

type MixedSource = { family: NameNationality; given: NameNationality[] }
const sources = new WeakMap<NamePools, Map<NameGender, MixedSource[]>>()

/** Choose a surname tradition uniformly, then a compatible different given tradition. */
export function mixedName(
  genus: NameGender = randomGenus(true),
  options: GenerationOptions = {},
): string {
  const pools = getNamePools(options)
  const byGender = sources.get(pools) ?? new Map<NameGender, MixedSource[]>()
  let available = byGender.get(genus)
  if (!available) {
    available = traditionIds
      .map((family) => ({
        family,
        given: traditionIds.filter(
          (given) => given !== family && canComposeName(pools, family, genus, given),
        ),
      }))
      .filter((source) => source.given.length > 0)
    byGender.set(genus, available)
    sources.set(pools, byGender)
  }
  if (!available.length)
    throw new Error(
      'Mixed names need given names and surnames from two different traditions. Adjust the excluded tags or name lists.',
    )
  const source = randomFrom(available)
  return nationalName(source.family, genus, undefined, options, randomFrom(source.given))
}

export function mixed(
  genus: NameGender = randomGenus(true),
  options: GenerationOptions = {},
): Generated {
  return { primary: mixedName(genus, options), ...characters(true, undefined, options) }
}
