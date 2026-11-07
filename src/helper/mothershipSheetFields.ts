import { mothershipGear, type MothershipGearEntry } from '@/data/characters/mothership-gear'
import { mothershipSkills } from '@/data/characters/mothership-skills'
import { mothershipTraumaResponses } from '@/data/mothership-classes'
import type { MothershipSheet } from './mothershipCharacterLink'

export function mothershipGearLabel(entry: MothershipGearEntry): string {
  const item = mothershipGear[entry.item]
  const details = [
    'armorPoints' in item ? `AP ${item.armorPoints}` : undefined,
    entry.detail,
    entry.quantity ? `x${entry.quantity}` : undefined,
  ].filter(Boolean)
  return `${item.name}${details.length ? ` (${details.join(', ')})` : ''}`
}

export function mothershipSheetSkills(sheet: MothershipSheet): string {
  return (
    sheet.skillsText ??
    sheet.mothershipCharacter.skills
      .map((id) => {
        const skill = mothershipSkills[id]
        return `${skill.name} (${skill.tier})`
      })
      .join('\n')
  )
}

export function mothershipSheetEquipment(sheet: MothershipSheet): string {
  return (
    sheet.equipmentText ??
    [
      ...sheet.mothershipCharacter.gear.map(mothershipGearLabel),
      ...(sheet.details ? sheet.details.split(' · ') : []),
    ].join('\n')
  )
}

export function mothershipSheetTrauma(sheet: MothershipSheet): string {
  return mothershipTraumaResponses[sheet.mothershipCharacter.characterClass]
}

export function mothershipSheetArmor(sheet: MothershipSheet): number {
  return (
    sheet.armorPoints ??
    Math.max(
      0,
      ...sheet.mothershipCharacter.gear.map((entry) => {
        const item = mothershipGear[entry.item]
        return 'armorPoints' in item ? item.armorPoints : 0
      }),
    )
  )
}
