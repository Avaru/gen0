import { neverMidnightCategories } from './definitions/never-midnight'
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
  defaultFlavor?: Flavor
  defaultCategory: string
  categories: readonly Category[]
  characterSheet?: { label: string; path: string }
}

export const neverMidnightEnabled = import.meta.env.VITE_ENABLE_NEVER_MIDNIGHT === 'true'

const cyberpunkSetting = {
  id: 'cyberpunk',
  label: 'Cyberpunk',
  caption: 'Cyberpunk name generator',
  theme: 'cyberpunk',
  flavors: cyberpunkFlavors,
  defaultFlavor: 'cyberpunk',
  defaultCategory: 'runners',
  categories: cyberpunkCategories,
  characterSheet: { label: 'CBR+PNK', path: '/chars/cbrpnk' },
} as const satisfies SettingDefinition

const neverMidnightSetting = {
  id: 'never-midnight',
  label: 'Never Midnight',
  caption: 'Never Midnight / Name generator',
  theme: 'never-midnight',
  flavors: [],
  defaultCategory: 'german',
  categories: neverMidnightCategories,
} as const satisfies SettingDefinition

export type SettingId = typeof cyberpunkSetting.id | typeof neverMidnightSetting.id

export const settings = [cyberpunkSetting, ...(neverMidnightEnabled ? [neverMidnightSetting] : [])]

export function getSetting(id?: unknown): SettingDefinition {
  return settings.find((setting) => setting.id === id) ?? cyberpunkSetting
}
