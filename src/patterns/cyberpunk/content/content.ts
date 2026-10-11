import { capitalize } from '@/helper/capitalize'
import Bits from '@/builders/Bits'
import { weaponManufacturers } from '@/data/weapons'
import { load, CONTENT, SHADOWRUN } from '@/load'
import { getNamePools } from '@/builders/namePools'
import type { GenerationOptions } from '@/generator/options'
import type { Generated } from '@/patterns/types'
import { randomFrom } from '@/helper/randomFrom'
import { randomRounded } from '@/helper/randomRounded'
import { p } from '@/helper/prob'
import { corporationName } from '../corporations/corporations'
import { givenName } from '../_secondary/names'
import { weaponName } from './weaponName'

function pool<List extends CONTENT>(list: List, options: GenerationOptions) {
  return new Bits(load(list, options))
}

function company(options: GenerationOptions, manufacturersOnly = false) {
  const known = new Bits(load(SHADOWRUN.NAMES, options), { tag: 'known-corporation' })
  const manufacturers = known.values.filter((name) => weaponManufacturers.includes(name))
  const available = manufacturersOnly ? manufacturers : known.values
  if (available.length && p(0.5)) return randomFrom(available)
  return corporationName(options)
}

export function weapons(options: GenerationOptions = {}): Generated {
  const data = pool(CONTENT.WEAPONS, options)
  const kind = data.type('kind').take()
  const name = [company(options, true), weaponName(options)]
  const modifications = data
    .type('modification')
    .filter({ none: kind.tags.includes('melee') ? ['firearm'] : [] })
  const details = [kind.value]
  if (p(0.6) && modifications.count) details.push(modifications.take().value)
  if (p(0.3) && modifications.count) details.push(modifications.take().value)
  return { primary: name.join(' '), details: details.join(', ') }
}

export function foodMenu(options: GenerationOptions = {}): Generated {
  const data = pool(CONTENT.FOOD_MENU, options)
  const name = [capitalize(data.type('preparation').take().value), data.type('dish').take().value]
  if (p(0.33)) name.push(data.type('extra').take().value)
  const details = [
    capitalize(data.type('detail').take().value),
    `${randomRounded(1, 30)} ${data.type('currency').take().value}`,
  ]
  return { primary: name.join(' '), details: details.join(', ') }
}

export function shops(options: GenerationOptions = {}): Generated {
  const data = pool(CONTENT.SHOPS, options)
  const owner = p(0.5) ? company(options) : `${givenName(options)}’s`
  const name = [owner]
  if (p(0.33)) name.push(capitalize(data.type('description').take().value))
  name.push(capitalize(data.type('wares').take().value), capitalize(data.type('kind').take().value))
  const details = [capitalize(data.type('outer').take().value)]
  if (p(0.5)) details.push(data.type('inner').take().value)
  return { primary: name.join(' '), details: details.join(', ') }
}

function address(options: GenerationOptions) {
  const data = pool(CONTENT.DEVICE_DATA, options)
  const name = capitalize(new Bits(getNamePools(options).get(undefined, 'family')).take().value)
  return `${name} ${capitalize(data.type('street-kind').take().value)} ${randomRounded(1, 200)}`
}

export function deviceContents(options: GenerationOptions = {}): Generated {
  const data = pool(CONTENT.DEVICE_DATA, options)
  const storage = capitalize(data.type('storage').take().value)
  switch (randomFrom(['picture', 'access', 'file', 'journey', 'map'])) {
    case 'picture': {
      const subject = data.type('subject').take()
      const description = subject.tags.includes('people')
        ? `${data.type('person-description').take().value} `
        : ''
      return {
        primary: `${capitalize(data.type('quality').take().value)} ${data.type('recording').take().value} of ${description}${subject.value}`,
        details: `${storage}, labeled ${givenName(options)}`,
      }
    }
    case 'access':
      return {
        primary: `${capitalize(data.type('access').take().value)} for ${data.type('target').take().value}`,
        details: `${storage}, ${company(options)}, ${address(options)}`,
      }
    case 'file':
      return {
        primary: `${capitalize(data.type('file').take().value)} of ${data.type('device-description').take().value} ${data.type('device').take().value}`,
        details: `${storage}, ${data.type('origin').take().value} ${company(options)}`,
      }
    case 'journey':
      return {
        primary: `${capitalize(data.type('journey').take().value)} from ${address(options)} to ${address(options)}`,
        details: storage,
      }
    default:
      return { primary: `Map of ${address(options)}`, details: storage }
  }
}
