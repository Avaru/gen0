import { afterEach, describe, expect, it, vi } from 'vitest'
import { corporations, knownCorporation } from '@/patterns/cyberpunk/corporations/corporations'
import { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'
import { flavors } from '@/generator/options'
import { corporationEvents } from '@/data/corporation-events'
import { seedRandom } from './helpers/random'
import { load, DATA } from '@/builders/load'
import * as personalNames from '@/patterns/cyberpunk/people/names'
import * as weaponNames from '@/patterns/cyberpunk/content/weaponName'

afterEach(() => vi.restoreAllMocks())

function rows(size: CORPORATION_SIZE, flavor: (typeof flavors)[number]['id'] = 'cyberpunk') {
  return corporations({ corporationSize: size, flavor }).details!.split('\n')
}

function escapePattern(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function eventPattern(template: string): RegExp {
  const parts = template.split(/(\[[^\]]+\]|\$(?:people|product|corporation)\$)/g)
  const pattern = parts
    .map((part) => {
      if (part.startsWith('['))
        return `(?:${part.slice(1, -1).split('|').map(escapePattern).join('|')})`
      if (part === '$product$') return '(?<product>.+?)'
      if (part === '$people$' || part === '$corporation$') return '.+?'
      return escapePattern(part)
    })
    .join('')
  return new RegExp(`^${pattern}$`)
}

describe('generated corporation details', () => {
  it('limits the details to the requested company sizes in every flavor', () => {
    seedRandom()
    for (const { id: flavor } of flavors) {
      const small = rows(CORPORATION_SIZE.A, flavor)
      expect(small).toHaveLength(2)
      expect(small[1]).toMatch(/^CEO: \S/)
      const medium = rows(CORPORATION_SIZE.AA, flavor)
      expect(medium).toHaveLength(4)
      expect(medium[1]).toMatch(/^CEO: \S/)
      expect(medium[2]).toMatch(/^Founded: \d{4}$/)
      expect(medium[3]).toMatch(/^20\d{2}: \S/)
      expect(medium.join('\n')).not.toContain('Recent event:')
      const large = rows(CORPORATION_SIZE.AAA, flavor)
      expect([7, 8]).toContain(large.length)
      expect(large[1]).toMatch(/^CEO: \S/)
      expect(large[3]).toMatch(/^Subsidiaries: \S/)
      expect(large[4]).toBe('Events:')
      expect([2, 3]).toContain(large.slice(5).length)
      expect([...small, ...medium, ...large].join('\n')).not.toMatch(/undefined|NaN|\$/)
    }
  })

  it.each([
    [0, 1, 2],
    [0.8, 2, 3],
    [0.999999, 2, 3],
  ])(
    'keeps AAA dates and distinct subsidiaries valid at draw %s',
    (draw, subsidiaryCount, eventCount) => {
      vi.spyOn(Math, 'random').mockReturnValue(draw)
      const result = corporations({ corporationSize: CORPORATION_SIZE.AAA })
      const lines = result.details!.split('\n')
      const founding = Number(lines[2]!.slice('Founded: '.length))
      expect(founding).toBeGreaterThanOrEqual(2020)
      expect(founding).toBeLessThanOrEqual(2077)
      const subsidiaries = lines[3]!.slice('Subsidiaries: '.length).split('; ')
      expect(subsidiaries).toHaveLength(subsidiaryCount)
      expect(new Set(subsidiaries).size).toBe(subsidiaryCount)
      expect(subsidiaries).not.toContain(result.primary)
      const years = lines.slice(5).map((line) => Number(line.slice(0, 4)))
      expect(years).toHaveLength(eventCount)
      expect(years.every((year) => year >= founding && year <= 2077)).toBe(true)
      expect(years).toEqual([...years].sort((a, b) => a - b))
      // Rendering may add names, but each history uses different templates.
      const templates = lines.slice(5).map((line) =>
        corporationEvents.findIndex((event) => {
          return eventPattern(event.value).test(line.slice(6))
        }),
      )
      expect(templates.every((index) => index >= 0)).toBe(true)
      expect(new Set(templates).size).toBe(eventCount)
    },
  )

  it('sorts a history with different years without predating the company', () => {
    seedRandom()
    const lines = rows(CORPORATION_SIZE.AAA)
    const founding = Number(lines[2]!.slice('Founded: '.length))
    const years = lines.slice(5).map((line) => Number(line.slice(0, 4)))
    expect(new Set(years).size).toBeGreaterThan(1)
    expect(years.every((year) => year >= founding && year <= 2077)).toBe(true)
    expect(years).toEqual([...years].sort((a, b) => a - b))
  })

  it.each([
    [0, 2020],
    [0.999999, 2077],
  ])('allows AA events at the timeline boundary for draw %s', (draw, year) => {
    vi.spyOn(Math, 'random').mockReturnValue(draw)
    const lines = rows(CORPORATION_SIZE.AA)
    expect(Number(lines[2]!.slice('Founded: '.length))).toBe(year)
    expect(Number(lines[3]!.slice(0, 4))).toBe(year)
  })

  it('can generate distinct subsidiaries even with fixed random draws', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.8)
    const result = corporations({ corporationSize: CORPORATION_SIZE.AAA })
    const subsidiaries = result.details!.split('\n')[3]!.slice('Subsidiaries: '.length).split('; ')
    expect(subsidiaries).toHaveLength(2)
    expect(new Set(subsidiaries).size).toBe(2)
    expect(subsidiaries).not.toContain(result.primary)
  })

  it('uses excluded personal-name pools and flavor rules for nested details', () => {
    seedRandom()
    const options = {
      flavor: 'cyberpunk2020-2077' as const,
      excludeTags: ['shadowrun', 'german', 'japanese'],
    }
    const banned = load(DATA.NAME_FRAGMENTS, { flavor: 'shadowrun' })
      .filter((bit) => bit.tags.includes('known-corporation'))
      .map((bit) => bit.value)
    const personSpy = vi.spyOn(personalNames, 'genericName')
    const results = Array.from({ length: 20 }, () =>
      corporations({ ...options, corporationSize: CORPORATION_SIZE.AAA }),
    )
    expect(
      results.some((result) => banned.some((name) => JSON.stringify(result).includes(name))),
    ).toBe(false)
    expect(personSpy).toHaveBeenCalledWith(expect.objectContaining(options), false)
    expect(
      personSpy.mock.calls.every(
        ([nestedOptions, includeNickname]) =>
          nestedOptions?.flavor === options.flavor &&
          nestedOptions.excludeTags === options.excludeTags &&
          includeNickname === false,
      ),
    ).toBe(true)
  })

  it('keeps known companies as names only', () => {
    seedRandom()
    expect(Object.keys(knownCorporation({ flavor: 'shadowrun' }))).toEqual(['primary'])
    expect(Object.keys(knownCorporation({ flavor: 'cyberpunk2020-2077' }))).toEqual(['primary'])
  })

  it('includes a weapon type even when a product uses a numeric model without a series', () => {
    const models = load(DATA.WEAPONS).filter((bit) => bit.type === 'model')
    const index = models.findIndex((bit) => bit.value === '200')
    expect(index).toBeGreaterThanOrEqual(0)
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce((index + 0.1) / models.length)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0)
    expect(weaponNames.weaponProductName()).toBe('200 Revolver')
  })

  it('omits the type when a weapon product has a quoted series', () => {
    const data = load(DATA.WEAPONS)
    const model = data.find((bit) => bit.type === 'model')!.value
    const series = data.find((bit) => bit.type === 'series')!.value
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(weaponNames.weaponProductName()).toBe(`${model} “${series}”`)
    expect(random).toHaveBeenCalledTimes(3)
  })
})
