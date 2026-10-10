import type { RawBit } from './types'
import { flavors, isFlavorEnabled, type GenerationOptions } from '@/generator/options'

/** Ordinary tags select pools; flavor tags restrict availability. Exclusions win. */
export function isEntryAvailable(entry: Pick<RawBit, 'tags'>, options: GenerationOptions = {}): boolean {
  return !options.excludeTags?.some(tag => entry.tags.includes(tag)) &&
    (!flavors.some(flavor => entry.tags.includes(flavor.id)) ||
      flavors.some(flavor => entry.tags.includes(flavor.id) && isFlavorEnabled(flavor.id, options)))
}
