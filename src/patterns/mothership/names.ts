import { getNamePools } from '@/builders/namePools'
import { mothershipPatches } from '@/data/mothership-patches'
import { mothershipShipNameCandidates } from '@/data/mothership-ship-name-candidates'
import { mothershipTrinkets } from '@/data/mothership-trinkets'
import { givenNameGenders, normalizeSelections, type GenerationOptions } from '@/generator/options'
import { p } from '@/helper/prob'
import { capitalize } from '@/helper/capitalize'
import { randomFrom } from '@/helper/randomFrom'
import { randomGenus } from '@/helper/randomGenus'
import { canComposeName } from '@/patterns/cyberpunk/nationality/availability'
import { nationalName, nationalityGivenName } from '@/patterns/cyberpunk/nationality/nameParts'
import { traditionIds } from '@/patterns/cyberpunk/nationality/traditions'
import { runnerLooks } from '@/patterns/cyberpunk/runners/looks'
import type { Generated } from '@/patterns/types'
import { mothershipClasses } from '@/data/mothership-classes'
import { formatMothershipShipClass, formatMothershipShipIssues, rollMothershipShip } from './ships'

export function genericName(options: GenerationOptions): Generated {
  const gender = options.genders
    ? randomFrom(normalizeSelections(options.genders, givenNameGenders))
    : (options.genus ?? randomGenus(true))
  const pools = getNamePools(options)
  const tradition = randomFrom(traditionIds.filter((id) => canComposeName(pools, id, gender)))
  const primary = nationalName(tradition, gender, undefined, options)
  const mothershipClass = randomFrom(mothershipClasses)
  return {
    primary,
    secondary: mothershipClass,
    mothershipClass,
    appearance: capitalize(runnerLooks({ ...options, flavor: 'cyberpunk' }).join(', ')),
    details: `Trinket: ${randomFrom(mothershipTrinkets)} · Patch: ${randomFrom(mothershipPatches)}`,
  }
}

function shipPrimaryName(options: GenerationOptions): string {
  if (p()) return randomFrom(mothershipShipNameCandidates)

  const pools = getNamePools(options)
  const traditions = (['british', 'spanish', 'french', 'russian'] as const).filter(
    (tradition) => pools.get(tradition, 'given', 'f').length > 0,
  )
  return nationalityGivenName(randomFrom(traditions), 'f', options)
}

export function shipName(options: GenerationOptions): Generated {
  const primary = shipPrimaryName(options)
  const mothershipShip = rollMothershipShip()
  return {
    primary,
    secondary: formatMothershipShipClass(mothershipShip),
    mothershipShip,
    details: formatMothershipShipIssues(mothershipShip),
  }
}
