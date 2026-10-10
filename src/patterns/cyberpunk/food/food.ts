import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { genitivS } from '@/helper/de/genitivS'
import { p } from '@/helper/prob'
import { replacePlaceholder } from '@/helper/replacePlaceholder'
import { load, SHADOWRUN } from '@/load'
import { getNamePools } from '@/builders/namePools'
import type { Generated } from '@/patterns/types'

export async function restaurants(options: GenerationOptions = {}): Promise<Generated> {
  const food = new Bits(await load(SHADOWRUN.FOOD, options))

  const pattern: string[] = []
  if (p(0.4)) {
    const name = new Bits(getNamePools(options).get(undefined, 'given')).pick.uc
    pattern.push(genitivS(name, true))
  }

  if (p(0.2)) {
    pattern.push(food.tag('description').pick.uc)
  }
  if (p(0.5)) {
    pattern.push(food.tag('preparation').pick.uc)
  }
  if (p(0.6) || pattern.length < 3) {
    pattern.push(food.tag('cuisine').pick.uc)
  }
  pattern.push(food.tag('restaurant').pick.uc)

  const getDetail = () =>
    replacePlaceholder(
      food.tag('restaurant-details').pick.uc,
      food.tag('details-placeholder').values,
    )
  const details = [getDetail()]
  if (p()) {
    details.push(getDetail())
    if (p()) {
      details.push(getDetail())
    }
  }

  return {
    primary: pattern.join(' '),
    details: details.join(', '),
    rating: 1 + Math.random() * 4,
  }
}

export async function bars(options: GenerationOptions = {}): Promise<Generated> {
  const bars = new Bits(await load(SHADOWRUN.NAMES, options), { tag: 'bar' })
  const food = new Bits(await load(SHADOWRUN.FOOD, options))

  const getDetail = () =>
    replacePlaceholder(
      food.tag('restaurant-details').pick.uc,
      food.tag('details-placeholder').values,
    )
  const details = [getDetail()]
  if (p()) {
    details.push(getDetail())
    if (p()) {
      details.push(getDetail())
    }
  }

  let primary: string
  if (p(0.5)) {
    primary = bars.type('name').pick.value
  } else if (p(0.3)) {
    primary = 'The '
    if (p(0.5)) {
      primary += ' ' + food.tag('bar-name').pick.uc
    }
    primary += ' ' + bars.type('type').pick.uc
  } else {
    const owners = p(0.3)
      ? new Bits(getNamePools(options).get(undefined, 'given'))
      : new Bits(await load(SHADOWRUN.NAMES, options), { tag: 'runner' })
    primary = genitivS(owners.pick.uc, true)
    if (p(0.25)) {
      primary += ' and ' + genitivS(owners.pick.uc, true)
    }
    if (p(0.5)) {
      primary += ' ' + food.tag('bar-name').pick.uc
    }
    primary += ' ' + bars.type('type').pick.uc
  }

  return {
    primary,
    details: details.join(', '),
    rating: 1 + Math.random() * 4,
  }
}
