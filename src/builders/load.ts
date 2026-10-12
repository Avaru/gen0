import { personalNames } from '@/data/personal-names'
import { nameFragments } from '@/data/name-fragments/index'
import { runnerTraits } from '@/data/runner-traits'
import { foodData } from '@/data/food'
import { movieData } from '@/data/movies'
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

/** Shared pools; setting availability is carried by entry tags, not list names. */
export enum DATA {
  PERSONAL_NAMES = 'personal-names',
  RUNNER_TRAITS = 'runner-traits',
  NAME_FRAGMENTS = 'name-fragments',
  FOOD = 'food',
  MOVIES = 'movies',
  WEAPONS = 'weapons',
  AUGMENTATIONS = 'augmentations',
  FOOD_MENU = 'food-menu',
  SHOPS = 'shops',
  DEVICE_DATA = 'device-data',
  PLACES = 'places',
}
const lists = {
  [DATA.PERSONAL_NAMES]: personalNames,
  [DATA.WEAPONS]: weaponData,
  [DATA.AUGMENTATIONS]: augmentationData,
  [DATA.FOOD_MENU]: foodMenuData,
  [DATA.SHOPS]: shopData,
  [DATA.DEVICE_DATA]: deviceData,
  [DATA.PLACES]: placeData,
  [DATA.NAME_FRAGMENTS]: [...nameFragments, ...cyberpunkCorporations],
  [DATA.RUNNER_TRAITS]: runnerTraits,
  [DATA.FOOD]: foodData,
  [DATA.MOVIES]: movieData,
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
