import Bits from '@/builders/Bits'
import { weaponManufacturers } from '@/data/weapons'
import { load, CONTENT, SHADOWRUN } from '@/load'
import { getNamePools } from '@/builders/namePools'
import type { GenerationOptions } from '@/generator/options'
import type { Generated } from '@/patterns/types'
import { randomFrom } from '@/helper/randomFrom'
import { randomRounded } from '@/helper/randomRounded'
import { p } from '@/helper/prob'
import { corporations } from '../corporations/corporations'
import { givenName } from '../_secondary/names'

function pool(list: CONTENT, options: GenerationOptions) {
  return new Bits(load(list, options))
}

async function company(options: GenerationOptions, manufacturersOnly = false) {
  const known = new Bits(load(SHADOWRUN.NAMES, options), { tag: 'known-corporation' })
  const manufacturers = known.values.filter(name =>
    weaponManufacturers.includes(name),
  )
  const available = manufacturersOnly ? manufacturers : known.values
  if (available.length && p(0.5)) return randomFrom(available)
  return (await corporations(undefined, false, options)).primary
}

export async function weapons(options: GenerationOptions = {}): Promise<Generated> {
  const data = pool(CONTENT.WEAPONS, options)
  const kind = data.type('kind').pick
  const name = [await company(options, true), data.type('model').pick.value]
  if (p(0.6)) name.push(`“${data.type('series').pick.value}”`)
  const modifications = data.type('modification').filter({ none: kind.tags.includes('melee') ? ['firearm'] : [] })
  const details = [kind.value]
  if (p(0.6) && modifications.count) details.push(modifications.pick.value)
  if (p(0.3) && modifications.count) details.push(modifications.pick.value)
  return { primary: name.join(' '), details: details.join(', ') }
}

export async function foodMenu(options: GenerationOptions = {}): Promise<Generated> {
  const data = pool(CONTENT.FOOD_MENU, options)
  const name = [data.type('preparation').pick.uc, data.type('dish').pick.value]
  if (p(0.33)) name.push(data.type('extra').pick.value)
  const details = [data.type('detail').pick.uc, `${randomRounded(1, 30)} ${data.type('currency').pick.value}`]
  return { primary: name.join(' '), details: details.join(', ') }
}

export async function shops(options: GenerationOptions = {}): Promise<Generated> {
  const data = pool(CONTENT.SHOPS, options)
  const owner = p(0.5) ? await company(options) : `${await givenName(options)}’s`
  const name = [owner]
  if (p(0.33)) name.push(data.type('description').pick.uc)
  name.push(data.type('wares').pick.uc, data.type('kind').pick.uc)
  const details = [data.type('outer').pick.uc]
  if (p(0.5)) details.push(data.type('inner').pick.value)
  return { primary: name.join(' '), details: details.join(', ') }
}

async function address(options: GenerationOptions) {
  const data = pool(CONTENT.DEVICE_DATA, options)
  const name = new Bits(getNamePools(options).get(undefined, 'family')).pick.uc
  return `${name} ${data.type('street-kind').pick.uc} ${randomRounded(1, 200)}`
}

export async function deviceContents(options: GenerationOptions = {}): Promise<Generated> {
  const data = pool(CONTENT.DEVICE_DATA, options)
  const storage = data.type('storage').pick.uc
  switch (randomFrom(['picture', 'access', 'file', 'journey', 'map'])) {
    case 'picture': {
      const subject = data.type('subject').pick
      const description = subject.tags.includes('people') ? `${data.type('person-description').pick.value} ` : ''
      return {
        primary: `${data.type('quality').pick.uc} ${data.type('recording').pick.value} of ${description}${subject.value}`,
        details: `${storage}, labeled ${await givenName(options)}`,
      }
    }
    case 'access':
      return {
        primary: `${data.type('access').pick.uc} for ${data.type('target').pick.value}`,
        details: `${storage}, ${await company(options)}, ${await address(options)}`,
      }
    case 'file':
      return {
        primary: `${data.type('file').pick.uc} of ${data.type('device-description').pick.value} ${data.type('device').pick.value}`,
        details: `${storage}, ${data.type('origin').pick.value} ${await company(options)}`,
      }
    case 'journey':
      return {
        primary: `${data.type('journey').pick.uc} from ${await address(options)} to ${await address(options)}`,
        details: storage,
      }
    default:
      return { primary: `Map of ${await address(options)}`, details: storage }
  }
}
