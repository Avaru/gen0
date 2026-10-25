import { describe, expect, it, vi } from 'vitest'
import { berlinerName, countryName } from '@/patterns/never-midnight/names'
import { eastBerlinStreets } from '@/data/east-berlin-streets'
import { cyberpunkCategories } from '@/generator/definitions/cyberpunk'
import { neverMidnightCategories } from '@/generator/definitions/never-midnight'

const options = { genus: 'f' } as const

function expectedBerlinAddress(): string {
  const street = eastBerlinStreets[Math.floor(eastBerlinStreets.length * 0.4)]!
  const number = 1 + Math.floor(street.maxHouseNumber * 0.4)
  return `${street.street} ${number}, ${street.district}`
}

describe('Never Midnight name addresses', () => {
  it('adds only the street, number, and district to German details', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4)
    expect(countryName('german', options).details).toBe(expectedBerlinAddress())
  })

  it.each(['polish', 'russian'] as const)(
    'leaves standalone %s names without an address',
    (country) => {
      vi.spyOn(Math, 'random').mockReturnValue(0.4)
      expect(countryName(country, options).details).toBeUndefined()
    },
  )

  it.each([
    [0, 'german'],
    [0.75 - Number.EPSILON, 'german'],
    [0.75, 'polish'],
    [0.85 - Number.EPSILON, 'polish'],
    [0.85, 'russian'],
    [1 - Number.EPSILON, 'russian'],
  ] as const)(
    'uses the 75/10/15 mix at draw %s and always adds a Berlin address',
    (draw, country) => {
      const random = vi.spyOn(Math, 'random').mockReturnValue(0.4)
      const expected = countryName(country, options)
      random.mockReturnValueOnce(draw)
      const person = berlinerName(options)
      expect(person).toMatchObject(expected)
      expect(person.details).toBe(expectedBerlinAddress())
    },
  )

  it('offers Berliner with name controls only in Never Midnight', () => {
    expect(neverMidnightCategories.find(({ id }) => id === 'berliner')).toMatchObject({
      label: 'Berliner',
      gender: true,
      generate: berlinerName,
    })
    expect(cyberpunkCategories.some(({ id }) => id === 'berliner')).toBe(false)
  })
})
