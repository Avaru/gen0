import { seedRandom } from './helpers/random'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { availableCategories, generateNames } from '@/generator/categories'
import { flavors } from '@/generator/options'
import { CONTENT, load, SHADOWRUN } from '@/load'
import { deviceContents, weapons } from '@/patterns/cyberpunk/content/content'

afterEach(() => vi.restoreAllMocks())

describe('adapted content generators', () => {
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
        (bit) => bit.id === 'data-storage',
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

  it('generates complete results in every flavor with matching currencies and nested brands', () => {
    seedRandom(971)
    for (const { id: flavor } of flavors) {
      const forbidden = load(SHADOWRUN.NAMES, { includeTags: ['shadowrun', 'cyberpunk2020-2077'] })
        .filter(
          (bit) =>
            ['Arasaka', 'Militech', 'Aztechnology', 'Saeder-Krupp'].includes(bit.value) &&
            !load(SHADOWRUN.NAMES, { flavor }).some((allowed) => allowed.value === bit.value),
        )
        .map((bit) => bit.value)
      for (const id of ['weapons', 'food-menu', 'shops', 'device-data']) {
        const results = generateNames(id, 100, { flavor })
        for (const result of results) {
          const text = JSON.stringify(result)
          expect(result.primary.length).toBeGreaterThan(0)
          expect(result.details?.length).toBeGreaterThan(0)
          expect(text).not.toMatch(/undefined|NaN|\[|(?<!€)\$/)
          expect(forbidden.filter((name) => text.includes(name))).toEqual([])
          expect(
            flavor === 'shadowrun'
              ? []
              : (text.match(
                  /\b(magically|troll|orcish|elven|dwarven|shaman|enchanted|awakened|Trideo|commlink)\b[^"]*/gi,
                ) ?? []),
          ).toEqual([])
          const currencyPattern =
            flavor === 'shadowrun'
              ? /\d+ ¥$/
              : flavor === 'cyberpunk2020-2077'
                ? /\d+ €\$$/
                : /\d+ credits$/
          expect(id !== 'food-menu' || currencyPattern.test(result.details ?? '')).toBe(true)
        }
      }
    }
  }, 60000)

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

  it('reports an empty required pool rather than producing broken data', () => {
    const subjects = load(CONTENT.DEVICE_DATA)
      .filter((bit) => bit.type === 'subject')
      .map((bit) => bit.id!)
    // Ordinary pool tags can be excluded explicitly.
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(subjects.length).toBeGreaterThan(0)
    expect(() => deviceContents({ excludeTags: ['people', 'general'] })).toThrow('No entries match')
  })
})
