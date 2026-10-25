import { describe, expect, it, vi } from 'vitest'
import { eastBerlinStreets } from '@/data/east-berlin-streets'
import { neverMidnightFlatLocations } from '@/data/never-midnight-address'
import { address } from '@/patterns/never-midnight/address'
import { cyberpunkCategories } from '@/generator/definitions/cyberpunk'
import { neverMidnightCategories } from '@/generator/definitions/never-midnight'

describe('Never Midnight addresses', () => {
  it.each(eastBerlinStreets.map((street, index) => ({ ...street, index })))(
    'uses $street with its own district and inclusive house-number bounds',
    ({ street, district, maxHouseNumber, index }) => {
      for (const [draw, number] of [
        [0, 1],
        [1 - Number.EPSILON, maxHouseNumber],
      ]) {
        vi.spyOn(Math, 'random')
          .mockReturnValue(0.5)
          .mockReturnValueOnce((index + 0.5) / eastBerlinStreets.length)
          .mockReturnValueOnce(draw!)
        expect(address()).toMatchObject({ primary: `${street} ${number}`, secondary: district })
      }
    },
  )

  it.each([
    [0, 0, 'A'],
    [0.25 - Number.EPSILON, 1 - Number.EPSILON, 'B'],
    [0.25, 0, ''],
    [1 - Number.EPSILON, 0, ''],
  ])('adds a suffix only below the 25 percent boundary (%s)', (chance, letter, suffix) => {
    vi.spyOn(Math, 'random')
      .mockReturnValue(letter as number)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(chance as number)
    expect(address()).toMatchObject({
      primary: `${eastBerlinStreets[0]!.street} 1${suffix}`,
      secondary: eastBerlinStreets[0]!.district,
    })
  })

  it.each(neverMidnightFlatLocations.map((location, index) => ({ location, index })))(
    'includes $location in the flat description',
    ({ location, index }) => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce((index + 0.5) / neverMidnightFlatLocations.length)
      expect(address()).toEqual({
        primary: `${eastBerlinStreets[0]!.street} 1`,
        secondary: eastBerlinStreets[0]!.district,
        details: location[0]!.toUpperCase() + location.slice(1),
      })
    },
  )

  it('registers Address only in Never Midnight', () => {
    expect(neverMidnightCategories.find(({ id }) => id === 'address')?.generate).toBe(address)
    expect(cyberpunkCategories.some(({ id }) => id === 'address')).toBe(false)
  })
})
