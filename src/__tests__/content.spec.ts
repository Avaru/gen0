import { seedRandom } from './helpers/random'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { availableCategories, generateNames } from '@/generator/categories'
import { CONTENT, load, SHADOWRUN } from '@/load'
import { deviceContents, weapons } from '@/patterns/cyberpunk/content/content'
import * as weaponNames from '@/patterns/cyberpunk/content/weaponName'
import * as personalNames from '@/patterns/cyberpunk/_secondary/names'

afterEach(() => vi.restoreAllMocks())

// Bulk generation needs room on slower deployment runners.
describe('adapted content generators', { timeout: 60_000 }, () => {
  it('uses the right category labels without changing category IDs', () => {
    for (const [flavor, label] of [
      ['cyberpunk', 'Device data'],
      ['shadowrun', 'Commlink data'],
      ['cyberpunk2020-2077', 'Shard data'],
    ] as const) {
      expect(
        availableCategories({ flavor }).find((category) => category.id === 'device-data')?.label,
      ).toBe(label)
    }
  })

  it('filters setting details, resolves shared terms, and honors exclusions', () => {
    for (const list of Object.values(CONTENT).filter((list) => list !== CONTENT.AUGMENTATIONS)) {
      expect(
        load(list).every(
          (bit) => !bit.tags.includes('shadowrun') && !bit.tags.includes('cyberpunk2020-2077'),
        ),
      ).toBe(true)
      expect(
        load(list, { includeTags: ['shadowrun'] }).some((bit) => bit.tags.includes('shadowrun')),
      ).toBe(true)
      expect(
        load(list, {
          flavor: 'shadowrun',
          includeTags: ['shadowrun'],
          excludeTags: ['shadowrun'],
        }).some((bit) => bit.tags.includes('shadowrun')),
      ).toBe(false)
    }
    expect(load(CONTENT.SHOPS).find((bit) => bit.id === 'shop-network-specialist')?.value).toBe(
      'Netrunner',
    )
    expect(
      load(CONTENT.SHOPS, { flavor: 'shadowrun' }).find(
        (bit) => bit.id === 'shop-network-specialist',
      )?.value,
    ).toBe('Decker')
    expect(
      load(CONTENT.DEVICE_DATA, { flavor: 'cyberpunk2020-2077' }).find(
        (bit) => bit.type === 'storage' && bit.flavorNames?.shadowrun === 'commlink memory',
      )?.value,
    ).toBe('data shard')
    expect(
      load(CONTENT.WEAPONS, { flavor: 'shadowrun' }).some((bit) => bit.value === 'Tech rifle'),
    ).toBe(false)
    expect(load(CONTENT.FOOD_MENU).some((bit) => bit.value === 'Kibble')).toBe(false)
    expect(
      load(CONTENT.FOOD_MENU, { flavor: 'cyberpunk2020-2077' }).some(
        (bit) => bit.value === 'Kibble',
      ),
    ).toBe(true)
  })

  it('covers every device content pattern and keeps nested exclusions', () => {
    seedRandom(971)
    const results = generateNames('device-data', 100, {
      flavor: 'shadowrun',
      excludeTags: ['shadowrun'],
    })
    const names = results.map((result) => result.primary).join('\n')
    expect(names).toMatch(/Password|Access key|Key card/)
    expect(names).toMatch(/Map of/)
    expect(names).toMatch(/ from .* to /)
    expect(names).toMatch(/photo|video|snapshot/)
    expect(names).toMatch(/model|plan|report|analysis|blueprint|drawing/i)
    const banned = load(SHADOWRUN.NAMES, { flavor: 'shadowrun' })
      .filter((bit) => bit.tags.includes('known-corporation'))
      .map((bit) => bit.value)
    expect(
      results.some((result) => banned.some((name) => JSON.stringify(result).includes(name))),
    ).toBe(false)
  })

  it('names people half the time using their gender and inherited settings', () => {
    const options = { flavor: 'shadowrun' as const, excludeTags: ['shadowrun'] }
    const subjects = load(CONTENT.DEVICE_DATA, options).filter((bit) => bit.type === 'subject')
    const nameSpy = vi.spyOn(personalNames, 'givenName')
    for (const value of ['woman', 'man', 'parent']) {
      const index = subjects.findIndex((bit) => bit.value === value)
      const subject = subjects[index]!
      for (const chance of [0.499, 0.5]) {
        nameSpy.mockClear()
        vi.spyOn(Math, 'random').mockReturnValue(0.2)
          .mockReturnValueOnce(0.2) // storage
          .mockReturnValueOnce(0.2) // mixed recording
          .mockReturnValueOnce((index + 0.1) / subjects.length)
          .mockReturnValueOnce(0.2) // description
          .mockReturnValueOnce(chance)
        const result = deviceContents(options)
        expect(result.primary.endsWith(value)).toBe(true)
        expect(nameSpy.mock.calls).toEqual(
          chance < 0.5 ? [[{ ...options, genus: subject.genus }]] : [],
        )
        expect(result.details?.includes('labeled')).toBe(chance < 0.5)
      }
    }
  })

  it('uses the five-point bonus for people and reduces technical files to 25%', () => {
    for (const [roll, pattern] of [
      [0.6, / of /], [0.849, / of /],
      [0.85, / of .*girlfriend$/], [0.899, / of .*girlfriend$/],
      [0.9, / from .* to /], [0.95, /^Map of /],
    ] as const) {
      vi.spyOn(Math, 'random').mockReturnValue(0)
        .mockReturnValueOnce(0).mockReturnValueOnce(roll)
      expect(deviceContents().primary).toMatch(pattern)
    }
    const subjects = load(CONTENT.DEVICE_DATA).filter((bit) => bit.type === 'subject')
    const index = subjects.findIndex((bit) => bit.value === 'car')
    const nameSpy = vi.spyOn(personalNames, 'givenName')
    vi.spyOn(Math, 'random').mockReturnValue(0)
      .mockReturnValueOnce(0).mockReturnValueOnce(0.2)
      .mockReturnValueOnce((index + 0.1) / subjects.length)
    expect(deviceContents().primary).toMatch(/ of car$/)
    expect(nameSpy).not.toHaveBeenCalled()
  })

  it('avoids firearm modifications on melee weapons', () => {
    const list = load(CONTENT.WEAPONS)
    const melee = list
      .filter((bit) => bit.type === 'kind')
      .findIndex((bit) => bit.tags.includes('melee'))
    const kinds = list.filter((bit) => bit.type === 'kind').length
    vi.spyOn(Math, 'random').mockReturnValue((melee + 0.1) / kinds)
    const result = weapons()
    expect(result.details).toContain('Katana')
    expect(result.details).not.toMatch(
      /Silencer|Smart targeting|Tripod|Bipod|Belt-feed|Stock|Gas-vent/,
    )
  })

  it('adds a manufacturer to the shared weapon name and preserves its settings', () => {
    seedRandom()
    const nameSpy = vi.spyOn(weaponNames, 'weaponName')
    const options = { flavor: 'shadowrun' as const, excludeTags: ['shadowrun'] }
    const result = weapons(options)
    expect(nameSpy).toHaveBeenCalledWith(options)
    const name = nameSpy.mock.results[0]!.value as string
    expect(result.primary.endsWith(` ${name}`)).toBe(true)
    expect(result.primary.length).toBeGreaterThan(name.length + 1)
    expect(result.details).toBeTruthy()
  })

  it('reports an empty required pool rather than producing broken data', () => {
    const subjects = load(CONTENT.DEVICE_DATA).filter((bit) => bit.type === 'subject')
    // Ordinary pool tags can be excluded explicitly.
    vi.spyOn(Math, 'random').mockReturnValue(0.2)
    expect(subjects.length).toBeGreaterThan(0)
    expect(() => deviceContents({ excludeTags: ['people', 'general'] })).toThrow('No entries match')
  })
})
