import type { RawBit } from '@/builders/types'
import type { NameEntry } from '@/data/nameTypes'
import { rlNamesModern } from '@/data/rl-names-modern'
import { shadowrunNames } from '@/data/shadowrun-names'
import { shadowrunCharacters } from '@/data/shadowrun-characters'
import { shadowrunFood } from '@/data/shadowrun-food'
import { shadowrunMovie } from '@/data/shadowrun-movie'
import type { GenerationOptions } from '@/generator/options'
import { isEntryAvailable } from '@/builders/availability'
import { cyberpunkCorporations } from '@/data/cyberpunk-corporations'
import { getName } from '@/generator/names'
import { weaponData } from '@/data/weapons'
import { foodMenuData } from '@/data/food-menu'
import { shopData } from '@/data/shops'
import { deviceData } from '@/data/device-data'

export enum RL {
  NAMES_MODERN = 'rl-names-modern',
}
export enum SHADOWRUN {
  CHARACTERS = 'shadowrun-characters',
  NAMES = 'shadowrun-names',
  FOOD = 'shadowrun-food',
  MOVIE = 'shadowrun-movie',
}
export enum CONTENT {
  WEAPONS = 'weapons',
  FOOD_MENU = 'food-menu',
  SHOPS = 'shops',
  DEVICE_DATA = 'device-data',
}
const lists: Record<RL | SHADOWRUN | CONTENT, RawBit[]> = {
  [RL.NAMES_MODERN]: rlNamesModern,
  [CONTENT.WEAPONS]: weaponData,
  [CONTENT.FOOD_MENU]: foodMenuData,
  [CONTENT.SHOPS]: shopData,
  [CONTENT.DEVICE_DATA]: deviceData,
  [SHADOWRUN.NAMES]: [...shadowrunNames, ...cyberpunkCorporations],
  [SHADOWRUN.CHARACTERS]: shadowrunCharacters,
  [SHADOWRUN.FOOD]: shadowrunFood,
  [SHADOWRUN.MOVIE]: shadowrunMovie,
}

// Static TypeScript data ships with the SPA; no fetch or spreadsheet connection.
export function load(list: RL, options?: GenerationOptions): NameEntry[]
export function load(list: SHADOWRUN | CONTENT, options?: GenerationOptions): RawBit[]
export function load(list: RL | SHADOWRUN | CONTENT, options?: GenerationOptions): RawBit[]
export function load(list: RL | SHADOWRUN | CONTENT, options: GenerationOptions = {}): RawBit[] {
  return lists[list].filter(bit => isEntryAvailable(bit, options)).map(bit => ({
    ...bit,
    tags: [...bit.tags],
    value: getName(bit, options.flavor),
    shortValue: getName(bit, options.flavor, 'short'),
  }))
}
