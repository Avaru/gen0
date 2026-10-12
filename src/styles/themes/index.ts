import type { Flavor } from '@/generator/options'

export const flavorThemes = {
  cyberpunk: 'cyberpunk',
  shadowrun: 'cyberpunk',
  'cyberpunk2020-2077': 'cyberpunk',
} as const satisfies Record<Flavor, string>

export type Theme = typeof flavorThemes[Flavor]
