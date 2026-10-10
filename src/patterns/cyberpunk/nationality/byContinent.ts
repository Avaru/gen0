import { continents } from '@/data/continents'
import { isEntryAvailable } from '@/builders/availability'
import type { GenerationOptions } from '@/generator/options'
import { randomGenus } from '@/helper/randomGenus'
import type { Generated } from '@/patterns/types'
import { generateRegionalName } from './bySovereignty'

export async function byContinent(id: string, genus = randomGenus(true), options: GenerationOptions = {}): Promise<Generated> {
  const continent = continents.find(item => item.id === id)
  if (!continent || !isEntryAvailable(continent, options)) throw new Error('Choose a continent available in this flavor.')
  return generateRegionalName(continent, genus, options)
}
