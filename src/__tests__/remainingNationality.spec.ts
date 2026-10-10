import { afterEach, describe, expect, it, vi } from 'vitest'
import { GENUS } from '@/builders/types'
import type { NameEntry } from '@/data/nameTypes'
import { generateNames } from '@/generator/categories'
import { flavors } from '@/generator/options'
import * as nameData from '@/load'
import { RL } from '@/load'
import { clearNamePools } from '@/builders/namePools'
import { NATIONALITY } from '@/patterns/cyberpunk/nationality/byNationality'
import { nationalName } from '@/patterns/cyberpunk/nationality/nameParts'
import { mixedName } from '@/patterns/cyberpunk/nationality/mixed'

const western = [
  NATIONALITY.GERMAN,
  NATIONALITY.BRITISH,
  NATIONALITY.AMERICAN_US,
  NATIONALITY.FRENCH,
  NATIONALITY.ITALIAN,
]
const familyNames: Record<string, string[]> = {
  german: ['Müller', 'Schmidt'],
  british: ['Smith', 'Jones'],
  'us-american': ['Brown', 'Wilson'],
  french: ['Le Goff', 'Martin'],
  italian: ['Di Martino', 'Rossi'],
  chinese: ['Wang', 'Li'],
  japanese: ['Sato', 'Tanaka'],
  spanish: ['García', 'Pérez'],
  russian: ['Ivanova', 'Petrova'],
  polish: ['Kowalska', 'Nowak'],
  greek: ['Papadopoulou', 'Nikolaou'],
  arabic: ['Haddad', 'Masri'],
}
const fixture: NameEntry[] = Object.entries(familyNames).flatMap(([nation, surnames]) => [
  ...['Anna', 'Maria'].map((value, index) => ({
    id: `${nation}-given-${index}`,
    tags: [nation],
    value: `${value}${nation}`,
    type: 'given' as const,
    genus: GENUS.F as const,
  })),
  ...['Ivan', 'Pyotr'].map((value, index) => ({
    id: `${nation}-father-${index}`,
    tags: [nation],
    value: `${value}${nation}`,
    type: 'given' as const,
    genus: GENUS.M as const,
  })),
  ...surnames.map((value, index) => ({
    id: `${nation}-family-${index}`,
    tags: [nation],
    value,
    type: 'family' as const,
    formGroupId: `${nation}-family-${index}`,
  })),
  ...(nation === 'russian'
    ? [
        {
          id: 'russian-patronymic',
          tags: ['russian'],
          value: 'Ivanovna',
          type: 'patronymic' as const,
          genus: GENUS.F as const,
          fatherNameId: 'russian-father-0',
        },
      ]
    : []),
])

function useFixture() {
  clearNamePools()
  const original = nameData.load
  vi.spyOn(nameData, 'load').mockImplementation((list, options = {}) =>
    list === RL.NAMES_MODERN
      ? fixture.filter((bit) => !options.excludeTags?.some((tag) => bit.tags.includes(tag)))
      : original(list, options),
  )
}
function draws(values: number[]) {
  vi.spyOn(Math, 'random').mockImplementation(() => values.shift() ?? 0.99)
}
afterEach(() => {
  clearNamePools()
  vi.restoreAllMocks()
})

describe('Remaining national name rules', () => {
  it.each(western)(
    'supports a simple %s name and optional parts without repeating them',
    (nation) => {
      useFixture()
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      expect(nationalName(nation, GENUS.F, 'Ghost')).toBe(
        `Maria${nation} 'Ghost' ${familyNames[nation]![1]}`,
      )
      vi.mocked(Math.random).mockReturnValue(0)
      const separator = ['german', 'british', 'us-american'].includes(nation) ? '-' : ' '
      expect(nationalName(nation, GENUS.F)).toBe(
        `Anna${nation} Maria${nation} ${familyNames[nation]!.join(separator)}`,
      )
    },
  )

  it.each([NATIONALITY.GERMAN, NATIONALITY.BRITISH, NATIONALITY.AMERICAN_US])(
    'also allows a space in a %s double surname',
    (nation) => {
      useFixture()
      draws([0, 0, 0, 0, 0, 0.99, 0])
      expect(nationalName(nation, GENUS.F)).toBe(
        `Anna${nation} Maria${nation} ${familyNames[nation]!.join(' ')}`,
      )
    },
  )

  it('uses fewer extra French given names and mostly single Italian surnames', () => {
    useFixture()
    vi.spyOn(Math, 'random').mockReturnValue(0.12)
    expect(nationalName(NATIONALITY.FRENCH, GENUS.F)).toBe('Annafrench Le Goff Martin')
    expect(nationalName(NATIONALITY.ITALIAN, GENUS.F)).toBe('Annaitalian Mariaitalian Di Martino')
  })

  it.each(western)(
    'uses %s rules through the category entry point with genders, flavors, and exclusions',
    async (nation) => {
      useFixture()
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      for (const flavor of flavors) {
        for (const genus of [GENUS.F, GENUS.M]) {
          const [name] = await generateNames(nation, 1, { genders: [genus], flavor: flavor.id })
          expect(name!.primary).toBe(
            `${genus === GENUS.F ? 'Maria' : 'Pyotr'}${nation} ${familyNames[nation]![1]}`,
          )
        }
      }
      await expect(
        generateNames(nation, 1, { genus: GENUS.F, excludeTags: [nation] }),
      ).rejects.toThrow('No entries match')
    },
  )
})

describe('Mixed personal names', () => {
  it('mixes different traditions and keeps additional given names together', () => {
    useFixture()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(mixedName(GENUS.F)).toBe('Annabritish Mariabritish Müller-Schmidt')
  })

  it.each([
    [NATIONALITY.CHINESE, 'Wang Annagerman'],
    [NATIONALITY.JAPANESE, 'Sato Annagerman'],
    [NATIONALITY.SPANISH, 'Annagerman Mariagerman García Pérez'],
    [NATIONALITY.RUSSIAN, 'Annagerman Ivanovna Ivanova'],
    ['arabic', 'Annagerman bint Ivanarabic Haddad'],
  ] as const)(
    'keeps the %s structure and gender forms with foreign given names',
    (nation, expected) => {
      useFixture()
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(
        nationalName(nation as NATIONALITY | 'arabic', GENUS.F, undefined, {}, NATIONALITY.GERMAN),
      ).toBe(expected)
    },
  )

  it('skips excluded sources and reports when only one tradition remains', () => {
    useFixture()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const keep = ['french', 'italian']
    const excludeTags = Object.keys(familyNames).filter((nation) => !keep.includes(nation))
    expect(mixedName(GENUS.F, { excludeTags })).toBe('Annafrench Mariafrench Di Martino Rossi')
    expect(() => mixedName(GENUS.F, { excludeTags: [...excludeTags, 'italian'] })).toThrow(
      'two different traditions',
    )
  })

  it('runs the Mixed category in every flavor with the selected gender', async () => {
    useFixture()
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    for (const flavor of flavors) {
      const [name] = await generateNames('mixed', 1, { genders: [GENUS.F], flavor: flavor.id })
      expect(name!.primary).toBe('Mariagreek Masri')
    }
  })

  it('generates the remaining categories and Mixed using shipped data', async () => {
    let state = 421
    vi.spyOn(Math, 'random').mockImplementation(() => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0
      return state / 4294967296
    })
    for (const category of [...western, 'mixed']) {
      for (const genus of [GENUS.F, GENUS.M]) {
        const names = await generateNames(category, 10, { genders: [genus] })
        expect(names).toHaveLength(10)
        expect(
          names.every((name) => name.primary.length > 0 && !name.primary.includes('undefined')),
        ).toBe(true)
      }
    }
  })
})
