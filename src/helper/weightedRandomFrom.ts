import { rng } from './rng'

// Preserve the old preference for entries earlier in the list.
export function randomFromWeighted<T>(items: T[], factor = 0.75): T {
  for (const [index, item] of items.entries()) {
    if (rng() > factor / (items.length - index)) return item
  }
  const last = items[items.length - 1]
  if (last === undefined) throw new Error('Cannot choose from an empty list.')
  return last
}
