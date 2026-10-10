import Bits from '@/builders/Bits'
import { capitalize } from '@/helper/capitalize'
import { p } from '@/helper/prob'
import { load, SHADOWRUN } from '@/load'
import type { GenerationOptions } from '@/generator/options'

/** A handle without generating professions, appearance, or a day job. */
export function runnerName(options: GenerationOptions = {}): string {
  const names = new Bits(load(SHADOWRUN.NAMES, options), { tag: 'runner' })
  const parts: string[] = []
  if (p(0.2)) parts.push(capitalize(names.type('prefix').take().value))
  parts.push(capitalize(names.type('name').take().value))
  return parts.join(' ')
}
