import { rng } from '@/helper/rng'
import { SPECIES, SPECIES_AGE } from '../people/species'

/** 70% in the two focus bands, 20% across young adults, 10% older runners. */
export function runnerAge(species: SPECIES): number {
  const draw = rng()
  const { MATURITY, MAX } = SPECIES_AGE[species]
  const [min, max]: [number, number] =
    draw < 0.35 ? [27, 29] : draw < 0.7 ? [33, 36] : draw < 0.9 ? [17, 40] : [41, MAX]
  const lower = Math.max(min, MATURITY)
  const upper = Math.min(max, MAX)
  return lower + Math.floor(rng() * (upper - lower + 1))
}
