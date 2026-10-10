import { corporations, knownCorporation } from '@/patterns/cyberpunk/corporations/corporations'
import { gang } from '@/patterns/cyberpunk/gangs/gangs'
import { runners } from '@/patterns/cyberpunk/runners/runners'
import { restaurants, bars } from '@/patterns/cyberpunk/food/food'
import { movies } from '@/patterns/cyberpunk/entertainment/entertainment'
import { arabic } from '@/patterns/cyberpunk/nationality/arabic'
import { genericNationality, NATIONALITY } from '@/patterns/cyberpunk/nationality/byNationality'
import type { Generated } from '@/patterns/types'
import type { GenerationOptions } from './options'

export interface Category {
  id: string
  label: string
  group: string
  gender?: boolean
  corporationSize?: boolean
  requiresFlavor?: boolean
  generate: (options: GenerationOptions) => Promise<Generated>
}
const nationalities: [NATIONALITY, string][] = [
  [NATIONALITY.AMERICAN_US, 'US American'],
  [NATIONALITY.BRITISH, 'British'],
  [NATIONALITY.CHINESE, 'Chinese'],
  [NATIONALITY.GERMAN, 'German'],
  [NATIONALITY.FRENCH, 'French'],
  [NATIONALITY.GREEK, 'Greek'],
  [NATIONALITY.ITALIAN, 'Italian'],
  [NATIONALITY.JAPANESE, 'Japanese'],
  [NATIONALITY.POLISH, 'Polish'],
  [NATIONALITY.RUSSIAN, 'Russian'],
  [NATIONALITY.SPANISH, 'Spanish'],
]
export const categories: Category[] = [
  ...nationalities.map(([nation, label]) => ({
    id: nation,
    label,
    group: 'Names by nationality',
    gender: true,
    generate: (options: GenerationOptions) =>
      genericNationality(nation, options.genus, undefined, options),
  })),
  {
    id: 'arabic',
    label: 'Arabic',
    group: 'Names by nationality',
    gender: true,
    generate: (options) => arabic(options.genus, options),
  },
  {
    id: 'corporations',
    label: 'Corporations',
    group: 'Organizations',
    corporationSize: true,
    generate: (options) => corporations(options.corporationSize, false, options),
  },
  { id: 'known-corporations', label: 'Known corporations', group: 'Organizations', requiresFlavor: true, generate: knownCorporation },
  { id: 'runners', label: 'Runners', group: 'People', generate: runners },
  { id: 'gangs', label: 'Gangs', group: 'Organizations', generate: gang },
  { id: 'restaurants', label: 'Restaurants', group: 'Food and drink', generate: restaurants },
  { id: 'bars', label: 'Bars', group: 'Food and drink', generate: bars },
  { id: 'movies', label: 'Movies', group: 'Entertainment', generate: movies },
]

export async function generateNames(
  categoryId: string,
  count: number,
  options: GenerationOptions = {},
): Promise<Generated[]> {
  const category = categories.find((item) => item.id === categoryId)
  if (!category) throw new Error('Choose an available category.')
  if (category.requiresFlavor && (!options.flavor || options.flavor === 'cyberpunk'))
    throw new Error('Choose a setting flavor for known corporations.')
  if (!Number.isInteger(count) || count < 1 || count > 100)
    throw new Error('Choose between 1 and 100 names.')
  const results: Generated[] = []
  for (let i = 0; i < count; i++) {
    const result = await category.generate(options)
    result.primary = result.primary.replace(/\s+/g, ' ').trim()
    results.push(result)
  }
  return results
}
