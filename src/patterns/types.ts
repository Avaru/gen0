import type { Archetype } from '@/data/characters/types'
import type { MothershipClass } from '@/data/mothership-classes'
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
  mothershipClass?: MothershipClass
  mothershipShip?: MothershipShip
}
