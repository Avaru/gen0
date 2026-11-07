import { afterEach, expect, it, vi } from 'vitest'
import { mothershipClasses } from '@/data/mothership-classes'
import { mothershipGear, mothershipLoadouts } from '@/data/characters/mothership-gear'
import { rollMothershipGear } from '@/patterns/mothership/gear'

afterEach(() => vi.restoreAllMocks())

it.each(mothershipClasses)(
  'selects all ten complete %s setups within equal ranges',
  (characterClass) => {
    const random = vi.spyOn(Math, 'random')
    const setups = mothershipLoadouts[characterClass]
    expect(setups).toHaveLength(10)
    for (let index = 0; index < 10; index++) {
      for (const draw of [index / 10, (index + 0.999) / 10]) {
        random.mockReturnValue(draw)
        const gear = rollMothershipGear(characterClass)
        expect(gear).toEqual(setups[index])
        expect(gear).not.toBe(setups[index])
        expect(gear[0]).not.toBe(setups[index]![0])
        for (const entry of gear) expect(mothershipGear[entry.item].name).toBeTruthy()
      }
    }
  },
)

it('retains supplied quantities, armor and setup-specific ammunition', () => {
  expect(mothershipGear['advanced-battle-dress']).toEqual({
    name: 'Advanced Battle Dress',
    armorPoints: 10,
  })
  expect(mothershipLoadouts.Marine[0]).toEqual([
    { item: 'tank-top-and-camo-pants' },
    { item: 'combat-knife', detail: 'as Scalpel DMG [+]' },
    { item: 'stimpak', quantity: 5 },
  ])
  expect(mothershipLoadouts.Scientist[2]).toContainEqual({ item: 'rigging-gun' })
  expect(mothershipLoadouts.Teamster[2]).toContainEqual({ item: 'rigging-gun', detail: '1 shot' })
})
