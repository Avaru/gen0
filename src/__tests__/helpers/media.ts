import { afterEach, beforeEach, vi } from 'vitest'

export function mockMedia() {
  const matches = new Set(['(min-width: 40rem) and (pointer: fine)'])
  beforeEach(() => {
    matches.clear()
    matches.add('(min-width: 40rem) and (pointer: fine)')
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: matches.has(query),
      addEventListener: vi.fn<() => void>(),
      removeEventListener: vi.fn<() => void>(),
    }))
  })
  afterEach(() => vi.unstubAllGlobals())
  return matches
}
