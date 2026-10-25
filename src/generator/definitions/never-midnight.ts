import {
  berlinerName,
  countries,
  countryName,
  namingTraditions,
} from '@/patterns/never-midnight/names'
import { spell } from '@/patterns/never-midnight/spells'
import { address } from '@/patterns/never-midnight/address'
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
    id: 'berliner',
    label: 'Berliner',
    group: 'Names by country',
    gender: true,
    generate: berlinerName,
  },
  {
    id: 'address',
    label: 'Address',
    group: 'Places',
    generate: address,
  },
  {
    id: 'spells',
    label: 'Spells',
    group: 'Spells',
    generate: spell,
  },
]
