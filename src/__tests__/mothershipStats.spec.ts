import { afterEach, expect, it, vi } from 'vitest'
import { rollMothershipCharacter } from '@/patterns/mothership/stats'
import { mothershipLoadouts } from '@/data/characters/mothership-gear'

afterEach(() => vi.restoreAllMocks())

it.each([
  [0, 0, 'Marine', { Str: 37, Spd: 27, Int: 27, Cmb: 37, San: 12, Fea: 32, Bod: 22 }],
  [0.25, 0.99, 'Android', { Str: 37, Spd: 27, Int: 47, Cmb: 17, San: 12, Fea: 72, Bod: 12 }],
  [0.5, 0.5, 'Scientist', { Str: 37, Spd: 27, Int: 42, Cmb: 27, San: 42, Fea: 12, Bod: 12 }],
  [0.75, 0, 'Teamster', { Str: 42, Spd: 32, Int: 32, Cmb: 32, San: 22, Fea: 22, Bod: 22 }],
] as const)(
  'rolls and applies the class modifiers for draw %s',
  (classRoll, statRoll, characterClass, scores) => {
    // Strength gets a 10 and a 2. The other six scores each get two 1s.
    const modifierRolls =
      characterClass === 'Android' || characterClass === 'Scientist' ? [statRoll] : []
    const rolls = [classRoll, 0.9, 0.1, ...Array<number>(12).fill(0), ...modifierRolls, 0.9, 0.9, 0]
    vi.spyOn(Math, 'random').mockImplementation(() => rolls.shift() ?? 0)
    expect(rollMothershipCharacter()).toEqual({
      characterClass,
      scores,
      health: { current: 20, max: 20 },
      wounds: {
        current: 0,
        max: characterClass === 'Marine' || characterClass === 'Android' ? 3 : 2,
      },
      stress: { current: 2, min: 2 },
      credits: 110,
      skills: expect.arrayContaining([expect.any(String)]),
      gear: mothershipLoadouts[characterClass][0],
    })
  },
)

it.each([
  [0, 11, 20],
  [0.999, 20, 200],
])('rolls health and credits at dice draw %s', (draw, health, credits) => {
  vi.spyOn(Math, 'random').mockReturnValue(draw)
  expect(rollMothershipCharacter()).toMatchObject({
    health: { current: health, max: health },
    credits,
  })
})
