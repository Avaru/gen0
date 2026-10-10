import Bits from '@/builders/Bits'
import { GENUS } from '@/builders/types'
import { p } from '@/helper/prob'
import { randomGenus } from '@/helper/randomGenus'
import { getNamePools } from '@/builders/namePools'
import type { GenerationOptions } from '@/generator/options'
import type { NameEntry, NamePart, NameGender } from '@/data/nameTypes'
import { namingTraditions, type NameNationality, type NameRule } from './traditions'
import { canComposeName } from './availability'
export type { NameNationality } from './traditions'

function partPool(
  nation: NameNationality,
  type: NamePart,
  genus: NameGender,
  options: GenerationOptions,
  excludeValue?: string,
): Bits<NameEntry> {
  const parts = getNamePools(options).get(nation, type, genus, true)
  return new Bits(
    excludeValue === undefined ? parts : parts.filter((bit) => bit.value !== excludeValue),
  )
}

/** One given name for use in any generator. */
export function nationalityGivenName(
  nation: NameNationality,
  genus: NameGender = randomGenus(true),
  options: GenerationOptions = {},
): string {
  return partPool(nation, 'given', genus, options).take().value
}

/** One surname, respecting gendered and invariant forms. */
export function nationalitySurname(
  nation: NameNationality,
  genus: NameGender = randomGenus(true),
  options: GenerationOptions = {},
): string {
  return partPool(nation, 'family', genus, options).take().value
}

/** An explicit stored patronymic, optionally selected by its father's given name. */
export function russianPatronymic(
  genus: NameGender = randomGenus(true),
  fatherGivenName?: string,
  options: GenerationOptions = {},
): string {
  const pools = getNamePools(options)
  const data = pools.get('russian')
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
    pools
      .get('russian', 'patronymic', genus)
      .filter(
        (bit) =>
          bit.type === 'patronymic' &&
          bit.genus === genus &&
          (fatherName === undefined || (father !== undefined && bit.fatherNameId === father.id)),
      ),
  )
  if (!pool.count)
    throw new Error(`No Russian patronymic found for father: ${fatherGivenName ?? 'any'}`)
  return pool.take().value
}

/** A name assembled with the supported tradition's rules, without character details. */
export function nationalName(
  nation: NameNationality,
  genus: NameGender = randomGenus(true),
  nickname?: string,
  options: GenerationOptions = {},
  givenNation: NameNationality = nation,
): string {
  if (!canComposeName(getNamePools(options), nation, genus, givenNation))
    throw new Error(
      `No entries match the required parts for ${namingTraditions[nation].label} names. Adjust the excluded tags or name list.`,
    )
  const given = partPool(givenNation, 'given', genus, options)
  const rule: NameRule = namingTraditions[nation].rule
  if (rule.kind === 'tamil') {
    // Expand the father's name instead of forcing an abbreviated initial.
    const personalName = given.take().value
    const father = partPool(nation, 'given', GENUS.M, options, personalName).take().value
    const parts = [father, personalName]
    if (nickname) parts.push(`'${nickname}'`)
    return parts.join(' ')
  }
  const family = partPool(nation, 'family', genus, options)
  const westernRule = rule.kind === 'western' ? rule : undefined
  if (rule.kind === 'surname-first') {
    const parts = [family.take().value, given.take().value]
    if (nickname) parts.push(`'${nickname}'`)
    return parts.join(' ')
  }
  const parts = [given.take().value]
  // Adjustable display variation; these are not measured population frequencies.
  if (rule.kind === 'russian') {
    if (p(rule.patronymic)) parts.push(russianPatronymic(genus, undefined, options))
  } else if (rule.kind === 'polish' || rule.kind === 'greek') {
    if (p(rule.secondGiven)) parts.push(given.take().value)
  } else if (rule.kind === 'spanish') {
    if (p(rule.secondGiven)) parts.push(given.take().value)
  } else if (rule.kind === 'arabic') {
    if (p(rule.fatherName)) {
      if (p(rule.marker)) parts.push(genus === GENUS.F ? 'bint' : p() ? 'ibn' : 'bin')
      parts.push(nationalityGivenName(nation, GENUS.M, options))
    }
  } else if (westernRule) {
    if (p(westernRule.secondGiven)) parts.push(given.take().value)
  } else {
    throw new Error(`No specific name structure for ${nation}`)
  }
  if (nickname) parts.push(`'${nickname}'`)
  let surname = family.take().value
  if (rule.kind === 'polish' && p(rule.secondSurname)) surname += `-${family.take().value}`
  if (westernRule && p(westernRule.secondSurname)) {
    const separator = p(westernRule.hyphenatedSurname) ? '-' : ' '
    surname += separator + family.take().value
  }
  parts.push(surname)
  if (rule.kind === 'spanish') parts.push(family.take().value)
  return parts.join(' ')
}
