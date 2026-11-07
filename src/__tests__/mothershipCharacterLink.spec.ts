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
      appearance: 'A familiar face',
      details: 'Trinket: Watch · Patch: “#1 Worker”',
      mothershipCharacter: rollMothershipCharacter('Scientist'),
    }
    sheet.mothershipCharacter.health.current = 0
    sheet.mothershipCharacter.wounds.current = 1
    sheet.mothershipCharacter.stress.current = 9
    expect(decodeMothershipCharacter(encodeMothershipCharacter(sheet))).toEqual(sheet)
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
