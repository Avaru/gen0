import type { Archetype } from '@/data/characters/types'
import type { MothershipCharacter } from './mothership/stats'
import type { MothershipShip } from './mothership/ships'

export interface GeneratedAttributes {
  archetypeId?: Archetype['id']
  angle?: string
  age?: string
  appearance?: string
  details?: string
  secondary?: string
  rating?: number
}
export interface Generated extends GeneratedAttributes {
  primary: string
  mothershipCharacter?: MothershipCharacter
  mothershipShip?: MothershipShip
}
