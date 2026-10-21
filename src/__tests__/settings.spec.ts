import { describe, expect, it } from 'vitest'
import {
  matchesSettingsQuery,
  normalizeGeneratorSettings,
  settingsQuery,
} from '@/generator/settings'

describe('Generator settings normalization', () => {
  it('defaults unknown settings to Cyberpunk without losing valid flavor and category choices', () => {
    expect(
      normalizeGeneratorSettings({ setting: 'missing', flavor: 'shadowrun', category: 'german' }),
    ).toMatchObject({ setting: 'cyberpunk', flavor: 'shadowrun', category: 'german' })
  })

  it('applies the same fallback to a link and to a flavor update', () => {
    const previous = normalizeGeneratorSettings({
      flavor: 'shadowrun',
      category: 'known-corporations',
    })
    const updated = normalizeGeneratorSettings({ ...previous, flavor: 'cyberpunk' })
    const linked = normalizeGeneratorSettings({
      flavor: 'cyberpunk',
      category: 'known-corporations',
    })
    expect(updated).toEqual(linked)
    expect(updated.category).toBe('corporations')
    expect(normalizeGeneratorSettings({ ...previous, category: 'missing' }).category).toBe(
      'runners',
    )
  })

  it('normalizes repeated query values and removes selections irrelevant to the category', () => {
    const settings = normalizeGeneratorSettings({
      category: 'german',
      gender: ['f,m', 'f', 'invalid'],
      size: ['a'],
    })
    expect(settings.gender).toEqual(['m', 'f'])
    expect(settings.size).toEqual([])
    expect(settingsQuery(settings)).toEqual({})
    expect(normalizeGeneratorSettings({ ...settings, gender: [] }).gender).toEqual(['m', 'f'])
  })

  it('compares URL contents without depending on property order', () => {
    const query = settingsQuery(normalizeGeneratorSettings({ category: 'german', gender: 'f' }))
    expect(matchesSettingsQuery({ gender: 'f' }, query)).toBe(true)
    expect(matchesSettingsQuery({ ...query, count: '10' }, query)).toBe(false)
    expect(matchesSettingsQuery({ ...query, gender: ['f'] }, query)).toBe(false)
  })
})
