import { GENUS } from '@/builders/types'
import { randomFrom } from './randomFrom'

export const randomGenus = (onlyMF = false): GENUS =>
  randomFrom(onlyMF ? [GENUS.F, GENUS.M] : [GENUS.F, GENUS.M, GENUS.N])
