import type { GENUS } from './types'
import type { NameEntry, NamePart } from '@/data/nameTypes'
import type { GenerationOptions } from '@/generator/options'
import { load, RL } from '@/load'

/** Shared name parts are read-only; Bits makes a separate list for each person's picks. */
export class NamePools {
  private readonly entries: readonly NameEntry[]
  private readonly byTag = new Map<string, NameEntry[]>()
  private readonly parts = new Map<string, readonly NameEntry[]>()

  constructor(entries: readonly NameEntry[]) {
    this.entries = Object.freeze(
      entries.map((entry) => {
        const copy = { ...entry, tags: [...entry.tags] }
        Object.freeze(copy.tags)
        return Object.freeze(copy)
      }),
    )
    for (const entry of this.entries) {
      for (const tag of new Set(entry.tags)) {
        const pool = this.byTag.get(tag) ?? []
        pool.push(entry)
        this.byTag.set(tag, pool)
      }
    }
  }

  get(
    nation?: string,
    type?: NamePart,
    genus?: `${GENUS}`,
    distinct = false,
  ): readonly NameEntry[] {
    const key = JSON.stringify([nation, type, genus, distinct])
    const cached = this.parts.get(key)
    if (cached) return cached
    const source = nation === undefined ? this.entries : (this.byTag.get(nation) ?? [])
    const matching = source.filter(
      (entry) =>
        (!type || entry.type === type) && (!genus || !entry.genus || entry.genus === genus),
    )
    // Keep the existing order and last entry for duplicate spellings.
    const pool = Object.freeze(
      distinct ? [...new Map(matching.map((entry) => [entry.value, entry])).values()] : matching,
    )
    this.parts.set(key, pool)
    return pool
  }
}

// Bound memory use when callers try many different include/exclude combinations.
const cache = new Map<string, NamePools>()
const maxSettings = 8

export function clearNamePools(): void {
  cache.clear()
}

export function getNamePools(options: GenerationOptions = {}): NamePools {
  const key = JSON.stringify([
    options.flavor ?? 'cyberpunk',
    [...new Set(options.includeTags ?? [])].sort(),
    [...new Set(options.excludeTags ?? [])].sort(),
  ])
  let pools = cache.get(key)
  if (pools) cache.delete(key)
  else pools = new NamePools(load(RL.NAMES_MODERN, options))
  cache.set(key, pools)
  if (cache.size > maxSettings) cache.delete(cache.keys().next().value!)
  return pools
}
