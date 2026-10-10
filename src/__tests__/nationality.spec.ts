import { seedRandom } from './helpers/random'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GENUS } from '@/builders/types'
import { generateNames } from '@/generator/categories'
import { load, RL } from '@/load'
import { rlNamesModern } from '@/data/rl-names-modern'
import {
  nationalName,
  nationalityGivenName,
  nationalitySurname,
  russianPatronymic,
} from '@/patterns/cyberpunk/nationality/nameParts'

afterEach(() => vi.restoreAllMocks())

describe('Modern national names in the app', () => {
  it.each(['russian', 'polish', 'greek'])(
    'uses matching name parts through the %s page generator',
    (nation) => {
      seedRandom()
      for (const genus of [GENUS.F, GENUS.M] as const) {
        const data = load(RL.NAMES_MODERN).filter(
          (bit) => bit.tags.includes(nation) && (!bit.genus || bit.genus === genus),
        )
        const names = generateNames(nation, 50, { genus })
        for (const name of names) {
          const words = name.primary.split(' ')
          expect(data.some((bit) => bit.type === 'given' && bit.value === words[0])).toBe(true)
          const surname = words[words.length - 1]!
          for (const part of nation === 'polish' ? surname.split('-') : [surname]) {
            expect(data.some((bit) => bit.type === 'family' && bit.value === part)).toBe(true)
          }
          const validRussianStructure =
            nation !== 'russian' ||
            words.length === 2 ||
            (words.length === 3 &&
              data.some((bit) => bit.type === 'patronymic' && bit.value === words[1]))
          expect(validRussianStructure).toBe(true)
        }
      }
    },
  )

  it.each([
    ['Sokolov', 'Sokolova'],
    ['Galkin', 'Galkina'],
    ['Volkov', 'Volkova'],
    ['Sorokin', 'Sorokina'],
  ])('stores %s / %s with distinct genders', (male, female) => {
    const data = load(RL.NAMES_MODERN).filter(
      (bit) => bit.tags.includes('russian') && bit.type === 'family',
    )
    expect(data.some((bit) => bit.value === male && bit.genus === GENUS.M)).toBe(true)
    expect(data.some((bit) => bit.value === female && bit.genus === GENUS.F)).toBe(true)
    expect(data.some((bit) => bit.value === male && bit.genus !== GENUS.M)).toBe(false)
  })

  it('provides reusable irregular patronymics and passes exclusions through', () => {
    expect(russianPatronymic(GENUS.F, 'Ilya')).toBe('Ilyinichna')
    expect(russianPatronymic(GENUS.M, 'Sergey')).toBe('Sergeevich')
    expect(russianPatronymic(GENUS.F, ' Dmitry ')).toBe('Dmitrievna')
    expect(() => russianPatronymic(GENUS.M, 'Unknown')).toThrow('No Russian patronymic found')
    expect(() => russianPatronymic(GENUS.F, 'Ilya', { excludeTags: ['father:ilya'] })).toThrow(
      'No Russian patronymic found',
    )
    expect(() => nationalityGivenName('russian', GENUS.F, { excludeTags: ['russian'] })).toThrow(
      'No entries match',
    )
    expect(() => nationalitySurname('greek', GENUS.F, { excludeTags: ['greek'] })).toThrow(
      'No entries match',
    )
  })

  it('retains both full and everyday Russian name structures', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(nationalName('russian', GENUS.F).split(' ')).toHaveLength(3)
    vi.mocked(Math.random).mockReturnValue(0.99)
    expect(nationalName('russian', GENUS.F).split(' ')).toHaveLength(2)
  })

  it('retains optional second Polish and Greek given names and Polish double surnames', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(nationalName('polish', GENUS.F)).toMatch(/^\S+ \S+ \S+-\S+$/)
    expect(nationalName('greek', GENUS.F)).toMatch(/^\S+ \S+ \S+$/)
    vi.mocked(Math.random).mockReturnValue(0.99)
    expect(nationalName('polish', GENUS.F).split(' ')).toHaveLength(2)
    expect(nationalName('greek', GENUS.F).split(' ')).toHaveLength(2)
  })
})

describe('Linked name data', () => {
  it('keeps unique IDs only on entries referenced by another name', () => {
    const referenced = new Set(
      rlNamesModern.flatMap((bit) =>
        bit.type === 'patronymic'
          ? [bit.fatherNameId]
          : bit.type === 'nickname'
            ? (bit.givenNameIds ?? [])
            : [],
      ),
    )
    const identified = rlNamesModern.filter((bit) => bit.id !== undefined)
    expect(new Set(identified.map((bit) => bit.id)).size).toBe(identified.length)
    expect(new Set(identified.map((bit) => bit.id))).toEqual(referenced)
    expect(identified.every((bit) => bit.type === 'given')).toBe(true)
    expect(rlNamesModern.some((bit) => bit.id === undefined)).toBe(true)
  })

  it('keeps surname groups only for related male and female forms', () => {
    const surnames = rlNamesModern.filter((bit) => bit.type === 'family')
    expect(surnames.some((bit) => bit.formGroupId === undefined)).toBe(true)
    for (const surname of surnames) {
      if (!surname.formGroupId) continue
      const related = surnames.filter((bit) => bit.formGroupId === surname.formGroupId)
      expect(related.some((bit) => bit.genus === 'm')).toBe(true)
      expect(related.some((bit) => bit.genus === 'f')).toBe(true)
    }
  })

  it('connects every gendered surname to both forms in the same tradition', () => {
    const surnames = rlNamesModern.filter((bit) => bit.type === 'family')
    for (const surname of surnames) {
      if (!surname.genus) continue
      expect(surname.formGroupId).toBeDefined()
      const related = surnames.filter((bit) => bit.formGroupId === surname.formGroupId)
      expect(related.some((bit) => bit.genus === 'm')).toBe(true)
      expect(related.some((bit) => bit.genus === 'f')).toBe(true)
      expect(related.every((bit) => bit.tags.some((tag) => surname.tags.includes(tag)))).toBe(true)
    }
    const group = (value: string) => surnames.find((bit) => bit.value === value)?.formGroupId
    expect(group('Ivanov')).toBe(group('Ivanova'))
    expect(group('Georgiades')).toBe(group('Georgiadis'))
    expect(group('Georgiadou')).toBe(group('Georgiadis'))
  })

  it('resolves every stored father and spelling alias to both patronymic forms', () => {
    const byId = new Map(
      rlNamesModern.filter((bit) => bit.id !== undefined).map((bit) => [bit.id, bit]),
    )
    for (const patronymic of rlNamesModern) {
      if (patronymic.type !== 'patronymic') continue
      const father = byId.get(patronymic.fatherNameId)
      expect(father?.type).toBe('given')
      expect(father?.genus).toBe('m')
      expect(father?.tags).toContain('russian')
      if (father?.type !== 'given') throw new Error('Missing linked father')
      for (const name of [father.value, ...(father.aliases ?? [])]) {
        expect(russianPatronymic(patronymic.genus === 'm' ? GENUS.M : GENUS.F, name)).toBe(
          patronymic.value,
        )
      }
    }
  })

  it('connects the common informal names without putting them in formal given-name pools', () => {
    for (const [nickname, given] of [
      ['Dima', 'Dmitri'],
      ['Misha', 'Mikhail'],
      ['Vanya', 'Ivan'],
    ]) {
      const entry = rlNamesModern.find((bit) => bit.type === 'nickname' && bit.value === nickname)
      if (entry?.type !== 'nickname') throw new Error('Missing nickname')
      expect(
        entry.givenNameIds?.some((id) =>
          rlNamesModern.some((bit) => bit.id === id && bit.type === 'given' && bit.value === given),
        ),
      ).toBe(true)
      expect(
        rlNamesModern.some(
          (bit) => bit.tags.includes('russian') && bit.type === 'given' && bit.value === nickname,
        ),
      ).toBe(false)
    }
  })
})
