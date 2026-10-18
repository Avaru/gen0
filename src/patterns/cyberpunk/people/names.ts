import type { GenerationOptions } from '@/generator/options'
import { p } from '@/helper/prob'
import { randomFrom } from '@/helper/randomFrom'
import { randomGenus } from '@/helper/randomGenus'
import { capitalize } from '@/helper/capitalize'
import { nationalName } from '../nationality/nameParts'
import { traditionIds } from '../nationality/traditions'
import { canComposeName } from '../nationality/availability'
import { runnerName } from '../runners/names'
import Bits from '@/builders/Bits'
import { getNamePools } from '@/builders/namePools'

/** A complete personal name, without generating unused character details. */
export function genericName(options: GenerationOptions = {}, includeNickname = true): string {
  const genus = randomGenus(true)
  const pools = getNamePools(options)
  // Preserve the inherited generic-name pool; Arabic remains separately available.
  const available = traditionIds.filter(
    (nation) => nation !== 'arabic' && canComposeName(pools, nation, genus),
  )
  const nation = randomFrom(available)
  const nickname = includeNickname && p() ? runnerName(options) : undefined
  return nationalName(nation, genus, nickname, options)
}

export function givenName(options: GenerationOptions = {}): string {
  return capitalize(
    new Bits(getNamePools(options).get(undefined, 'given', options.genus)).take().value,
  )
}
