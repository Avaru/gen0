import { afterEach, describe, expect, it, vi } from 'vitest'
import { shadowrunCharacters } from '@/data/shadowrun-characters'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import { load, SHADOWRUN } from '@/load'
import { flavors } from '@/generator/options'
import { getNamePools } from '@/builders/namePools'
import { SPECIES, SPECIES_AGE } from '@/patterns/cyberpunk/_secondary/helpers'
import { runnerAge } from '@/patterns/cyberpunk/runners/age'
import { runners } from '@/patterns/cyberpunk/runners/runners'
import { traditionIds } from '@/patterns/cyberpunk/nationality/traditions'
import { seedRandom } from './helpers/random'

afterEach(() => vi.restoreAllMocks())

describe('Runners', () => {
  it('links every runner profession, including duplicates, to an existing archetype', () => {
    const professions = shadowrunCharacters.filter((entry) => entry.tags.includes('runner') && entry.type === 'profession')
    expect(professions).toHaveLength(26)
    const ids = cbrPnkCatalogue.archetypes.map((item) => item.id)
    for (const entry of professions) expect(ids).toContain(entry.archetypeId)
  })

  it.each(flavors)('keeps the main profession link through $label flavor naming and secondary professions', ({ id: flavor }) => {
    seedRandom()
    const professions = load(SHADOWRUN.CHARACTERS, { flavor }).filter((entry) => entry.tags.includes('runner') && entry.type === 'profession')
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
    const professions = load(SHADOWRUN.CHARACTERS, { flavor }).filter(entry => entry.tags.includes('runner') && entry.type === 'profession')
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
        expect(runner.details).toMatch(/^Real name: \S+ .+/)
        expect(runner.details).not.toContain("'")
        expect(/\b(Norm|Elf|Dwarf|Ork|Troll)\b/.test(runner.appearance!)).toBe(
          flavor === 'shadowrun',
        )
      }
    }
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
      const name = runner.details!.replace('Real name: ', '')
      expect(given.some((value) => name.startsWith(`${value} `))).toBe(true)
      expect(family.some((value) => name.endsWith(` ${value}`))).toBe(true)
      expect(runner.title).not.toContain('Technomancer')
      expect(runner.appearance).not.toMatch(/\b(Norm|Elf|Dwarf|Ork|Troll)\b/)
    }
  })
})
