import { traditionIds } from '@/patterns/cyberpunk/nationality/traditions'
import { describe, expect, it } from 'vitest'
import { GENUS } from '@/builders/types'
import { continents } from '@/data/continents'
import { availableCategories, generateNames } from '@/generator/categories'
import { getNamePools } from '@/builders/namePools'
import { byContinent } from '@/patterns/cyberpunk/nationality/byContinent'

describe('Names by continent', () => {
  it('offers six continents only for generic cyberpunk and keeps Mixed first in the last group', () => {
    for (const flavor of ['cyberpunk', 'shadowrun', 'cyberpunk2020-2077'] as const) {
      const categories = availableCategories({ flavor })
      const regional = categories.filter((item) => item.group === 'Names by continent')
      expect(regional.map((item) => item.label)).toEqual(
        flavor === 'cyberpunk'
          ? ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']
          : [],
      )
      expect(categories.filter((item) => item.group === 'Names by nationality')[0]?.id).toBe(
        'mixed',
      )
      expect(categories[categories.length - 1]?.group).toBe('Names by nationality')
    }
  })

  it('keeps tag overrides and exclusions consistent between listing and generation', () => {
    const included = { flavor: 'shadowrun' as const, includeTags: ['cyberpunk'] }
    expect(availableCategories(included).some((item) => item.id === 'continent-europe')).toBe(true)
    expect(generateNames('continent-europe', 1, included)).toHaveLength(1)
    const excluded = { ...included, excludeTags: ['cyberpunk'] }
    expect(availableCategories(excluded).some((item) => item.id === 'continent-europe')).toBe(false)
    expect(() => generateNames('continent-europe', 1, excluded)).toThrow('setting flavor')
    expect(() => byContinent('continent-europe', GENUS.M, { flavor: 'shadowrun' })).toThrow(
      'available',
    )
    expect(() => byContinent('missing')).toThrow('available')
  })

  it('uses complete Korean names in surname-first order when other Asia pools are excluded', () => {
    const options = { excludeTags: [...traditionIds, 'arabic'].filter((tag) => tag !== 'korean') }
    for (const genus of [GENUS.M, GENUS.F] as const) {
      const pools = getNamePools(options)
      const given = pools.get('korean', 'given', genus).map((bit) => bit.value)
      const surnames = pools.get('korean', 'family', genus).map((bit) => bit.value)
      const results = generateNames('continent-asia', 10, { ...options, genders: [genus] })
      expect(
        results.every((result) =>
          surnames.some(
            (surname) =>
              result.primary.startsWith(`${surname} `) &&
              given.includes(result.primary.slice(surname.length + 1)),
          ),
        ),
      ).toBe(true)
    }
  })

  it('shows coverage gaps and skips empty pools rather than inventing names', () => {
    const categories = availableCategories()
    expect(categories.find((item) => item.id === 'continent-africa')?.coverage).toContain(
      'only the Arabic pool',
    )
    expect(categories.find((item) => item.id === 'continent-oceania')?.pendingPools).toEqual([
      'Māori',
      'Aboriginal Australian',
    ])
    expect(categories.find((item) => item.id === 'maori')?.label).toBe('Māori TODO')
    for (const continent of continents) {
      expect(generateNames(continent.id, 5, { genders: [GENUS.F] })).toHaveLength(5)
    }
    expect(() => generateNames('continent-africa', 1, { excludeTags: ['arabic'] })).toThrow(
      'Ghanaian',
    )
    expect(() => generateNames('maori', 1)).toThrow('empty')
  })
})
