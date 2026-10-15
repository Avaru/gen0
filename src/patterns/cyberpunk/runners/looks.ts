import Bits from '@/builders/Bits'
import type { GenerationOptions } from '@/generator/options'
import { p } from '@/helper/prob'
import { load, DATA } from '@/builders/load'

/** Compose unlabelled appearance fragments for a single row. */
export function runnerLooks(options: GenerationOptions = {}): string[] {
  const data = new Bits(load(DATA.RUNNER_TRAITS, options)).tag('character')
  const pick = (type: Parameters<typeof data.type>[0]) => data.type(type).take().value

  const appearance = pick('appearance')
  const style = pick('hair-style')
  // Bald heads have no hair color; skinhead remains a separate migrated style.
  const hair = style === 'bald' ? style : `${pick('hair-color')} ${style}`
  const face: string[] = []
  if (p(0.5)) face.push(`${pick('face-shape')} face`)
  if (p(0.33)) face.push(pick('face-structure'))
  if (p(0.5)) face.push(pick('face-detail'))
  if (p(0.5)) face.push(pick('eyes'))
  const clothes = [`${pick('clothes-condition')} ${pick('clothes-style')} ${pick('clothes-noun')}`]
  if (p(0.5)) clothes.push(pick('garment'))

  return [appearance, hair, ...face, ...clothes]
}
