import type { GenerationOptions } from './options'
import type { Generated } from '@/patterns/types'
import type { RawBit } from '@/builders/types'

export interface Category {
  id: string
  label: string
  group: string
  gender?: boolean
  corporationSize?: boolean
  requiresFlavor?: boolean
  fallbackCategory?: string
  tags?: string[]
  flavorNames?: RawBit['flavorNames']
  todo?: boolean
  pendingPools?: string[]
  coverage?: string
  generate: (options: GenerationOptions) => Generated
}
