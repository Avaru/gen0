// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestPinia as createPinia } from './helpers/pinia'
import { enableAutoUnmount, mount, flushPromises } from '@vue/test-utils'
import CharacterView from '@/views/CharacterView.vue'
import UiApproachRow from '@/components/ui/UiApproachRow.vue'
import UiSkillRow from '@/components/ui/UiSkillRow.vue'
import { useCharacterStore } from '@/stores/character'
import { DATA, load } from '@/builders/load'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flavors } from '@/generator/options'
import * as probability from '@/helper/prob'
import * as generators from '@/generator/categories'
import { generateNames } from '@/generator/categories'
import { seedRandom } from './helpers/random'

import { mockDialog } from './helpers/dialog'
import { mockMedia } from './helpers/media'
enableAutoUnmount(afterEach)
mockDialog()
mockMedia()

async function chooseArchetype(wrapper: ReturnType<typeof mount>, id: string) {
  await wrapper.get('#runner-generate').trigger('click')
  await wrapper.get(`[data-choice="${id}"]`).trigger('click')
  await flushPromises()
}

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('editable CBR+PNK sheet', () => {
  it('keeps one angle selected, saves it, randomizes it on Generate, and clears it on Reset', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const card = wrapper.get('.runner-card')
    expect(wrapper.getComponent(UiApproachRow).props('generation')).toBe(0)
    expect(wrapper.getComponent(UiSkillRow).props('generation')).toBe(0)
    expect(card.get('label[for="runner-alias"]').text()).toBe('Handle')
    expect(card.get('label[for="runner-description"]').text()).toBe('Details and looks')
    expect(card.get('.angle legend').text()).toBe('Angle // Convey what ultimately you run for:')
    expect(
      card.findAll('input[name="runner-angle"]').map((input) => input.attributes('value')),
    ).toEqual([
      'Get out',
      'Upgrade life',
      'Make them pay',
      'Learn the truth',
      'Look after them',
      'Take a stand',
    ])
    expect(card.findAll('input[name="runner-angle"]:checked')).toHaveLength(0)
    await card.get('input[value="Get out"]').setValue(true)
    await card.get('input[value="Learn the truth"]').setValue(true)
    expect(card.findAll('input[name="runner-angle"]:checked')).toHaveLength(1)
    expect(store.sheet.runner.angle).toBe('Learn the truth')
    expect(store.hasContent).toBe(true)
    expect(useCharacterStore(createPinia()).sheet.runner.angle).toBe('Learn the truth')
    vi.spyOn(generators, 'generateNames').mockReturnValue([{ primary: 'Handle', secondary: 'Role' }])
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    await chooseArchetype(wrapper, 'hacker')
    expect(wrapper.getComponent(UiApproachRow).props('generation')).toBe(1)
    expect(wrapper.getComponent(UiSkillRow).props('generation')).toBe(1)
    expect(store.sheet.runner.angle).toBe('Get out')
    random.mockReturnValue(0.999)
    await chooseArchetype(wrapper, 'hacker')
    expect(wrapper.getComponent(UiApproachRow).props('generation')).toBe(2)
    expect(wrapper.getComponent(UiSkillRow).props('generation')).toBe(2)
    expect(store.sheet.runner.angle).toBe('Take a stand')
    expect(card.findAll('input[name="runner-angle"]:checked')).toHaveLength(1)
    expect(useCharacterStore(createPinia()).sheet.runner.angle).toBe('Take a stand')
    await card
      .findAll('button')
      .find((button) => button.text() === 'Reset')!
      .trigger('click')
    await card
      .findAll('button')
      .find((button) => button.text() === 'really?')!
      .trigger('click')
    expect(store.sheet.runner.angle).toBeUndefined()
    expect(card.findAll('input[name="runner-angle"]:checked')).toHaveLength(0)
    wrapper.unmount()
  })

  it('lets Vue place existing cards in desktop and print columns without losing edits', async () => {
    const listeners = new Map<string, () => void>()
    const desktop = {
      matches: true,
      addEventListener: vi.fn<(event: string, listener: () => void) => void>(),
      removeEventListener: vi.fn<(event: string, listener: () => void) => void>(),
    }
    const print = {
      matches: false,
      addEventListener: vi.fn<(event: string, listener: () => void) => void>(),
      removeEventListener: vi.fn<(event: string, listener: () => void) => void>(),
    }
    vi.stubGlobal('matchMedia', (query: string) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return {
          matches: true,
          addEventListener: vi.fn<() => void>(),
          removeEventListener: vi.fn<() => void>(),
        }
      }
      const media = query === 'print' ? print : desktop
      media.addEventListener.mockImplementation((_event: string, listener: () => void) => {
        listeners.set(query, listener)
      })
      return media
    })
    const wrapper = mount(CharacterView, { global: { plugins: [createPinia()] } })
    await flushPromises()
    const columns = wrapper.findAll('.sheet-column')
    const rating = wrapper.get('[aria-label="Aggressive rating 2"]')
    await rating.setValue(true)
    const element = rating.element
    expect(columns[0]!.find('.approaches').exists()).toBe(true)
    expect(columns[1]!.find('.augmentations-card').exists()).toBe(true)
    print.matches = true
    listeners.get('print')!()
    await flushPromises()
    expect(columns[0]!.find('.augmentations-card').exists()).toBe(true)
    expect(columns[1]!.find('.approaches').exists()).toBe(true)
    expect(wrapper.get('[aria-label="Aggressive rating 2"]').element).toBe(element)
    await wrapper.get('[aria-label="Smart rating 1"]').setValue(true)
    print.matches = false
    listeners.get('print')!()
    await flushPromises()
    expect(columns[0]!.find('.approaches').exists()).toBe(true)
    expect(columns[1]!.find('.augmentations-card').exists()).toBe(true)
    expect(wrapper.get('[aria-label="Aggressive rating 2"]').element).toBe(element)
    expect(wrapper.get('[aria-label="Smart rating 1"]').element).toHaveProperty('checked', true)
    desktop.matches = false
    listeners.get('(min-width: 56rem)')!()
    await flushPromises()
    expect(
      wrapper
        .findAll('.workspace > section')
        .map((card) => card.classes().find((name) => name !== 'sheet-card')),
    ).toEqual([
      'runner-card',
      'approaches',
      'skills',
      'harm-card',
      'stress-card',
      'resistance-card',
      'gear-card',
      'augmentations-card',
    ])
    expect(wrapper.get('[aria-label="Aggressive rating 2"]').element).toBe(element)
    wrapper.unmount()
    expect(print.removeEventListener).toHaveBeenCalledWith('change', listeners.get('print'))
    expect(desktop.removeEventListener).toHaveBeenCalledWith(
      'change',
      listeners.get('(min-width: 56rem)'),
    )
  })

  it('keeps expertise typing updates within its own skill row', async () => {
    const updates: string[] = []
    const wrapper = mount(CharacterView, {
      global: {
        plugins: [createPinia()],
        mixins: [
          {
            updated() {
              updates.push(this.$options.name ?? this.$options.__name ?? '')
            },
          },
        ],
      },
    })
    await flushPromises()
    await wrapper.get('[aria-label="Analyze custom expertise"]').setValue('First')
    updates.length = 0
    await wrapper.get('[aria-label="Analyze custom expertise"]').setValue('Second')
    expect(updates.filter((name) => name === 'UiSheetRatingRow')).toHaveLength(1)
    expect(updates.filter((name) => name === 'UiExpertiseChoices')).toHaveLength(1)
    expect(updates).not.toContain('UiCharacterSheet')
    wrapper.unmount()
  })

  it.each(flavors)(
    'regenerates each runner field in Generic despite a $label query without changing stats',
    async ({ id }) => {
      const generate = vi.spyOn(generators, 'generateNames').mockReturnValue([
        {
          primary: 'New alias',
          details: 'Real name: New name',
          secondary: 'New role',
          appearance: 'New appearance',
          archetypeId: 'driver',
        },
      ])
      const pinia = createPinia()
      const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/chars/cbrpnk', meta: { flavor: 'cyberpunk' }, component: CharacterView }],
      })
      await router.push({ path: '/chars/cbrpnk', query: { flavor: id } })
      await router.isReady()
      const wrapper = mount(CharacterView, { global: { plugins: [pinia, router] } })
      const store = useCharacterStore(pinia)
      store.sheet.runner = {
        alias: 'Existing alias',
        description: 'Existing description',
        archetypeId: 'hacker',
      }
      store.sheet.attributeRatings[0]!.value = 2
      store.sheet.skillRatings[0]!.value = 1
      store.sheet.expertises[0]!.values = ['Existing expertise']
      store.sheet.augmentations[0]!.description = 'Existing augmentation'
      store.sheet.stress = 4
      await flushPromises()
      const before = JSON.parse(JSON.stringify(store.sheet))
      await wrapper.get('[aria-label="Regenerate handle"]').trigger('click')
      expect(generate).toHaveBeenLastCalledWith('runners', 1, { flavor: 'cyberpunk' })
      expect(store.sheet).toEqual({ ...before, runner: { ...before.runner, alias: 'New alias' } })
      expect(wrapper.get('#runner-alias').element).toHaveProperty('value', 'New alias')
      await wrapper.get('[aria-label="Regenerate details and looks"]').trigger('click')
      expect(generate).toHaveBeenLastCalledWith('runners', 1, { flavor: 'cyberpunk' })
      expect(store.sheet).toEqual({
        ...before,
        runner: {
          ...before.runner,
          alias: 'New alias',
          description: 'Real name: New name\nNew appearance',
        },
      })
      expect(wrapper.get('#runner-description').element).toHaveProperty(
        'value',
        store.sheet.runner.description,
      )
      await vi.advanceTimersByTimeAsync(200)
      expect(useCharacterStore(createPinia()).sheet).toEqual(store.sheet)
      wrapper.unmount()
    },
  )

  it('opens the archetype picker without changing fields and cancels without generating', async () => {
    const wrapper = mount(CharacterView, {
      attachTo: document.body,
      global: { plugins: [createPinia()] },
    })
    const store = useCharacterStore()
    store.sheet.runner.alias = 'Keep me'
    const before = JSON.stringify(store.sheet)
    await wrapper.get('#runner-generate').trigger('click')
    expect(wrapper.get('dialog').element).toHaveProperty('open', true)
    expect(wrapper.find('input[type="search"]').exists()).toBe(false)
    expect(wrapper.get('dialog input[aria-label="bit random"]').element).toHaveProperty('checked', false)
    expect(JSON.stringify(store.sheet)).toBe(before)
    await wrapper.get('[aria-label="Close archetype picker"]').trigger('click')
    expect(JSON.stringify(store.sheet)).toBe(before)
    expect(document.activeElement).toBe(wrapper.get('#runner-generate').element)
    wrapper.unmount()
  })

  it('only varies archetype ratings when bit random is enabled', async () => {
    vi.spyOn(generators, 'generateNames').mockReturnValue([{ primary: 'Handle' }])
    const chance = vi.spyOn(probability, 'p').mockReturnValue(true)
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    await chooseArchetype(wrapper, 'hacker')
    const baseline = structuredClone({
      approaches: store.sheet.attributeRatings.map((row) => row.value),
      skills: store.sheet.skillRatings.map((row) => row.value),
    })
    expect(chance.mock.calls.filter(([value]) => value === 0.2)).toHaveLength(0)
    await wrapper.get('#runner-generate').trigger('click')
    await wrapper.get('dialog input[aria-label="bit random"]').setValue(true)
    await wrapper.get('[data-choice="hacker"]').trigger('click')
    await flushPromises()
    expect(chance.mock.calls.filter(([value]) => value === 0.2)).toEqual([[0.2], [0.2]])
    expect(store.sheet.attributeRatings.map((row) => row.value)).not.toEqual(baseline.approaches)
    expect(store.sheet.skillRatings.map((row) => row.value)).not.toEqual(baseline.skills)
    await wrapper.get('#runner-generate').trigger('click')
    await wrapper.get('dialog input[aria-label="bit random"]').setValue(false)
    chance.mockClear()
    await wrapper.get('[data-choice="hacker"]').trigger('click')
    await flushPromises()
    expect(store.sheet.attributeRatings.map((row) => row.value)).toEqual(baseline.approaches)
    expect(store.sheet.skillRatings.map((row) => row.value)).toEqual(baseline.skills)
    expect(chance.mock.calls.filter(([value]) => value === 0.2)).toHaveLength(0)
    wrapper.unmount()
  })

  it('clears every sheet field and saves blank defaults only after confirming Reset', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const blank = JSON.parse(JSON.stringify(store.sheet))
    const button = (text: string) =>
      wrapper.findAll('.runner-card button').find((item) => item.text() === text)!
    await chooseArchetype(wrapper, 'hacker')
    store.sheet.runner.description = 'Runner description'
    store.sheet.attributeRatings.forEach((row) => {
      row.value = 2
    })
    store.sheet.skillRatings.forEach((row) => {
      row.value = 1
    })
    store.sheet.expertises.forEach((row) => {
      row.values = ['Choice']
    })
    store.sheet.glitches.forEach((row) => {
      row.marked = true
    })
    store.sheet.harm.forEach((row) => {
      row.description = 'Hurt'
      row.marks.fill(true)
    })
    store.sheet.gear = { level: 'heavy', selected: ['Armor'], extra: [true, false, false, false] }
    store.sheet.stress = 7
    store.sheet.specialArmor = true
    store.sheet.augmentations.forEach((row) => {
      row.description = 'Augmentation'
      row.glitched = true
    })
    await wrapper.get('#runner-alias').setValue('Alias')
    expect(
      wrapper.findAll('#runner-generate, .actions > button').map((item) => item.text()),
    ).toEqual(['Generate', 'Reset'])
    const before = JSON.stringify(store.sheet)
    await button('Reset').trigger('click')
    expect(JSON.stringify(store.sheet)).toBe(before)
    expect(
      wrapper.findAll('#runner-generate, .actions > button').map((item) => item.text()),
    ).toEqual(['really?', 'nah.'])
    expect(button('really?').classes()).toContain('destructive')
    await button('really?').trigger('click')
    expect(store.sheet).toEqual(blank)
    expect(JSON.parse(localStorage.getItem('gen0.character')!)).toEqual(blank)
    expect(wrapper.find('#runner-archetype').exists()).toBe(false)
    expect(useCharacterStore(createPinia()).sheet).toEqual(blank)
    expect(wrapper.get('#runner-alias').element).toHaveProperty('value', '')
    expect(wrapper.get('#runner-description').element).toHaveProperty('value', '')
    expect(
      wrapper.findAll('#runner-generate, .actions > button').map((item) => item.text()),
    ).toEqual(['Generate'])
    // A later reset must still create fresh blank values after nested edits.
    await wrapper.get('#runner-alias').setValue('Another alias')
    await button('Reset').trigger('click')
    await button('really?').trigger('click')
    expect(store.sheet).toEqual(blank)
    wrapper.unmount()
  })

  it('hides Generate during reset confirmation and restores it on cancellation or unmounting', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const button = (text: string) =>
      wrapper.findAll('.actions > button').find((item) => item.text() === text)!
    await wrapper.get('#runner-alias').setValue('Keep me')
    const before = JSON.stringify(store.sheet)
    await button('Reset').trigger('click')
    expect(wrapper.find('#runner-generate').exists()).toBe(false)
    await button('nah.').trigger('click')
    expect(wrapper.find('#runner-generate').exists()).toBe(true)
    expect(JSON.stringify(store.sheet)).toBe(before)
    expect(wrapper.findAll('.actions > button').map((item) => item.text())).toEqual(['Reset'])
    await chooseArchetype(wrapper, 'hacker')
    expect(wrapper.findAll('.actions > button').map((item) => item.text())).toEqual(['Reset'])
    const generated = JSON.stringify(store.sheet)
    await button('Reset').trigger('click')
    wrapper.unmount()
    const remounted = mount(CharacterView, { global: { plugins: [pinia] } })
    expect(remounted.findAll('.actions > button').map((item) => item.text())).toEqual(['Reset'])
    expect(JSON.stringify(store.sheet)).toBe(generated)
    expect(remounted.find('#runner-generate').exists()).toBe(true)
    remounted.unmount()
  })

  it('shows Reset for content anywhere in the sheet and hides it when cleared', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const edits: Array<() => void> = [
      () => {
        store.sheet.runner.alias = 'Alias'
      },
      () => {
        store.sheet.runner.description = 'Description'
      },
      () => {
        store.sheet.runner.archetypeId = 'hacker'
      },
      () => {
        store.sheet.attributeRatings[0]!.value = 1
      },
      () => {
        store.sheet.skillRatings[0]!.value = 1
      },
      () => {
        store.sheet.expertises[0]!.values = ['People']
      },
      () => {
        store.sheet.glitches[0]!.marked = true
      },
      () => {
        store.sheet.harm[0]!.description = 'Bruised'
      },
      () => {
        store.sheet.harm[0]!.marks[0] = true
      },
      () => {
        store.sheet.stress = 1
      },
      () => {
        store.sheet.specialArmor = true
      },
      () => {
        store.sheet.gear.level = 'light'
      },
      () => {
        store.sheet.gear.selected = ['Armor']
      },
      () => {
        store.sheet.gear.extra[0] = true
      },
      () => {
        store.sheet.augmentations[0]!.description = 'Wired reflexes'
      },
      () => {
        store.sheet.augmentations[0]!.glitched = true
      },
    ]
    expect(wrapper.findAll('.actions > button')).toHaveLength(0)
    for (const edit of edits) {
      edit()
      await flushPromises()
      expect(wrapper.get('.actions > button').text()).toBe('Reset')
      await wrapper.get('.actions > button').trigger('click')
      store.reset()
      await flushPromises()
      expect(wrapper.findAll('.actions > button')).toHaveLength(0)
    }
    await wrapper.get('[aria-label="Aggressive rating 1"]').setValue(true)
    await wrapper.get('[aria-label="Aggressive rating 1"]').setValue(false)
    expect(wrapper.findAll('.actions > button')).toHaveLength(0)
    await wrapper.get('#runner-alias').setValue('Alias')
    expect(wrapper.get('.actions > button').text()).toBe('Reset')
    await wrapper.get('#runner-alias').setValue('')
    expect(wrapper.findAll('.actions > button')).toHaveLength(0)
    wrapper.unmount()
  })

  it.each(flavors)(
    'fills runner fields and profile ratings in Generic despite a $label query only on Generate',
    async ({ id }) => {
      const pinia = createPinia()
      const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/chars/cbrpnk', meta: { flavor: 'cyberpunk' }, component: CharacterView }],
      })
      await router.push({ path: '/chars/cbrpnk', query: { flavor: id, category: 'german' } })
      await router.isReady()
      const wrapper = mount(CharacterView, { global: { plugins: [pinia, router] } })
      const store = useCharacterStore(pinia)
      const card = wrapper.get('.runner-card')
      expect(store.sheet.runner).toEqual({ alias: '', description: '' })
      await card.get('#runner-alias').setValue('My alias')
      await card.get('#runner-description').setValue('My runner')
      await wrapper.get('[aria-label="Aggressive rating 1"]').setValue(true)
      const otherFields = JSON.stringify({
        ...store.sheet,
        runner: undefined,
        attributeRatings: undefined,
        skillRatings: undefined,
        expertises: undefined,
        augmentations: undefined,
      })
      seedRandom()
      const result = generateNames('runners', 1, { flavor: 'cyberpunk', runnerArchetypeId: 'hacker' })[0]!
      vi.restoreAllMocks()
      seedRandom()
      await chooseArchetype(wrapper, 'hacker')
      expect(store.sheet.runner.archetypeId).toBe('hacker')
      expect(card.get('button').attributes('type')).toBe('button')
      expect(store.sheet.runner).toEqual({
        angle: expect.any(String),
        alias: result.primary,
        archetypeId: result.archetypeId,
        description: `${result.details}\n${result.appearance}`,
      })
      expect(
        JSON.stringify({
          ...store.sheet,
          runner: undefined,
          attributeRatings: undefined,
          skillRatings: undefined,
          expertises: undefined,
          augmentations: undefined,
        }),
      ).toBe(otherFields)
      expect(card.get('#runner-alias').element).toHaveProperty('value', result.primary)
      expect(card.get('#runner-description').element).toHaveProperty(
        'value',
        store.sheet.runner.description,
      )
      await card.get('#runner-alias').setValue('Edited alias')
      await vi.advanceTimersByTimeAsync(200)
      expect(useCharacterStore(createPinia()).sheet.runner).toEqual(store.sheet.runner)
      wrapper.unmount()
    },
  )

  it.each(cbrPnkCatalogue.archetypes)(
    'populates $name ratings after choosing it and replaces prior ratings and expertise',
    async ({ id }) => {
      const source = JSON.stringify(cbrPnkCatalogue)
      vi.spyOn(probability, 'p').mockReturnValue(false)
      vi.spyOn(generators, 'generateNames').mockReturnValue([
        { primary: 'Handle', secondary: 'Role', details: 'By day: Real name', appearance: 'Chrome eyes', archetypeId: id },
      ])
      const pinia = createPinia()
      const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
      const store = useCharacterStore(pinia)
      store.sheet.attributeRatings.forEach((row) => {
        row.value = 2
      })
      store.sheet.skillRatings.forEach((row) => {
        row.value = 2
      })
      store.sheet.expertises.forEach((row) => {
        row.values = ['Old expertise']
      })
      const profile = cbrPnkCatalogue.archetypeSystemProfiles.find(
        (item) => item.archetypeId === id,
      )
      await wrapper.get('#runner-alias').setValue('Existing alias')
      await wrapper.get('#runner-description').setValue('Existing description')
      store.sheet.stress = 4
      store.sheet.glitches[0]!.marked = true
      store.sheet.harm[0]!.description = 'Bruised'
      store.sheet.augmentations.forEach((row) => {
        row.description = 'Old augmentation'
        row.glitched = true
      })
      const otherFields = JSON.stringify({
        ...store.sheet,
        runner: undefined,
        attributeRatings: undefined,
        skillRatings: undefined,
        expertises: undefined,
        augmentations: undefined,
      })
      await chooseArchetype(wrapper, id)
      expect(vi.mocked(probability.p).mock.calls.filter(([chance]) => chance === 0.2)).toHaveLength(
        0,
      )
      const eligibleAugmentations = load(DATA.AUGMENTATIONS).filter((entry) =>
        entry.archetypeIds.includes(id),
      )
      const filledAugmentations = store.sheet.augmentations.filter((row) => row.description)
      expect(filledAugmentations).toHaveLength(eligibleAugmentations.length ? 1 : 0)
      expect(
        filledAugmentations.every((row) =>
          eligibleAugmentations.some((entry) => row.description.startsWith(`${entry.value} · `)),
        ),
      ).toBe(true)
      expect(filledAugmentations.every((row) => / · Manufacturer: .+$/.test(row.description))).toBe(
        true,
      )
      expect(store.sheet.augmentations.slice(1)).toEqual([
        { description: '', glitched: false },
        { description: '', glitched: false },
      ])
      expect(store.sheet.augmentations.every((row) => !row.glitched)).toBe(true)
      expect(wrapper.get('[aria-label="Augmentation 1"]').element).toHaveProperty(
        'value',
        store.sheet.augmentations[0]!.description,
      )
      expect(store.sheet.runner).toEqual({
        alias: 'Handle',
        description: 'By day: Real name\nChrome eyes',
        archetypeId: id,
        angle: expect.any(String),
      })
      expect(generators.generateNames).toHaveBeenCalledWith('runners', 1, {
        flavor: 'cyberpunk',
        runnerArchetypeId: id,
      })
      expect(store.sheet.runner.archetypeId).toBe(id)
      expect(
        JSON.stringify({
          ...store.sheet,
          runner: undefined,
          attributeRatings: undefined,
          skillRatings: undefined,
          expertises: undefined,
          augmentations: undefined,
        }),
      ).toBe(otherFields)
      expect(store.sheet.attributeRatings).toEqual(
        store.attributes.map((item) => ({
          definitionId: item.id,
          value:
            profile?.attributeRatings.find((row) => row.definitionId === item.id)?.value ?? null,
        })),
      )
      expect(store.sheet.skillRatings).toEqual(
        store.skills.map((item) => ({
          definitionId: item.id,
          value: profile
            ? Math.min(profile.skillRatings.find((row) => row.definitionId === item.id)!.value, 2)
            : null,
        })),
      )
      const expectedExpertises: Record<string, string[]> = {
        hacker: ['Hack'],
        driver: ['Cars', 'Bikes'],
        face: ['Negotiate', 'Perform'],
        rigger: ['Electronics'],
        marksman: ['Rifle'],
        scientist: ['Biotech'],
        shaman: ['Artifacts'],
        technomancer: ['Spirits'],
        'street-samurai': ['Weapon'],
      }
      const selections = store.sheet.expertises.flatMap((row) => row.values)
      expect(selections).toHaveLength(expectedExpertises[id] ? 1 : 0)
      expect(selections.every((value) => expectedExpertises[id]?.includes(value))).toBe(true)
      for (const skill of store.skills) {
        const rating =
          store.sheet.skillRatings.find((row) => row.definitionId === skill.id)!.value ?? 0
        expect(wrapper.get(`[aria-label="${skill.name} rating 1"]`).element).toHaveProperty(
          'checked',
          rating >= 1,
        )
        expect(wrapper.get(`[aria-label="${skill.name} rating 2"]`).element).toHaveProperty(
          'checked',
          rating >= 2,
        )
      }
      const selectedExpertise = wrapper
        .findAll('.expertises input')
        .filter((input) => (input.element as HTMLInputElement).checked)
      expect(selectedExpertise).toHaveLength(selections.length)
      await vi.advanceTimersByTimeAsync(200)
      expect(useCharacterStore(createPinia()).sheet).toEqual(store.sheet)
      expect(JSON.stringify(cbrPnkCatalogue)).toBe(source)
      wrapper.unmount()
    },
  )

  it('stores three independent augmentation entries and glitch marks across navigation', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    await wrapper.get('[aria-label="Augmentation 2"]').setValue('Wired reflexes')
    await wrapper.get('[aria-label="Augmentation 2 glitched"]').setValue(true)
    expect(store.sheet.augmentations).toEqual([
      { description: '', glitched: false },
      { description: 'Wired reflexes', glitched: true },
      { description: '', glitched: false },
    ])
    wrapper.unmount()
    const remounted = mount(CharacterView, { global: { plugins: [pinia] } })
    expect(remounted.get('[aria-label="Augmentation 2"]').element).toHaveProperty(
      'value',
      'Wired reflexes',
    )
    expect(remounted.get('[aria-label="Augmentation 2 glitched"]').element).toHaveProperty(
      'checked',
      true,
    )
    await remounted.get('[aria-label="Augmentation 2 glitched"]').setValue(false)
    expect(store.sheet.augmentations[1]?.description).toBe('Wired reflexes')
    expect(store.sheet.augmentations[1]?.glitched).toBe(false)
    expect(useCharacterStore(createPinia()).sheet.augmentations).toEqual(store.sheet.augmentations)
    remounted.unmount()
  })
  it('keeps resistance static except Special Armor, saves its yellow state, and clears it on reset', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const card = wrapper.get('.resistance-card')
    expect(card.findAll('input, button, select, textarea')).toHaveLength(1)
    expect(card.attributes('data-state')).toBe('empty')
    expect(store.hasContent).toBe(false)
    const before = JSON.parse(JSON.stringify(store.sheet))
    await card.get('[aria-label="Special Armor"]').setValue(true)
    expect(store.sheet).toEqual({ ...before, specialArmor: true })
    expect(card.attributes('data-state')).toBe('yellow')
    expect(store.hasContent).toBe(true)
    wrapper.unmount()
    const remounted = mount(CharacterView, { global: { plugins: [createPinia()] } })
    expect(remounted.get('[aria-label="Special Armor"]').element).toHaveProperty('checked', true)
    expect(remounted.get('.resistance-card').attributes('data-state')).toBe('yellow')
    await remounted.get('[aria-label="Special Armor"]').setValue(false)
    expect(remounted.get('.resistance-card').attributes('data-state')).toBe('empty')
    remounted.unmount()
  })

  it('preserves older sheets without Special Armor and rejects invalid saved marks', () => {
    const blank = useCharacterStore(createPinia()).sheet
    const { specialArmor: _specialArmor, ...older } = JSON.parse(JSON.stringify(blank))
    older.runner.alias = 'Saved alias'
    localStorage.setItem('gen0.character', JSON.stringify(older))
    const restored = useCharacterStore(createPinia())
    expect(restored.sheet.runner.alias).toBe('Saved alias')
    expect(restored.sheet.specialArmor).toBe(false)
    localStorage.setItem('gen0.character', JSON.stringify({ ...older, specialArmor: 'true' }))
    expect(useCharacterStore(createPinia()).sheet).toEqual(blank)
  })

  it('fills stress through the selected slot, clears subsequent slots, and retains it across navigation', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const slot = (position: number) => wrapper.get(`[aria-label="Stress slot ${position}"]`)
    await slot(5).setValue(true)
    expect(store.sheet.stress).toBe(5)
    for (let position = 1; position <= 7; position++) {
      expect(slot(position).element).toHaveProperty('checked', position <= 5)
    }
    await slot(3).setValue(false)
    expect(store.sheet.stress).toBe(2)
    for (let position = 1; position <= 7; position++) {
      expect(slot(position).element).toHaveProperty('checked', position <= 2)
    }
    await slot(7).setValue(true)
    expect(store.sheet.stress).toBe(7)
    expect(wrapper.get('.overload').classes()).toContain('active')
    expect(store.sheet.glitches.every((row) => !row.marked)).toBe(true)
    wrapper.unmount()
    const remounted = mount(CharacterView, { global: { plugins: [pinia] } })
    expect(remounted.get('[aria-label="Stress slot 7"]').element).toHaveProperty('checked', true)
    await remounted.get('[aria-label="Stress slot 7"]').setValue(false)
    expect(store.sheet.stress).toBe(6)
    expect(remounted.get('.overload').classes()).not.toContain('active')
    await remounted.get('[aria-label="Stress slot 1"]').setValue(false)
    expect(store.sheet.stress).toBe(0)
    expect(useCharacterStore(createPinia()).sheet.stress).toBe(0)
    remounted.unmount()
  })
  it('uses cyan for level 1, yellow for level 2, and red when both are full or level 3 is selected', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const card = wrapper.get('.harm-card')
    expect(card.attributes('data-state')).toBe('empty')
    await wrapper.get('[aria-label="Level 1 harm description"]').setValue('Bruised')
    expect(store.sheet.harm[0]?.description).toBe('Bruised')
    const slot = (level: number, position: number) =>
      wrapper.get(`[aria-label="Level ${level} harm slot ${position}"]`)
    await slot(1, 2).setValue(true)
    expect(store.sheet.harm[0]?.marks).toEqual([false, true])
    expect(card.attributes('data-state')).toBe('cyan')
    await slot(1, 1).setValue(true)
    expect(card.attributes('data-state')).toBe('cyan')
    await slot(2, 1).setValue(true)
    expect(card.attributes('data-state')).toBe('yellow')
    await slot(1, 1).setValue(false)
    expect(card.attributes('data-state')).toBe('yellow')
    await slot(2, 2).setValue(true)
    expect(card.attributes('data-state')).toBe('yellow')
    await slot(1, 1).setValue(true)
    expect(card.attributes('data-state')).toBe('red')
    await slot(1, 1).setValue(false)
    expect(card.attributes('data-state')).toBe('yellow')
    await slot(2, 1).setValue(false)
    expect(card.attributes('data-state')).toBe('yellow')
    await slot(3, 1).setValue(true)
    expect(card.attributes('data-state')).toBe('red')
    await slot(3, 1).setValue(false)
    expect(card.attributes('data-state')).toBe('yellow')
    await slot(2, 2).setValue(false)
    expect(card.attributes('data-state')).toBe('cyan')
    await slot(1, 2).setValue(false)
    expect(card.attributes('data-state')).toBe('empty')
    await slot(3, 1).setValue(true)
    expect(card.attributes('data-state')).toBe('red')
    await slot(3, 1).setValue(false)
    await slot(1, 2).setValue(true)
    wrapper.unmount()
    const remounted = mount(CharacterView, { global: { plugins: [pinia] } })
    expect(remounted.get('[aria-label="Level 1 harm description"]').element).toHaveProperty(
      'value',
      'Bruised',
    )
    expect(remounted.get('[aria-label="Level 1 harm slot 2"]').element).toHaveProperty(
      'checked',
      true,
    )
    remounted.unmount()
  })
  it('saves custom expertise, shows its filled state, and clears it on reset', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const field = wrapper.get('[aria-label="Analyze custom expertise"]')
    expect(wrapper.find('.custom-print-value').exists()).toBe(false)
    await field.setValue('  ')
    expect(store.hasContent).toBe(false)
    expect(wrapper.find('.custom-print-value').exists()).toBe(false)
    await field.setValue('User expertise')
    expect(store.hasContent).toBe(true)
    expect(store.sheet.expertises[0]?.custom).toBe('User expertise')
    expect(field.element.parentElement?.classList.contains('filled')).toBe(true)
    expect(wrapper.get('.custom-print-value').text()).toBe('User expertise')
    await vi.advanceTimersByTimeAsync(200)
    expect(useCharacterStore(createPinia()).sheet.expertises[0]?.custom).toBe('User expertise')
    store.reset()
    await flushPromises()
    expect(field.element).toHaveProperty('value', '')
    expect(wrapper.find('.custom-print-value').exists()).toBe(false)
    expect(store.hasContent).toBe(false)
    wrapper.unmount()
  })

  it('selects zero through all preset expertises independently and retains them across navigation', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const coding = store.sheet.expertises.find((row) => row.skillId === 'cbr-pnk.skill.coding')!
    const options = ['Hack', 'Compile', 'Mine', 'Scramble']
    const input = (option: string) => wrapper.get(`[aria-label="Coding expertise: ${option}"]`)
    expect(store.sheet.expertises.every((row) => row.values.length === 0)).toBe(true)
    for (const option of options) {
      await input(option).setValue(true)
    }
    expect(coding.values).toEqual(options)
    await input('Compile').setValue(false)
    expect(coding.values).toEqual(['Hack', 'Mine', 'Scramble'])
    expect(store.sheet.skillRatings.every((row) => row.value === null)).toBe(true)
    expect(
      store.sheet.expertises.find((row) => row.skillId === 'cbr-pnk.skill.analyze')?.values,
    ).toEqual([])
    wrapper.unmount()
    const remounted = mount(CharacterView, { global: { plugins: [pinia] } })
    for (const option of options) {
      expect(remounted.get(`[aria-label="Coding expertise: ${option}"]`).element).toHaveProperty(
        'checked',
        option !== 'Compile',
      )
    }
    for (const option of ['Hack', 'Mine', 'Scramble']) {
      await remounted.get(`[aria-label="Coding expertise: ${option}"]`).setValue(false)
    }
    expect(coding.values).toEqual([])
    expect(
      useCharacterStore(createPinia()).sheet.expertises.every((row) => row.values.length === 0),
    ).toBe(true)
    remounted.unmount()
  })
  it('starts blank and connects catalogue fields to Pinia without changing profiles', async () => {
    const pinia = createPinia()
    const source = JSON.stringify(cbrPnkCatalogue)
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    expect(wrapper.find('#runner-archetype').exists()).toBe(false)
    expect(
      wrapper.findAll('[data-choice]').map((option) => option.attributes('data-choice')),
    ).toEqual(cbrPnkCatalogue.archetypes.map((item) => item.id))
    expect(wrapper.findAll('input[type="number"]')).toHaveLength(0)
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(111)
    expect(wrapper.findAll('input[type="text"]')).toHaveLength(15)
    expect(wrapper.findAll('.augmentation-row textarea')).toHaveLength(3)
    for (const input of wrapper.findAll('input, textarea')) {
      const isTextField = input.attributes('type') === 'text' || input.element.tagName === 'TEXTAREA'
      expect(input.element).toHaveProperty(
        isTextField ? 'value' : 'checked',
        isTextField
          ? ''
          : input.attributes('type') === 'radio' && input.attributes('value') === 'medium',
      )
    }
    expect(store.sheet.systemId).toBe('cbr-pnk')
    expect(store.sheet.skillRatings.map((row) => row.definitionId)).toEqual(
      store.skills.map((row) => row.id),
    )
    expect(wrapper.findAll('h2').map((heading) => heading.text())).toEqual([
      'Runner',
      'Choose archetype',
      'Approaches // Skills',
      'Skills',
      'Harm',
      'Stress',
      'Resist/Armor',
      'Load/Gear',
      'Augmentations',
      'Action roll',
      'Glitched dice',
    ])
    for (const [label, row] of [
      ['Aggressive', store.sheet.attributeRatings[0]!],
      [
        'Coding',
        store.sheet.skillRatings.find((item) => item.definitionId === 'cbr-pnk.skill.coding')!,
      ],
    ] as const) {
      const left = wrapper.get(`[aria-label="${label} rating 1"]`)
      const right = wrapper.get(`[aria-label="${label} rating 2"]`)
      expect(row.value).toBeNull()
      await right.setValue(true)
      expect(row.value).toBe(2)
      expect(left.element).toHaveProperty('checked', true)
      expect(right.element).toHaveProperty('checked', true)
      await right.setValue(false)
      expect(row.value).toBe(1)
      expect(left.element).toHaveProperty('checked', true)
      await left.setValue(false)
      expect(row.value).toBe(0)
      expect(right.element).toHaveProperty('checked', false)
      await left.setValue(true)
      expect(row.value).toBe(1)
      expect(right.element).toHaveProperty('checked', false)
      await right.setValue(true)
      await left.setValue(false)
      expect(row.value).toBe(0)
      expect(left.element).toHaveProperty('checked', false)
      expect(right.element).toHaveProperty('checked', false)
    }
    const codingRow = wrapper.get('[aria-label="Coding rating 1"]').element.closest('.skill')!
    expect(codingRow.getAttribute('data-state')).toBe('0')
    await wrapper.get('[aria-label="Coding rating 1"]').setValue(true)
    expect(codingRow.getAttribute('data-state')).toBe('1')
    await wrapper.get('[aria-label="Coding rating 2"]').setValue(true)
    expect(codingRow.getAttribute('data-state')).toBe('2')
    await wrapper.get('[aria-label="Aggressive glitched"]').setValue(true)
    expect(store.sheet.glitches[0]?.marked).toBe(true)
    const approach = wrapper.get('.approach')
    expect(approach.attributes('data-state')).toBe('glitched')
    expect(approach.get('.approach-name').text()).toBe('Aggressive')
    expect(approach.get('.approach-title .approach-negative').text()).toBe('// Hesitation')
    expect(approach.get('.approach-negative').classes()).toContain('visible')
    expect(store.sheet.attributeRatings[0]?.value).toBe(0)
    await wrapper.get('[aria-label="Aggressive glitched"]').setValue(false)
    expect(approach.get('.approach-name').text()).toBe('Aggressive')
    expect(approach.attributes('data-state')).toBe('0')
    expect(approach.get('.approach-negative').classes()).not.toContain('visible')
    await wrapper.get('[aria-label="Aggressive rating 1"]').setValue(true)
    expect(approach.attributes('data-state')).toBe('1')
    await wrapper.get('[aria-label="Aggressive rating 2"]').setValue(true)
    expect(approach.attributes('data-state')).toBe('2')
    await wrapper.get('[aria-label="Aggressive glitched"]').setValue(true)
    expect(approach.attributes('data-state')).toBe('glitched')
    expect(store.sheet.attributeRatings[0]?.value).toBe(2)
    await wrapper.get('[aria-label="Aggressive glitched"]').setValue(false)
    expect(approach.attributes('data-state')).toBe('2')
    expect(wrapper.text()).toContain('Weird')
    expect(JSON.stringify(cbrPnkCatalogue)).toBe(source)
    wrapper.unmount()
    const fresh = useCharacterStore(createPinia())
    expect(fresh.sheet).toEqual(store.sheet)
  })
})
