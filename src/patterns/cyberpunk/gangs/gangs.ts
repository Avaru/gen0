import { capitalize } from '@/helper/capitalize'
import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { randomRounded } from '@/helper/randomRounded'
import { randomFromWeighted } from '@/helper/weightedRandomFrom'
import { load, SHADOWRUN } from '@/load'
import { type Generated } from '@/patterns/types'
import { genericName } from '../_secondary/names'

export const gang = (options: GenerationOptions = {}): Generated => {
  const names = new Bits(load(SHADOWRUN.NAMES, options), { tag: 'gang' })

  let primary = p() ? 'The ' : ''

  primary += p(0.8) ? capitalize(names.type('prefix').take().value) + ' ' : ''
  primary += p(0.5) ? capitalize(names.type('prefix').take().value) + ' ' : ''

  primary += capitalize(names.type('main').take().value)
  primary += p(0.3) ? ' of ' + capitalize(names.type('suffix').take().value) + ' ' : ''

  const details = [capitalize(names.type('attribute').take().value)]
  if (p(0.1)) details.push(capitalize(names.type('attribute').take().value))

  const leadership = ['lead by', 'following', 'paid by', 'controlled by', 'revering']

  details.push(randomFromWeighted(leadership) + ' ' + genericName(options))

  details.push(`${randomRounded(7, 200)} members`)

  return {
    primary,
    details: details.join(', '),
  }
}
