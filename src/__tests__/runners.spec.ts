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
import { runnerLooks } from '@/patterns/cyberpunk/runners/looks'
import { traditionIds } from '@/patterns/cyberpunk/nationality/traditions'
import { seedRandom } from './helpers/random'

afterEach(() => vi.restoreAllMocks())

describe('Runners', () => {
  it('links every runner profession, including duplicates, to an existing archetype', () => {
    const professions = runnerTraits.filter((entry) => entry.tags.includes('runner') && entry.type === 'profession')
    expect(professions).toHaveLength(26)
    const ids = cbrPnkCatalogue.archetypes.map((item) => item.id)
    for (const entry of professions) expect(ids).toContain(entry.archetypeId)
  })

  it.each(flavors)('keeps the main profession link through $label flavor naming and secondary professions', ({ id: flavor }) => {
    seedRandom()
    const professions = load(DATA.RUNNER_TRAITS, { flavor }).filter((entry) => entry.tags.includes('runner') && entry.type === 'profession')
    for (let i = 0; i < 100; i++) {
      const runner = runners({ flavor })
      const mainTitle = runner.title!.split(/ turned | previously a | aspiring to become a /)[0]!
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
        const mainTitle = runner.title!.split(/ turned | previously a | aspiring to become a /)[0]!
        const labels = matches.length ? matches.map(entry => entry.value) : [archetype.name]
        expect(labels.some(label => mainTitle.endsWith(label))).toBe(true)
      }
    }
  })

  it('keeps most ages in 17–40, with a focus on late 20s and mid 30s', () => {
    seedRandom()
    for (const species of Object.values(SPECIES)) {
      const ages = Array.from({ length: 10000 }, () => runnerAge(species))
      expect(
        ages.every(
          (age) =>
            Number.isInteger(age) &&
            age >= Math.max(17, SPECIES_AGE[species].MATURITY) &&
            age <= SPECIES_AGE[species].MAX,
        ),
      ).toBe(true)
      const proportion = (min: number, max: number) =>
        ages.filter((age) => age >= min && age <= max).length / ages.length
      expect(proportion(17, 40)).toBeGreaterThan(0.87)
      expect(proportion(17, 40)).toBeLessThan(0.93)
      expect(proportion(27, 29)).toBeGreaterThan(0.33)
      expect(proportion(33, 36)).toBeGreaterThan(0.33)
      expect(proportion(41, SPECIES_AGE[species].MAX)).toBeGreaterThan(0.07)
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
    let bald = 0
    let shapeCount = 0
    let structureCount = 0
    let detailCount = 0
    let eyeCount = 0
    let garmentCount = 0
    const samples = 3000
    for (let i = 0; i < samples; i++) {
      const looks = runnerLooks()
      expect(values('appearance')).toContain(looks[0])
      const hair = looks[1]!
      const hairStyle = values('hair-style').find(style => hair === style || hair.endsWith(` ${style}`))!
      expect(hairStyle).toBeDefined()
      const color = hair.slice(0, -(hairStyle.length + 1))
      expect(hairStyle === 'bald' ? ['bald'] : values('hair-color')).toContain(hairStyle === 'bald' ? hair : color)
      bald += Number(hairStyle === 'bald')
      const count = (pool: string[]) => looks.filter(value => pool.includes(value)).length
      expect(count(shapes)).toBeLessThanOrEqual(1)
      expect(count(structures)).toBeLessThanOrEqual(1)
      expect(count(details)).toBeLessThanOrEqual(1)
      expect(count(eyes)).toBeLessThanOrEqual(1)
      shapeCount += count(shapes)
      structureCount += count(structures)
      detailCount += count(details)
      eyeCount += count(eyes)
      const clothes = looks.find(value => values('clothes-noun').some(noun => value.endsWith(` ${noun}`)))!
      expect(clothes).toBeDefined()
      expect(values('clothes-condition').some(value => clothes.startsWith(`${value} `))).toBe(true)
      expect(values('clothes-style').some(value => clothes.includes(` ${value} `))).toBe(true)
      expect(count(garments)).toBeLessThanOrEqual(1)
      garmentCount += count(garments)
    }
    expect(bald / samples).toBeGreaterThan(0.03)
    expect(bald / samples).toBeLessThan(0.065)
    expect(shapeCount / samples).toBeGreaterThan(0.72)
    expect(shapeCount / samples).toBeLessThan(0.78)
    expect(structureCount / samples).toBeGreaterThan(0.30)
    expect(structureCount / samples).toBeLessThan(0.36)
    for (const count of [detailCount, eyeCount, garmentCount]) {
      expect(count / samples).toBeGreaterThan(0.47)
      expect(count / samples).toBeLessThan(0.53)
    }
  })

  it('includes an inner trait in 75% of single-row descriptions', () => {
    seedRandom()
    const traits = load(DATA.RUNNER_TRAITS).filter(entry => entry.type === 'inner').map(entry => entry.value)
    const appearances = Array.from({ length: 1000 }, () => runners().appearance!.split(', '))
    const counts = appearances.map(parts => parts.filter(value => traits.includes(value)).length)
    expect(counts.every(count => count <= 1)).toBe(true)
    const proportion = counts.reduce((sum, count) => sum + count, 0) / counts.length
    expect(proportion).toBeGreaterThan(0.70)
    expect(proportion).toBeLessThan(0.80)
  })

  it('puts the optional day job after the real name, with the same 20% chance', () => {
    seedRandom()
    vi.spyOn(peopleNames, 'genericName').mockReturnValue('Test Name')
    vi.spyOn(peopleJobs, 'dayjob').mockReturnValue('Test Job')
    const results = Array.from({ length: 500 }, () => runners())
    for (const result of results) {
      expect(['By day: Test Name', 'By day: Test Name, Test Job']).toContain(result.details)
      expect(result.appearance).not.toContain('Test Job')
      expect(result.appearance).not.toContain('by day')
    }
    const proportion = results.filter(result => result.details === 'By day: Test Name, Test Job').length / results.length
    expect(proportion).toBeGreaterThan(0.15)
    expect(proportion).toBeLessThan(0.25)
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
      expect(runner.title).not.toContain('Technomancer')
      expect(runner.appearance).not.toMatch(/\b(Norm|Elf|Dwarf|Ork|Troll)\b/)
    }
  })
})
