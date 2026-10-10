import type { GENUS } from '@/builders/types'
import type { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'

export const flavors = [
  { id: 'cyberpunk', label: 'Generic cyberpunk' },
  { id: 'shadowrun', label: 'Shadowrun' },
  { id: 'cyberpunk2020-2077', label: 'Cyberpunk 2020/2077' },
] as const
export type Flavor = typeof flavors[number]['id']

export interface GenerationOptions {
  flavor?: Flavor
  // Overrides take priority over a flavor; exclusion takes priority over inclusion.
  includeTags?: string[]
  excludeTags?: string[]
  genus?: GENUS
  corporationSize?: CORPORATION_SIZE
}

export function isFlavorEnabled(flavor: Flavor, options: GenerationOptions): boolean {
  if (options.excludeTags?.includes(flavor)) return false
  return options.includeTags?.includes(flavor) === true || (options.flavor ?? 'cyberpunk') === flavor
}
