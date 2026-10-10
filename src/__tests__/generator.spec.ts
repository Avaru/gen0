import { afterEach, describe, expect, it, vi } from 'vitest'
import { categories, generateNames } from '@/generator/categories'
import { flavors, isFlavorEnabled } from '@/generator/options'
import { load, RL, SHADOWRUN } from '@/load'
import { SPECIES, pickSpecies } from '@/patterns/cyberpunk/_secondary/helpers'
import { corporations } from '@/patterns/cyberpunk/corporations/corporations'
import { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'
import { randomRounded } from '@/helper/randomRounded'
import Bits from '@/builders/Bits'
import { getName } from '@/generator/names'
import { shadowrunCharacters } from '@/data/shadowrun-characters'
import { cyberpunkCorporations } from '@/data/cyberpunk-corporations'

function seedRandom() {
  let state = 421
  vi.spyOn(Math, 'random').mockImplementation(() => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  })
}
afterEach(() => vi.restoreAllMocks())

describe('migrated generator', () => {
  it('retains the migrated lists with duplicate role spellings merged', () => {
    const options = { flavor: 'shadowrun' as const }
    expect(load(RL.NAMES_MODERN, options)).toHaveLength(19042)
    expect(load(SHADOWRUN.NAMES, options)).toHaveLength(2179)
    expect(load(SHADOWRUN.CHARACTERS, options)).toHaveLength(373)
    expect(load(SHADOWRUN.FOOD, options)).toHaveLength(611)
    expect(load(SHADOWRUN.MOVIE, options)).toHaveLength(469)
  })

  it('generates every available category in all flavors', async () => {
    seedRandom()
    for (const { id: flavor } of flavors) {
      for (const category of categories) {
        if (category.requiresFlavor && flavor === 'cyberpunk') continue
        const results = await generateNames(category.id, 20, { flavor })
        expect(results).toHaveLength(20)
        for (const result of results) {
          expect(result.primary.trim().length).toBeGreaterThan(0)
          expect(JSON.stringify(result)).not.toMatch(/undefined|NaN|\$/)
          expect(flavor === 'shadowrun' || !/\b(Norm|Elf|Dwarf|Ork|Troll)\b/.test(result.appearance ?? '')).toBe(true)
        }
      }
    }
  }, 20000)

  it('filters flavor entries and allows explicit inclusion and exclusion', () => {
    for (const list of Object.values(SHADOWRUN)) {
      expect(load(list).some((bit) => bit.tags.includes('shadowrun'))).toBe(false)
    }
    expect(
      load(SHADOWRUN.NAMES, { includeTags: ['shadowrun'] }).some(
        (bit) => bit.value === 'Aztechnology',
      ),
    ).toBe(true)
    expect(
      load(SHADOWRUN.NAMES, { flavor: 'shadowrun', excludeTags: ['shadowrun'] }).some(
        (bit) => bit.value === 'Aztechnology',
      ),
    ).toBe(false)
    expect(
      isFlavorEnabled('shadowrun', {
        flavor: 'shadowrun',
        excludeTags: ['shadowrun'],
        includeTags: ['shadowrun'],
      }),
    ).toBe(false)
    expect(pickSpecies({})).toBe(SPECIES.NORM)
  })

  it('uses setting names and short names without changing the source lists', () => {
    const role = (flavor: 'cyberpunk' | 'shadowrun' | 'cyberpunk2020-2077', id: string) =>
      load(SHADOWRUN.CHARACTERS, { flavor }).find(bit => bit.id === id)!
    expect(role('cyberpunk', 'network-specialist').value).toBe('Netrunner')
    expect(role('shadowrun', 'network-specialist').value).toBe('Decker')
    expect(role('shadowrun', 'street-samurai').shortValue).toBe('Sam')
    expect(role('cyberpunk2020-2077', 'job-contact').value).toBe('Fixer')
    expect(role('shadowrun', 'job-contact').value).toBe('Johnson')
    expect(shadowrunCharacters.find(bit => bit.id === 'network-specialist')?.value).toBe('Netrunner')
    expect(getName({ value: 'Shared', tags: [] }, 'shadowrun', 'short')).toBe('Shared')
    for (const { id: flavor } of flavors) {
      expect(load(SHADOWRUN.CHARACTERS, { flavor }).some(bit => bit.value === 'Technomancer')).toBe(flavor === 'shadowrun')
    }
  })

  it('combines both Cyberpunk corporation lists and keeps settings separate', async () => {
    const known = load(SHADOWRUN.NAMES, { flavor: 'cyberpunk2020-2077' }).filter(bit => bit.tags.includes('known-corporation'))
    expect(known).toHaveLength(cyberpunkCorporations.length)
    expect(new Set(known.map(bit => bit.id)).size).toBe(known.length)
    expect(known.some(bit => bit.value === 'Arasaka')).toBe(true)
    expect(known.some(bit => bit.value === 'Aztechnology')).toBe(false)
    expect(load(SHADOWRUN.NAMES, { flavor: 'shadowrun' }).some(bit => bit.value === 'Arasaka')).toBe(false)
    const results = await generateNames('known-corporations', 20, { flavor: 'cyberpunk2020-2077' })
    expect(results.every(result => known.some(bit => bit.value === result.primary))).toBe(true)
    await expect(generateNames('known-corporations', 1)).rejects.toThrow('setting flavor')
  })

  it('passes the flavor into nested parent corporations', async () => {
    // Force the branch that uses a named parent corporation.
    vi.spyOn(Math, 'random').mockReturnValue(0.45)
    const shadowrun = await corporations(CORPORATION_SIZE.A, false, { flavor: 'shadowrun' })
    const generic = await corporations(CORPORATION_SIZE.A, false, {})
    const knownNames = load(SHADOWRUN.NAMES, { flavor: 'shadowrun' })
      .filter((bit) => bit.tags.includes('corporation') && bit.type === 'name')
      .map((bit) => bit.value)
    expect(knownNames.some((name) => shadowrun.title?.includes(name))).toBe(true)
    expect(knownNames.some((name) => generic.title?.includes(name))).toBe(false)
  })

  it('keeps pools independent and rejects empty selections and invalid requests', async () => {
    const source = [{ value: 'One', tags: ['test'] }]
    const bits = new Bits(source)
    expect(bits.tag('test').pick.value).toBe('One')
    expect(bits.count).toBe(1)
    expect(() => new Bits(source, { not: 'test' }).pick).toThrow('No entries match')
    await expect(generateNames('missing', 1)).rejects.toThrow('category')
    await expect(generateNames('runners', 101)).rejects.toThrow('between 1 and 100')
  })

  it('keeps rounded random values inside their requested range', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(randomRounded(7, 200)).toBeGreaterThanOrEqual(7)
    expect(randomRounded(5000, 80000)).toBeGreaterThanOrEqual(5000)
    vi.mocked(Math.random).mockReturnValue(0.999999)
    expect(randomRounded(7, 197)).toBeLessThanOrEqual(197)
  })
})
