import { randomFrom } from '@/helper/randomFrom'
import type { MothershipClass } from '@/data/mothership-classes'
import { mothershipLoadouts, type MothershipGearEntry } from '@/data/characters/mothership-gear'

export function rollMothershipGear(characterClass: MothershipClass): MothershipGearEntry[] {
  return randomFrom(mothershipLoadouts[characterClass]).map((entry) => ({ ...entry }))
}
