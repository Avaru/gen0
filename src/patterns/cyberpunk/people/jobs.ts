import { capitalize } from '@/helper/capitalize'
import { isFlavorEnabled, type GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { randomAge } from '@/helper/randomAge'
import { load, DATA } from '@/builders/load'
import type { GeneratedAttributes } from '@/patterns/types'
import { corporationName } from '../corporations/corporations'
import { runnerName } from '../runners/names'
import { pickSpecies, SPECIES, SPECIES_AGE } from './species'

export const characters = (
  allowRunners = true,
  species: SPECIES | undefined = undefined,
  options: GenerationOptions = {},
): GeneratedAttributes => {
  species ??= pickSpecies(options)
  const character: GeneratedAttributes = {}
  const data = new Bits(load(DATA.RUNNER_TRAITS, options))

  const age = randomAge(SPECIES_AGE[species])

  character.age = `${Math.round(age)} Years`

  if (isFlavorEnabled('shadowrun', options)) character.appearance = species

  if (age > SPECIES_AGE[species].MATURITY) {
    const title = []
    if (allowRunners && p(0.1)) {
      title.push('"' + runnerName(options) + '", ')
      title.push(capitalize(data.tag('runner').type('profession').take().value))
    } else {
      title.push(dayjob(options))
    }
    character.title = title.join('')
  }

  return character
}

export const dayjob = (options: GenerationOptions = {}): string => {
  const title = []
  const data = new Bits(load(DATA.RUNNER_TRAITS, options))
  const jobs = data.tag('job')
  if (p()) {
    if (p(0.1)) title.push(capitalize(jobs.type('level').take().value))
    if (p(0.7)) title.push(capitalize(jobs.type('branch').take().value))
    title.push(capitalize(jobs.type('position').take().value))
  } else {
    title.push(capitalize(jobs.type('description').take().value))
  }
  if (p(0.75)) {
    title.push('at', corporationName(options))
  }

  return title.join(' ')
}
