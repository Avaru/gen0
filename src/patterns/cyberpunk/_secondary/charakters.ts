import { isFlavorEnabled, type GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { randomAge } from '@/helper/randomAge'
import { load, SHADOWRUN } from '@/load'
import type { GeneratedAttributes } from '@/patterns/types'
import { corporations } from '../corporations/corporations'
import { runners } from '../runners/runners'
import { pickSpecies, SPECIES, SPECIES_AGE } from './helpers'

export const characters = async (
  allowRunners = true,
  species: SPECIES | undefined = undefined,
  options: GenerationOptions = {},
): Promise<GeneratedAttributes> => {
  species ??= pickSpecies(options)
  const character: GeneratedAttributes = {}
  const data = new Bits(await load(SHADOWRUN.CHARACTERS, options))

  const age = randomAge(SPECIES_AGE[species])

  character.age = `${Math.round(age)} Years`

  if (isFlavorEnabled('shadowrun', options)) character.appearance = species

  if (age > SPECIES_AGE[species].MATURITY) {
    const title = []
    if (allowRunners && p(0.1)) {
      title.push('"' + (await runners(options)).primary + '", ')
      title.push(data.tag('runner').type('profession').pick.uc)
    } else {
      title.push(await dayjob(options))
    }
    character.title = title.join('')
  }

  return character
}

export const dayjob = async (options: GenerationOptions = {}): Promise<string> => {
  const title = []
  const data = new Bits(await load(SHADOWRUN.CHARACTERS, options))
  const jobs = data.tag('job')
  if (p()) {
    if (p(0.1)) title.push(jobs.type('level').pick.uc)
    if (p(0.7)) title.push(jobs.type('branch').pick.uc)
    title.push(jobs.type('position').pick.uc)
  } else {
    title.push(jobs.type('description').pick.uc)
  }
  if (p(0.75)) {
    title.push('at', (await corporations(undefined, false, options)).primary)
  }

  return title.join(' ')
}
