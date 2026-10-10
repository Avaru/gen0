import type { GenerationOptions } from '@/generator/options'
import { randomGenus } from '@/helper/randomGenus'
import { type Generated } from '@/patterns/types'
import { characters } from '../_secondary/charakters'
import { nationalName } from './nameParts'

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
  DUTCH = 'dutch',
  TURKISH = 'turkish',
  UKRAINIAN = 'ukrainian',
  SWEDISH = 'swedish',
  KOREAN = 'korean',
  VIETNAMESE = 'vietnamese',
  HINDI = 'hindi',
  TAMIL = 'tamil',
}
export async function genericNationality(
  nation: NATIONALITY,
  genus = randomGenus(true),
  nickname?: string,
  options: GenerationOptions = {},
): Promise<Generated> {
  return {
    primary: nationalName(nation, genus, nickname, options),
    ...(await characters(true, undefined, options)),
  }
}
