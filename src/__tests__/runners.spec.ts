import { afterEach, describe, expect, it, vi } from 'vitest'
import { runnerTraits } from '@/data/runner-traits'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import { load, DATA } from '@/builders/load'
import { flavors } from '@/generator/options'
import { getNamePools } from '@/builders/namePools'
import { SPECIES, SPECIES_AGE } from '@/patterns/cyberpunk/people/species'
import { runnerAge } from '@/patterns/cyberpunk/runners/age'
import { runners } from '@/patterns/cyberpunk/runners/runners'
import * as peopleJobs from '@/patterns/cyberpunk/people/jobs'
import * as peopleNames from '@/patterns/cyberpunk/people/names'
import * as probability from '@/helper/prob'
import { runnerLooks } from '@/patterns/cyberpunk/runners/looks'
import { traditionIds } from '@/patterns/cyberpunk/nationality/traditions'
import { seedRandom } from './helpers/random'

afterEach(() => vi.restoreAllMocks())

describe('Runners', () => {
  it('links every runner profession, including duplicates, to an existing archetype', () => {
    const professions = runnerTraits.filter((entry) => entry.tags.includes('runner') && entry.type === 'profession')
    expect(professions).toHaveLength(22)
    const ids = cbrPnkCatalogue.archetypes.map((item) => item.id)
    for (const entry of professions) expect(ids).toContain(entry.archetypeId)
  })

  it.each(flavors)('keeps the main profession link through $label flavor naming and secondary professions', ({ id: flavor }) => {
    seedRandom()
    const professions = load(DATA.RUNNER_TRAITS, { flavor }).filter((entry) => entry.tags.includes('runner') && entry.type === 'profession')
    for (let i = 0; i < 100; i++) {
      const runner = runners({ flavor })
      const mainTitle = runner.secondary!.split(/ turned | previously a | aspiring to become a /)[0]!
      const profession = [...professions].sort((a, b) => b.value.length - a.value.length).find((entry) => mainTitle.endsWith(entry.value))!
      expect(profession).toBeDefined()
      expect(runner.archetypeId).toBe(profession.archetypeId)
    }
  })

  it.each(flavors)('generates each selected archetype with $label flavor professions', ({ id: flavor }) => {
    seedRandom()
    const professions = load(DATA.RUNNER_TRAITS, { flavor }).filter(entry => entry.tags.includes('runner') && entry.type === 'profession')
    for (const archetype of cbrPnkCatalogue.archetypes) {
      const matches = professions.filter(entry => entry.archetypeId === archetype.id)
      for (let i = 0; i < 10; i++) {
        const runner = runners({ flavor, runnerArchetypeId: archetype.id })
        expect(runner.archetypeId).toBe(archetype.id)
        const mainTitle = runner.secondary!.split(/ turned | previously a | aspiring to become a /)[0]!
        const labels = matches.length ? matches.map(entry => entry.value) : [archetype.name]
        expect(labels.some(label => mainTitle.endsWith(label))).toBe(true)
      }
    }
  })

  it('keeps ages as whole years within each species’ adult range', () => {
    const random = vi.spyOn(Math, 'random')
    for (const species of Object.values(SPECIES)) {
      for (const draw of [0, 0.5, 0.8, 0.999]) {
        for (const endpoint of [0, 0.999]) {
          random.mockReturnValueOnce(draw).mockReturnValueOnce(endpoint)
          const age = runnerAge(species)
          expect(Number.isInteger(age)).toBe(true)
          expect(age).toBeGreaterThanOrEqual(Math.max(17, SPECIES_AGE[species].MATURITY))
          expect(age).toBeLessThanOrEqual(SPECIES_AGE[species].MAX)
        }
      }
    }
  })

  it('includes a complete real name and keeps species labels limited to Shadowrun', () => {
    seedRandom()
    for (const { id: flavor } of flavors) {
      for (let i = 0; i < 100; i++) {
        const runner = runners({ flavor })
        expect(runner.primary.trim()).not.toBe('')
        expect(runner.details).toMatch(/^By day: \S+ .+/)
        expect(runner.details).not.toMatch(/ '[^']+' /)
        expect(runner.appearance).not.toMatch(/Appearance:|Hair:|Face:|Clothes:|[;\n]/)
        expect(/\b(Norm|Elf|Dwarf|Ork|Troll)\b/.test(runner.appearance!)).toBe(
          flavor === 'shadowrun',
        )
      }
    }
  })

  it('gives every runner looks and keeps bald heads and face features consistent', () => {
    seedRandom()
    const values = (type: string) => runnerTraits.filter(entry => entry.type === type).map(entry => entry.value)
    const structures = values('face-structure')
    const details = values('face-detail')
    const eyes = values('eyes')
    const garments = values('garment')
    const shapes = values('face-shape').map(value => `${value} face`)
    const hairStyles = values('hair-style')
    const random = vi.spyOn(Math, 'random')
    for (const [index, style] of hairStyles.entries()) {
      // Exercise every hair style, including bald, without waiting for a lucky draw.
      random.mockReturnValueOnce(0).mockReturnValueOnce((index + 0.1) / hairStyles.length)
      const looks = runnerLooks()
      expect(values('appearance')).toContain(looks[0])
      const hair = looks[1]!
      const hairStyle = hairStyles.find(style => hair === style || hair.endsWith(` ${style}`))!
      expect(hairStyle).toBe(style)
      const color = hair.slice(0, -(hairStyle.length + 1))
      expect(hairStyle === 'bald' ? ['bald'] : values('hair-color')).toContain(hairStyle === 'bald' ? hair : color)
      const count = (pool: string[]) => looks.filter(value => pool.includes(value)).length
      expect(count(shapes)).toBeLessThanOrEqual(1)
      expect(count(structures)).toBeLessThanOrEqual(1)
      expect(count(details)).toBeLessThanOrEqual(1)
      expect(count(eyes)).toBeLessThanOrEqual(1)
      const clothes = looks.find(value => values('clothes-noun').some(noun => value.endsWith(` ${noun}`)))!
      expect(clothes).toBeDefined()
      expect(values('clothes-condition').some(value => clothes.startsWith(`${value} `))).toBe(true)
      expect(values('clothes-style').some(value => clothes.includes(` ${value} `))).toBe(true)
      expect(count(garments)).toBeLessThanOrEqual(1)
    }
  })

  it.each([true, false])('keeps inner traits optional in single-row descriptions (enabled: %s)', (enabled) => {
    seedRandom()
    vi.spyOn(probability, 'p').mockReturnValue(enabled)
    const traits = load(DATA.RUNNER_TRAITS).filter(entry => entry.type === 'inner').map(entry => entry.value)
    const parts = runners().appearance!.split(', ')
    expect(parts.filter(value => traits.includes(value))).toHaveLength(enabled ? 1 : 0)
  })

  it.each([true, false])('puts the optional day job after the real name (enabled: %s)', (enabled) => {
    seedRandom()
    vi.spyOn(probability, 'p').mockReturnValue(enabled)
    vi.spyOn(peopleNames, 'genericName').mockReturnValue('Test Name')
    const dayjob = vi.spyOn(peopleJobs, 'dayjob').mockReturnValue('Test Job')
    const result = runners()
    expect(result.details).toBe(enabled ? 'By day: Test Name, Test Job' : 'By day: Test Name')
    expect(dayjob).toHaveBeenCalledTimes(enabled ? 1 : 0)
    expect(result.appearance).not.toContain('Test Job')
    expect(result.appearance).not.toContain('by day')
  })

  it('passes excluded name traditions and flavor overrides into nested generation', () => {
    seedRandom()
    const options = {
      flavor: 'shadowrun' as const,
      excludeTags: ['shadowrun', ...traditionIds.filter((nation) => nation !== 'dutch')],
    }
    const pools = getNamePools(options)
    const given = pools.get('dutch', 'given').map((entry) => entry.value)
    const family = pools.get('dutch', 'family').map((entry) => entry.value)
    for (let i = 0; i < 100; i++) {
      const runner = runners(options)
      const name = runner.details!.replace('By day: ', '').split(', ')[0]!
      expect(given.some((value) => name.startsWith(`${value} `))).toBe(true)
      expect(family.some((value) => name.endsWith(` ${value}`))).toBe(true)
      expect(runner.secondary).not.toContain('Technomancer')
      expect(runner.appearance).not.toMatch(/\b(Norm|Elf|Dwarf|Ork|Troll)\b/)
    }
  })
})
