import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import Bits from '@/builders/Bits'
import { GENUS, type RawBit } from '@/builders/types'
import { clearNamePools, getNamePools, NamePools } from '@/builders/namePools'
import type { GivenNameEntry, NameEntry } from '@/data/nameTypes'
import { generateNames } from '@/generator/categories'
import { load, DATA } from '@/builders/load'
import { genericName } from '@/patterns/cyberpunk/people/names'
import { corporationName } from '@/patterns/cyberpunk/corporations/corporations'
import { runnerName } from '@/patterns/cyberpunk/runners/names'
import { canComposeName } from '@/patterns/cyberpunk/nationality/availability'
import { mixedName } from '@/patterns/cyberpunk/nationality/mixed'
import { nationalName } from '@/patterns/cyberpunk/nationality/nameParts'
import { traditionIds } from '@/patterns/cyberpunk/nationality/traditions'
import { seedRandom } from './helpers/random'

afterEach(() => {
  clearNamePools()
  vi.restoreAllMocks()
})

describe('Independent typed selection pools', () => {
  it('consumes only a saved pool and leaves the source and filtered siblings intact', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const source = [
      { value: 'One', type: 'prefix', tags: ['test'] },
      { value: 'Two', type: 'prefix', tags: ['test'] },
    ]
    const parent = new Bits(source)
    const prefixes = parent.type('prefix')
    expect(prefixes.take().value).toBe('One')
    expect(prefixes.take().value).toBe('Two')
    expect(() => prefixes.take()).toThrow('No entries match')
    expect(parent.count).toBe(2)
    expect(parent.type('prefix').take().value).toBe('One')
    expect(source).toHaveLength(2)
  })

  it('preserves entry fields and reads unspecified genus without making random draws', () => {
    const entries: GivenNameEntry[] = [
      { value: 'Alex', type: 'given', tags: ['test'], aliases: ['Aleks'] },
    ]
    const selected = new Bits(entries).take()
    expectTypeOf(selected).toEqualTypeOf<GivenNameEntry>()
    expectTypeOf<'typo'>().not.toExtend<RawBit['genus']>()
    expect(selected.aliases).toEqual(['Aleks'])
    const random = vi.spyOn(Math, 'random')
    expect(selected.genus).toBeUndefined()
    expect(selected.genus).toBeUndefined()
    expect(random).not.toHaveBeenCalled()
  })
})

describe('Complete naming traditions', () => {
  it('keeps nested gang leaders inside the available traditions', () => {
    seedRandom()
    const options = { excludeTags: traditionIds.filter((nation) => nation !== 'dutch') }
    const given = getNamePools(options)
      .get('dutch', 'given')
      .map((entry) => entry.value)
    const names = generateNames('gangs', 100, options)
    expect(names).toHaveLength(100)
    expect(names.every((name) => given.some((value) => name.details?.includes(value)))).toBe(true)
  })

  it('skips Russian surname rules after all patronymics are excluded', () => {
    seedRandom()
    const fatherTags = [
      ...new Set(
        load(DATA.PERSONAL_NAMES)
          .filter((entry) => entry.type === 'patronymic')
          .flatMap((entry) => entry.tags.filter((tag) => tag.startsWith('father:'))),
      ),
    ]
    const options = { excludeTags: fatherTags }
    expect(canComposeName(getNamePools(options), 'russian', GENUS.F)).toBe(false)
    expect(Array.from({ length: 100 }, () => mixedName(GENUS.F, options)).every(Boolean)).toBe(true)
    expect(() => nationalName('russian', GENUS.F, undefined, options)).toThrow('required parts')
  })

  it('checks optional second names, two Spanish surnames, and mixed given-name requirements', () => {
    const entries: NameEntry[] = [
      { value: 'Ana', type: 'given', genus: 'f', tags: ['spanish'] },
      { value: 'Garcia', type: 'family', tags: ['spanish'] },
      { value: 'Perez', type: 'family', tags: ['spanish'] },
      { value: 'Noor', type: 'given', genus: 'f', tags: ['dutch'] },
      { value: 'Jones', type: 'family', tags: ['dutch'] },
    ]
    const pools = new NamePools(entries)
    expect(canComposeName(pools, 'dutch', GENUS.F)).toBe(true)
    expect(canComposeName(pools, 'spanish', GENUS.F)).toBe(false)
    expect(canComposeName(pools, 'spanish', GENUS.F, 'dutch')).toBe(false)
    entries.push({ value: 'Maria', type: 'given', genus: 'f', tags: ['spanish'] })
    expect(canComposeName(new NamePools(entries), 'spanish', GENUS.F)).toBe(true)
    expect(
      canComposeName(
        new NamePools(entries.filter((entry) => entry.value !== 'Perez')),
        'spanish',
        GENUS.F,
      ),
    ).toBe(false)
  })

  it('keeps Tamil fathers distinct and requires male Arabic father names', () => {
    const entries: NameEntry[] = [
      { value: 'Arun', type: 'given', genus: 'm', tags: ['tamil'] },
      { value: 'Layla', type: 'given', genus: 'f', tags: ['arabic'] },
      { value: 'Haddad', type: 'family', tags: ['arabic'] },
    ]
    const pools = new NamePools(entries)
    expect(canComposeName(pools, 'tamil', GENUS.M)).toBe(false)
    expect(canComposeName(pools, 'arabic', GENUS.F)).toBe(false)
    entries.push({ value: 'Omar', type: 'given', genus: 'm', tags: ['arabic'] })
    expect(canComposeName(new NamePools(entries), 'arabic', GENUS.F)).toBe(true)
  })
})

describe('Names without unused descriptions', () => {
  it('composes handles and personal names with character-detail pools excluded', () => {
    seedRandom()
    const options = { excludeTags: ['character', 'job'] }
    expect(runnerName(options)).toBeTruthy()
    expect(genericName(options)).toEqual(expect.any(String))
    expect(corporationName(options)).toEqual(expect.any(String))
    expect(generateNames('corporations', 1)).toHaveLength(1)
  })

  it('allows the ordinary surname Decker in a generic corporation name', () => {
    const families = getNamePools().get('german', 'family')
    const index = families.findIndex((entry) => entry.value === 'Decker')
    expect(index).toBeGreaterThanOrEqual(0)
    const draws = [0.99, 0, (index + 0.5) / families.length, 0.99, 0]
    vi.spyOn(Math, 'random').mockImplementation(() => draws.shift() ?? 0.99)
    expect(corporationName()).toMatch(/^Decker /)
  })
})
