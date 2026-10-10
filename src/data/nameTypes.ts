import type { RawBit } from '@/builders/types'

export type NameGender = 'm' | 'f'

type NameBase = Omit<RawBit, 'id' | 'type' | 'genus'> & {
  /** Only entries referenced by patronymics or nicknames need an ID. */
  id?: string
  /** Omitted for a form usable by either gender. */
  genus?: NameGender
}

export type GivenNameEntry = NameBase & { type: 'given'; aliases?: string[] }
export type FamilyNameEntry = NameBase & { type: 'family'; formGroupId?: string }
export type NicknameEntry = NameBase & { type: 'nickname'; givenNameIds?: string[] }
export type TranslationNameEntry = NameBase & { type: 'translation' }
export type PatronymicEntry = NameBase & {
  type: 'patronymic'
  genus: NameGender
  fatherNameId: string
}

export type NameEntry =
  | GivenNameEntry
  | FamilyNameEntry
  | NicknameEntry
  | TranslationNameEntry
  | PatronymicEntry

export type NamePart = Extract<NameEntry['type'], 'given' | 'family' | 'patronymic'>
