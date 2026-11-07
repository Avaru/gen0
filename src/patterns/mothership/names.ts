import { getNamePools } from '@/builders/namePools'
import { mothershipPatches } from '@/data/mothership-patches'
import { mothershipTrinkets } from '@/data/mothership-trinkets'
import { givenNameGenders, normalizeSelections, type GenerationOptions } from '@/generator/options'
import { randomFrom } from '@/helper/randomFrom'
import { randomGenus } from '@/helper/randomGenus'
import { canComposeName } from '@/patterns/cyberpunk/nationality/availability'
import { nationalName } from '@/patterns/cyberpunk/nationality/nameParts'
import { traditionIds } from '@/patterns/cyberpunk/nationality/traditions'
import { givenName } from '@/patterns/cyberpunk/people/names'
import type { Generated } from '@/patterns/types'
import { rollMothershipCharacter } from './stats'

export function genericName(options: GenerationOptions): Generated {
  const gender = options.genders
    ? randomFrom(normalizeSelections(options.genders, givenNameGenders))
    : (options.genus ?? randomGenus(true))
  const pools = getNamePools(options)
  const tradition = randomFrom(traditionIds.filter((id) => canComposeName(pools, id, gender)))
  return {
    primary: nationalName(tradition, gender, undefined, options),
    mothershipCharacter: rollMothershipCharacter(),
    details: `Trinket: ${randomFrom(mothershipTrinkets)} · Patch: ${randomFrom(mothershipPatches)}`,
  }
}

export function shipName(options: GenerationOptions): Generated {
  return { primary: givenName(options), details: 'ship' }
}
