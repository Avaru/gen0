import { capitalize } from '@/helper/capitalize'
import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { genitivS } from '@/helper/de/genitivS'
import { p } from '@/helper/prob'
import { replacePlaceholder } from '@/helper/replacePlaceholder'
import { load, DATA } from '@/builders/load'
import { getNamePools } from '@/builders/namePools'
import type { Generated } from '@/patterns/types'

export function restaurants(options: GenerationOptions = {}): Generated {
  const food = new Bits(load(DATA.FOOD, options))

  const pattern: string[] = []
  if (p(0.4)) {
    const name = capitalize(new Bits(getNamePools(options).get(undefined, 'given')).take().value)
    pattern.push(genitivS(name, true))
  }

  if (p(0.2)) {
    pattern.push(capitalize(food.tag('description').take().value))
  }
  if (p(0.5)) {
    pattern.push(capitalize(food.tag('preparation').take().value))
  }
  if (p(0.6) || pattern.length < 3) {
    pattern.push(capitalize(food.tag('cuisine').take().value))
  }
  pattern.push(capitalize(food.tag('restaurant').take().value))

  const getDetail = () =>
    replacePlaceholder(
      capitalize(food.tag('restaurant-details').take().value),
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

export function bars(options: GenerationOptions = {}): Generated {
  const bars = new Bits(load(DATA.NAME_FRAGMENTS, options), { tag: 'bar' })
  const food = new Bits(load(DATA.FOOD, options))

  const getDetail = () =>
    replacePlaceholder(
      capitalize(food.tag('restaurant-details').take().value),
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
    primary = bars.type('name').take().value
  } else if (p(0.3)) {
    primary = 'The '
    if (p(0.5)) {
      primary += ' ' + capitalize(food.tag('bar-name').take().value)
    }
    primary += ' ' + capitalize(bars.type('type').take().value)
  } else {
    const owners = p(0.3)
      ? new Bits(getNamePools(options).get(undefined, 'given'))
      : new Bits(load(DATA.NAME_FRAGMENTS, options), { tag: 'runner' })
    primary = genitivS(capitalize(owners.take().value), true)
    if (p(0.25)) {
      primary += ' and ' + genitivS(capitalize(owners.take().value), true)
    }
    if (p(0.5)) {
      primary += ' ' + capitalize(food.tag('bar-name').take().value)
    }
    primary += ' ' + capitalize(bars.type('type').take().value)
  }

  return {
    primary,
    details: details.join(', '),
    rating: 1 + Math.random() * 4,
  }
}
