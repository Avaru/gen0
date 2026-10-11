import Bits from '@/builders/Bits'
import { load, CONTENT } from '@/load'
import { p } from '@/helper/prob'
import type { GenerationOptions } from '@/generator/options'

function weaponNameParts(options: GenerationOptions): string[] {
  const data = new Bits(load(CONTENT.WEAPONS, options))
  const name = [data.type('model').take().value]
  if (p(0.6)) name.push(`“${data.type('series').take().value}”`)
  return name
}

/** The weapon category's model and optional series, without a manufacturer. */
export function weaponName(options: GenerationOptions = {}): string {
  return weaponNameParts(options).join(' ')
}

/** Use the weapon type only when there is no quoted series. */
export function weaponProductName(options: GenerationOptions = {}): string {
  const name = weaponNameParts(options)
  if (name.length === 1) {
    name.push(new Bits(load(CONTENT.WEAPONS, options), { type: 'kind' }).take().value)
  }
  return name.join(' ')
}
