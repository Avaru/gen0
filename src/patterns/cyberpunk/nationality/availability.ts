import { GENUS } from '@/builders/types'
import type { NamePools } from '@/builders/namePools'
import type { NameGender } from '@/data/nameTypes'
import { namingTraditions, type NameNationality, type NameRule } from './traditions'

/** Verify every part a rule may request, including optional second names. */
export function canComposeName(
  pools: NamePools,
  nation: NameNationality,
  genus: NameGender,
  givenNation: NameNationality = nation,
): boolean {
  const rule: NameRule = namingTraditions[nation].rule
  const given = pools.get(givenNation, 'given', genus, true)
  const needsSecondGiven = 'secondGiven' in rule && rule.secondGiven > 0
  if (given.length < (needsSecondGiven ? 2 : 1)) return false
  if (rule.kind === 'tamil') {
    const fathers = pools.get(nation, 'given', GENUS.M, true)
    return given.every((person) => fathers.some((father) => father.value !== person.value))
  }
  const family = pools.get(nation, 'family', genus, true)
  const needsSecondSurname =
    rule.kind === 'spanish' || ('secondSurname' in rule && rule.secondSurname > 0)
  if (family.length < (needsSecondSurname ? 2 : 1)) return false
  if (rule.kind === 'russian' && rule.patronymic > 0)
    return pools.get(nation, 'patronymic', genus).some((entry) => entry.genus === genus)
  if (rule.kind === 'arabic' && rule.fatherName > 0)
    return pools.get(nation, 'given', GENUS.M).length > 0
  return true
}
