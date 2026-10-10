import type { RawBit } from '@/builders/types'
import type { NameEntry } from '@/data/nameTypes'
import { rlNamesModern } from '@/data/rl-names-modern'
import { shadowrunNames } from '@/data/shadowrun-names'
import { shadowrunCharacters } from '@/data/shadowrun-characters'
import { shadowrunFood } from '@/data/shadowrun-food'
import { shadowrunMovie } from '@/data/shadowrun-movie'
import { flavors, isFlavorEnabled, type GenerationOptions } from '@/generator/options'
import { cyberpunkCorporations } from '@/data/cyberpunk-corporations'
import { getName } from '@/generator/names'

export enum RL {
  NAMES_MODERN = 'rl-names-modern',
}
export enum SHADOWRUN {
  CHARACTERS = 'shadowrun-characters',
  NAMES = 'shadowrun-names',
  FOOD = 'shadowrun-food',
  MOVIE = 'shadowrun-movie',
}
const lists: Record<RL | SHADOWRUN, RawBit[]> = {
  [RL.NAMES_MODERN]: rlNamesModern,
  [SHADOWRUN.NAMES]: [...shadowrunNames, ...cyberpunkCorporations],
  [SHADOWRUN.CHARACTERS]: shadowrunCharacters,
  [SHADOWRUN.FOOD]: shadowrunFood,
  [SHADOWRUN.MOVIE]: shadowrunMovie,
}

// Static TypeScript data ships with the SPA; no fetch or spreadsheet connection.
export function load(list: RL, options?: GenerationOptions): NameEntry[]
export function load(list: SHADOWRUN, options?: GenerationOptions): RawBit[]
export function load(list: RL | SHADOWRUN, options?: GenerationOptions): RawBit[]
export function load(list: RL | SHADOWRUN, options: GenerationOptions = {}): RawBit[] {
  return lists[list].filter(
    (bit) =>
      !options.excludeTags?.some((tag) => bit.tags.includes(tag)) &&
      (!flavors.some(flavor => bit.tags.includes(flavor.id)) || flavors.some(flavor => bit.tags.includes(flavor.id) && isFlavorEnabled(flavor.id, options))),
  ).map(bit => ({
    ...bit,
    tags: [...bit.tags],
    value: getName(bit, options.flavor),
    shortValue: getName(bit, options.flavor, 'short'),
  }))
}
