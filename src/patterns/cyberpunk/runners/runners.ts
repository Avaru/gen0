import { isFlavorEnabled, type GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { randomAge } from '@/helper/randomAge'
import { randomFrom } from '@/helper/randomFrom'
import { randomFromWeighted } from '@/helper/weightedRandomFrom'
import { load, SHADOWRUN } from '@/load'
import type { Generated } from '@/patterns/types'
import { dayjob } from '../_secondary/charakters'
import { pickSpecies, SPECIES_AGE } from '../_secondary/helpers'

export const runners = async (options: GenerationOptions = {}): Promise<Generated> => {
  const names = new Bits(await load(SHADOWRUN.NAMES, options), { tag: 'runner' })
  const characters = new Bits(await load(SHADOWRUN.CHARACTERS, options))
  const jobs = characters.tag('runner')
  const details = characters.tag('character')

  const primary: string[] = []
  if (p(0.2)) primary.push(names.type('prefix').pick.uc)
  primary.push(names.type('name').pick.uc)

  const title: string[] = []
  if (p(0.5)) title.push(jobs.type('level').pick.uc)
  title.push(jobs.type('profession').pick.uc)
  if (p(0.1))
    title.push(
      randomFromWeighted(['turned', 'previously a', 'aspiring to become a']),
      jobs.type('profession').pick.uc,
    )

  const species = pickSpecies(options)
  const appearance = [
    ...(isFlavorEnabled('shadowrun', options) ? [species] : []),
    `${randomAge({ MIN: SPECIES_AGE[species].MATURITY, MAX: SPECIES_AGE[species].MAX })} Years`,
    details.type(randomFrom(['inner', 'outer'])).pick.uc,
  ]
  if (p()) appearance.push(details.type(randomFrom(['inner', 'outer', 'mood'])).pick.value)
  if (p(0.2)) appearance.push((await dayjob(options)) + ' by day')

  return {
    primary: primary.join(' '),
    title: title.join(' '),
    appearance: appearance.join(', '),
  }
}
