import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { randomGenus } from '@/helper/randomGenus'
import { load, RL } from '@/load'
import { type Generated } from '@/patterns/types'
import { characters } from '../_secondary/charakters'

export enum NATIONALITY {
  GERMAN = 'german',
  BRITISH = 'british',
  AMERICAN_US = 'us-american',
  ITALIAN = 'italian',
  FRENCH = 'french',
  SPANISH = 'spanish',
  JAPANESE = 'japanese',
  RUSSIAN = 'russian',
  POLISH = 'polish',
  CHINESE = 'chinese',
  GREEK = 'greek',
}
export async function genericNationality(
  nation: NATIONALITY,
  genus = randomGenus(true),
  nickname?: string,
  options: GenerationOptions = {},
): Promise<Generated> {
  const names = new Bits(await load(RL.NAMES_MODERN, options), { tag: nation })

  const pattern = [names.filter({ genus, type: 'given' }).pick.uc, ' ']
  if (p(0.15)) {
    pattern.push(names.filter({ genus, type: 'given' }).pick.uc, ' ')
  }

  if (nickname) {
    pattern.push(" '" + nickname + "' ")
  }

  pattern.push(names.type('family').pick.uc)
  if (p(0.15)) {
    pattern.push(nation === NATIONALITY.GERMAN ? '-' : ' ', names.type('family').pick.uc)
  }

  return {
    primary: pattern.join(''),
    ...(await characters(true, undefined, options)),
  }
}
