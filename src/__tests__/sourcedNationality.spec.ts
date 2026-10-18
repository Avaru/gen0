import { traditionIds } from '@/patterns/cyberpunk/nationality/traditions'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GENUS } from '@/builders/types'
import { personalNames } from '@/data/personal-names'
import { categories, generateNames } from '@/generator/categories'
import { flavors } from '@/generator/options'
import { load, DATA } from '@/builders/load'
import { mixedName } from '@/patterns/cyberpunk/nationality/mixed'
import { nationalName, nationalitySurname } from '@/patterns/cyberpunk/nationality/nameParts'

const additions = [
  'dutch',
  'turkish',
  'ukrainian',
  'swedish',
  'korean',
  'vietnamese',
  'hindi',
  'tamil',
] as const

afterEach(() => vi.restoreAllMocks())

describe('Sourced modern name additions', () => {
  it.each(additions)('ships at least 300 distinct source names for %s', (nation) => {
    const rows = personalNames.filter((bit) => bit.tags.includes(nation))
    expect(new Set(rows.map((bit) => bit.value)).size).toBeGreaterThanOrEqual(300)
    expect(new Set(rows.map((bit) => `${bit.type}:${bit.genus ?? ''}:${bit.value}`)).size).toBe(
      rows.length,
    )
    expect(rows.every((bit) => bit.source?.startsWith('https://'))).toBe(true)
    expect(
      rows.every(
        (bit) =>
          bit.value === bit.value.trim() &&
          !/[\p{Script=Hangul}\p{Script=Cyrillic}\p{Script=Devanagari}\p{Script=Tamil}]/u.test(
            bit.value,
          ),
      ),
    ).toBe(true)
    for (const genus of [GENUS.M, GENUS.F] as const) {
      expect(rows.some((bit) => bit.type === 'given' && (!bit.genus || bit.genus === genus))).toBe(
        true,
      )
      expect(rows.some((bit) => bit.type === 'family' && (!bit.genus || bit.genus === genus))).toBe(
        nation !== 'tamil',
      )
    }
    expect(categories.find((category) => category.id === nation)?.gender).toBe(true)
  })

  it.each(additions)('uses complete matching parts, gender and order for %s', (nation) => {
    for (const genus of [GENUS.M, GENUS.F] as const) {
      const rows = personalNames.filter(
        (bit) => bit.tags.includes(nation) && (!bit.genus || bit.genus === genus),
      )
      const givens = rows.filter((bit) => bit.type === 'given').map((bit) => bit.value)
      const surnames = rows.filter((bit) => bit.type === 'family').map((bit) => bit.value)
      for (let i = 0; i < 12; i++) {
        const name = nationalName(nation, genus)
        let matches: boolean
        if (nation === 'tamil') {
          const fathers = personalNames
            .filter(
              (bit) => bit.tags.includes('tamil') && bit.type === 'given' && bit.genus === 'm',
            )
            .map((bit) => bit.value)
          matches = fathers.some(
            (father) =>
              name.startsWith(`${father} `) &&
              givens.includes(name.slice(father.length + 1)) &&
              father !== name.slice(father.length + 1),
          )
        } else if (nation === 'korean' || nation === 'vietnamese') {
          matches = surnames.some(
            (surname) =>
              name.startsWith(`${surname} `) && givens.includes(name.slice(surname.length + 1)),
          )
        } else {
          matches = givens.some(
            (given) =>
              name.startsWith(`${given} `) && surnames.includes(name.slice(given.length + 1)),
          )
        }
        expect(matches).toBe(true)
      }
      expect(() => nationalName(nation, genus, undefined, { excludeTags: [nation] })).toThrow(
        'No entries match',
      )
    }
  })

  it('omits reviewed abbreviations and corrupted source spellings while preserving valid short names', () => {
    const newRows = personalNames.filter((bit) =>
      additions.some((nation) => bit.tags.includes(nation)),
    )
    const bad = new Set([
      'Md',
      'Mhd',
      'Catyarāai',
      'Taṅkarāai',
      'Yūvarāaiṉ',
      'Varatarāaiṉ',
      'Kaailaṭcumi',
      'Inasha',
      'Ikashori',
    ])
    expect(newRows.some((bit) => bad.has(bit.value))).toBe(false)
    expect(
      newRows.some(
        (bit) => bit.tags.includes('swedish') && bit.type === 'given' && bit.value === 'Bo',
      ),
    ).toBe(true)
    expect(newRows.some((bit) => bit.tags.includes('turkish') && bit.value === 'Kırgız')).toBe(true)
    expect(newRows.some((bit) => bit.tags.includes('korean') && bit.value === 'Seo-u')).toBe(true)
    expect(newRows.some((bit) => bit.tags.includes('vietnamese') && bit.value === 'Như Ý')).toBe(
      true,
    )
  })

  it('keeps complete Hindi spellings after the Latin conversion review', () => {
    const values = personalNames.filter((bit) => bit.tags.includes('hindi')).map((bit) => bit.value)
    expect(values).toEqual(
      expect.arrayContaining([
        'Dhananjay',
        'Manju',
        'Manjula',
        'Manjusha',
        'Ranjit',
        'Jitendra',
        'Rajendra',
        'Padma',
        'Singh',
      ]),
    )
    expect(values.some((value) => /nyj|^(?:Jitendr|Rajendr|Padm|Sinh)$/.test(value))).toBe(false)
  })

  it('uses full distinct Tamil father and personal names, including with a nickname', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(nationalName('tamil', GENUS.M)).toBe('Akattiyaṉ Akaṇṭalaṉ')
    expect(nationalName('tamil', GENUS.M, 'Ghost')).toBe("Akattiyaṉ Akaṇṭalaṉ 'Ghost'")
    expect(nationalName('tamil', GENUS.F)).not.toContain('.')
    expect(() => nationalName('tamil', GENUS.M, undefined, { excludeTags: ['tamil'] })).toThrow(
      'No entries match',
    )
  })

  it('keeps the new pools shared by flavors and honors exclusions over inclusions', () => {
    for (const nation of additions) {
      const rows = load(DATA.PERSONAL_NAMES).filter((bit) => bit.tags.includes(nation))
      for (const flavor of flavors) {
        expect(
          load(DATA.PERSONAL_NAMES, { flavor: flavor.id }).filter((bit) =>
            bit.tags.includes(nation),
          ),
        ).toEqual(rows)
        expect(
          load(DATA.PERSONAL_NAMES, {
            flavor: flavor.id,
            includeTags: [nation],
            excludeTags: [nation],
          }).some((bit) => bit.tags.includes(nation)),
        ).toBe(false)
      }
    }
  })

  it('shares related Ukrainian male and female surname identities', () => {
    const male = personalNames.find(
      (bit) => bit.tags.includes('ukrainian') && bit.value === 'Abrahamovskyi',
    )
    const female = personalNames.find(
      (bit) => bit.tags.includes('ukrainian') && bit.value === 'Abrahamovska',
    )
    expect(male?.genus).toBe('m')
    expect(male?.type === 'family' && male.formGroupId).toBeTruthy()
    expect(female?.genus).toBe('f')
    expect(
      male?.type === 'family' &&
        female?.type === 'family' &&
        male.formGroupId === female.formGroupId,
    ).toBe(true)
  })

  it('mixes Tamil given names with another surname tradition without inventing Tamil surnames', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const excludeTags = [...traditionIds, 'arabic'].filter(
      (tag) => tag !== 'tamil' && tag !== 'dutch',
    )
    const name = mixedName(GENUS.F, { excludeTags })
    const tamil = personalNames.find(
      (bit) => bit.tags.includes('tamil') && bit.type === 'given' && bit.genus === 'f',
    )!
    const dutch = personalNames.find((bit) => bit.tags.includes('dutch') && bit.type === 'family')!
    expect(name).toBe(`${tamil.value} ${dutch.value}`)
    expect(() => nationalitySurname('tamil')).toThrow('No entries match')
    expect(() => mixedName(GENUS.F, { excludeTags: [...excludeTags, 'dutch'] })).toThrow(
      'two different traditions',
    )
  })

  it('passes exclusions through nested personal names in character details', () => {
    for (const nation of additions) {
      const names = generateNames(nation, 2, { genus: GENUS.F, excludeTags: ['shadowrun'] })
      expect(names).toHaveLength(2)
      expect(
        names.every(
          (name) => name.primary && !/\b(Norm|Elf|Dwarf|Ork|Troll)\b/.test(name.appearance ?? ''),
        ),
      ).toBe(true)
    }
  })
})
