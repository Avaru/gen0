import { rng } from './rng'

export function randomFrom<T>(items: readonly T[]): T {
  const item = items[Math.floor(items.length * rng())]
  if (item === undefined)
    throw new Error('No entries match these settings. Enable more tags or adjust the name list.')
  return item
}
