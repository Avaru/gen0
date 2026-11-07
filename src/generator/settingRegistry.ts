import { neverMidnightCategories } from './definitions/never-midnight'
import { cyberpunkCategories } from './definitions/cyberpunk'
import { mothershipCategories } from './definitions/mothership'
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

export const neverMidnightEnabled = __NEVER_MIDNIGHT__

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
  caption: 'Never Midnight\nName generator',
  theme: 'never-midnight',
  flavors: [],
  defaultCategory: 'german',
  categories: neverMidnightCategories,
  characterSheet: { label: 'Student sheet', path: '/chars/never-midnight' },
} as const satisfies SettingDefinition

const mothershipSetting = {
  id: 'mothership',
  label: 'Mothership',
  caption: 'Mothership\nName generator',
  theme: 'mothership',
  flavors: [],
  defaultCategory: 'generic',
  categories: mothershipCategories,
} as const satisfies SettingDefinition

export type SettingId =
  | typeof cyberpunkSetting.id
  | typeof neverMidnightSetting.id
  | typeof mothershipSetting.id

export const settings = [
  cyberpunkSetting,
  mothershipSetting,
  ...(neverMidnightEnabled ? [neverMidnightSetting] : []),
]

export function getSetting(id?: unknown): SettingDefinition {
  return settings.find((setting) => setting.id === id) ?? cyberpunkSetting
}
