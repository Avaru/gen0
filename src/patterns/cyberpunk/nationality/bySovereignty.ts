import { GENUS } from '@/builders/types'
import { isEntryAvailable } from '@/builders/availability'
import { sovereignties, type Sovereignty, type SovereigntyMix } from '@/data/sovereignties'
import { pendingNationalities } from '@/data/names/pending'
import { getName } from '@/generator/names'
import type { GenerationOptions } from '@/generator/options'
import { randomGenus } from '@/helper/randomGenus'
import { rng } from '@/helper/rng'
import { getNamePools, type NamePools } from '@/builders/namePools'
import { characters } from '../_secondary/charakters'
import { nationalName, type NameNationality } from './nameParts'
import type { Generated } from '@/patterns/types'

const mixes = new WeakMap<NamePools, Map<string, readonly SovereigntyMix[]>>()

export function pendingSovereigntyPools(state: Sovereignty): string[] {
  return pendingNationalities.filter(pool => state.mix.some(part => part.nationality === pool.id))
    .map(pool => pool.label)
}

/** Remove excluded, empty, and gender-incompatible traditions before choosing. */
export function sovereigntyMix(state: Sovereignty, genus: GENUS, options: GenerationOptions = {}): readonly SovereigntyMix[] {
  const pools = getNamePools(options)
  const available = mixes.get(pools) ?? new Map<string, readonly SovereigntyMix[]>()
  const key = JSON.stringify([state.id, genus])
  const cached = available.get(key)
  if (cached) return cached
  const parts = Object.freeze(state.mix.filter(part => {
    if (pendingNationalities.some(pool => pool.id === part.nationality)) return false
    const given = pools.get(part.nationality, 'given', genus)
    if (!given.length) return false
    if (part.nationality === 'tamil') {
      const fathers = pools.get('tamil', 'given', GENUS.M)
      return given.every(person => fathers.some(father => father.value !== person.value))
    }
    const distinct = pools.get(part.nationality, 'family', genus, true).length
    // Spanish always needs two surnames; Russian can add a stored patronymic.
    if (part.nationality === 'spanish') return distinct >= 2
    if (part.nationality === 'russian' && !pools.get('russian', 'patronymic', genus).some(bit => bit.genus === genus)) return false
    return distinct > 0
  }))
  available.set(key, parts)
  mixes.set(pools, available)
  return parts
}

export async function bySovereignty(id: string, genus = randomGenus(true), options: GenerationOptions = {}): Promise<Generated> {
  const state = sovereignties.find(item => item.id === id)
  if (!state || !isEntryAvailable(state, options)) throw new Error('Choose a sovereignty available in this flavor.')
  return generateRegionalName(state, genus, options)
}

/** Shared complete-name mixing for sovereignty and continent entries. */
export async function generateRegionalName(state: Sovereignty, genus = randomGenus(true), options: GenerationOptions = {}): Promise<Generated> {
  if (!isEntryAvailable(state, options)) throw new Error('Choose a name region available in this flavor.')
  const parts = sovereigntyMix(state, genus, options)
  if (!parts.length) {
    const pending = pendingSovereigntyPools(state)
    throw new Error(pending.length
      ? `${getName(state, options.flavor)} names are TODO. Missing pools: ${pending.join(', ')}.`
      : 'No names match this region and these settings. Enable more name pools.')
  }
  let pick = rng() * parts.reduce((total, part) => total + part.weight, 0)
  let chosen = parts[parts.length - 1]!
  for (const part of parts) {
    pick -= part.weight
    if (pick < 0) { chosen = part; break }
  }
  return {
    primary: nationalName(chosen.nationality as NameNationality, genus, undefined, options),
    ...(await characters(true, undefined, options)),
  }
}
