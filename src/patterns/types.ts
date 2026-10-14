import type { Archetype } from '@/data/characters/types'

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
}
