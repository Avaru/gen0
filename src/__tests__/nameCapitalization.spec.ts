import { afterEach, expect, it, vi } from 'vitest'
import { GENUS } from '@/builders/types'
import { load, RL } from '@/load'
import { NATIONALITY } from '@/patterns/cyberpunk/nationality/byNationality'
import { nationalName } from '@/patterns/cyberpunk/nationality/nameParts'

afterEach(() => vi.restoreAllMocks())

it('stores given names with capitalized starts without changing their internal spelling', () => {
  const names = load(RL.NAMES_MODERN)
  expect(names.filter((bit) => bit.type === 'given' && /^\p{Ll}/u.test(bit.value))).toEqual([])
  expect(names.some((bit) => bit.value === 'Milianí' && bit.type === 'given')).toBe(true)
  expect(names.some((bit) => bit.value === 'Lye' && bit.type === 'given')).toBe(true)
  expect(names.some((bit) => bit.value === 'Lye "Smoke"' && bit.type === 'translation')).toBe(true)
})

it('displays the corrected Greek given name through the full name builder', () => {
  const given = [
    ...new Set(
      load(RL.NAMES_MODERN)
        .filter(
          (bit) =>
            bit.tags.includes('greek') &&
            bit.type === 'given' &&
            (!bit.genus || bit.genus === GENUS.F),
        )
        .map((bit) => bit.value),
    ),
  ]
  const index = given.indexOf('Milianí')
  expect(index).toBeGreaterThanOrEqual(0)
  vi.spyOn(Math, 'random')
    .mockReturnValue(0.99)
    .mockReturnValueOnce((index + 0.5) / given.length)
  expect(nationalName(NATIONALITY.GREEK, GENUS.F)).toMatch(/^Milianí /)
})

it('preserves a lowercase Dutch surname particle after the given name', () => {
  const family = [
    ...new Set(
      load(RL.NAMES_MODERN)
        .filter(
          (bit) =>
            bit.tags.includes('dutch') &&
            bit.type === 'family' &&
            (!bit.genus || bit.genus === GENUS.F),
        )
        .map((bit) => bit.value),
    ),
  ]
  const index = family.indexOf('de Boer')
  expect(index).toBeGreaterThanOrEqual(0)
  vi.spyOn(Math, 'random')
    .mockReturnValue(0.99)
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(0.99)
    .mockReturnValueOnce((index + 0.5) / family.length)
  expect(nationalName(NATIONALITY.DUTCH, GENUS.F)).toMatch(/ de Boer$/)
})
