import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import { capitalize } from '@/helper/capitalize'
import { isFlavorEnabled, type GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { randomFrom } from '@/helper/randomFrom'
import { randomFromWeighted } from '@/helper/weightedRandomFrom'
import { runnerName } from './names'
import { load, SHADOWRUN } from '@/load'
import type { Generated } from '@/patterns/types'
import { dayjob } from '../_secondary/characters'
import { genericName } from '../_secondary/names'
import { pickSpecies } from '../_secondary/helpers'
import { runnerAge } from './age'

export const runners = (options: GenerationOptions = {}): Generated => {
  const primary = runnerName(options)
  const characters = new Bits(load(SHADOWRUN.CHARACTERS, options))
  const jobs = characters.tag('runner')
  const details = characters.tag('character')

  const title: string[] = []
  if (p(0.5)) title.push(capitalize(jobs.type('level').take().value))
  const matching = options.runnerArchetypeId
    ? load(SHADOWRUN.CHARACTERS, options).filter(entry => entry.tags.includes('runner') && entry.type === 'profession' && entry.archetypeId === options.runnerArchetypeId)
    : undefined
  const archetype = cbrPnkCatalogue.archetypes.find(item => item.id === options.runnerArchetypeId)
  const profession = matching
    ? matching.length ? new Bits(matching).take() : { value: archetype?.name ?? '', archetypeId: archetype?.id }
    : jobs.type('profession').take()
  title.push(capitalize(profession.value))
  if (p(0.1))
    title.push(
      randomFromWeighted(['turned', 'previously a', 'aspiring to become a']),
      capitalize(jobs.type('profession').take().value),
    )

  const species = pickSpecies(options)
  const appearance = [
    ...(isFlavorEnabled('shadowrun', options) ? [species] : []),
    `${runnerAge(species)} Years`,
    capitalize(details.type(randomFrom(['inner', 'outer'])).take().value),
  ]
  if (p()) appearance.push(details.type(randomFrom(['inner', 'outer', 'mood'])).take().value)
  if (p(0.2)) appearance.push(dayjob(options) + ' by day')

  return {
    primary,
    archetypeId: profession.archetypeId,
    title: title.join(' '),
    appearance: appearance.join(', '),
    details: `Real name: ${genericName(options, false)}`,
  }
}
