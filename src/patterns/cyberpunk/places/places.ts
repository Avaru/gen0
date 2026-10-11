import Bits from '@/builders/Bits'
import { load, CONTENT, SHADOWRUN } from '@/load'
import { capitalize } from '@/helper/capitalize'
import { randomFrom } from '@/helper/randomFrom'
import { rng } from '@/helper/rng'
import { p } from '@/helper/prob'
import type { GenerationOptions } from '@/generator/options'
import type { Generated } from '@/patterns/types'

function placeName(options: GenerationOptions): string {
  return new Bits(load(CONTENT.PLACES, options), { type: 'name' }).take().value
}

export function cities(options: GenerationOptions = {}): Generated {
  const name = [placeName(options)]
  if (p(0.9)) {
    name.push(new Bits(load(SHADOWRUN.NAMES, options), { tag: 'city', type: 'suffix' }).take().value)
  }
  // Preserve the old 1–99 × 100 / 1,000 / 10,000 population pattern.
  const population = (1 + Math.floor(rng() * 99)) * randomFrom([100, 1000, 10000])
  const details = [`${Intl.NumberFormat().format(population)} inhabitants`]
  if (p(0.8)) details.push(capitalize(new Bits(load(CONTENT.PLACES, options), { type: 'attribute' }).take().value))
  if (p(2 / 3)) {
    const industry = new Bits(load(SHADOWRUN.NAMES, options), { tag: 'corporation', type: 'business' }).take().value
    details.push(p() ? `${industry}-focused economy` : `Specialized in ${industry} industries`)
  }
  return { primary: name.join(' '), details: details.join(', ') }
}

export function streets(options: GenerationOptions = {}): Generated {
  const fragments = load(SHADOWRUN.NAMES, options)
  const prefix = p(1 / 3)
    ? new Bits(fragments, { tag: 'location', type: 'prefix' }).take().value
    : new Bits(load(CONTENT.PLACES, options), { type: 'ordinal' }).take().value
  const known = new Bits(fragments, { all: ['corporation', 'known-corporation'] })
  // Generic has no canon corporations; use the inherited city-base branch instead.
  const name = known.count && p() ? known.take().value : placeName(options)
  const kind = new Bits(load(CONTENT.DEVICE_DATA, options), { type: 'street-kind' }).take().value
  return {
    primary: `${prefix} ${name} ${kind}`,
    details: p(0.8)
      ? capitalize(new Bits(load(CONTENT.PLACES, options), { type: 'attribute' }).take().value)
      : undefined,
  }
}
