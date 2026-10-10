import { capitalize } from '@/helper/capitalize'
import { isFlavorEnabled, type GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { randomAge } from '@/helper/randomAge'
import { randomFrom } from '@/helper/randomFrom'
import { randomFromWeighted } from '@/helper/weightedRandomFrom'
import { runnerName } from './names'
import { load, SHADOWRUN } from '@/load'
import type { Generated } from '@/patterns/types'
import { dayjob } from '../_secondary/characters'
import { pickSpecies, SPECIES_AGE } from '../_secondary/helpers'

export const runners = (options: GenerationOptions = {}): Generated => {
  const primary = runnerName(options)
  const characters = new Bits(load(SHADOWRUN.CHARACTERS, options))
  const jobs = characters.tag('runner')
  const details = characters.tag('character')

  const title: string[] = []
  if (p(0.5)) title.push(capitalize(jobs.type('level').take().value))
  title.push(capitalize(jobs.type('profession').take().value))
  if (p(0.1))
    title.push(
      randomFromWeighted(['turned', 'previously a', 'aspiring to become a']),
      capitalize(jobs.type('profession').take().value),
    )

  const species = pickSpecies(options)
  const appearance = [
    ...(isFlavorEnabled('shadowrun', options) ? [species] : []),
    `${randomAge({ MIN: SPECIES_AGE[species].MATURITY, MAX: SPECIES_AGE[species].MAX })} Years`,
    capitalize(details.type(randomFrom(['inner', 'outer'])).take().value),
  ]
  if (p()) appearance.push(details.type(randomFrom(['inner', 'outer', 'mood'])).take().value)
  if (p(0.2)) appearance.push(dayjob(options) + ' by day')

  return {
    primary,
    title: title.join(' '),
    appearance: appearance.join(', '),
  }
}
