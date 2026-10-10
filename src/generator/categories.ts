import { augmentations } from '@/patterns/cyberpunk/augmentations/augmentations'
import { weapons, foodMenu, shops, deviceContents } from '@/patterns/cyberpunk/content/content'
import { corporations, knownCorporation } from '@/patterns/cyberpunk/corporations/corporations'
import { gang } from '@/patterns/cyberpunk/gangs/gangs'
import { runners } from '@/patterns/cyberpunk/runners/runners'
import { restaurants, bars } from '@/patterns/cyberpunk/food/food'
import { movies } from '@/patterns/cyberpunk/entertainment/entertainment'
import { mixed } from '@/patterns/cyberpunk/nationality/mixed'
import { genericNationality } from '@/patterns/cyberpunk/nationality/byNationality'
import type { Generated } from '@/patterns/types'
import {
  corporationSizes,
  givenNameGenders,
  normalizeSelections,
  type GenerationOptions,
} from './options'
import { randomFrom } from '@/helper/randomFrom'
import { sovereignties } from '@/data/sovereignties'
import { pendingNationalities } from '@/data/names/pending'
import {
  bySovereignty,
  pendingSovereigntyPools,
} from '@/patterns/cyberpunk/nationality/bySovereignty'
import { isEntryAvailable } from '@/builders/availability'
import { getName } from './names'
import type { RawBit } from '@/builders/types'
import { continents } from '@/data/continents'
import { byContinent } from '@/patterns/cyberpunk/nationality/byContinent'
import { namingTraditions, traditionIds } from '@/patterns/cyberpunk/nationality/traditions'

export interface Category {
  id: string
  label: string
  group: string
  gender?: boolean
  corporationSize?: boolean
  requiresFlavor?: boolean
  tags?: string[]
  flavorNames?: RawBit['flavorNames']
  todo?: boolean
  pendingPools?: string[]
  coverage?: string
  generate: (options: GenerationOptions) => Generated
}
function selectedGender(options: GenerationOptions) {
  return options.genders
    ? randomFrom(normalizeSelections(options.genders, givenNameGenders))
    : options.genus
}

const traditionCategories: Category[] = traditionIds.map((nation) => ({
  id: nation,
  label: namingTraditions[nation].label,
  group: 'Names by nationality',
  gender: true,
  generate: (options: GenerationOptions) =>
    genericNationality(nation, selectedGender(options), undefined, options),
}))

const nationalityCategories: Category[] = [
  {
    id: 'mixed',
    label: 'Mixed',
    group: 'Names by nationality',
    gender: true,
    generate: (options) => mixed(selectedGender(options), options),
  },
  ...traditionCategories.filter((category) => category.id !== 'arabic'),
  ...pendingNationalities.map((pool) => ({
    id: pool.id,
    label: `${pool.label} TODO`,
    group: 'Names by nationality',
    todo: true,
    generate: (): Generated => {
      throw new Error(`${pool.label} names are TODO. This name pool is empty.`)
    },
  })),
  ...traditionCategories.filter((category) => category.id === 'arabic'),
]

export const categories: Category[] = [
  {
    id: 'corporations',
    label: 'Corporations',
    group: 'Organizations',
    corporationSize: true,
    generate: (options) =>
      corporations({
        ...options,
        corporationSize: options.corporationSizes
          ? randomFrom(normalizeSelections(options.corporationSizes, corporationSizes))
          : options.corporationSize,
      }),
  },
  {
    id: 'known-corporations',
    label: 'Known corporations',
    group: 'Organizations',
    requiresFlavor: true,
    tags: ['shadowrun', 'cyberpunk2020-2077'],
    generate: knownCorporation,
  },
  { id: 'runners', label: 'Runners', group: 'People', generate: runners },
  { id: 'gangs', label: 'Gangs', group: 'Organizations', generate: gang },
  { id: 'restaurants', label: 'Restaurants', group: 'Food and drink', generate: restaurants },
  { id: 'bars', label: 'Bars', group: 'Food and drink', generate: bars },
  { id: 'augmentations', label: 'Augmentations', group: 'Equipment', generate: augmentations },
  { id: 'weapons', label: 'Weapons', group: 'Equipment', generate: weapons },
  { id: 'food-menu', label: 'Food menu', group: 'Food and drink', generate: foodMenu },
  { id: 'shops', label: 'Shops', group: 'Places', generate: shops },
  {
    id: 'device-data',
    label: 'Device data',
    flavorNames: { shadowrun: 'Commlink data', 'cyberpunk2020-2077': 'Shard data' },
    group: 'Equipment',
    generate: deviceContents,
  },
  { id: 'movies', label: 'Movies', group: 'Entertainment', generate: movies },
  ...sovereignties.map((state) => ({
    id: `sovereignty-${state.id}`,
    label: state.value,
    flavorNames: state.flavorNames,
    tags: state.tags,
    group: 'Names by sovereignty',
    gender: true,
    todo: state.mix.every((part) =>
      pendingNationalities.some((pool) => pool.id === part.nationality),
    ),
    pendingPools: pendingSovereigntyPools(state),
    generate: (options: GenerationOptions) =>
      bySovereignty(state.id, selectedGender(options), options),
  })),
  ...continents.map((continent) => ({
    id: continent.id,
    label: continent.value,
    tags: continent.tags,
    group: 'Names by continent',
    gender: true,
    pendingPools: pendingSovereigntyPools(continent),
    coverage: continent.coverage,
    generate: (options: GenerationOptions) =>
      byContinent(continent.id, selectedGender(options), options),
  })),
  ...nationalityCategories,
]

export function isCategoryAvailable(category: Category, options: GenerationOptions = {}): boolean {
  return (
    (!category.requiresFlavor || (!!options.flavor && options.flavor !== 'cyberpunk')) &&
    isEntryAvailable({ tags: category.tags ?? [] }, options)
  )
}

export function availableCategories(options: GenerationOptions = {}): Category[] {
  return categories
    .filter((category) => isCategoryAvailable(category, options))
    .map((category) => ({
      ...category,
      label: getName(
        { value: category.label, tags: category.tags ?? [], flavorNames: category.flavorNames },
        options.flavor,
      ),
    }))
}

export function generateNames(
  categoryId: string,
  count: number,
  options: GenerationOptions = {},
): Generated[] {
  const category = categories.find((item) => item.id === categoryId)
  if (!category) throw new Error('Choose an available category.')
  if (!isCategoryAvailable(category, options))
    throw new Error('Choose an available category for this setting flavor.')
  if (!Number.isInteger(count) || count < 1 || count > 100)
    throw new Error('Choose between 1 and 100 names.')
  const results: Generated[] = []
  for (let i = 0; i < count; i++) {
    const result = category.generate(options)
    result.primary = result.primary.replace(/\s+/g, ' ').trim()
    results.push(result)
  }
  return results
}
