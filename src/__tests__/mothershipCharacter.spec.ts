import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  generateMothershipSheet,
  generateMothershipMiniSheet,
  rerollMothershipField,
} from '@/patterns/mothership/character'
import {
  decodeMothershipCharacter,
  encodeMothershipCharacter,
} from '@/helper/mothershipCharacterLink'
import { mothershipLoadouts } from '@/data/characters/mothership-gear'
import { mothershipSheetEquipment, mothershipSheetSkills } from '@/helper/mothershipSheetFields'

afterEach(() => vi.restoreAllMocks())

describe('Mothership mini-sheet rolls', () => {
  const result = { primary: 'Mini character', mothershipClass: 'Marine' as const }

  it.each([
    [0, 2, 0, 50, 11],
    [0.999999999, 19, 2, 100_000, 20],
  ])(
    'keeps the requested resource and credit bounds at draw %s',
    (draw, stress, wounds, credits, health) => {
      vi.spyOn(Math, 'random').mockReturnValue(draw)
      const sheet = generateMothershipMiniSheet(result)
      expect(sheet.mothershipCharacter).toMatchObject({
        stress: { current: stress, min: 2 },
        wounds: { current: wounds, max: 3 },
        health: { current: health, max: health },
        credits,
      })
      expect(sheet.filledResources).toEqual(['stress', 'wounds'])
      expect(decodeMothershipCharacter(encodeMothershipCharacter(sheet))).toEqual(sheet)
      // Full-sheet generation retains its normal starting resources and credits.
      expect(generateMothershipSheet(result).mothershipCharacter).toMatchObject({
        stress: { current: 2, min: 2 },
        wounds: { current: 0, max: 3 },
        credits: draw === 0 ? 20 : 200,
      })
    },
  )

  it('strongly favors zero wounds and lower credit balances across evenly spaced draws', () => {
    const random = vi.spyOn(Math, 'random')
    const woundCounts = [0, 0, 0]
    const credits: number[] = []
    for (let index = 0; index < 200; index++) {
      random.mockReturnValue((index + 0.5) / 200)
      const character = generateMothershipMiniSheet(result).mothershipCharacter
      woundCounts[character.wounds.current]!++
      credits.push(character.credits)
    }
    expect(woundCounts).toEqual([160, 30, 10])
    expect(credits[99]).toBeLessThan(2_250)
    expect(credits.filter((value) => value < 10_000).length).toBeGreaterThan(130)
    expect(credits.some((value) => value > 90_000)).toBe(true)
  })
})

function editedSheet() {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  return {
    ...generateMothershipSheet(),
    primary: 'Keep name',
    notes: 'Keep notes',
    playerName: 'Keep player',
    conditions: 'Keep conditions',
    skillsText: 'Manual skills',
    equipmentText: 'Manual equipment',
    armorPoints: 99,
  }
}

describe('Mothership field rerolls', () => {
  it.each(['name', 'pronouns', 'appearance'] as const)(
    'rerolls %s while preserving other fields and manual edits',
    (field) => {
      const sheet = editedSheet()
      const before = structuredClone(sheet)
      vi.mocked(Math.random).mockReturnValue(0.9)
      rerollMothershipField(sheet, field)
      const key = field === 'name' ? 'primary' : field
      expect(sheet[key]).not.toBe(before[key])
      expect({ ...sheet, [key]: before[key] }).toEqual(before)
    },
  )

  it.each(['stats', 'saves'] as const)(
    'rerolls class-adjusted %s without changing the other scores or resources',
    (field) => {
      const sheet = editedSheet()
      const before = structuredClone(sheet)
      vi.mocked(Math.random).mockReturnValue(0.9)
      rerollMothershipField(sheet, field)
      const keys =
        field === 'stats'
          ? (['Str', 'Spd', 'Int', 'Cmb'] as const)
          : (['San', 'Fea', 'Bod'] as const)
      for (const key of keys) {
        expect(sheet.mothershipCharacter.scores[key]).toBe(
          before.mothershipCharacter.scores[key] + 18,
        )
        before.mothershipCharacter.scores[key] = sheet.mothershipCharacter.scores[key]
      }
      expect(sheet).toEqual(before)
      expect(decodeMothershipCharacter(encodeMothershipCharacter(sheet))).toEqual(sheet)
    },
  )

  it('rerolls skills and equipment for the selected class and replaces only their manual overrides', () => {
    const sheet = editedSheet()
    const before = structuredClone(sheet)
    rerollMothershipField(sheet, 'skills')
    expect(sheet.skillsText).toBeUndefined()
    expect(mothershipSheetSkills(sheet)).not.toBe('Manual skills')
    expect(sheet.equipmentText).toBe('Manual equipment')
    rerollMothershipField(sheet, 'equipment')
    expect(sheet.equipmentText).toBeUndefined()
    expect(sheet.armorPoints).toBeUndefined()
    expect(mothershipLoadouts[sheet.mothershipCharacter.characterClass]).toContainEqual(
      sheet.mothershipCharacter.gear,
    )
    expect(mothershipSheetEquipment(sheet)).toMatch(/Trinket: .+\nPatch: .+/)
    expect(sheet.notes).toBe(before.notes)
    expect(sheet.mothershipCharacter.scores).toEqual(before.mothershipCharacter.scores)
    expect(sheet.mothershipCharacter.credits).toBe(before.mothershipCharacter.credits)
  })

  it('rerolls class-dependent values together and keeps identity and notes', () => {
    const sheet = editedSheet()
    const before = structuredClone(sheet)
    rerollMothershipField(sheet, 'class')
    expect(sheet.mothershipCharacter.characterClass).not.toBe(
      before.mothershipCharacter.characterClass,
    )
    expect(sheet.skillsText).toBeUndefined()
    expect(sheet.equipmentText).toBeUndefined()
    expect(sheet.armorPoints).toBeUndefined()
    expect(sheet.primary).toBe(before.primary)
    expect(sheet.notes).toBe(before.notes)
    expect(sheet.conditions).toBe(before.conditions)
    expect(sheet.portrait).toBe(before.portrait)
    expect(sheet.mothershipCharacter.health).toEqual(before.mothershipCharacter.health)
    expect(sheet.mothershipCharacter.stress).toEqual(before.mothershipCharacter.stress)
    expect(sheet.mothershipCharacter.credits).toBe(before.mothershipCharacter.credits)
    expect(decodeMothershipCharacter(encodeMothershipCharacter(sheet))).toEqual(sheet)
  })

  it('rerolls health and credits without resetting other progress', () => {
    const sheet = editedSheet()
    sheet.mothershipCharacter.health = { current: 19, max: 20 }
    sheet.mothershipCharacter.stress.current = 5
    rerollMothershipField(sheet, 'health')
    expect(sheet.mothershipCharacter.health).toEqual({ current: 11, max: 11 })
    vi.mocked(Math.random).mockReturnValue(0.9)
    rerollMothershipField(sheet, 'credits')
    expect(sheet.mothershipCharacter.credits).toBe(200)
    expect(sheet.mothershipCharacter.stress.current).toBe(5)
    expect(sheet.skillsText).toBe('Manual skills')
    expect(sheet.equipmentText).toBe('Manual equipment')
  })
})
