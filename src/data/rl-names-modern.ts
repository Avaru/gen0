import type { NameEntry } from './nameTypes'
import { arabicNames } from './names/arabic'
import { britishNames } from './names/british'
import { greekNames } from './names/greek'
import { frenchNames } from './names/french'
import { chineseNames } from './names/chinese'
import { germanNames } from './names/german'
import { italianNames } from './names/italian'
import { polishNames } from './names/polish'
import { japaneseNames } from './names/japanese'
import { usAmericanNames } from './names/us-american'
import { spanishNames } from './names/spanish'
import { russianNames } from './names/russian'
import { nativeAmericanNames } from './names/native-american'
import { dutchNames } from './names/dutch'
import { turkishNames } from './names/turkish'
import { ukrainianNames } from './names/ukrainian'
import { swedishNames } from './names/swedish'
import { koreanNames } from './names/korean'
import { vietnameseNames } from './names/vietnamese'
import { hindiNames } from './names/hindi'
import { tamilNames } from './names/tamil'

// Keep the combined list for existing generators; edit each tradition in names/.
export const rlNamesModern: NameEntry[] = [
  ...arabicNames,
  ...britishNames,
  ...greekNames,
  ...frenchNames,
  ...chineseNames,
  ...germanNames,
  ...italianNames,
  ...polishNames,
  ...japaneseNames,
  ...usAmericanNames,
  ...spanishNames,
  ...russianNames,
  ...nativeAmericanNames,
  ...dutchNames,
  ...turkishNames,
  ...ukrainianNames,
  ...swedishNames,
  ...koreanNames,
  ...vietnameseNames,
  ...hindiNames,
  ...tamilNames,
]
