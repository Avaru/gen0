import { countries, countryName, namingTraditions } from '@/patterns/never-midnight/names'
import type { Category } from '../categoryTypes'

export const neverMidnightCategories: Category[] = countries.map((country) => ({
  id: country,
  label: namingTraditions[country].label,
  group: 'Names by country',
  gender: true,
  generate: (options) => countryName(country, options),
}))
