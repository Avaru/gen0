import { getSetting } from './settingRegistry'
import { isEntryAvailable } from '@/builders/availability'
import { getName } from './names'
import type { GenerationOptions } from './options'
import type { Generated } from '@/patterns/types'
import type { Category } from './categoryTypes'
export type { Category } from './categoryTypes'

/** Existing callers without a setting use Cyberpunk. */
export const categories = getSetting().categories

export function isCategoryAvailable(category: Category, options: GenerationOptions = {}): boolean {
  const setting = getSetting(options.setting)
  return (
    setting.categories.includes(category) &&
    (!options.flavor || setting.flavors.some((flavor) => flavor.id === options.flavor)) &&
    (!category.requiresFlavor || (!!options.flavor && options.flavor !== setting.defaultFlavor)) &&
    isEntryAvailable({ tags: category.tags ?? [] }, options)
  )
}

export function availableCategories(options: GenerationOptions = {}): Category[] {
  return getSetting(options.setting)
    .categories.filter((category) => isCategoryAvailable(category, options))
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
  const category = getSetting(options.setting).categories.find((item) => item.id === categoryId)
  if (!category) throw new Error('Choose an available category.')
  if (!isCategoryAvailable(category, options))
    throw new Error('Choose an available category for this setting flavor.')
  if (!Number.isInteger(count) || count < 1 || count > 100)
    throw new Error('Choose between 1 and 100 names.')
  return Array.from({ length: count }, () => {
    const result = category.generate(options)
    result.primary = result.primary.replace(/\s+/g, ' ').trim()
    return result
  })
}
