import type { NameGender } from '@/data/nameTypes'
import { canComposeName } from './availability'
import { isNameNationality } from './traditions'
import { isEntryAvailable } from '@/builders/availability'
import { sovereignties, type Sovereignty, type SovereigntyMix } from '@/data/sovereignties'
import { pendingNationalities } from '@/data/names/pending'
import { getName } from '@/generator/names'
import type { GenerationOptions } from '@/generator/options'
import { randomGenus } from '@/helper/randomGenus'
import { rng } from '@/helper/rng'
import { getNamePools, type NamePools } from '@/builders/namePools'
import { characters } from '../_secondary/characters'
import { nationalName } from './nameParts'
import type { Generated } from '@/patterns/types'

const mixes = new WeakMap<NamePools, Map<string, readonly SovereigntyMix[]>>()

export function pendingSovereigntyPools(state: Sovereignty): string[] {
  return pendingNationalities
    .filter((pool) => state.mix.some((part) => part.nationality === pool.id))
    .map((pool) => pool.label)
}

/** Remove excluded, empty, and gender-incompatible traditions before choosing. */
export function sovereigntyMix(
  state: Sovereignty,
  genus: NameGender,
  options: GenerationOptions = {},
): readonly SovereigntyMix[] {
  const pools = getNamePools(options)
  const available = mixes.get(pools) ?? new Map<string, readonly SovereigntyMix[]>()
  const key = JSON.stringify([state.id, genus])
  const cached = available.get(key)
  if (cached) return cached
  const parts = Object.freeze(
    state.mix.filter(
      (part) =>
        isNameNationality(part.nationality) && canComposeName(pools, part.nationality, genus),
    ),
  )
  available.set(key, parts)
  mixes.set(pools, available)
  return parts
}

export function bySovereignty(
  id: string,
  genus: NameGender = randomGenus(true),
  options: GenerationOptions = {},
): Generated {
  const state = sovereignties.find((item) => item.id === id)
  if (!state || !isEntryAvailable(state, options))
    throw new Error('Choose a sovereignty available in this flavor.')
  return generateRegionalName(state, genus, options)
}

/** Shared complete-name mixing for sovereignty and continent entries. */
export function generateRegionalName(
  state: Sovereignty,
  genus: NameGender = randomGenus(true),
  options: GenerationOptions = {},
): Generated {
  if (!isEntryAvailable(state, options))
    throw new Error('Choose a name region available in this flavor.')
  const parts = sovereigntyMix(state, genus, options)
  if (!parts.length) {
    const pending = pendingSovereigntyPools(state)
    throw new Error(
      pending.length
        ? `${getName(state, options.flavor)} names are TODO. Missing pools: ${pending.join(', ')}.`
        : 'No names match this region and these settings. Enable more name pools.',
    )
  }
  let pick = rng() * parts.reduce((total, part) => total + part.weight, 0)
  let chosen = parts[parts.length - 1]!
  for (const part of parts) {
    pick -= part.weight
    if (pick < 0) {
      chosen = part
      break
    }
  }
  if (!isNameNationality(chosen.nationality)) throw new Error('This name tradition is still TODO.')
  return {
    primary: nationalName(chosen.nationality, genus, undefined, options),
    ...characters(true, undefined, options),
  }
}
