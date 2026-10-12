import { seedRandom } from './helpers/random'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateNames } from '@/generator/categories'
import { flavors, isFlavorEnabled } from '@/generator/options'
import { load, DATA } from '@/builders/load'
import { SPECIES, pickSpecies } from '@/patterns/cyberpunk/people/species'
import { corporations } from '@/patterns/cyberpunk/corporations/corporations'
import { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'
import { randomRounded } from '@/helper/randomRounded'
import { GENUS } from '@/builders/types'
import Bits from '@/builders/Bits'
import { getName } from '@/generator/names'
import { runnerTraits } from '@/data/runner-traits'
import { cyberpunkCorporations } from '@/data/cyberpunk-corporations'

afterEach(() => vi.restoreAllMocks())

describe('migrated generator', () => {
  it('retains the migrated lists with duplicate role spellings merged', () => {
    const options = { flavor: 'shadowrun' as const }
    const additions = [
      'dutch',
      'turkish',
      'ukrainian',
      'swedish',
      'korean',
      'vietnamese',
      'hindi',
      'tamil',
    ]
    expect(
      load(DATA.PERSONAL_NAMES, options).filter(
        (bit) => !bit.tags.some((tag) => additions.includes(tag)),
      ),
    ).toHaveLength(19478)
    expect(load(DATA.NAME_FRAGMENTS, options)).toHaveLength(2179)
    // Includes the user's hair, face, and clothing words, with outer entries removed.
    expect(load(DATA.RUNNER_TRAITS, options)).toHaveLength(479)
    expect(load(DATA.FOOD, options)).toHaveLength(611)
    expect(load(DATA.MOVIES, options)).toHaveLength(517)
  })

  it('filters flavor entries and allows explicit inclusion and exclusion', () => {
    for (const list of Object.values(DATA)) {
      expect(load(list).some((bit) => bit.tags.includes('shadowrun'))).toBe(false)
    }
    expect(
      load(DATA.NAME_FRAGMENTS, { includeTags: ['shadowrun'] }).some(
        (bit) => bit.value === 'Aztechnology',
      ),
    ).toBe(true)
    expect(
      load(DATA.NAME_FRAGMENTS, { flavor: 'shadowrun', excludeTags: ['shadowrun'] }).some(
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

  it('keeps movie experience terms in their own flavors and respects overrides', () => {
    for (const { id: flavor } of flavors) {
      const values = load(DATA.MOVIES, { flavor }).map((bit) => bit.value)
      expect(values.includes('BTL trip')).toBe(flavor === 'shadowrun')
      expect(values.includes('Braindance')).toBe(flavor === 'cyberpunk2020-2077')
      expect(values.includes('XBD')).toBe(flavor === 'cyberpunk2020-2077')
    }
    const included = load(DATA.MOVIES, {
      includeTags: ['cyberpunk2020-2077'],
    }).map((bit) => bit.value)
    expect(included).toEqual(expect.arrayContaining(['Braindance', 'XBD']))
    const excluded = load(DATA.MOVIES, {
      flavor: 'cyberpunk2020-2077',
      includeTags: ['cyberpunk2020-2077'],
      excludeTags: ['cyberpunk2020-2077'],
    }).map((bit) => bit.value)
    expect(excluded).not.toContain('Braindance')
    expect(excluded).not.toContain('XBD')
  })

  it('uses setting names and short names without changing the source lists', () => {
    const role = (flavor: 'cyberpunk' | 'shadowrun' | 'cyberpunk2020-2077', id: string) =>
      load(DATA.RUNNER_TRAITS, { flavor }).find((bit) => bit.id === id)!
    expect(role('cyberpunk', 'network-specialist').value).toBe('Netrunner')
    expect(role('shadowrun', 'network-specialist').value).toBe('Decker')
    expect(role('shadowrun', 'street-samurai').shortValue).toBe('Sam')
    expect(role('cyberpunk2020-2077', 'job-contact').value).toBe('Fixer')
    expect(role('shadowrun', 'job-contact').value).toBe('Johnson')
    expect(runnerTraits.find((bit) => bit.id === 'network-specialist')?.value).toBe(
      'Netrunner',
    )
    expect(getName({ value: 'Shared', tags: [] }, 'shadowrun', 'short')).toBe('Shared')
    for (const { id: flavor } of flavors) {
      expect(
        load(DATA.RUNNER_TRAITS, { flavor }).some((bit) => bit.value === 'Technomancer'),
      ).toBe(flavor === 'shadowrun')
    }
  })

  it('combines both Cyberpunk corporation lists and keeps settings separate', () => {
    const known = load(DATA.NAME_FRAGMENTS, { flavor: 'cyberpunk2020-2077' }).filter((bit) =>
      bit.tags.includes('known-corporation'),
    )
    expect(known).toHaveLength(cyberpunkCorporations.length)
    expect(new Set(known.map((bit) => bit.source)).size).toBe(known.length)
    expect(known.some((bit) => bit.value === 'Arasaka')).toBe(true)
    expect(known.some((bit) => bit.value === 'Aztechnology')).toBe(false)
    expect(
      load(DATA.NAME_FRAGMENTS, { flavor: 'shadowrun' }).some((bit) => bit.value === 'Arasaka'),
    ).toBe(false)
    const results = generateNames('known-corporations', 20, { flavor: 'cyberpunk2020-2077' })
    expect(results.every((result) => known.some((bit) => bit.value === result.primary))).toBe(true)
    expect(() => generateNames('known-corporations', 1)).toThrow('setting flavor')
  })

  it('passes the flavor into nested parent corporations', () => {
    // Force the branch that uses a named parent corporation.
    vi.spyOn(Math, 'random').mockReturnValue(0.45)
    const shadowrun = corporations({ corporationSize: CORPORATION_SIZE.A, flavor: 'shadowrun' })
    const generic = corporations({ corporationSize: CORPORATION_SIZE.A })
    const knownNames = load(DATA.NAME_FRAGMENTS, { flavor: 'shadowrun' })
      .filter((bit) => bit.tags.includes('corporation') && bit.type === 'name')
      .map((bit) => bit.value)
    expect(knownNames.some((name) => shadowrun.title?.includes(name))).toBe(true)
    expect(knownNames.some((name) => generic.title?.includes(name))).toBe(false)
  })

  it('generates only selected genders and keeps Russian name parts consistent', () => {
    seedRandom()
    const data = load(DATA.PERSONAL_NAMES).filter((bit) => bit.tags.includes('russian'))
    for (const genders of [[GENUS.F], [GENUS.M], [GENUS.M, GENUS.F]] as const) {
      const seen = new Set<'m' | 'f'>()
      const results = generateNames('russian', 50, { genders })
      for (const result of results) {
        const words = result.primary.split(' ')
        const given = data.find((bit) => bit.type === 'given' && bit.value === words[0])!
        const genus = given.genus as 'm' | 'f'
        seen.add(genus)
        expect(genders).toContain(genus)
        expect(
          data.some(
            (bit) =>
              bit.type === 'family' &&
              bit.value === words[words.length - 1] &&
              (!bit.genus || bit.genus === genus),
          ),
        ).toBe(true)
        expect(
          words.length !== 3 ||
            data.some(
              (bit) => bit.type === 'patronymic' && bit.value === words[1] && bit.genus === genus,
            ),
        ).toBe(true)
      }
      expect([...seen].sort()).toEqual([...genders].sort())
    }
  })

  it('uses selected corporation sizes and preserves nested mega corporations', () => {
    seedRandom()
    const results = generateNames('corporations', 50, {
      corporationSizes: [CORPORATION_SIZE.A, CORPORATION_SIZE.AAA],
    })
    const employees = results.map((result) => Number(result.details!.split('\n')[0]!.replace(/[^0-9]/g, '')))
    expect(
      employees.every(
        (count) => (count >= 100 && count <= 2500) || (count >= 50000 && count <= 1000000),
      ),
    ).toBe(true)
    expect(employees.some((count) => count <= 2500)).toBe(true)
    expect(employees.some((count) => count >= 50000)).toBe(true)
    vi.mocked(Math.random).mockReturnValue(0.45)
    const [minor] = generateNames('corporations', 1, {
      flavor: 'shadowrun',
      corporationSizes: [CORPORATION_SIZE.A],
    })
    expect(minor!.title).toContain(' of ')
  })

  it('keeps pools independent and rejects empty selections and invalid requests', () => {
    const source = [{ value: 'One', tags: ['test'] }]
    const bits = new Bits(source)
    expect(bits.tag('test').take().value).toBe('One')
    expect(bits.count).toBe(1)
    expect(() => new Bits(source, { not: 'test' }).take()).toThrow('No entries match')
    expect(() => generateNames('missing', 1)).toThrow('category')
    expect(() => generateNames('runners', 101)).toThrow('between 1 and 100')
  })

  it('keeps rounded random values inside their requested range', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(randomRounded(7, 200)).toBeGreaterThanOrEqual(7)
    expect(randomRounded(5000, 80000)).toBeGreaterThanOrEqual(5000)
    vi.mocked(Math.random).mockReturnValue(0.999999)
    expect(randomRounded(7, 197)).toBeLessThanOrEqual(197)
  })
})
