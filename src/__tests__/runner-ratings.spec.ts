import { afterEach, describe, expect, it, vi } from 'vitest'
import { varyRatings } from '@/patterns/cyberpunk/runners/ratings'
import type { SheetRating } from '@/data/characters/types'

const rows = (values: SheetRating[]) => values.map((value, i) => ({ definitionId: String(i), value }))
afterEach(() => vi.restoreAllMocks())

describe('runner rating variation', () => {
  it.each([0.199, 0.2])('uses the 20 percent boundary at %s', (roll) => {
    vi.spyOn(Math, 'random').mockReturnValue(0).mockReturnValueOnce(roll)
    const ratings = rows([2, 0, 1])
    varyRatings(ratings)
    expect(ratings.map((row) => row.value)).toEqual(roll < 0.2 ? [1, 1, 1] : [2, 0, 1])
  })

  it('can move the only point to a different field, without filling a blank or a full field', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const ratings = rows([1, null, 0, 2])
    varyRatings(ratings)
    expect(ratings.map((row) => row.value)).toEqual([0, null, 1, 2])
  })

  it.each([[null, null], [0, 0], [2, 2], [1]] as SheetRating[][])(
    'leaves ratings alone when no move is possible: %j', (...values) => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const ratings = rows(values)
      varyRatings(ratings)
      expect(ratings.map((row) => row.value)).toEqual(values)
    },
  )
})
