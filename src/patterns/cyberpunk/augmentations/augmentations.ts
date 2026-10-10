import Bits from '@/builders/Bits'
import { augmentationAttributes, augmentationManufacturers } from '@/data/augmentations'
import { isEntryAvailable } from '@/builders/availability'
import type { GenerationOptions } from '@/generator/options'
import { p } from '@/helper/prob'
import { randomFrom } from '@/helper/randomFrom'
import { CONTENT, load, SHADOWRUN } from '@/load'
import type { Generated } from '@/patterns/types'
import { corporationName } from '../corporations/corporations'

export function augmentations(options: GenerationOptions = {}): Generated {
  const kind = new Bits(load(CONTENT.AUGMENTATIONS, options)).take()
  const attributes = new Bits(
    augmentationAttributes.filter((entry) => isEntryAvailable(entry, options)),
  )
  const attribute = attributes.count && p(0.25) ? attributes.take().value : undefined
  const manufacturers = new Bits(load(SHADOWRUN.NAMES, options), { tag: 'known-corporation' })
  const eligible = manufacturers.values.filter((value) => augmentationManufacturers.includes(value))
  // Kiroshi Optics names its manufacturer already; other combinations are invented products.
  const manufacturer =
    kind.id === 'kiroshi-optics'
      ? 'Kiroshi'
      : eligible.length && p()
        ? randomFrom(eligible)
        : corporationName(options)
  return {
    primary: [attribute, kind.value].filter(Boolean).join(' '),
    details: [kind.details, `Manufacturer: ${manufacturer}`].filter(Boolean).join('\n'),
  }
}
