import type { MothershipSheet } from '@/helper/mothershipCharacterLink'
import { mothershipClasses, mothershipPronouns } from '@/data/mothership-classes'
import { mothershipPortraitCount } from '@/data/mothership-portraits'
import { randomFrom } from '@/helper/randomFrom'
import { rng } from '@/helper/rng'
import { genericName } from './names'
import {
  rollMothershipCharacter,
  rollMothershipCredits,
  rollMothershipHealth,
  rollMothershipScores,
} from './stats'
import { rollMothershipGear } from './gear'
import { rollMothershipSkills } from './skills'

export type MothershipReroll =
  | 'name'
  | 'pronouns'
  | 'appearance'
  | 'class'
  | 'stats'
  | 'saves'
  | 'health'
  | 'skills'
  | 'equipment'
  | 'credits'

export function createBlankMothershipSheet(): MothershipSheet {
  return {
    primary: '',
    mothershipCharacter: {
      characterClass: 'Teamster',
      scores: { Str: 0, Spd: 0, Int: 0, Cmb: 0, San: 0, Fea: 0, Bod: 0 },
      health: { current: 0, max: 0 },
      wounds: { current: 0, max: 0 },
      stress: { current: 2, min: 2 },
      credits: 0,
      skills: [],
      gear: [],
    },
  }
}

export function generateMothershipSheet(
  result = genericName({ setting: 'mothership' }),
): MothershipSheet {
  return {
    primary: result.primary,
    pronouns: result.pronouns,
    appearance: result.appearance,
    details: result.details,
    mothershipCharacter: rollMothershipCharacter(result.mothershipClass),
    portrait: Math.floor(Math.random() * mothershipPortraitCount) + 1,
  }
}

export function generateMothershipMiniSheet(
  result: Parameters<typeof generateMothershipSheet>[0],
): MothershipSheet {
  const sheet = generateMothershipSheet(result)
  const character = sheet.mothershipCharacter
  character.stress.current = 2 + Math.floor(rng() * 18)
  const wounds = rng()
  character.wounds.current = wounds < 0.8 ? 0 : wounds < 0.95 ? 1 : 2
  // Equal chances across ratios keep smaller balances common over this wide range.
  character.credits = Math.round(50 * (100_000 / 50) ** rng())
  sheet.filledResources = ['stress', 'wounds']
  return sheet
}

export function rerollMothershipField(sheet: MothershipSheet, field: MothershipReroll) {
  const character = sheet.mothershipCharacter
  switch (field) {
    case 'name':
      sheet.primary = genericName({ setting: 'mothership' }).primary
      break
    case 'pronouns':
      sheet.pronouns = randomFrom(mothershipPronouns)
      break
    case 'appearance':
      sheet.appearance = genericName({ setting: 'mothership' }).appearance
      break
    case 'class': {
      const nextClass = randomFrom(
        mothershipClasses.filter((value) => value !== character.characterClass),
      )
      const rolled = rollMothershipCharacter(nextClass)
      Object.assign(character, {
        characterClass: nextClass,
        scores: rolled.scores,
        skills: rolled.skills,
        gear: rolled.gear,
      })
      character.wounds.max = rolled.wounds.max
      character.wounds.current = Math.min(character.wounds.current, character.wounds.max)
      delete sheet.skillsText
      delete sheet.equipmentText
      delete sheet.armorPoints
      break
    }
    case 'stats':
    case 'saves': {
      const scores = rollMothershipScores(character.characterClass)
      const keys =
        field === 'stats'
          ? (['Str', 'Spd', 'Int', 'Cmb'] as const)
          : (['San', 'Fea', 'Bod'] as const)
      for (const key of keys) character.scores[key] = scores[key]
      break
    }
    case 'health': {
      character.health.max = rollMothershipHealth()
      character.health.current = Math.min(character.health.current, character.health.max)
      break
    }
    case 'skills':
      character.skills = rollMothershipSkills(character.characterClass)
      delete sheet.skillsText
      break
    case 'equipment':
      character.gear = rollMothershipGear(character.characterClass)
      sheet.details = genericName({ setting: 'mothership' }).details
      delete sheet.equipmentText
      delete sheet.armorPoints
      break
    case 'credits':
      character.credits = rollMothershipCredits()
      break
  }
}
