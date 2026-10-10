import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { GENUS } from '@/builders/types'
import { p } from '@/helper/prob'
import { randomGenus } from '@/helper/randomGenus'
import { randomFromWeighted } from '@/helper/weightedRandomFrom'
import { load, RL } from '@/load'
import type { Generated } from '@/patterns/types'
import { characters } from '../_secondary/charakters'

export async function arabic(
  genus = randomGenus(true),
  options: GenerationOptions = {},
): Promise<Generated> {
  const names = new Bits(await load(RL.NAMES_MODERN, options), { tag: 'arabic' })
  const nasab = genus === GENUS.M ? randomFromWeighted(['ibn', 'bin']) : 'sint'

  const pattern = [names.filter({ genus, type: 'given' }).pick.uc]

  if (p(0.15)) {
    pattern.push(nasab)
  }
  pattern.push(names.type('family').pick.uc)

  if (p(0.15)) {
    pattern.push(nasab)
    pattern.push(names.type('family').pick.uc)
  }

  if (p(0.15)) {
    pattern.push('Al-' + names.type('family').pick.uc)
  }

  return {
    primary: pattern.join(' '),
    ...(await characters(true, undefined, options)),
  }
}
