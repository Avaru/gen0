import { randomGenus } from '@/helper/randomGenus'
import { randomFrom } from '@/helper/randomFrom'
import type { GenerationOptions } from '@/generator/options'
import type { Generated } from '@/patterns/types'
import { load, RL } from '@/load'
import { characters } from '../_secondary/charakters'
import { NATIONALITY } from './byNationality'
import { nationalName, type NameNationality } from './nameParts'

const traditions: NameNationality[] = [...Object.values(NATIONALITY), 'arabic']

/** Mix two naming traditions while keeping one coherent surname structure. */
export function mixedName(genus = randomGenus(true), options: GenerationOptions = {}): string {
  const entries = load(RL.NAMES_MODERN, options).filter((bit) => !bit.genus || bit.genus === genus)
  const givenSources = traditions.filter((nation) =>
    entries.some((bit) => bit.type === 'given' && bit.tags.includes(nation)),
  )
  const familySources = traditions.filter(
    (nation) =>
      entries.some((bit) => bit.type === 'family' && bit.tags.includes(nation)) &&
      givenSources.some((givenNation) => givenNation !== nation),
  )
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
