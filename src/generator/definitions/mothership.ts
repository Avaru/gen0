import { genericName, shipName } from '@/patterns/mothership/names'
import type { Category } from '../categoryTypes'

export const mothershipCategories: Category[] = [
  {
    id: 'generic',
    label: 'Characters',
    group: 'Names',
    gender: true,
    generate: genericName,
  },
  {
    id: 'ships',
    label: 'Ships',
    group: 'Names',
    generate: shipName,
  },
]
