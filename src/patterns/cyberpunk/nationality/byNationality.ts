import type { GenerationOptions } from '@/generator/options'
import { randomGenus } from '@/helper/randomGenus'
import { type Generated } from '@/patterns/types'
import { characters } from '../people/jobs'
import { nationalName } from './nameParts'
import type { NameNationality } from './traditions'
import type { NameGender } from '@/data/nameTypes'

export function genericNationality(
  nation: NameNationality,
  genus: NameGender = randomGenus(true),
  nickname?: string,
  options: GenerationOptions = {},
): Generated {
  return {
    primary: nationalName(nation, genus, nickname, options),
    ...characters(true, undefined, options),
  }
}
