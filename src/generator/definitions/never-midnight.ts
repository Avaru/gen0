import { countries, countryName, namingTraditions } from '@/patterns/never-midnight/names'
import { spell } from '@/patterns/never-midnight/spells'
import type { Category } from '../categoryTypes'

export const neverMidnightNameCategories: Category[] = countries.map((country) => ({
  id: country,
  label: namingTraditions[country].label,
  group: 'Names by country',
  gender: true,
  generate: (options) => countryName(country, options),
}))

export const neverMidnightCategories: Category[] = [
  ...neverMidnightNameCategories,
  {
    id: 'spells',
    label: 'Spells',
    group: 'Spells',
    generate: spell,
  },
]
