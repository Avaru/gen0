import { decodeSheetToken, encodeSheetToken } from './sheetToken'
import { mothershipClasses } from '@/data/mothership-classes'
import { mothershipSkills } from '@/data/characters/mothership-skills'
import { mothershipGear } from '@/data/characters/mothership-gear'
import type { MothershipCharacter } from '@/patterns/mothership/stats'

export interface MothershipSheet {
  primary: string
  appearance?: string
  details?: string
  mothershipCharacter: MothershipCharacter
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid character link')
  return value as Record<string, unknown>
}

function integer(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

export function encodeMothershipCharacter(sheet: MothershipSheet): string {
  return encodeSheetToken([1, sheet])
}

export function decodeMothershipCharacter(token: string): MothershipSheet {
  const data = decodeSheetToken(token)
  if (!Array.isArray(data) || data.length !== 2 || data[0] !== 1)
    throw new Error('Unsupported character link version')
  const sheet = object(data[1])
  const character = object(sheet.mothershipCharacter)
  const scores = object(character.scores)
  if (
    typeof sheet.primary !== 'string' ||
    ![sheet.appearance, sheet.details].every(
      (value) => value === undefined || typeof value === 'string',
    ) ||
    !mothershipClasses.some((value) => value === character.characterClass) ||
    !['Str', 'Spd', 'Int', 'Cmb', 'San', 'Fea', 'Bod'].every((key) => integer(scores[key])) ||
    !integer(character.credits) ||
    !Array.isArray(character.skills) ||
    !character.skills.every(
      (id) => typeof id === 'string' && Object.prototype.hasOwnProperty.call(mothershipSkills, id),
    ) ||
    !Array.isArray(character.gear) ||
    !character.gear.every((value) => {
      const entry = object(value)
      return (
        typeof entry.item === 'string' &&
        Object.prototype.hasOwnProperty.call(mothershipGear, entry.item) &&
        (entry.quantity === undefined || integer(entry.quantity)) &&
        (entry.detail === undefined || typeof entry.detail === 'string')
      )
    })
  )
    throw new Error('Invalid character link')
  for (const key of ['health', 'wounds', 'stress']) {
    const resource = object(character[key])
    const bound = resource[key === 'stress' ? 'min' : 'max']
    if (
      !integer(resource.current) ||
      !integer(bound) ||
      (key === 'stress' ? resource.current < bound : resource.current > bound)
    )
      throw new Error('Invalid character link')
  }
  return sheet as unknown as MothershipSheet
}
