import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { capitalize } from '@/helper/capitalize'
import { p } from '@/helper/prob'
import { randomFrom } from '@/helper/randomFrom'
import { randomFromEnum } from '@/helper/randomFromEnum'
import { randomRounded } from '@/helper/randomRounded'
import { load, SHADOWRUN, CONTENT } from '@/load'
import { getNamePools } from '@/builders/namePools'
import { corporationEvents } from '@/data/corporation-events'
import { isEntryAvailable } from '@/builders/availability'
import { getName } from '@/generator/names'
import { genericName } from '../_secondary/names'
import { rng } from '@/helper/rng'
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
  const details = [`${Intl.NumberFormat().format(employees)} Employees`, `CEO: ${genericName(options, false)}`]
  if (size !== CORPORATION_SIZE.A) {
    const foundingYear = yearBetween(2020, 2077)
    details.push(`Founded: ${foundingYear}`)
    if (size === CORPORATION_SIZE.AAA) {
      details.push(`Subsidiaries: ${subsidiaryNames(primary, options).join('; ')}`)
    }
    const events = new Bits(corporationEvents.filter(event => isEntryAvailable(event, options)))
    const count = size === CORPORATION_SIZE.AAA ? randomFrom([2, 3]) : 1
    const history = Array.from({ length: count }, () => ({
      year: yearBetween(foundingYear, 2077),
      text: eventText(getName(events.take(), options.flavor), options),
    })).sort((a, b) => a.year - b.year)
    if (size === CORPORATION_SIZE.AAA) details.push('Events:')
    details.push(...history.map(event => `${event.year}: ${event.text}`))
  }
  return { primary, details: details.join('\n'), title }
}

export function knownCorporation(options: GenerationOptions = {}): Generated {
  const known = new Bits(load(SHADOWRUN.NAMES, options), {
    all: ['corporation', 'known-corporation'],
  })
  return { primary: known.take().value }
}


function yearBetween(min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

function subsidiaryNames(parent: string, options: GenerationOptions): string[] {
  const count = p() ? 1 : 2
  const names = new Set<string>()
  // Bound retries even when callers supply a constant random draw.
  for (let attempt = 0; attempt < 12 && names.size < count; attempt++) {
    const name = corporationName(options)
    if (name !== parent) names.add(name)
  }
  // Existing business/type fragments give distinct fallback names in small pools.
  const businesses = new Bits(load(SHADOWRUN.NAMES, options), { tag: 'corporation', type: 'business' })
  const types = new Bits(load(SHADOWRUN.NAMES, options), { tag: 'corporation', type: 'type' })
  while (names.size < count && businesses.count) {
    const name = `${parent} ${capitalize(businesses.take().value)} ${capitalize(types.filter({}).take().value)}`
    names.add(name)
  }
  if (names.size !== count) throw new Error('No distinct subsidiaries match these settings.')
  return [...names]
}

function eventText(template: string, options: GenerationOptions): string {
  const replacements = new Map<string, string>()
  return template.replace(/\$(people|product|corporation)\$/g, (_, key: string) => {
    if (!replacements.has(key)) {
      const value = key === 'people'
        ? genericName(options, false)
        : key === 'corporation'
          ? corporationName(options)
          : new Bits(load(CONTENT.WEAPONS, options), { type: 'model' }).take().value
      replacements.set(key, value)
    }
    return replacements.get(key)!
  })
}
