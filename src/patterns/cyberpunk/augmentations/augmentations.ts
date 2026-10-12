import Bits from '@/builders/Bits'
import { augmentationAttributes, augmentationManufacturers, type AugmentationBit } from '@/data/augmentations'
import { isEntryAvailable } from '@/builders/availability'
import type { GenerationOptions } from '@/generator/options'
import { p } from '@/helper/prob'
import { randomFrom } from '@/helper/randomFrom'
import { DATA, load } from '@/builders/load'
import type { Generated } from '@/patterns/types'
import { corporationName } from '../corporations/corporations'

export function augmentations(options: GenerationOptions = {}): Generated {
  const kind = new Bits(load(DATA.AUGMENTATIONS, options)).take()
  return composeAugmentation(kind, options)
}

/** Complete result for an already selected, flavor-resolved augmentation type. */
export function composeAugmentation(kind: AugmentationBit, options: GenerationOptions = {}): Generated {
  const attributes = new Bits(
    augmentationAttributes.filter((entry) => isEntryAvailable(entry, options)),
  )
  const attribute = attributes.count && p(0.25) ? attributes.take().value : undefined
  const manufacturers = new Bits(load(DATA.NAME_FRAGMENTS, options), { tag: 'known-corporation' })
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
