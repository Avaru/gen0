import type { RawBit } from '@/builders/types'
import type { Flavor } from './options'

export function getName(
  bit: RawBit,
  flavor: Flavor = 'cyberpunk',
  form: 'full' | 'short' = 'full',
): string {
  const fullName = bit.flavorNames?.[flavor] ?? bit.value
  return form === 'short'
    ? (bit.flavorShortNames?.[flavor] ?? bit.shortValue ?? fullName)
    : fullName
}
