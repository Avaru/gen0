import { describe, expect, it, vi } from 'vitest'
import { availableCategories, generateNames } from '@/generator/categories'
import { normalizeGeneratorSettings } from '@/generator/settings'
import { neverMidnightEnabled } from '@/generator/settingRegistry'
import { nationalName } from '@/patterns/cyberpunk/nationality/nameParts'

const options = { setting: 'never-midnight' } as const

describe.runIf(neverMidnightEnabled)('Never Midnight names', () => {
  it('offers only the three requested countries and falls back to German', () => {
    expect(availableCategories(options).map((category) => category.id)).toEqual([
      'german',
      'russian',
      'polish',
    ])
    expect(
      normalizeGeneratorSettings({ ...options, category: 'runners', flavor: 'shadowrun' }),
    ).toMatchObject({ ...options, category: 'german', flavor: undefined })
    expect(() => generateNames('runners', 1, options)).toThrow('Choose an available category')
  })

  it.each(['german', 'russian', 'polish'] as const)(
    'reuses %s name rules and name forms without character details',
    (country) => {
      vi.spyOn(Math, 'random').mockReturnValue(0.4)
      for (const gender of ['m', 'f'] as const) {
        const expected = nationalName(country, gender, undefined, options)
        expect(generateNames(country, 1, { ...options, genders: [gender] })).toEqual([
          { primary: expected },
        ])
      }
    },
  )

  it('passes exclusions to the reused name pools', () => {
    expect(() => generateNames('german', 1, { ...options, excludeTags: ['german'] })).toThrow(
      'No entries match the required parts for German names',
    )
  })
})
