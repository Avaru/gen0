import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import { capitalize } from '@/helper/capitalize'
import { isFlavorEnabled, type GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { randomFromWeighted } from '@/helper/weightedRandomFrom'
import { runnerName } from './names'
import { load, DATA } from '@/builders/load'
import type { Generated } from '@/patterns/types'
import { dayjob } from '../people/jobs'
import { genericName } from '../people/names'
import { pickSpecies } from '../people/species'
import { runnerAge } from './age'
import { runnerLooks } from './looks'

export const runners = (options: GenerationOptions = {}): Generated => {
  const primary = runnerName(options)
  const characters = new Bits(load(DATA.RUNNER_TRAITS, options))
  const jobs = characters.tag('runner')
  const details = characters.tag('character')

  const title: string[] = []
  if (p(0.5)) title.push(capitalize(jobs.type('level').take().value))
  const matching = options.runnerArchetypeId
    ? load(DATA.RUNNER_TRAITS, options).filter(entry => entry.tags.includes('runner') && entry.type === 'profession' && entry.archetypeId === options.runnerArchetypeId)
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
    ...runnerLooks(options),
  ]
  if (p(0.75)) appearance.push(details.type('inner').take().value)
  if (p(0.5)) appearance.push(details.type('mood').take().value)
  const job = p(0.2) ? dayjob(options) : undefined

  return {
    primary,
    archetypeId: profession.archetypeId,
    title: title.join(' '),
    appearance: appearance.join(', '),
    details: `By day: ${genericName(options, false)}${job ? `, ${job}` : ''}`,
  }
}
