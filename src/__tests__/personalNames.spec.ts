import { afterEach, describe, expect, it, vi } from 'vitest'
import { GENUS } from '@/builders/types'
import { NamePools } from '@/builders/namePools'
import * as namePools from '@/builders/namePools'
import * as nameParts from '@/patterns/cyberpunk/nationality/nameParts'
import { genericName, givenName } from '@/patterns/cyberpunk/people/names'

afterEach(() => vi.restoreAllMocks())

describe('personal name forms', () => {
  it.each([
    [0, GENUS.F],
    [0.5 - Number.EPSILON, GENUS.F],
    [0.5, GENUS.M],
    [1 - Number.EPSILON, GENUS.M],
  ] as const)('chooses name forms before full-name parts at draw %s', (draw, genus) => {
    vi.spyOn(Math, 'random').mockReturnValue(0).mockReturnValueOnce(draw)
    const nationalName = vi.spyOn(nameParts, 'nationalName').mockReturnValue('Test Name')
    const options = { flavor: 'shadowrun' as const, excludeTags: ['shadowrun'] }
    expect(genericName(options, false)).toBe('Test Name')
    expect(nationalName).toHaveBeenCalledWith(expect.any(String), genus, undefined, options)
  })

  it.each([
    [0, 'Feminine'],
    [0.5 - Number.EPSILON, 'Feminine'],
    [0.5, 'Masculine'],
    [1 - Number.EPSILON, 'Masculine'],
  ] as const)('balances first-name forms with unequal pool sizes at draw %s', (draw, expected) => {
    const pools = new NamePools([
      { value: 'Feminine', type: 'given', genus: GENUS.F, tags: [] },
      ...Array.from({ length: 3 }, () => ({
        value: 'Masculine',
        type: 'given' as const,
        genus: GENUS.M as const,
        tags: [],
      })),
    ])
    vi.spyOn(namePools, 'getNamePools').mockReturnValue(pools)
    vi.spyOn(Math, 'random').mockReturnValue(0).mockReturnValueOnce(draw)
    expect(givenName()).toBe(expected)
  })

  it.each([GENUS.F, GENUS.M] as const)(
    'preserves an explicit %s first-name constraint',
    (genus) => {
      const pools = namePools.getNamePools()
      const get = vi.spyOn(pools, 'get')
      vi.spyOn(Math, 'random').mockReturnValue(genus === GENUS.F ? 0.99 : 0)
      givenName({ genus })
      expect(get).toHaveBeenCalledWith(undefined, 'given', genus)
    },
  )
})
