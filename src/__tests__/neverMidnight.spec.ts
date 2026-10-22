import { describe, expect, it, vi } from 'vitest'
import { availableCategories, generateNames } from '@/generator/categories'
import { normalizeGeneratorSettings } from '@/generator/settings'
import { neverMidnightEnabled } from '@/generator/settingRegistry'
import { countryName } from '@/patterns/never-midnight/names'
import { neverMidnightLooks, neverMidnightClothing } from '@/patterns/never-midnight/looks'
import { neverMidnightHairColors } from '@/data/never-midnight-traits'
import {
  neverMidnightJobs,
  neverMidnightCatalogueJobs,
  neverMidnightAdditionalJobs,
} from '@/data/never-midnight-jobs'
import { runnerTraits } from '@/data/runner-traits'
import { nationalName } from '@/patterns/cyberpunk/nationality/nameParts'

const options = { setting: 'never-midnight' } as const

describe.runIf(neverMidnightEnabled)('Never Midnight names', () => {
  it('offers the three requested countries and spells and falls back to German', () => {
    expect(availableCategories(options).map((category) => category.id)).toEqual([
      'german',
      'russian',
      'polish',
      'spells',
    ])
    expect(
      normalizeGeneratorSettings({ ...options, category: 'runners', flavor: 'shadowrun' }),
    ).toMatchObject({ ...options, category: 'german', flavor: undefined })
    expect(() => generateNames('runners', 1, options)).toThrow('Choose an available category')
  })

  it.each(['german', 'russian', 'polish'] as const)(
    'reuses %s name rules and name forms with adult ages',
    (country) => {
      vi.spyOn(Math, 'random').mockReturnValue(0.4)
      for (const gender of ['m', 'f'] as const) {
        const expected = nationalName(country, gender, undefined, options)
        expect(generateNames(country, 1, { ...options, genders: [gender] })).toEqual([
          {
            primary: expected,
            age: '37 years',
            appearance: 'White afro, heart-shaped face',
            secondary: neverMidnightJobs[Math.floor(neverMidnightJobs.length * 0.4)],
          },
        ])
      }
    },
  )

  it.each([
    [0, 18],
    [1 / 48 - Number.EPSILON, 18],
    [1 / 48, 19],
    [0.5, 42],
    [1 - Number.EPSILON, 65],
  ])('maps age draw %s to %s years', (draw, age) => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4).mockReturnValueOnce(draw)
    expect(countryName('german', options).age).toBe(`${age} years`)
  })

  it('passes exclusions to the reused name pools', () => {
    expect(() => generateNames('german', 1, { ...options, excludeTags: ['german'] })).toThrow(
      'No entries match the required parts for German names',
    )
  })
})

describe('Never Midnight appearance', () => {
  it.each(neverMidnightHairColors)('can select the approved color %s', (color) => {
    const index = neverMidnightHairColors.indexOf(color)
    vi.spyOn(Math, 'random')
      .mockReturnValue(0.4)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce((index + 0.5) / neverMidnightHairColors.length)
    expect(neverMidnightLooks()).toBe(`${color} long hair, heart-shaped face`)
  })

  it('reuses bald without adding a hair color', () => {
    const styles = runnerTraits.filter((trait) => trait.type === 'hair-style')
    const index = styles.findIndex((trait) => trait.value === 'bald')
    vi.spyOn(Math, 'random')
      .mockReturnValue(0.75)
      .mockReturnValueOnce((index + 0.5) / styles.length)
    expect(neverMidnightLooks()).toBe('bald')
  })

  it.each([
    [0.25 - Number.EPSILON, 'long hair, heart-shaped face, ragged business style'],
    [0.25, 'long hair, heart-shaped face'],
  ])('includes clothing only below the 25 percent boundary: %s', (draw, expected) => {
    vi.spyOn(Math, 'random')
      .mockReturnValue(0.4)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(draw as number)
    expect(neverMidnightLooks()).toBe(`blonde ${expected}`)
  })

  it('keeps the exact supplied colors separate from Cyberpunk', () => {
    expect([...neverMidnightHairColors]).toEqual([
      'blonde',
      'brown',
      'black',
      'red',
      'gray',
      'white',
      'silver',
      'dark blonde',
      'brown-black',
      'dyed',
      'bright blonde',
      'pitch black',
      'brunette',
    ])
    expect(
      runnerTraits.filter((trait) => trait.type === 'hair-color').map((trait) => trait.value),
    ).toContain('glowing')
  })
})

describe('Never Midnight clothing', () => {
  const wording = ['clothes', 'outfit', 'style', 'attire', 'getup', 'threads']

  it.each(wording)('ends with %s instead of a garment', (noun) => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce((wording.indexOf(noun) + 0.5) / wording.length)
    expect(neverMidnightClothing()).toBe(`mass-produced all-day ${noun}`)
  })

  it('can select the final supplied condition and style', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1 - Number.EPSILON)
    expect(neverMidnightClothing()).toBe('communist utilitarian threads')
  })
})

describe('Never Midnight jobs', () => {
  it('retains every translated catalogue entry and all supplied additions', () => {
    expect(neverMidnightCatalogueJobs).toHaveLength(63)
    expect(neverMidnightCatalogueJobs.every((job) => job.german.trim() && job.value.trim())).toBe(
      true,
    )
    expect(neverMidnightJobs).toHaveLength(76)
    expect(neverMidnightAdditionalJobs.filter((job) => job === 'archivist')).toHaveLength(2)
    expect(neverMidnightJobs).toContain("Doctor's surgery nurse")
    expect(neverMidnightJobs).toContain('Meat sales assistant')
    expect(neverMidnightJobs).toContain('Bakery sales assistant')
  })

  it.each([0, 1 - Number.EPSILON])('selects a job at random boundary %s', (draw) => {
    vi.spyOn(Math, 'random').mockReturnValue(draw)
    const person = countryName('german', options)
    expect(person.secondary).toBe(draw === 0 ? 'Pharmacy assistant' : 'Laboratory technician')
  })
})
