import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearNamePools } from '@/builders/namePools'
import { GENUS } from '@/builders/types'
import { mothershipShipNameCandidates } from '@/data/mothership-ship-name-candidates'
import { genericName, shipName } from '@/patterns/mothership/names'
import * as stats from '@/patterns/mothership/stats'
import * as looks from '@/patterns/cyberpunk/runners/looks'

afterEach(() => {
  clearNamePools()
  vi.restoreAllMocks()
})

describe('Mothership character appearance', () => {
  it.each([
    [0, 'he/him'],
    [0.4, 'she/her'],
    [0.8, 'they/them'],
  ] as const)('generates the supplied pronoun choices at draw %s', (draw, pronouns) => {
    vi.spyOn(Math, 'random').mockReturnValue(draw)
    expect(genericName({ setting: 'mothership' }).pronouns).toBe(pronouns)
  })

  it.each(['cyberpunk', 'shadowrun', 'cyberpunk2020-2077'] as const)(
    'uses generic Cyberpunk looks and preserves exclusions with %s options',
    (flavor) => {
      const rollCharacter = vi.spyOn(stats, 'rollMothershipCharacter')
      const runnerLooks = vi.spyOn(looks, 'runnerLooks')
      const options = { setting: 'mothership' as const, flavor, excludeTags: ['british'] }
      const result = genericName(options)

      expect(runnerLooks).toHaveBeenCalledExactlyOnceWith({ ...options, flavor: 'cyberpunk' })
      const fragments = runnerLooks.mock.results[0]!.value as string[]
      expect(fragments.length).toBeGreaterThanOrEqual(3)
      const appearance = fragments.join(', ')
      expect(result.appearance).toBe(appearance[0]!.toUpperCase() + appearance.slice(1))
      expect(result).not.toHaveProperty('mothershipCharacter')
      expect(rollCharacter).not.toHaveBeenCalled()
      expect(result.secondary).toBe(result.mothershipClass)
      expect(result.details).toMatch(/^Trinket: .+ · Patch: .+$/)
    },
  )
})

describe('Mothership ship names', () => {
  it.each([0, 0.499999])('uses the edited song list below the 50%% boundary (%s)', (draw) => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999).mockReturnValueOnce(draw)
    expect(shipName({ setting: 'mothership' })).toMatchObject({
      primary: mothershipShipNameCandidates[mothershipShipNameCandidates.length - 1],
    })
  })

  it.each([
    [0, 'Zoe'],
    [0.249999, 'Zoe'],
    [0.25, 'Zuriñe'],
    [0.499999, 'Zuriñe'],
    [0.5, 'Maina'],
    [0.749999, 'Maina'],
    [0.75, 'Zinoviya'],
    [0.999999, 'Zinoviya'],
  ])('gives each language one quarter of given-name draws (%s)', (languageDraw, expected) => {
    vi.spyOn(Math, 'random')
      .mockReturnValue(0.999999)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(languageDraw)
    expect(shipName({ setting: 'mothership', genus: GENUS.M, genders: [GENUS.M] })).toMatchObject({
      primary: expected,
    })
  })

  it.each(['cyberpunk', 'shadowrun', 'cyberpunk2020-2077'] as const)(
    'passes exclusions through to the female given-name pool in %s',
    (flavor) => {
      vi.spyOn(Math, 'random').mockReturnValue(0).mockReturnValueOnce(0.999999)
      expect(
        shipName({
          setting: 'mothership',
          flavor,
          excludeTags: ['british', 'spanish', 'french'],
          genus: GENUS.M,
        }),
      ).toMatchObject({ primary: 'Agafiia' })
    },
  )

  it('reports an exhausted given-name pool without using another language or gender', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(() => shipName({ excludeTags: ['british', 'spanish', 'french', 'russian'] })).toThrow(
      'No entries match these settings',
    )
  })
})
