import type { Flavor } from '@/generator/options'

export enum GENUS {
  M = 'm',
  F = 'f',
  N = 'n',
  P = 'p',
}

export type RawBit = {
  id?: string
  value: string
  shortValue?: string
  flavorNames?: Partial<Record<Flavor, string>>
  flavorShortNames?: Partial<Record<Flavor, string>>
  tags: string[]
  type?: string
  genus?: GENUS | string
  source?: string
  details?: string
}

export interface BitFilter {
  tag?: string
  not?: string
  one?: string[]
  all?: string[]
  none?: string[]
  type?: string
  genus?: GENUS
  required?: (keyof RawBit)[]
}
