import { randomGenus } from '@/helper/randomGenus'
import { randomFrom } from '@/helper/randomFrom'
import type { GenerationOptions } from '@/generator/options'
import type { Generated } from '@/patterns/types'
import { getNamePools, type NamePools } from '@/builders/namePools'
import type { GENUS } from '@/builders/types'
import { characters } from '../_secondary/charakters'
import { NATIONALITY } from './byNationality'
import { nationalName, type NameNationality } from './nameParts'

const traditions: NameNationality[] = [...Object.values(NATIONALITY), 'arabic']
type MixedSources = {
  given: NameNationality[]
  family: NameNationality[]
}
const sources = new WeakMap<NamePools, Map<GENUS, MixedSources>>()

/** Mix two naming traditions while keeping one coherent surname structure. */
export function mixedName(genus = randomGenus(true), options: GenerationOptions = {}): string {
  const pools = getNamePools(options)
  const byGender = sources.get(pools) ?? new Map<GENUS, MixedSources>()
  let available = byGender.get(genus)
  if (!available) {
    const given = traditions.filter(nation => pools.get(nation, 'given', genus).length)
    const family = traditions.filter(nation =>
      pools.get(nation, 'family', genus).length && given.some(other => other !== nation),
    )
    available = { given, family }
    byGender.set(genus, available)
    sources.set(pools, byGender)
  }
  const { given: givenSources, family: familySources } = available
  if (!familySources.length)
    throw new Error(
      'Mixed names need given names and surnames from two different traditions. Adjust the excluded tags or name lists.',
    )
  const familyNation = randomFrom(familySources)
  const givenNation = randomFrom(givenSources.filter((nation) => nation !== familyNation))
  return nationalName(familyNation, genus, undefined, options, givenNation)
}

export async function mixed(
  genus = randomGenus(true),
  options: GenerationOptions = {},
): Promise<Generated> {
  return {
    primary: mixedName(genus, options),
    ...(await characters(true, undefined, options)),
  }
}
