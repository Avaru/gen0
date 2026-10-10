import Bits from '@/builders/Bits'
import { GENUS } from '@/builders/types'
import { p } from '@/helper/prob'
import { randomGenus } from '@/helper/randomGenus'
import { load, RL } from '@/load'
import type { GenerationOptions } from '@/generator/options'
import type { NamePart } from '@/data/nameTypes'
import type { NATIONALITY } from './byNationality'

export type NameNationality = NATIONALITY | 'arabic'

// Display variation, not measured population frequencies.
const westernNameRules: Partial<
  Record<
    NameNationality,
    {
      secondGiven: number
      secondSurname: number
      hyphenatedSurname: number
    }
  >
> = {
  german: { secondGiven: 0.15, secondSurname: 0.15, hyphenatedSurname: 0.5 },
  british: { secondGiven: 0.15, secondSurname: 0.15, hyphenatedSurname: 0.5 },
  'us-american': { secondGiven: 0.15, secondSurname: 0.15, hyphenatedSurname: 0.5 },
  french: { secondGiven: 0.1, secondSurname: 0.15, hyphenatedSurname: 0 },
  italian: { secondGiven: 0.15, secondSurname: 0.05, hyphenatedSurname: 0 },
  dutch: { secondGiven: 0, secondSurname: 0, hyphenatedSurname: 0 },
  swedish: { secondGiven: 0, secondSurname: 0, hyphenatedSurname: 0 },
  turkish: { secondGiven: 0, secondSurname: 0, hyphenatedSurname: 0 },
  ukrainian: { secondGiven: 0, secondSurname: 0, hyphenatedSurname: 0 },
  hindi: { secondGiven: 0, secondSurname: 0, hyphenatedSurname: 0 },
}

function partPool(
  nation: NameNationality,
  type: NamePart,
  genus: GENUS,
  options: GenerationOptions,
): Bits {
  const matching = load(RL.NAMES_MODERN, options).filter(
    (bit) => bit.tags.includes(nation) && bit.type === type && (!bit.genus || bit.genus === genus),
  )
  return new Bits([...new Map(matching.map((bit) => [bit.value, bit])).values()])
}

/** One given name for use in any generator. */
export function nationalityGivenName(
  nation: NameNationality,
  genus = randomGenus(true),
  options: GenerationOptions = {},
): string {
  return partPool(nation, 'given', genus, options).pick.value
}

/** One surname, respecting gendered and invariant forms. */
export function nationalitySurname(
  nation: NameNationality,
  genus = randomGenus(true),
  options: GenerationOptions = {},
): string {
  return partPool(nation, 'family', genus, options).pick.value
}

/** An explicit stored patronymic, optionally selected by its father's given name. */
export function russianPatronymic(
  genus = randomGenus(true),
  fatherGivenName?: string,
  options: GenerationOptions = {},
): string {
  const data = load(RL.NAMES_MODERN, options).filter((bit) => bit.tags.includes('russian'))
  const fatherIds = new Set(
    data.flatMap((bit) => (bit.type === 'patronymic' ? [bit.fatherNameId] : [])),
  )
  const fatherName = fatherGivenName?.trim().toLowerCase()
  const father =
    fatherName === undefined
      ? undefined
      : data.find(
          (bit) =>
            bit.type === 'given' &&
            bit.genus === GENUS.M &&
            bit.id !== undefined &&
            fatherIds.has(bit.id) &&
            (bit.value.toLowerCase() === fatherName ||
              bit.aliases?.some((alias) => alias.toLowerCase() === fatherName)),
        )
  const pool = new Bits(
    data.filter(
      (bit) =>
        bit.type === 'patronymic' &&
        bit.genus === genus &&
        (fatherName === undefined || (father !== undefined && bit.fatherNameId === father.id)),
    ),
  )
  if (!pool.count)
    throw new Error(`No Russian patronymic found for father: ${fatherGivenName ?? 'any'}`)
  return pool.pick.value
}

/** A name assembled with the supported tradition's rules, without character details. */
export function nationalName(
  nation: NameNationality,
  genus = randomGenus(true),
  nickname?: string,
  options: GenerationOptions = {},
  givenNation: NameNationality = nation,
): string {
  const given = partPool(givenNation, 'given', genus, options)
  if (nation === 'tamil') {
    // A father's initial is not a hereditary surname. Keep his pool masculine.
    const father = nationalityGivenName(nation, GENUS.M, options)
    const parts = [`${father[0]}.`, given.pick.value]
    if (nickname) parts.push(`'${nickname}'`)
    return parts.join(' ')
  }
  const family = partPool(nation, 'family', genus, options)
  const westernRule = westernNameRules[nation]
  if (nation === 'chinese' || nation === 'japanese' || nation === 'korean' || nation === 'vietnamese') {
    const parts = [family.pick.value, given.pick.value]
    if (nickname) parts.push(`'${nickname}'`)
    return parts.join(' ')
  }
  const parts = [given.pick.value]
  // Adjustable display variation; these are not measured population frequencies.
  if (nation === 'russian') {
    if (p(0.75)) parts.push(russianPatronymic(genus, undefined, options))
  } else if (nation === 'polish' || nation === 'greek') {
    if (p(nation === 'polish' ? 0.25 : 0.1)) parts.push(given.pick.value)
  } else if (nation === 'spanish') {
    if (p(0.15)) parts.push(given.pick.value)
  } else if (nation === 'arabic') {
    if (p(0.5)) {
      if (p(0.5)) parts.push(genus === GENUS.F ? 'bint' : p() ? 'ibn' : 'bin')
      parts.push(nationalityGivenName('arabic', GENUS.M, options))
    }
  } else if (westernRule) {
    if (p(westernRule.secondGiven)) parts.push(given.pick.value)
  } else {
    throw new Error(`No specific name structure for ${nation}`)
  }
  if (nickname) parts.push(`'${nickname}'`)
  let surname = family.pick.value
  if (nation === 'polish' && p(0.1)) surname += `-${family.pick.value}`
  if (westernRule && p(westernRule.secondSurname)) {
    const separator = p(westernRule.hyphenatedSurname) ? '-' : ' '
    surname += separator + family.pick.value
  }
  parts.push(surname)
  if (nation === 'spanish') parts.push(family.pick.value)
  return parts.join(' ')
}
