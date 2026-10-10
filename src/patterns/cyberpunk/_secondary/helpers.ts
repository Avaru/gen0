import type { GenerationOptions } from '@/generator/options'
export enum SPECIES {
  NORM = 'Norm',
  ELF = 'Elf',
  DWARF = 'Dwarf',
  TROLL = 'Troll',
  ORK = 'Ork',
}

export const SPECIES_AGE: Record<SPECIES, { MIN: number; MAX: number; MATURITY: number }> = {
  [SPECIES.NORM]: {
    MIN: 10,
    MAX: 100,
    MATURITY: 16,
  },
  [SPECIES.DWARF]: {
    MIN: 10,
    MAX: 70,
    MATURITY: 21,
  },
  [SPECIES.ELF]: {
    MIN: 5,
    MAX: 70,
    MATURITY: 18,
  },
  [SPECIES.ORK]: {
    MIN: 5,
    MAX: 50,
    MATURITY: 10,
  },
  [SPECIES.TROLL]: {
    MIN: 5,
    MAX: 50,
    MATURITY: 15,
  },
} as const

import { isFlavorEnabled } from '@/generator/options'
import { randomFrom } from '@/helper/randomFrom'
export function pickSpecies(options: GenerationOptions): SPECIES {
  return isFlavorEnabled('shadowrun', options) ? randomFrom(Object.values(SPECIES)) : SPECIES.NORM
}
