import { afterEach, describe, expect, it, vi } from 'vitest'
import { replacePlaceholder } from '@/helper/replacePlaceholder'

afterEach(() => vi.restoreAllMocks())

describe('placeholder replacement', () => {
  it('uses each choice before repeating, without mutating the source', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const choices = Object.freeze(['One', 'Two', 'Three'])
    expect(replacePlaceholder('$ / $ / $ / $', choices)).toBe('Two / Three / One / Two')
    expect(choices).toEqual(['One', 'Two', 'Three'])
  })

  it('inserts replacement text literally and only replaces original placeholders', () => {
    expect(replacePlaceholder('Before $ after $', ['$&'])).toBe('Before $& after $&')
  })

  it('reports missing choices only when the template needs them', () => {
    const random = vi.spyOn(Math, 'random')
    expect(replacePlaceholder('No placeholder', [])).toBe('No placeholder')
    expect(random).not.toHaveBeenCalled()
    expect(() => replacePlaceholder('A $', [])).toThrow('No replacements')
  })
})
