import type { GenerationOptions } from '@/generator/options'
import { randomGenus } from '@/helper/randomGenus'
import type { Generated } from '@/patterns/types'
import { characters } from '../_secondary/charakters'
import { nationalName } from './nameParts'

export async function arabic(
  genus = randomGenus(true),
  options: GenerationOptions = {},
): Promise<Generated> {
  return {
    primary: nationalName('arabic', genus, undefined, options),
    ...(await characters(true, undefined, options)),
  }
}
