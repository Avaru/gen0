import { afterEach, describe, expect, it, vi } from 'vitest'
import Bits from '@/builders/Bits'
import { clearNamePools, getNamePools, NamePools } from '@/builders/namePools'
import { GENUS } from '@/builders/types'
import type { NameEntry } from '@/data/nameTypes'
import { flavors, type GenerationOptions } from '@/generator/options'
import * as nameData from '@/load'
import { RL } from '@/load'
import { nationalName } from '@/patterns/cyberpunk/nationality/nameParts'
import { mixedName } from '@/patterns/cyberpunk/nationality/mixed'

afterEach(() => {
  clearNamePools()
  vi.restoreAllMocks()
})

describe('Reusable name pools', () => {
  it('loads once for equivalent settings and reuses smaller pools across gender selections', () => {
    const load = vi.spyOn(nameData, 'load')
    const pools = getNamePools({ excludeTags: ['greek', 'russian'] })
    expect(getNamePools({
      flavor: 'cyberpunk', excludeTags: ['russian', 'greek', 'greek'], genders: [GENUS.F],
    })).toBe(pools)
    const female = pools.get('german', 'given', GENUS.F, true)
    expect(pools.get('german', 'given', GENUS.F, true)).toBe(female)
    expect(pools.get('german', 'given', GENUS.M, true)).not.toBe(female)
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('keeps flavor, inclusions, and exclusions separate, including mutated options', () => {
    const options: GenerationOptions = { flavor: 'shadowrun', includeTags: ['russian'] }
    const included = getNamePools(options)
    expect(included.get('russian', 'family', GENUS.F).length).toBeGreaterThan(0)
    options.excludeTags = ['russian']
    const excluded = getNamePools(options)
    expect(excluded).not.toBe(included)
    expect(excluded.get('russian')).toHaveLength(0)
    expect(included.get('russian').length).toBeGreaterThan(0)
    expect(getNamePools({ flavor: 'cyberpunk' })).not.toBe(included)
    expect(getNamePools({ flavor: 'cyberpunk2020-2077' })).not.toBe(included)
    expect(getNamePools({ flavor: 'shadowrun' })).not.toBe(included)
  })

  it('matches existing data order, weights, and gender filtering in every flavor', () => {
    for (const { id: flavor } of flavors) {
      const data = nameData.load(RL.NAMES_MODERN, { flavor })
      const pools = getNamePools({ flavor })
      expect(pools.get(undefined, 'family')).toEqual(data.filter(bit => bit.type === 'family'))
      for (const genus of [GENUS.F, GENUS.M]) {
        const matching = data.filter(bit => bit.tags.includes('russian') && bit.type === 'family' &&
          (!bit.genus || bit.genus === genus))
        expect(pools.get('russian', 'family', genus, true)).toEqual(
          [...new Map(matching.map(bit => [bit.value, bit])).values()],
        )
      }
    }
  })

  it('deduplicates only when requested and gives each person independent picks', () => {
    const source: NameEntry[] = [
      { value: 'One', type: 'family', tags: ['test'], id: 'first' },
      { value: 'Two', type: 'family', tags: ['test'] },
      { value: 'One', type: 'family', tags: ['test'], id: 'last' },
    ]
    const pools = new NamePools(source)
    expect(pools.get('test', 'family')).toHaveLength(3)
    const pool = pools.get('test', 'family', GENUS.F, true)
    expect(pool.map(bit => bit.value)).toEqual(['One', 'Two'])
    expect(pool[0]?.id).toBe('last')
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const first = new Bits(pool)
    expect(first.pick.value).toBe('One')
    expect(first.pick.value).toBe('Two')
    expect(new Bits(pool).pick.value).toBe('One')
    const selected = new Bits(pool).pick
    selected.tags.push('changed')
    selected.pick.value = 'Changed'
    expect(pool[0]?.value).toBe('One')
    expect(pool[0]?.tags).toEqual(['test'])
    expect(source).toHaveLength(3)
    expect(source[0]?.tags).toEqual(['test'])
  })

  it('reuses preparation without consuming random draws or generating the same person each time', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    getNamePools().get('german', 'given', GENUS.F, true)
    expect(random).not.toHaveBeenCalled()
    const first = nationalName('german', GENUS.F)
    random.mockReturnValue(0.99)
    expect(nationalName('german', GENUS.F)).not.toBe(first)
    random.mockReturnValue(0)
    expect(nationalName('german', GENUS.F)).toBe(first)
  })

  it('keeps mixed eligibility separate when settings or gender change', () => {
    const excludeTags = [...new Set(nameData.load(RL.NAMES_MODERN).flatMap(bit => bit.tags))]
      .filter(tag => tag !== 'dutch' && tag !== 'tamil')
    expect(mixedName(GENUS.F, { excludeTags })).toBeTruthy()
    expect(mixedName(GENUS.M, { excludeTags })).toBeTruthy()
    expect(() => mixedName(GENUS.F, { excludeTags: [...excludeTags, 'dutch'] }))
      .toThrow('two different traditions')
    expect(mixedName(GENUS.F, { excludeTags })).toBeTruthy()
  })

  it('bounds cached settings and rebuilds discarded pools without changing their names', () => {
    const first = getNamePools({ excludeTags: ['russian'] })
    const expected = first.get('german', 'given', GENUS.F, true)
    for (let index = 0; index < 8; index++) getNamePools({ excludeTags: [`unused-${index}`] })
    const rebuilt = getNamePools({ excludeTags: ['russian'] })
    expect(rebuilt).not.toBe(first)
    expect(rebuilt.get('german', 'given', GENUS.F, true)).toEqual(expected)
  })
})
