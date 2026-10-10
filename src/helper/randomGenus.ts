import { GENUS } from '@/builders/types'
import { randomFrom } from './randomFrom'

export function randomGenus(onlyMF: true): GENUS.M | GENUS.F
export function randomGenus(onlyMF?: false): GENUS
export function randomGenus(onlyMF: boolean): GENUS
export function randomGenus(onlyMF = false): GENUS {
  return randomFrom(onlyMF ? [GENUS.F, GENUS.M] : [GENUS.F, GENUS.M, GENUS.N])
}
