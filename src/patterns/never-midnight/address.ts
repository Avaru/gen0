import { eastBerlinStreets } from '@/data/east-berlin-streets'
import { neverMidnightFlatLocations } from '@/data/never-midnight-address'
import { capitalize } from '@/helper/capitalize'
import { randomFrom } from '@/helper/randomFrom'
import { rng } from '@/helper/rng'
import { p } from '@/helper/prob'
import type { Generated } from '@/patterns/types'

export function streetAddress(): Generated {
  const street = randomFrom(eastBerlinStreets)
  const houseNumber = 1 + Math.floor(rng() * street.maxHouseNumber)
  const suffix = p(0.25) ? randomFrom(['A', 'B']) : ''
  return {
    primary: `${street.street} ${houseNumber}${suffix}`,
    secondary: street.district,
  }
}

export function address(): Generated {
  return {
    ...streetAddress(),
    details: capitalize(randomFrom(neverMidnightFlatLocations)),
  }
}
