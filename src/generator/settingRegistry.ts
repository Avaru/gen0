import { cyberpunkCategories } from './definitions/cyberpunk'
import { cyberpunkFlavors, type Flavor } from './options'
import type { Category } from './categoryTypes'
import type { Theme } from '@/styles/themes'

export interface SettingDefinition {
  id: string
  label: string
  caption: string
  theme: Theme
  flavors: readonly { id: Flavor; label: string }[]
  defaultFlavor: Flavor
  defaultCategory: string
  categories: readonly Category[]
  characterSheet?: { label: string; path: string }
}

export const settings = [
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    caption: 'Cyberpunk name generator',
    theme: 'cyberpunk',
    flavors: cyberpunkFlavors,
    defaultFlavor: 'cyberpunk',
    defaultCategory: 'runners',
    categories: cyberpunkCategories,
    characterSheet: { label: 'CBR+PNK', path: '/chars/cbrpnk' },
  },
] as const satisfies readonly SettingDefinition[]

export type SettingId = (typeof settings)[number]['id']

export function getSetting(id?: unknown): SettingDefinition {
  return settings.find((setting) => setting.id === id) ?? settings[0]
}
