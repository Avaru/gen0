import type { GenerationOptions } from '@/generator/options'
import { p } from '@/helper/prob'
import { randomFromEnum } from '@/helper/randomFromEnum'
import { randomGenus } from '@/helper/randomGenus'
import type { Generated } from '@/patterns/types'
import { genericNationality, NATIONALITY } from '../nationality/byNationality'
import { runners } from '../runners/runners'
import Bits from '@/builders/Bits'
import { getNamePools } from '@/builders/namePools'

export const genericName = async (options: GenerationOptions = {}): Promise<Generated> => {
  const nickname = p() ? (await runners(options)).primary : ''
  return await genericNationality(randomFromEnum(NATIONALITY), randomGenus(true), nickname, options)
}

export const givenName = async (options: GenerationOptions = {}): Promise<string> =>
  new Bits(getNamePools(options).get(undefined, 'given')).pick.uc
