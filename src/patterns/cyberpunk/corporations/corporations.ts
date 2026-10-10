import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { capitalize } from '@/helper/capitalize'
import { p } from '@/helper/prob'
import { randomFrom } from '@/helper/randomFrom'
import { randomFromEnum } from '@/helper/randomFromEnum'
import { randomRounded } from '@/helper/randomRounded'
import { load, SHADOWRUN } from '@/load'
import { getNamePools } from '@/builders/namePools'
import type { Generated } from '@/patterns/types'
import { CORPORATION_SIZE, CORPORATION_PARAMETERS } from './helpers'

interface CorporationNameOptions extends GenerationOptions {
  knownParent?: boolean
}

/** A company name without generating employees or company relationships. */
export function corporationName(options: CorporationNameOptions = {}): string {
  const names = new Bits(load(SHADOWRUN.NAMES, options))
  const corp = names.tag('corporation')
  const known = corp.tag('known-corporation')
  if (options.knownParent && p(0.6) && known.count > 0) return known.take().value

  const parts: string[] = []
  if (p(0.4)) {
    parts.push(capitalize(names.filter({ all: ['creature', 'mythological'] }).take().value))
  } else {
    const families = getNamePools(options).get(undefined, 'family')
    const preferred = ['german', 'british', 'spanish', 'japanese'].filter((tag) =>
      families.some((bit) => bit.tags.includes(tag)),
    )
    const tag = preferred.length ? randomFrom(preferred) : undefined
    parts.push(capitalize(new Bits(families, { tag }).take().value))
  }
  if (p()) parts.push(capitalize(corp.type('business').take().value))
  parts.push(capitalize(corp.type('type').take().value))
  return parts.join(' ')
}

export function corporations(options: GenerationOptions = {}): Generated {
  const size = options.corporationSize ?? randomFromEnum(CORPORATION_SIZE)
  const primary = corporationName(options)
  const parameters = CORPORATION_PARAMETERS[size]
  const employees = randomRounded(parameters.EMPLOYEES_MIN, parameters.EMPLOYEES_MAX)
  let title: string | undefined
  if (p() && size !== CORPORATION_SIZE.AAA) {
    const relation = new Bits(load(SHADOWRUN.NAMES, options), {
      tag: 'corporation',
      type: 'relation',
    })
    title = `${capitalize(relation.take().value)} of ${corporationName({ ...options, knownParent: true })}`
  }
  return { primary, details: `${Intl.NumberFormat().format(employees)} Employees`, title }
}

export function knownCorporation(options: GenerationOptions = {}): Generated {
  const known = new Bits(load(SHADOWRUN.NAMES, options), {
    all: ['corporation', 'known-corporation'],
  })
  return { primary: known.take().value }
}
