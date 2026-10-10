import { describe, expect, it } from 'vitest'
import { GENUS } from '@/builders/types'
import { continents } from '@/data/continents'
import { availableCategories, generateNames } from '@/generator/categories'
import { getNamePools } from '@/builders/namePools'
import { NATIONALITY } from '@/patterns/cyberpunk/nationality/byNationality'
import { byContinent } from '@/patterns/cyberpunk/nationality/byContinent'

describe('Names by continent', () => {
  it('offers six continents only for generic cyberpunk and keeps Mixed first in the last group', () => {
    for (const flavor of ['cyberpunk', 'shadowrun', 'cyberpunk2020-2077'] as const) {
      const categories = availableCategories({ flavor })
      const regional = categories.filter(item => item.group === 'Names by continent')
      expect(regional.map(item => item.label)).toEqual(flavor === 'cyberpunk'
        ? ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'] : [])
      expect(categories.filter(item => item.group === 'Names by nationality')[0]?.id).toBe('mixed')
      expect(categories[categories.length - 1]?.group).toBe('Names by nationality')
    }
  })

  it('keeps tag overrides and exclusions consistent between listing and generation', async () => {
    const included = { flavor: 'shadowrun' as const, includeTags: ['cyberpunk'] }
    expect(availableCategories(included).some(item => item.id === 'continent-europe')).toBe(true)
    await expect(generateNames('continent-europe', 1, included)).resolves.toHaveLength(1)
    const excluded = { ...included, excludeTags: ['cyberpunk'] }
    expect(availableCategories(excluded).some(item => item.id === 'continent-europe')).toBe(false)
    await expect(generateNames('continent-europe', 1, excluded)).rejects.toThrow('setting flavor')
    await expect(byContinent('continent-europe', GENUS.M, { flavor: 'shadowrun' })).rejects.toThrow('available')
    await expect(byContinent('missing')).rejects.toThrow('available')
  })

  it('uses complete Korean names in surname-first order when other Asia pools are excluded', async () => {
    const options = { excludeTags: [...Object.values(NATIONALITY), 'arabic'].filter(tag => tag !== 'korean') }
    for (const genus of [GENUS.M, GENUS.F]) {
      const pools = getNamePools(options)
      const given = pools.get('korean', 'given', genus).map(bit => bit.value)
      const surnames = pools.get('korean', 'family', genus).map(bit => bit.value)
      const results = await generateNames('continent-asia', 10, { ...options, genders: [genus] })
      expect(results.every(result => surnames.some(surname =>
        result.primary.startsWith(`${surname} `) && given.includes(result.primary.slice(surname.length + 1)),
      ))).toBe(true)
    }
  })

  it('shows coverage gaps and skips empty pools rather than inventing names', async () => {
    const categories = availableCategories()
    expect(categories.find(item => item.id === 'continent-africa')?.coverage).toContain('only the Arabic pool')
    expect(categories.find(item => item.id === 'continent-oceania')?.pendingPools).toEqual(['Māori', 'Aboriginal Australian'])
    expect(categories.find(item => item.id === 'maori')?.label).toBe('Māori TODO')
    for (const continent of continents) {
      await expect(generateNames(continent.id, 5, { genders: [GENUS.F] })).resolves.toHaveLength(5)
    }
    await expect(generateNames('continent-africa', 1, { excludeTags: ['arabic'] })).rejects.toThrow('Ghanaian')
    await expect(generateNames('maori', 1)).rejects.toThrow('empty')
  })
})
