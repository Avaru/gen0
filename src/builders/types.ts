import type { Archetype } from '@/data/characters/types'
import type { Flavor } from '@/generator/options'

export enum GENUS {
  M = 'm',
  F = 'f',
  N = 'n',
  P = 'p',
}

export type RawBit<Type extends string = string> = {
  id?: string
  archetypeId?: Archetype['id']
  value: string
  shortValue?: string
  flavorNames?: Partial<Record<Flavor, string>>
  flavorShortNames?: Partial<Record<Flavor, string>>
  tags: string[]
  type?: Type
  genus?: `${GENUS}`
  source?: string
  details?: string
}

export interface BitFilter<Entry extends RawBit = RawBit> {
  tag?: string
  not?: string
  one?: string[]
  all?: string[]
  none?: string[]
  type?: Entry['type']
  genus?: GENUS
}
