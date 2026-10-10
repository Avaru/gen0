import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { randomRounded } from '@/helper/randomRounded'
import { randomFromWeighted } from '@/helper/weightedRandomFrom'
import { load, SHADOWRUN } from '@/load'
import { type Generated } from '@/patterns/types'
import { genericName } from '../_secondary/names'

export const gang = async (options: GenerationOptions = {}): Promise<Generated> => {
  const names = new Bits(await load(SHADOWRUN.NAMES, options), { tag: 'gang' })

  let primary = p() ? 'The ' : ''

  primary += p(0.8) ? names.type('prefix').pick.uc + ' ' : ''
  primary += p(0.5) ? names.type('prefix').pick.uc + ' ' : ''

  primary += names.type('main').pick.uc
  primary += p(0.3) ? ' of ' + names.type('suffix').pick.uc + ' ' : ''

  const details = [names.type('attribute').pick.uc]
  if (p(0.1)) details.push(names.type('attribute').pick.uc)

  const leadership = ['lead by', 'following', 'paid by', 'controlled by', 'revering']

  details.push(randomFromWeighted(leadership) + ' ' + (await genericName(options)).primary)

  details.push(`${randomRounded(7, 200)} members`)

  return {
    primary,
    details: details.join(', '),
  }
}
