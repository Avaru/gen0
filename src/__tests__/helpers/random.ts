import { vi } from 'vitest'

/** Repeatable draws for behavior tests; callers restore mocks after each test. */
export function seedRandom(seed = 421) {
  let state = seed
  return vi.spyOn(Math, 'random').mockImplementation(() => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  })
}
