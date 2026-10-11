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
import { augmentationData } from '@/data/augmentations'
import { placeData } from '@/data/places'

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
  AUGMENTATIONS = 'augmentations',
  FOOD_MENU = 'food-menu',
  SHOPS = 'shops',
  DEVICE_DATA = 'device-data',
  PLACES = 'places',
}
const lists = {
  [RL.NAMES_MODERN]: rlNamesModern,
  [CONTENT.WEAPONS]: weaponData,
  [CONTENT.AUGMENTATIONS]: augmentationData,
  [CONTENT.FOOD_MENU]: foodMenuData,
  [CONTENT.SHOPS]: shopData,
  [CONTENT.DEVICE_DATA]: deviceData,
  [CONTENT.PLACES]: placeData,
  [SHADOWRUN.NAMES]: [...shadowrunNames, ...cyberpunkCorporations],
  [SHADOWRUN.CHARACTERS]: shadowrunCharacters,
  [SHADOWRUN.FOOD]: shadowrunFood,
  [SHADOWRUN.MOVIE]: shadowrunMovie,
}

export type DataList = keyof typeof lists
export type ListEntry<List extends DataList> = (typeof lists)[List][number]

// Preserve each dataset's fragment types through filtering and flavor spelling.
export function load<List extends DataList>(
  list: List,
  options: GenerationOptions = {},
): ListEntry<List>[] {
  const source: readonly ListEntry<List>[] = lists[list]
  return source
    .filter((bit) => isEntryAvailable(bit, options))
    .map((bit) => ({
      ...bit,
      tags: [...bit.tags],
      value: getName(bit, options.flavor),
      shortValue: getName(bit, options.flavor, 'short'),
    }))
}
