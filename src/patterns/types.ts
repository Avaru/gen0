import type { Archetype } from '@/data/characters/types'

export interface GeneratedAttributes {
  archetypeId?: Archetype['id']
  age?: string
  appearance?: string
  details?: string
  title?: string
  rating?: number
}
export interface Generated extends GeneratedAttributes {
  primary: string
}
