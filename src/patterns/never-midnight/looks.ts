import Bits from '@/builders/Bits'
import { DATA, load } from '@/builders/load'
import {
  neverMidnightHairStyles,
  neverMidnightHairColors,
  neverMidnightClothingConditions,
  neverMidnightClothingStyles,
} from '@/data/never-midnight-traits'
import type { GenerationOptions } from '@/generator/options'
import { p } from '@/helper/prob'
import { randomFrom } from '@/helper/randomFrom'

/** Use everyday hair styles, approved colors, and shared face shapes. */
export function neverMidnightLooks(options: GenerationOptions = {}): string {
  const traits = new Bits(load(DATA.RUNNER_TRAITS, options)).tag('character')
  const style = randomFrom(neverMidnightHairStyles)
  const hair = style === 'bald' ? style : `${randomFrom(neverMidnightHairColors)} ${style}`
  const face = p(0.5) ? `${traits.type('face-shape').take().value} face` : undefined
  const clothing = p(0.25) ? neverMidnightClothing(options) : undefined
  return [hair, face, clothing].filter(Boolean).join(', ')
}

/** Compose clothing from the supplied lists and shared general wording. */
export function neverMidnightClothing(options: GenerationOptions = {}): string {
  const condition = randomFrom(neverMidnightClothingConditions)
  const style = randomFrom(neverMidnightClothingStyles)
  const wording = new Bits(load(DATA.RUNNER_TRAITS, options)).type('clothes-noun').take().value
  return `${condition} ${style} ${wording}`
}
