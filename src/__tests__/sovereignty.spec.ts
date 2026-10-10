import { afterEach, describe, expect, it, vi } from 'vitest'
import { GENUS } from '@/builders/types'
import { availableCategories, generateNames } from '@/generator/categories'
import { sovereignties } from '@/data/sovereignties'
import { pendingNationalities } from '@/data/names/pending'
import { bySovereignty, sovereigntyMix } from '@/patterns/cyberpunk/nationality/bySovereignty'
import * as nameParts from '@/patterns/cyberpunk/nationality/nameParts'

afterEach(() => vi.restoreAllMocks())

describe('Names by sovereignty', () => {
  const states = (flavor: 'cyberpunk' | 'shadowrun' | 'cyberpunk2020-2077') =>
    availableCategories({ flavor }).filter(item => item.group === 'Names by sovereignty')

  it('shows only the chosen setting and resolves shared names for that setting', () => {
    expect(states('cyberpunk')).toHaveLength(0)
    expect(states('shadowrun').some(item => item.id === 'sovereignty-ucas')).toBe(true)
    expect(states('shadowrun').some(item => item.id === 'sovereignty-nusa')).toBe(false)
    expect(states('cyberpunk2020-2077').some(item => item.id === 'sovereignty-nusa')).toBe(true)
    expect(states('cyberpunk2020-2077').some(item => item.id === 'sovereignty-ucas')).toBe(false)
    expect(states('shadowrun').find(item => item.id === 'sovereignty-germany')?.label).toBe('ADL — Allied German States')
    expect(states('cyberpunk2020-2077').some(item => item.id === 'sovereignty-germany')).toBe(false)
    expect(states('cyberpunk2020-2077').some(item => item.id === 'sovereignty-france')).toBe(false)
    expect(states('cyberpunk2020-2077').some(item => item.id === 'sovereignty-europe')).toBe(true)
    expect(states('shadowrun').find(item => item.id === 'sovereignty-japan')?.label).toBe('Japanese Imperial State')
    expect(states('cyberpunk2020-2077').find(item => item.id === 'sovereignty-japan')?.label).toBe('Japan')
  })

  it('places nationalities last in the picker for every flavor', () => {
    for (const flavor of ['cyberpunk', 'shadowrun', 'cyberpunk2020-2077'] as const) {
      const groups = [...new Set(availableCategories({ flavor }).map(item => item.group))]
      expect(groups[groups.length - 1]).toBe('Names by nationality')
    }
  })

  it('honors flavor overrides and lets exclusions win in both the list and generation', async () => {
    const options = { includeTags: ['shadowrun'] }
    expect(availableCategories(options).some(item => item.id === 'sovereignty-ucas')).toBe(true)
    await expect(generateNames('sovereignty-ucas', 1, options)).resolves.toHaveLength(1)
    const excluded = { ...options, excludeTags: ['shadowrun'] }
    expect(availableCategories(excluded).some(item => item.id === 'sovereignty-ucas')).toBe(false)
    await expect(generateNames('sovereignty-ucas', 1, excluded)).rejects.toThrow('setting flavor')
    await expect(generateNames('sovereignty-ucas', 1, { flavor: 'cyberpunk2020-2077' })).rejects.toThrow('setting flavor')
    await expect(bySovereignty('nusa', GENUS.M, { flavor: 'shadowrun' })).rejects.toThrow('available')
  })

  it('keeps every empty pool visible as TODO without pretending it has names', async () => {
    for (const pool of pendingNationalities) {
      expect(pool.names).toHaveLength(0)
      expect(availableCategories().find(item => item.id === pool.id)?.label).toBe(`${pool.label} TODO`)
      await expect(generateNames(pool.id, 1)).rejects.toThrow('pool is empty')
    }
    await expect(generateNames('sovereignty-asamando', 1, { flavor: 'shadowrun' })).rejects.toThrow('Ghanaian')
  })

  it('chooses by editable weights rather than source-list size, preserving gender and options', async () => {
    const name = vi.spyOn(nameParts, 'nationalName').mockReturnValue('A complete name')
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    const options = { flavor: 'shadowrun' as const }
    await bySovereignty('ucas', GENUS.F, options)
    expect(name).toHaveBeenLastCalledWith('us-american', GENUS.F, undefined, options)
    random.mockReturnValue(12.5 / 18)
    await bySovereignty('ucas', GENUS.F, options)
    expect(name).toHaveBeenLastCalledWith('french', GENUS.F, undefined, options)
    random.mockReturnValue(17.5 / 18)
    await bySovereignty('ucas', GENUS.F, options)
    expect(name).toHaveBeenLastCalledWith('spanish', GENUS.F, undefined, options)
  })

  it('skips TODO and excluded traditions before choosing, and reports an exhausted mix', async () => {
    const state = sovereignties.find(item => item.id === 'nusa')!
    const options = { flavor: 'cyberpunk2020-2077' as const, excludeTags: ['us-american', 'spanish', 'chinese', 'korean'] }
    expect(sovereigntyMix(state, GENUS.F, options).map(part => part.nationality)).toEqual(['vietnamese'])
    const [result] = await generateNames('sovereignty-nusa', 1, { ...options, genders: [GENUS.F] })
    const expectedName = nameParts.nationalName
    const spy = vi.spyOn(nameParts, 'nationalName').mockImplementation(expectedName)
    await generateNames('sovereignty-nusa', 1, { ...options, genders: [GENUS.F] })
    expect(spy).toHaveBeenCalledWith('vietnamese', GENUS.F, undefined, expect.objectContaining(options))
    expect(result?.primary).toBeTruthy()
    await expect(generateNames('sovereignty-nusa', 1, { ...options, excludeTags: [...options.excludeTags, 'vietnamese'] })).rejects.toThrow('TODO')
  })

  it('keeps sovereignty data consistent and leaves source data unchanged', () => {
    const before = JSON.stringify(sovereignties)
    expect(new Set(sovereignties.map(state => state.id)).size).toBe(sovereignties.length)
    for (const state of sovereignties) {
      expect(state.source).toMatch(/^https:\/\//)
      expect(state.tags.every(tag => ['shadowrun', 'cyberpunk2020-2077'].includes(tag))).toBe(true)
      expect(state.mix.every(part => Number.isFinite(part.weight) && part.weight > 0)).toBe(true)
      expect(new Set(state.mix.map(part => part.nationality)).size).toBe(state.mix.length)
    }
    states('shadowrun')
    states('cyberpunk2020-2077')
    expect(JSON.stringify(sovereignties)).toBe(before)
  })
})
