import { afterEach, describe, expect, it, vi } from 'vitest'
import { GENUS } from '@/builders/types'
import type { NameEntry } from '@/data/nameTypes'
import { generateNames } from '@/generator/categories'
import { flavors } from '@/generator/options'
import * as nameData from '@/load'
import { RL } from '@/load'
import { clearNamePools } from '@/builders/namePools'
import { NATIONALITY, genericNationality } from '@/patterns/cyberpunk/nationality/byNationality'
import {
  nationalName,
  nationalityGivenName,
  nationalitySurname,
} from '@/patterns/cyberpunk/nationality/nameParts'

const fixture: NameEntry[] = [
    ['chinese', 'Mei Lan', 'Li Hua', 'Wei', 'Jun', 'Au Yeung', 'Wang'],
    ['japanese', 'Haruka', 'Yui', 'Hiroshi', 'Kenji', 'Sato', 'Tanaka'],
    ['spanish', 'María José', 'Elena', 'Juan', 'Carlos', 'de la Cruz', 'Santos'],
    ['arabic', 'Layla', 'Aisha', 'Ahmed', 'Omar', 'Haddad', 'Masri'],
  ].flatMap(([nation, female, female2, male, male2, family, family2]) => [
    ...[
      [female, GENUS.F],
      [female2, GENUS.F],
      [male, GENUS.M],
      [male2, GENUS.M],
    ].map(([value, genus]) => ({
      id: `${nation}-${value}`,
      tags: [nation!],
      value: value!,
      type: 'given' as const,
      genus: genus as GENUS.F | GENUS.M,
    })),
    ...[family, family2].map((value) => ({
      id: `${nation}-${value}`,
      tags: [nation!],
      value: value!,
      type: 'family' as const,
      formGroupId: `${nation}-${value}`,
    })),
  ])

function useFixture() {
  clearNamePools()
  const originalLoad = nameData.load
  vi.spyOn(nameData, 'load').mockImplementation((list, options = {}) =>
    list === RL.NAMES_MODERN
      ? fixture.filter((bit) => !options.excludeTags?.some((tag) => bit.tags.includes(tag)))
      : originalLoad(list, options),
  )
}

afterEach(() => {
  clearNamePools()
  vi.restoreAllMocks()
})

describe('Critical nationality construction', () => {
  it.each([NATIONALITY.CHINESE, NATIONALITY.JAPANESE])(
    'keeps %s family first with no random extra names',
    async (nation) => {
      useFixture()
      const expected = nation === NATIONALITY.CHINESE ? 'Au Yeung Mei Lan' : 'Sato Haruka'
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(nationalName(nation, GENUS.F)).toBe(expected)
      expect((await genericNationality(nation, GENUS.F, 'Ghost')).primary).toBe(
        `${expected} 'Ghost'`,
      )
      vi.mocked(Math.random).mockReturnValue(0.99)
      expect(nationalName(nation, GENUS.F)).toBe(
        nation === NATIONALITY.CHINESE ? 'Wang Li Hua' : 'Tanaka Yui',
      )
    },
  )

  it('uses two Spanish surnames and preserves optional second given names and compound parts', () => {
    useFixture()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(nationalName(NATIONALITY.SPANISH, GENUS.F, 'Ghost')).toBe(
      "María José Elena 'Ghost' de la Cruz Santos",
    )
    vi.mocked(Math.random).mockReturnValue(0.99)
    expect(nationalName(NATIONALITY.SPANISH, GENUS.F)).toBe('Elena Santos de la Cruz')
  })

  it('uses bint with a male given name for a daughter and ibn/bin for a son', () => {
    useFixture()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(nationalName('arabic', GENUS.F)).toBe('Layla bint Ahmed Haddad')
    expect(nationalName('arabic', GENUS.M)).toBe('Ahmed ibn Ahmed Haddad')
    const draws = [0, 0, 0, 0.99, 0, 0]
    vi.mocked(Math.random).mockImplementation(() => draws.shift() ?? 0)
    expect(nationalName('arabic', GENUS.M)).toBe('Ahmed bin Ahmed Haddad')
  })

  it('also generates short Arabic names and father names without a marker', () => {
    useFixture()
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    expect(nationalName('arabic', GENUS.F)).toBe('Aisha Masri')
    const draws = [0, 0, 0.99, 0, 0]
    vi.mocked(Math.random).mockImplementation(() => draws.shift() ?? 0)
    expect(nationalName('arabic', GENUS.F)).toBe('Layla Ahmed Haddad')
  })

  it('passes exclusions into the nested Arabic father selection and reusable parts', () => {
    useFixture()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    fixture
      .filter((bit) => bit.type === 'given' && bit.tags.includes('arabic') && bit.genus === GENUS.M)
      .forEach((bit) => bit.tags.push('test-father'))
    try {
      expect(() =>
        nationalName('arabic', GENUS.F, undefined, { excludeTags: ['test-father'] }),
      ).toThrow('No entries match')
      expect(nationalityGivenName('arabic', GENUS.F)).toBe('Layla')
      expect(nationalitySurname('arabic', GENUS.F)).toBe('Haddad')
    } finally {
      fixture.forEach((bit) => {
        bit.tags = bit.tags.filter((tag) => tag !== 'test-father')
      })
    }
  })

  it.each(['chinese', 'japanese', 'spanish', 'arabic'])(
    'uses the new %s rules through the category entry point in every flavor',
    async (category) => {
      useFixture()
      vi.spyOn(Math, 'random').mockReturnValue(0)
      for (const flavor of flavors) {
        for (const genus of [GENUS.F, GENUS.M]) {
          const [name] = await generateNames(category, 1, { genus, flavor: flavor.id })
          const expected: Record<string, string[]> = {
            chinese: ['Au Yeung Mei Lan', 'Au Yeung Wei'],
            japanese: ['Sato Haruka', 'Sato Hiroshi'],
            spanish: ['María José Elena de la Cruz Santos', 'Juan Carlos de la Cruz Santos'],
            arabic: ['Layla bint Ahmed Haddad', 'Ahmed ibn Ahmed Haddad'],
          }
          expect(name!.primary).toBe(expected[category]![genus === GENUS.F ? 0 : 1])
        }
      }
      await expect(
        generateNames(category, 1, { genus: GENUS.F, excludeTags: [category] }),
      ).rejects.toThrow('No entries match')
    },
  )

  it.each(['chinese', 'japanese', 'spanish', 'arabic'])(
    'generates %s names using the shipped lists',
    async (category) => {
      for (const genus of [GENUS.F, GENUS.M]) {
        const names = await generateNames(category, 20, { genus })
        expect(names).toHaveLength(20)
        expect(
          names.every((name) => name.primary.length > 0 && !/undefined|sint/.test(name.primary)),
        ).toBe(true)
      }
    },
  )
})
