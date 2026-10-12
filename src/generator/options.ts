import type { NameGender } from '@/data/nameTypes'
import { GENUS } from '@/builders/types'
import { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'

export const flavors = [
  { id: 'cyberpunk', label: 'Generic' },
  { id: 'shadowrun', label: 'Shadowrun' },
  { id: 'cyberpunk2020-2077', label: 'CP 2020/77' },
] as const
export type Flavor = (typeof flavors)[number]['id']

export const givenNameGenders = [GENUS.M, GENUS.F] as const
export const corporationSizes = [
  CORPORATION_SIZE.A,
  CORPORATION_SIZE.AA,
  CORPORATION_SIZE.AAA,
] as const

/** Keep supported selections in a stable order; an empty selection means all. */
export function normalizeSelections<T extends string>(
  values: readonly string[] | undefined,
  available: readonly T[],
): T[] {
  const selected = available.filter((value) => values?.includes(value))
  return selected.length ? selected : [...available]
}

export interface GenerationOptions {
  runnerArchetypeId?: string
  flavor?: Flavor
  // Overrides take priority over a flavor; exclusion takes priority over inclusion.
  includeTags?: string[]
  excludeTags?: string[]
  genders?: readonly NameGender[]
  corporationSizes?: readonly CORPORATION_SIZE[]
  genus?: NameGender
  corporationSize?: CORPORATION_SIZE
}

export function isFlavorEnabled(flavor: Flavor, options: GenerationOptions): boolean {
  if (options.excludeTags?.includes(flavor)) return false
  return (
    options.includeTags?.includes(flavor) === true ||
    (options.flavor ?? 'cyberpunk') === flavor
  )
}
