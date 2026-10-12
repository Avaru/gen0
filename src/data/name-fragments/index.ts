import type { NameFragment } from './types'
import { barNames } from './bars'
import { businessNames } from './businesses'
import { cityNames } from './cities'
import { commlinkPictureNames } from './commlink-pictures'
import { corporationNames } from './corporations'
import { creatureNames } from './creatures'
import { deviceNames } from './devices'
import { gangNames } from './gangs'
import { locationNames } from './locations'
import { pictureNames } from './pictures'
import { restaurantNames } from './restaurants'
import { runnerNames } from './runners'
import { shopNames } from './shops'
import { weaponNames } from './weapons'

export const nameFragments: NameFragment[] = [
  ...barNames,
  ...businessNames,
  ...cityNames,
  ...commlinkPictureNames,
  ...corporationNames,
  ...creatureNames,
  ...deviceNames,
  ...gangNames,
  ...locationNames,
  ...pictureNames,
  ...restaurantNames,
  ...runnerNames,
  ...shopNames,
  ...weaponNames,
]
