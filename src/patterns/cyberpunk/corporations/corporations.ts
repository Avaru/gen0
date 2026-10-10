import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { randomFrom } from '@/helper/randomFrom'
import { randomFromEnum } from '@/helper/randomFromEnum'
import { randomRounded } from '@/helper/randomRounded'
import { load, SHADOWRUN } from '@/load'
import { getNamePools } from '@/builders/namePools'
import { type Generated } from '@/patterns/types'
import { CORPORATION_SIZE, CORPORATION_PARAMETERS } from './helpers'

export const corporations = async (
  size = randomFromEnum(CORPORATION_SIZE),
  isRelation = false,
  options: GenerationOptions = {},
): Promise<Generated> => {
  const names = new Bits(await load(SHADOWRUN.NAMES, options))
  const corp = names.tag('corporation')

  const known = corp.tag('known-corporation')
  const primary = []
  if (isRelation && p(0.6) && known.count > 0) {
    primary.push(known.pick.value)
  } else {
    if (p(0.4)) {
      primary.push(names.filter({ all: ['creature', 'mythological'] }).pick.uc)
    } else {
      const families = getNamePools(options).get(undefined, 'family')
      const preferred = ['german', 'british', 'spanish', 'japanese'].filter(tag =>
        families.some(bit => bit.tags.includes(tag)),
      )
      const tag = preferred.length ? randomFrom(preferred) : undefined
      primary.push(new Bits(families, { tag }).pick.uc)
    }

    if (p()) {
      primary.push(corp.type('business').pick.uc)
    }
    primary.push(corp.type('type').pick.uc)
  }

  const details = [
    `${Intl.NumberFormat().format(
      randomRounded(
        CORPORATION_PARAMETERS[size].EMPLOYEES_MIN,
        CORPORATION_PARAMETERS[size].EMPLOYEES_MAX,
      ),
    )} Employees`,
  ]

  let title
  if (p() && !isRelation && size !== CORPORATION_SIZE.AAA) {
    title =
      corp.type('relation').pick.uc +
      ' of ' +
      (await corporations(CORPORATION_SIZE.AAA, true, options)).primary
  }

  return {
    primary: primary.join(' '),
    details: details.join(', '),
    title,
  }
}

export async function knownCorporation(options: GenerationOptions = {}): Promise<Generated> {
  const known = new Bits(load(SHADOWRUN.NAMES, options), { all: ['corporation', 'known-corporation'] })
  const pick = known.pick
  return { primary: pick.value }
}
