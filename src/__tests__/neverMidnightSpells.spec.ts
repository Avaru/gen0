import { describe, expect, it, vi } from 'vitest'
import {
  spellConcepts,
  spellExpressions,
  spellSources,
  spellTypes,
} from '@/data/never-midnight-spells'
import { spell } from '@/patterns/never-midnight/spells'
import { generateNames } from '@/generator/categories'
import { neverMidnightEnabled } from '@/generator/settingRegistry'

function draw(shape: number, expression = 0, concept = 0, chance = 0.5) {
  return vi
    .spyOn(Math, 'random')
    .mockReturnValue(chance)
    .mockReturnValueOnce([0.125, 0.375, 0.625, 0.8125, 0.9375][shape]!)
    .mockReturnValueOnce((expression + 0.5) / spellExpressions.length)
    .mockReturnValueOnce((concept + 0.5) / spellConcepts.length)
}

describe('Never Midnight spells', () => {
  it.each(spellTypes.map((type, index) => ({ type, index })))(
    'includes the type $type with the right article in details',
    ({ type, index }) => {
      draw(2)
        .mockReturnValueOnce((index + 0.5) / spellTypes.length)
        .mockReturnValueOnce(0)
      expect(spell()).toEqual({
        primary: 'No door shall dream',
        details: `${type.startsWith('i') ? 'An' : 'A'} ${type} from a dream of a forgotten future`,
      })
    },
  )

  it.each(spellSources.map((source, index) => ({ source, index })))(
    'includes the source $source in details',
    ({ source, index }) => {
      draw(2)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce((index + 0.5) / spellSources.length)
      expect(spell().details).toBe(`A hex ${source}`)
    },
  )

  it.each([
    [0, 'A door that never dreams'],
    [0.25 - Number.EPSILON, 'A door that never dreams'],
    [0.25, 'Every door must dream'],
    [0.5 - Number.EPSILON, 'Every door must dream'],
    [0.5, 'No door shall dream'],
    [0.75 - Number.EPSILON, 'No door shall dream'],
    [0.75, 'A door beneath the door that never dreams'],
    [0.875 - Number.EPSILON, 'A door beneath the door that never dreams'],
    [0.875, 'As the door dreams, so shall the door.'],
    [1 - Number.EPSILON, 'As the door dreams, so shall the door.'],
  ])(
    'gives shorter shapes 25 percent each and longer shapes 12.5 percent each: %s',
    (roll, expected) => {
      vi.spyOn(Math, 'random')
        .mockReturnValue(0)
        .mockReturnValueOnce(roll as number)
      expect(spell().primary).toBe(expected)
    },
  )

  it('preserves source pools and repeated Name weighting, with negation only in shapes', () => {
    expect(spellConcepts.filter(({ value }) => value === 'name')).toHaveLength(2)
    expect(spellExpressions.every(([base]) => !base.includes('never'))).toBe(true)
    expect(spellExpressions).toContainEqual(['speak the truth', 'speaks the truth'])
    expect(spellExpressions).toContainEqual(['find its way', 'finds its way'])
  })

  it.each([0, 3])('adds never only below the 50 percent boundary in shape %s', (shape) => {
    draw(shape, 9, 0, 0.5 - Number.EPSILON)
    expect(spell().primary).toContain('that never speaks the truth')
    draw(shape, 9, 0, 0.5)
    expect(spell().primary).toContain('that speaks the truth')
  })

  it.each(spellExpressions.map((expression, index) => ({ expression, index })))(
    'uses the right verb forms for $expression',
    ({ expression: [base, thirdPerson], index }) => {
      draw(0, index)
      expect(spell().primary).toBe(`The door that ${thirdPerson}`)
      draw(1, index)
      expect(spell().primary).toBe(`Every door shall ${base}`)
      draw(2, index)
      expect(spell().primary).toBe(`No door shall ${base}`)
    },
  )

  it('handles articles and uncountable nouns', () => {
    const darkness = spellConcepts.findIndex(({ value }) => value === 'darkness')
    draw(0, 0, darkness, 0)
    expect(spell().primary).toBe('The darkness that never dreams')
    draw(1, 0, darkness, 0)
    expect(spell().primary).toBe('Darkness must dream')
    draw(
      0,
      0,
      spellConcepts.findIndex(({ value }) => value === 'earth'),
      0,
    )
    expect(spell().primary).toBe('The earth that never dreams')
  })

  it.each(spellConcepts.filter(({ uncountable }) => uncountable))(
    'uses $value without Every or All in the command shape',
    ({ value }) => {
      const concept = spellConcepts.findIndex((entry) => entry.value === value)
      const whisper = spellExpressions.findIndex(([base]) => base === 'whisper')
      const subject = value[0]!.toUpperCase() + value.slice(1)
      draw(1, whisper, concept, 0)
      expect(spell().primary).toBe(`${subject} must whisper`)
      draw(1, whisper, concept, 0.5)
      expect(spell().primary).toBe(`${subject} shall whisper`)
    },
  )

  it('rolls the two concepts separately and conjugates the As shape', () => {
    draw(4).mockReturnValueOnce(1 - Number.EPSILON)
    expect(spell().primary).toBe('As the door dreams, so shall the mask.')
  })

  it.runIf(neverMidnightEnabled)('generates spells through the existing category flow', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(generateNames('spells', 3, { setting: 'never-midnight' })).toEqual(
      Array.from({ length: 3 }, () => ({
        primary: 'A door that never dreams',
        details: 'A hex from a dream of a forgotten future',
      })),
    )
    expect(() => generateNames('spells', 1, { setting: 'cyberpunk' })).toThrow(
      'Choose an available category.',
    )
  })
})
