import { afterEach, describe, expect, it, vi } from 'vitest'
import { GENUS } from '@/builders/types'
import { rlNamesModern } from '@/data/rl-names-modern'
import { categories, generateNames } from '@/generator/categories'
import { flavors } from '@/generator/options'
import { load, RL } from '@/load'
import { NATIONALITY } from '@/patterns/cyberpunk/nationality/byNationality'
import { mixedName } from '@/patterns/cyberpunk/nationality/mixed'
import { nationalName, nationalitySurname } from '@/patterns/cyberpunk/nationality/nameParts'

const additions = [NATIONALITY.DUTCH, NATIONALITY.TURKISH, NATIONALITY.UKRAINIAN,
  NATIONALITY.SWEDISH, NATIONALITY.KOREAN, NATIONALITY.VIETNAMESE,
  NATIONALITY.HINDI, NATIONALITY.TAMIL]

afterEach(() => vi.restoreAllMocks())

describe('Sourced modern name additions', () => {
  it.each(additions)('ships at least 300 distinct source names for %s', nation => {
    const rows = rlNamesModern.filter(bit => bit.tags.includes(nation))
    expect(new Set(rows.map(bit => bit.value)).size).toBeGreaterThanOrEqual(300)
    expect(new Set(rows.map(bit => `${bit.type}:${bit.genus ?? ''}:${bit.value}`)).size).toBe(rows.length)
    expect(rows.every(bit => bit.source?.startsWith('https://'))).toBe(true)
    expect(rows.every(bit => bit.value === bit.value.trim() && !/[\p{Script=Hangul}\p{Script=Cyrillic}\p{Script=Devanagari}\p{Script=Tamil}]/u.test(bit.value))).toBe(true)
    for (const genus of [GENUS.M, GENUS.F]) {
      expect(rows.some(bit => bit.type === 'given' && (!bit.genus || bit.genus === genus))).toBe(true)
      expect(rows.some(bit => bit.type === 'family' && (!bit.genus || bit.genus === genus))).toBe(nation !== NATIONALITY.TAMIL)
    }
    expect(categories.find(category => category.id === nation)?.gender).toBe(true)
  })

  it.each(additions)('uses complete matching parts, gender and order for %s', nation => {
    for (const genus of [GENUS.M, GENUS.F]) {
      const rows = rlNamesModern.filter(bit => bit.tags.includes(nation) && (!bit.genus || bit.genus === genus))
      const givens = rows.filter(bit => bit.type === 'given').map(bit => bit.value)
      const surnames = rows.filter(bit => bit.type === 'family').map(bit => bit.value)
      for (let i = 0; i < 12; i++) {
        const name = nationalName(nation, genus)
        let matches: boolean
        if (nation === NATIONALITY.TAMIL) {
          const [initial, ...given] = name.split(' ')
          matches = givens.includes(given.join(' ')) && rlNamesModern.some(bit => bit.tags.includes('tamil') && bit.type === 'given' && bit.genus === 'm' && `${bit.value[0]}.` === initial)
        } else if (nation === NATIONALITY.KOREAN || nation === NATIONALITY.VIETNAMESE) {
          matches = surnames.some(surname => name.startsWith(`${surname} `) && givens.includes(name.slice(surname.length + 1)))
        } else {
          matches = givens.some(given => name.startsWith(`${given} `) && surnames.includes(name.slice(given.length + 1)))
        }
        expect(matches).toBe(true)
      }
      expect(() => nationalName(nation, genus, undefined, { excludeTags: [nation] })).toThrow('No entries match')
    }
  })

  it('keeps the new pools shared by flavors and honors exclusions over inclusions', () => {
    for (const nation of additions) {
      const rows = load(RL.NAMES_MODERN).filter(bit => bit.tags.includes(nation))
      for (const flavor of flavors) {
        expect(load(RL.NAMES_MODERN, { flavor: flavor.id }).filter(bit => bit.tags.includes(nation))).toEqual(rows)
        expect(load(RL.NAMES_MODERN, { flavor: flavor.id, includeTags: [nation], excludeTags: [nation] }).some(bit => bit.tags.includes(nation))).toBe(false)
      }
    }
  })

  it('shares related Ukrainian male and female surname identities', () => {
    const male = rlNamesModern.find(bit => bit.tags.includes('ukrainian') && bit.value === 'Abrahamovskyi')
    const female = rlNamesModern.find(bit => bit.tags.includes('ukrainian') && bit.value === 'Abrahamovska')
    expect(male?.genus).toBe('m')
    expect(male?.type === 'family' && male.formGroupId).toBeTruthy()
    expect(female?.genus).toBe('f')
    expect(male?.type === 'family' && female?.type === 'family' && male.formGroupId === female.formGroupId).toBe(true)
  })

  it('mixes Tamil given names with another surname tradition without inventing Tamil surnames', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const excludeTags = [...Object.values(NATIONALITY), 'arabic'].filter(tag => tag !== 'tamil' && tag !== 'dutch')
    const name = mixedName(GENUS.F, { excludeTags })
    const tamil = rlNamesModern.find(bit => bit.tags.includes('tamil') && bit.type === 'given' && bit.genus === 'f')!
    const dutch = rlNamesModern.find(bit => bit.tags.includes('dutch') && bit.type === 'family')!
    expect(name).toBe(`${tamil.value} ${dutch.value}`)
    expect(() => nationalitySurname(NATIONALITY.TAMIL)).toThrow('No entries match')
    expect(() => mixedName(GENUS.F, { excludeTags: [...excludeTags, 'dutch'] })).toThrow('two different traditions')
  })

  it('passes exclusions through nested personal names in character details', async () => {
    for (const nation of additions) {
      const names = await generateNames(nation, 2, { genus: GENUS.F, excludeTags: ['shadowrun'] })
      expect(names).toHaveLength(2)
      expect(names.every(name => name.primary && !/\b(Norm|Elf|Dwarf|Ork|Troll)\b/.test(name.appearance ?? ''))).toBe(true)
    }
  })
})
