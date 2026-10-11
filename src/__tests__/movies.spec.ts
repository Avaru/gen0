import { afterEach, describe, expect, it, vi } from 'vitest'
import { shadowrunMovie } from '@/data/shadowrun-movie'
import * as loader from '@/load'
import * as probability from '@/helper/prob'
import { movies } from '@/patterns/cyberpunk/entertainment/entertainment'

afterEach(() => vi.restoreAllMocks())

function useExistingFragments() {
  const values = ['Chronicles', 'with chainsaws', 'Army', 'Action', 'plagiarized', '2']
  vi.spyOn(loader, 'load').mockReturnValue(
    shadowrunMovie.filter((entry) => values.includes(entry.value)),
  )
}

describe('movie title phrases', () => {
  it.each(['Spy', 'return', 'party'])('pairs No time to with the existing verb %s', (verb) => {
    const values = ['No time to', verb, 'Action', 'plagiarized']
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    vi.spyOn(loader, 'load').mockReturnValue(
      shadowrunMovie.filter((entry) => values.includes(entry.value)),
    )
    vi.spyOn(probability, 'p')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValue(false)
    expect(movies().primary).toBe(`No time to ${verb[0]!.toUpperCase()}${verb.slice(1)}`)
  })

  it('uses Chronicles at the beginning with a connecting phrase', () => {
    useExistingFragments()
    vi.spyOn(probability, 'p')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValue(false)
    expect(movies().primary).toBe('Chronicles of the Army')
  })

  it.each([
    [0, 'Army Chronicles'],
    [0.99, 'Army with chainsaws'],
  ])('uses an ending at draw %s without moving it to the beginning', (draw, title) => {
    useExistingFragments()
    vi.spyOn(Math, 'random').mockReturnValue(draw)
    vi.spyOn(probability, 'p')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValue(false)
    expect(movies().primary).toBe(title)
    expect(shadowrunMovie.find((entry) => entry.value === 'with chainsaws')?.tags)
      .not.toContain('title-object-start')
  })

  it.each([
    [0.19, 'Army 2'],
    [0.21, 'Army'],
  ])('applies the 20 percent extra-ending chance at draw %s', (draw, title) => {
    useExistingFragments()
    vi.spyOn(Math, 'random').mockReturnValue(draw)
    vi.spyOn(probability, 'p')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockImplementation((chance = 0.5) => Math.random() < chance)
    expect(movies().primary).toBe(title)
  })
})
