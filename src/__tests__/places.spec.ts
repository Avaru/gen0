import { afterEach, describe, expect, it, vi } from 'vitest'
import { availableCategories, generateNames } from '@/generator/categories'
import { DATA, load } from '@/builders/load'
import { flavors } from '@/generator/options'
import { seedRandom } from './helpers/random'
import { placeData } from '@/data/places'

afterEach(() => vi.restoreAllMocks())

describe('place categories', () => {
  it('exposes both categories under Places in every flavor', () => {
    for (const { id: flavor } of flavors) {
      const categories = availableCategories({ flavor }).filter(category => ['cities', 'streets'].includes(category.id))
      expect(categories.map(category => category.label)).toEqual(['Cities', 'Streets & plazas'])
      expect(categories.every(category => category.group === 'Places')).toBe(true)
    }
    expect(placeData.filter(bit => bit.type === 'name')).toHaveLength(2009)
    expect(placeData.filter(bit => bit.type === 'attribute')).toHaveLength(33)
  })

  it('composes names from the migrated bases and existing suffixes and street types', () => {
    seedRandom()
    for (const { id: flavor } of flavors) {
      const bases = load(DATA.PLACES, { flavor }).filter(bit => bit.type === 'name').map(bit => bit.value)
      const suffixes = load(DATA.NAME_FRAGMENTS, { flavor }).filter(bit => bit.tags.includes('city') && bit.type === 'suffix').map(bit => bit.value)
      const prefixes = [
        ...load(DATA.NAME_FRAGMENTS, { flavor }).filter(bit => bit.tags.includes('location') && bit.type === 'prefix').map(bit => bit.value),
        ...load(DATA.PLACES, { flavor }).filter(bit => bit.type === 'ordinal').map(bit => bit.value),
      ]
      const brands = load(DATA.NAME_FRAGMENTS, { flavor }).filter(bit => bit.tags.includes('known-corporation')).map(bit => bit.value)
      const kinds = load(DATA.DEVICE_DATA, { flavor }).filter(bit => bit.type === 'street-kind').map(bit => bit.value)
      const cityNames = new Set(bases.flatMap(base => [
        base, ...suffixes.map(suffix => `${base} ${suffix}`),
      ]))
      const streetBases = new Set([...bases, ...brands])
      const cities = generateNames('cities', 30, { flavor })
      expect(cities.every(city => cityNames.has(city.primary))).toBe(true)
      expect(cities.every(city => /^\d[\d,. ]* inhabitants/.test(city.details ?? ''))).toBe(true)
      const streets = generateNames('streets', 30, { flavor })
      expect(streets.every(street => prefixes.some(prefix => {
        const start = `${prefix} `
        if (!street.primary.startsWith(start)) return false
        return kinds.some(kind => {
          const end = ` ${kind}`
          return street.primary.endsWith(end) &&
            streetBases.has(street.primary.slice(start.length, -end.length))
        })
      }))).toBe(true)
    }
  })

  it('keeps magical attributes in Shadowrun and respects explicit overrides', () => {
    const magical = placeData.filter(bit => bit.tags.includes('shadowrun')).map(bit => bit.value)
    expect(magical).toHaveLength(5)
    for (const flavor of ['cyberpunk', 'cyberpunk2020-2077'] as const) {
      expect(load(DATA.PLACES, { flavor }).some(bit => magical.includes(bit.value))).toBe(false)
    }
    expect(load(DATA.PLACES, { includeTags: ['shadowrun'] }).some(bit => magical.includes(bit.value))).toBe(true)
    expect(load(DATA.PLACES, { flavor: 'shadowrun', includeTags: ['shadowrun'], excludeTags: ['shadowrun'] }).some(bit => magical.includes(bit.value))).toBe(false)
    seedRandom()
    for (const id of ['cities', 'streets']) {
      const results = generateNames(id, 100, { flavor: 'shadowrun', excludeTags: ['shadowrun'] })
      expect(results.some(result => magical.some(value => result.details?.toLowerCase().includes(value.toLowerCase())))).toBe(false)
      expect(JSON.stringify(results)).not.toContain('Aztechnology')
    }
  })

  it('reports excluded place bases instead of silently picking from them', () => {
    expect(() => generateNames('cities', 1, { excludeTags: ['us'] })).toThrow('No entries match')
    expect(() => generateNames('streets', 1, { excludeTags: ['us'] })).toThrow('No entries match')
  })
})
