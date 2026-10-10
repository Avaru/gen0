import { GENUS } from '@/builders/types'
import { isEntryAvailable } from '@/builders/availability'
import { sovereignties, type Sovereignty, type SovereigntyMix } from '@/data/sovereignties'
import { pendingNationalities } from '@/data/names/pending'
import { getName } from '@/generator/names'
import type { GenerationOptions } from '@/generator/options'
import { randomGenus } from '@/helper/randomGenus'
import { rng } from '@/helper/rng'
import { load, RL } from '@/load'
import { characters } from '../_secondary/charakters'
import { nationalName, type NameNationality } from './nameParts'
import type { Generated } from '@/patterns/types'

export function pendingSovereigntyPools(state: Sovereignty): string[] {
  return pendingNationalities.filter(pool => state.mix.some(part => part.nationality === pool.id))
    .map(pool => pool.label)
}

/** Remove excluded, empty, and gender-incompatible traditions before choosing. */
export function sovereigntyMix(state: Sovereignty, genus: GENUS, options: GenerationOptions = {}): SovereigntyMix[] {
  const entries = load(RL.NAMES_MODERN, options)
  return state.mix.filter(part => {
    if (pendingNationalities.some(pool => pool.id === part.nationality)) return false
    const given = entries.filter(bit => bit.tags.includes(part.nationality) && bit.type === 'given' && (!bit.genus || bit.genus === genus))
    if (!given.length) return false
    if (part.nationality === 'tamil') {
      const fathers = entries.filter(bit => bit.tags.includes('tamil') && bit.type === 'given' && (!bit.genus || bit.genus === GENUS.M))
      return given.every(person => fathers.some(father => father.value !== person.value))
    }
    const family = entries.filter(bit => bit.tags.includes(part.nationality) && bit.type === 'family' && (!bit.genus || bit.genus === genus))
    const distinct = new Set(family.map(bit => bit.value)).size
    // Spanish always needs two surnames; Russian can add a stored patronymic.
    if (part.nationality === 'spanish') return distinct >= 2
    if (part.nationality === 'russian' && !entries.some(bit => bit.tags.includes('russian') && bit.type === 'patronymic' && bit.genus === genus)) return false
    return distinct > 0
  })
}

export async function bySovereignty(id: string, genus = randomGenus(true), options: GenerationOptions = {}): Promise<Generated> {
  const state = sovereignties.find(item => item.id === id)
  if (!state || !isEntryAvailable(state, options)) throw new Error('Choose a sovereignty available in this flavor.')
  const parts = sovereigntyMix(state, genus, options)
  if (!parts.length) {
    const pending = pendingSovereigntyPools(state)
    throw new Error(pending.length
      ? `${getName(state, options.flavor)} names are TODO. Missing pools: ${pending.join(', ')}.`
      : 'No names match this sovereignty and these settings. Enable more name pools.')
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
