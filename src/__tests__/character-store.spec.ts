// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { disposePinia } from 'pinia'
import { createTestPinia as createPinia } from './helpers/pinia'
import { nextTick } from 'vue'
import { DATA, load } from '@/builders/load'
import { flavors } from '@/generator/options'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import * as probability from '@/helper/prob'
import { useCharacterStore } from '@/stores/character'

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe('character local storage', () => {
  it('restores all editable fields in a new store after saving nested edits', async () => {
    const pinia = createPinia()
    const store = useCharacterStore(pinia)
    store.sheet.runner = {
      alias: 'Handle',
      description: 'Real name: Test Name\nRunner',
      archetypeId: 'hacker',
    }
    store.sheet.attributeRatings[0]!.value = 2
    store.sheet.skillRatings[0]!.value = 1
    store.sheet.expertises[0]!.values = ['Observe']
    store.sheet.glitches[0]!.marked = true
    store.sheet.harm[0]!.description = 'Bruised'
    store.sheet.harm[0]!.marks[1] = true
    store.sheet.gear = {
      level: 'medium',
      selected: ['Armor', '+Heavy'],
      extra: [false, true, false, false],
    }
    store.sheet.stress = 4
    store.sheet.augmentations[0] = { description: 'Wired reflexes', glitched: true }
    await nextTick()
    const saved = JSON.parse(localStorage.getItem('gen0.character')!)
    expect(saved).toEqual(store.sheet)
    disposePinia(pinia)
    expect(useCharacterStore(createPinia()).sheet).toEqual(saved)
  })

  it('batches typing, saves discrete changes immediately, and flushes pending text when leaving', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const store = useCharacterStore(createPinia())
    const writes = vi.spyOn(Storage.prototype, 'setItem')
    store.sheet.runner.alias = 'First'
    await nextTick()
    await vi.advanceTimersByTimeAsync(100)
    store.sheet.runner.alias = 'Second'
    await nextTick()
    await vi.advanceTimersByTimeAsync(199)
    expect(writes).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(writes).toHaveBeenCalledTimes(1)
    expect(useCharacterStore(createPinia()).sheet.runner.alias).toBe('Second')
    store.sheet.runner.alias = 'Third'
    await nextTick()
    store.sheet.stress = 1
    await nextTick()
    expect(writes).toHaveBeenCalledTimes(2)
    expect(useCharacterStore(createPinia()).sheet.runner.alias).toBe('Third')
    await vi.advanceTimersByTimeAsync(200)
    expect(writes).toHaveBeenCalledTimes(2)
    store.sheet.expertises[0]!.custom = 'Final text'
    await nextTick()
    window.dispatchEvent(new Event('pagehide'))
    expect(writes).toHaveBeenCalledTimes(3)
    expect(useCharacterStore(createPinia()).sheet.expertises[0]!.custom).toBe('Final text')
    vi.useRealTimers()
  })

  it('saves pending text and removes lifecycle listeners when its store is disposed', async () => {
    const pinia = createPinia()
    const store = useCharacterStore(pinia)
    store.sheet.harm[0]!.description = 'Last edit'
    await nextTick()
    const remove = vi.spyOn(window, 'removeEventListener')
    disposePinia(pinia)
    expect(useCharacterStore(createPinia()).sheet.harm[0]!.description).toBe('Last edit')
    expect(remove).toHaveBeenCalledWith('pagehide', expect.any(Function))
  })

  it.each(['null', '{broken', '{}', '{"systemId":"other"}'])(
    'starts blank when saved data is unusable: %s',
    (saved) => {
      const blank = useCharacterStore(createPinia()).sheet
      localStorage.setItem('gen0.character', saved)
      expect(useCharacterStore(createPinia()).sheet).toEqual(blank)
    },
  )

  it('ignores a sheet with unusable nested data', () => {
    const blank = useCharacterStore(createPinia()).sheet
    localStorage.setItem('gen0.character', JSON.stringify({ ...blank, harm: [null, null, null] }))
    expect(useCharacterStore(createPinia()).sheet).toEqual(blank)
  })

  it('keeps existing sheet edits when the saved sheet has no runner fields yet', () => {
    const store = useCharacterStore(createPinia())
    const saved = JSON.parse(JSON.stringify(store.sheet))
    delete saved.runner
    saved.stress = 4
    localStorage.setItem('gen0.character', JSON.stringify(saved))
    const restored = useCharacterStore(createPinia()).sheet
    expect(restored.stress).toBe(4)
    expect(restored.runner).toEqual({ alias: '', description: '' })
  })

  it('preserves earlier edits when a saved sheet has no gear yet', () => {
    const saved = JSON.parse(JSON.stringify(useCharacterStore(createPinia()).sheet))
    delete saved.gear
    saved.stress = 3
    localStorage.setItem('gen0.character', JSON.stringify(saved))
    const restored = useCharacterStore(createPinia()).sheet
    expect(restored.stress).toBe(3)
    expect(restored.gear).toEqual({
      level: 'medium',
      selected: [],
      extra: [false, false, false, false],
    })
  })

  it('selects Medium when an older saved sheet has an unselected load', () => {
    const saved = JSON.parse(JSON.stringify(useCharacterStore(createPinia()).sheet))
    saved.gear.level = ''
    saved.gear.selected = ['Armor']
    localStorage.setItem('gen0.character', JSON.stringify(saved))
    expect(useCharacterStore(createPinia()).sheet.gear).toEqual({
      level: 'medium',
      selected: ['Armor'],
      extra: [false, false, false, false],
    })
  })

  it('keeps the sheet editable when storage cannot be read or written', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const store = useCharacterStore(createPinia())
    expect(store.sheet.stress).toBe(0)
    store.sheet.stress = 3
    await nextTick()
    expect(store.sheet.stress).toBe(3)
  })
})

describe('archetype rating variation', () => {
  it.each([
    { approaches: false, skills: false },
    { approaches: true, skills: false },
    { approaches: false, skills: true },
    { approaches: true, skills: true },
  ])(
    'rolls independently for approaches=$approaches and skills=$skills',
    async ({ approaches, skills }) => {
      const source = JSON.stringify(cbrPnkCatalogue)
      const store = useCharacterStore(createPinia())
      store.sheet.runner.archetypeId = 'hacker'
      const chance = vi.spyOn(probability, 'p').mockReturnValue(false)
      store.applyArchetype()
      const baseline = JSON.parse(JSON.stringify(store.sheet))
      chance.mockClear().mockReturnValueOnce(approaches).mockReturnValueOnce(skills)
      vi.spyOn(Math, 'random').mockReturnValue(0)
      store.applyArchetype({ bitRandom: true })
      expect(chance.mock.calls.filter(([value]) => value === 0.2)).toEqual([[0.2], [0.2]])
      for (const [key, varied] of [
        ['attributeRatings', approaches],
        ['skillRatings', skills],
      ] as const) {
        const deltas = store.sheet[key].map((row, i) => row.value! - baseline[key][i].value)
        expect(deltas.filter((delta) => delta !== 0).sort()).toEqual(varied ? [-1, 1] : [])
        expect(deltas.reduce((total, delta) => total + delta, 0)).toBe(0)
        expect(
          store.sheet[key].every((row) => row.value !== null && row.value >= 0 && row.value <= 2),
        ).toBe(true)
      }
      expect(store.sheet.expertises).toEqual(baseline.expertises)
      expect(JSON.stringify(cbrPnkCatalogue)).toBe(source)
      await nextTick()
      expect(useCharacterStore(createPinia()).sheet).toEqual(store.sheet)
    },
  )
})

describe('archetype augmentations', () => {
  it('stores the descriptor, purpose, and manufacturer as one editable augmentation line', () => {
    const store = useCharacterStore(createPinia())
    store.sheet.runner.archetypeId = 'hacker'
    vi.spyOn(Math, 'random').mockReturnValue(0)
    store.applyArchetype({ flavor: 'shadowrun' })
    expect(store.sheet.augmentations[0]!.description).toMatch(
      /^Aftermarket Neural firewall · Manufacturer: .+$/,
    )
    store.sheet.runner.archetypeId = 'brawler'
    // Berserk has a stored purpose description, which must be kept in the sheet line.
    const eligible = load(DATA.AUGMENTATIONS, { flavor: 'shadowrun' }).filter((entry) =>
      entry.archetypeIds.includes('brawler'),
    )
    const index = eligible.findIndex((entry) => entry.value === 'Berserk')
    vi.mocked(Math.random)
      .mockReturnValue(0)
      .mockReturnValueOnce((index + 0.5) / eligible.length)
    // Brawler has no expertise draw; skip rating variation draws so the first draw selects the type.
    vi.spyOn(probability, 'p').mockImplementation((chance = 0.5) => chance !== 0.2)
    store.applyArchetype({ flavor: 'shadowrun' })
    expect(store.sheet.augmentations[0]!.description).toMatch(
      /^Aftermarket Berserk · Temporarily enhances the body for intense close combat\. · Manufacturer: .+$/,
    )
    expect(store.sheet.augmentations[0]!.description).not.toContain('\n')
  })

  it.each(flavors)(
    'uses the $label name for a linked augmentation and saves it',
    async ({ id: flavor }) => {
      const store = useCharacterStore(createPinia())
      store.sheet.runner.archetypeId = 'infiltrator'
      vi.spyOn(probability, 'p').mockReturnValue(false)
      const eligible = load(DATA.AUGMENTATIONS, { flavor }).filter((entry) =>
        entry.archetypeIds.includes('infiltrator'),
      )
      const thermalIndex = eligible.findIndex((entry) => entry.id === 'thermal-vision')
      expect(thermalIndex).toBeGreaterThanOrEqual(0)
      vi.spyOn(Math, 'random').mockReturnValue((thermalIndex + 0.5) / eligible.length)
      const source = JSON.stringify(eligible)
      store.applyArchetype({ flavor })
      expect(store.sheet.augmentations).toEqual([
        {
          description: expect.stringMatching(
            flavor === 'shadowrun'
              ? /^Thermographic vision · Manufacturer: .+$/
              : /^Thermal vision · Manufacturer: .+$/,
          ),
          glitched: false,
        },
        { description: '', glitched: false },
        { description: '', glitched: false },
      ])
      expect(JSON.stringify(eligible)).toBe(source)
      await nextTick()
      expect(useCharacterStore(createPinia()).sheet.augmentations).toEqual(
        store.sheet.augmentations,
      )
    },
  )
})
