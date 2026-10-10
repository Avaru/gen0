import type { GENUS } from '@/builders/types'

export interface GeneratedAttributes {
  age?: string
  appearance?: string
  details?: string
  title?: string
  genus?: GENUS
  rating?: number
}
export interface Generated extends GeneratedAttributes {
  primary: string
}
