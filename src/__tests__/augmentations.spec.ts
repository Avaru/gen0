import { afterEach, describe, expect, it, vi } from 'vitest'
import { augmentationAttributes, augmentationData } from '@/data/augmentations'
import { availableCategories, generateNames } from '@/generator/categories'
import { flavors } from '@/generator/options'
import { CONTENT, load, SHADOWRUN } from '@/load'
import { augmentations } from '@/patterns/cyberpunk/augmentations/augmentations'
import { seedRandom } from './helpers/random'

afterEach(() => vi.restoreAllMocks())

describe('augmentations', () => {
  it('appears under Equipment in every flavor and generates coherent details', () => {
    seedRandom(971)
    for (const { id: flavor } of flavors) {
      expect(
        availableCategories({ flavor }).find((category) => category.id === 'augmentations'),
      ).toMatchObject({ label: 'Augmentations', group: 'Equipment' })
      const kinds = load(CONTENT.AUGMENTATIONS, { flavor })
      for (const result of generateNames('augmentations', 100, { flavor })) {
        const kind = kinds.find(
          (entry) =>
            result.primary === entry.value ||
            augmentationAttributes.some(
              (attribute) => result.primary === `${attribute.value} ${entry.value}`,
            ),
        )
        expect(kind).toBeDefined()
        const lines = result.details!.split('\n')
        expect(lines[lines.length - 1]).toMatch(/^Manufacturer: .+/)
        expect(lines).toHaveLength(kind!.details ? 2 : 1)
        expect(lines).toEqual([...(kind!.details ? [kind!.details] : []), expect.any(String)])
        expect(lines.every(Boolean)).toBe(true)
        expect(JSON.stringify(result)).not.toMatch(/undefined|NaN/)
      }
    }
  })

  it('describes obscure terms but leaves self-explanatory types without descriptions', () => {
    for (const id of ['cyberarm', 'thermal-vision', 'armor', 'strength', 'air-tank']) {
      expect(augmentationData.find((entry) => entry.id === id)?.details).toBeUndefined()
    }
    for (const id of ['sandevistan', 'kerenzikov', 'skillwires', 'simrig']) {
      expect(augmentationData.find((entry) => entry.id === id)?.details).toBeTruthy()
    }
  })

  it('sometimes omits the attribute and otherwise uses exactly one requested attribute', () => {
    seedRandom(102)
    const results = generateNames('augmentations', 100)
    const kinds = load(CONTENT.AUGMENTATIONS).map((entry) => entry.value)
    expect(results.some((result) => kinds.includes(result.primary))).toBe(true)
    expect(
      results.some((result) =>
        augmentationAttributes.some((entry) => result.primary.startsWith(`${entry.value} `)),
      ),
    ).toBe(true)
    expect(augmentationAttributes.map((entry) => entry.value)).toEqual([
      'Aftermarket',
      'High-tech',
      'Stolen',
      'Malfunctioning',
      'Expensive',
      'High-class',
      'Low-class',
      'Outdated',
      'Glitched',
      'Mass-produced',
      'Customized',
      'Waterproof',
      'Corporate',
      'Jury-rigged',
      'Prototype',
      'Discontinued',
      '2nd hand',
      'Iconic',
    ])
  })

  it('uses attributes only for draws below 25 percent', () => {
    const random = vi.spyOn(Math, 'random')
    random.mockReturnValue(0.249)
    const withAttribute = augmentations().primary
    expect(
      augmentationAttributes.some((entry) => withAttribute.startsWith(`${entry.value} `)),
    ).toBe(true)
    random.mockReturnValue(0.25)
    expect(load(CONTENT.AUGMENTATIONS).map((entry) => entry.value)).toContain(
      augmentations().primary,
    )
  })

  it('offers the full augmentation pool in every flavor and keeps alternate names', () => {
    const ids = augmentationData.map((entry) => entry.id)
    for (const { id: flavor } of flavors) {
      expect(load(CONTENT.AUGMENTATIONS, { flavor }).map((entry) => entry.id)).toEqual(ids)
    }
    expect(
      load(CONTENT.AUGMENTATIONS, {
        flavor: 'shadowrun',
        includeTags: ['shadowrun', 'cyberpunk2020-2077'],
        excludeTags: ['shadowrun', 'cyberpunk2020-2077'],
      }).map((entry) => entry.id),
    ).toEqual(ids)
    expect(
      load(CONTENT.AUGMENTATIONS, { flavor: 'shadowrun' }).find((entry) => entry.id === 'armor')
        ?.value,
    ).toBe('Dermal plating')
    expect(load(CONTENT.AUGMENTATIONS).find((entry) => entry.id === 'armor')?.value).toBe(
      'Subdermal armor',
    )
  })

  it('passes exclusions into nested manufacturer generation without mutating data', () => {
    seedRandom(441)
    const snapshot = JSON.stringify(augmentationData)
    const options = {
      flavor: 'shadowrun' as const,
      includeTags: ['shadowrun', 'cyberpunk2020-2077'],
      excludeTags: ['shadowrun', 'cyberpunk2020-2077'],
    }
    const banned = load(SHADOWRUN.NAMES, { includeTags: ['shadowrun', 'cyberpunk2020-2077'] })
      .filter((entry) => entry.tags.includes('known-corporation'))
      .map((entry) => entry.value)
    for (const result of generateNames('augmentations', 100, options)) {
      const manufacturer = result.details!.split('\n').pop()
      const namedManufacturer = result.primary.endsWith('Kiroshi Optics') ? 'Kiroshi' : undefined
      expect(
        banned.some(
          (brand) => brand !== namedManufacturer && manufacturer === `Manufacturer: ${brand}`,
        ),
      ).toBe(false)
    }
    expect(JSON.stringify(augmentationData)).toBe(snapshot)
  })

  it('keeps Kiroshi Optics paired with its named manufacturer', () => {
    const kinds = load(CONTENT.AUGMENTATIONS, { flavor: 'cyberpunk2020-2077' })
    const index = kinds.findIndex((entry) => entry.id === 'kiroshi-optics')
    vi.spyOn(Math, 'random').mockReturnValue((index + 0.5) / kinds.length)
    expect(augmentations({ flavor: 'cyberpunk2020-2077' }).details).toMatch(
      /^Manufacturer: Kiroshi$/,
    )
  })
})
