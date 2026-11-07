import { describe, expect, it } from 'vitest'
import { encodeSheetToken } from '@/helper/sheetToken'
import {
  decodeMothershipCharacter,
  encodeMothershipCharacter,
} from '@/helper/mothershipCharacterLink'
import { rollMothershipCharacter } from '@/patterns/mothership/stats'

describe('Mothership character links', () => {
  it('preserves the complete character and resource edits, including Unicode', () => {
    const sheet = {
      primary: 'Ä / 東京',
      playerName: 'Player',
      pronouns: 'they/them',
      highScore: '42',
      skillsText: 'Custom skill',
      equipmentText: '',
      conditions: 'Edited condition',
      notes: 'Edited notes',
      armorPoints: 4,
      appearance: 'A familiar face',
      portrait: 122,
      details: 'Trinket: Watch · Patch: “#1 Worker”',
      mothershipCharacter: rollMothershipCharacter('Scientist'),
    }
    sheet.mothershipCharacter.health.current = 0
    sheet.mothershipCharacter.wounds.current = 1
    sheet.mothershipCharacter.stress.current = 9
    sheet.mothershipCharacter.stress.min = 3
    expect(decodeMothershipCharacter(encodeMothershipCharacter(sheet))).toEqual(sheet)
  })

  it('loads older links without new fields and keeps them blank', () => {
    const oldSheet = { primary: 'Old name', mothershipCharacter: rollMothershipCharacter('Marine') }
    expect(decodeMothershipCharacter(encodeSheetToken([1, oldSheet]))).toEqual(oldSheet)
  })

  it.each([
    { filledResources: ['unknown'] },
    { filledResources: 'health' },
    { pronouns: 5 },
    { armorPoints: -1 },
    { skillsText: [] },
    { highScore: {} },
    { portrait: 0 },
    { portrait: 123 },
    { portrait: 1.5 },
    { portrait: '01' },
    { portrait: null },
  ])('rejects malformed detailed fields %j', (fields) => {
    const sheet = { primary: 'Name', mothershipCharacter: rollMothershipCharacter(), ...fields }
    expect(() => decodeMothershipCharacter(encodeSheetToken([1, sheet]))).toThrow(/character link/)
  })

  it.each([-1, '20', 3, null])('rejects an invalid stress minimum %j', (min) => {
    const character = { ...rollMothershipCharacter(), stress: { current: 2, min } }
    expect(() =>
      decodeMothershipCharacter(
        encodeSheetToken([1, { primary: 'Name', mothershipCharacter: character }]),
      ),
    ).toThrow(/character link/)
  })

  it.each([
    [2, {}],
    [1, {}],
    [1, { primary: 'Name', mothershipCharacter: { characterClass: 'Unknown' } }],
  ])('rejects unsupported or incomplete data (%j)', (...data) => {
    expect(() => decodeMothershipCharacter(encodeSheetToken(data))).toThrow(/character link/)
  })

  it.each(['skills', 'gear', 'scores', 'health'] as const)(
    'rejects malformed %s before displaying the card',
    (key) => {
      const character = {
        ...rollMothershipCharacter(),
        [key]: key === 'skills' ? ['unknown'] : null,
      }
      const token = encodeSheetToken([1, { primary: 'Name', mothershipCharacter: character }])
      expect(() => decodeMothershipCharacter(token)).toThrow(/character link/)
    },
  )
})
