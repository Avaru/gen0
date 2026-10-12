// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import CharacterView from '@/views/CharacterView.vue'
import { useCharacterStore } from '@/stores/character'
import { CONTENT, load } from '@/load'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flavors } from '@/generator/options'
import * as probability from '@/helper/prob'
import * as generators from '@/generator/categories'
import { generateNames } from '@/generator/categories'
import { seedRandom } from './helpers/random'

import { mockDialog } from './helpers/dialog'
import { mockMedia } from './helpers/media'
mockDialog()
mockMedia()

async function chooseArchetype(wrapper: ReturnType<typeof mount>, id: string) {
  await wrapper.get('#runner-generate').trigger('click')
  await wrapper.get(`[data-choice="${id}"]`).trigger('click')
  await flushPromises()
}

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe('editable CBR+PNK sheet', () => {
  it('opens the archetype picker without changing fields and cancels without generating', async () => {
    const wrapper = mount(CharacterView, { attachTo: document.body, global: { plugins: [createPinia()] } })
    const store = useCharacterStore()
    store.sheet.runner.alias = 'Keep me'
    const before = JSON.stringify(store.sheet)
    await wrapper.get('#runner-generate').trigger('click')
    expect(wrapper.get('dialog').element).toHaveProperty('open', true)
    expect(wrapper.find('input[type="search"]').exists()).toBe(false)
    expect(JSON.stringify(store.sheet)).toBe(before)
    await wrapper.get('[aria-label="Close archetype picker"]').trigger('click')
    expect(JSON.stringify(store.sheet)).toBe(before)
    expect(document.activeElement).toBe(wrapper.get('#runner-generate').element)
    wrapper.unmount()
  })

  it('immediately clears every sheet field and saves blank defaults on Reset', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const blank = JSON.parse(JSON.stringify(store.sheet))
    const button = (text: string) => wrapper.findAll('.runner-card button').find((item) => item.text() === text)!
    await chooseArchetype(wrapper, 'hacker')
    store.sheet.runner.description = 'Runner description'
    store.sheet.attributeRatings.forEach((row) => { row.value = 2 })
    store.sheet.skillRatings.forEach((row) => { row.value = 1 })
    store.sheet.expertises.forEach((row) => { row.values = ['Choice'] })
    store.sheet.glitches.forEach((row) => { row.marked = true })
    store.sheet.harm.forEach((row) => {
      row.description = 'Hurt'
      row.marks.fill(true)
    })
    store.sheet.gear = { level: 'heavy', selected: ['Armor'], extra: [true, false, false, false] }
    store.sheet.stress = 7
    store.sheet.augmentations.forEach((row) => {
      row.description = 'Augmentation'
      row.glitched = true
    })
    await wrapper.get('#runner-alias').setValue('Alias')
    expect(wrapper.findAll('#runner-generate, .actions > button').map((item) => item.text())).toEqual(['Generate', 'Reset'])
    await button('Reset').trigger('click')
    expect(store.sheet).toEqual(blank)
    expect(JSON.parse(localStorage.getItem('gen0.character')!)).toEqual(blank)
    expect(wrapper.find('#runner-archetype').exists()).toBe(false)
    expect(useCharacterStore(createPinia()).sheet).toEqual(blank)
    expect(wrapper.get('#runner-alias').element).toHaveProperty('value', '')
    expect(wrapper.get('#runner-description').element).toHaveProperty('value', '')
    expect(wrapper.findAll('#runner-generate, .actions > button').map((item) => item.text())).toEqual(['Generate', 'Reset'])
    // A later reset must still create fresh blank values after nested edits.
    await wrapper.get('#runner-alias').setValue('Another alias')
    await button('Reset').trigger('click')
    expect(store.sheet).toEqual(blank)
    wrapper.unmount()
  })

  it.each(flavors)('fills runner fields and profile ratings using the $label route flavor only on Generate', async ({ id }) => {
    const pinia = createPinia()
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/chars/cbrpnk', component: CharacterView }],
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
    const otherFields = JSON.stringify({ ...store.sheet, runner: undefined, attributeRatings: undefined, skillRatings: undefined, expertises: undefined, augmentations: undefined })
    seedRandom()
    const result = generateNames('runners', 1, { flavor: id, runnerArchetypeId: 'hacker' })[0]!
    vi.restoreAllMocks()
    seedRandom()
    await chooseArchetype(wrapper, 'hacker')
    expect(store.sheet.runner.archetypeId).toBe('hacker')
    expect(card.get('button').attributes('type')).toBe('button')
    expect(store.sheet.runner).toEqual({
      alias: result.primary,
      archetypeId: result.archetypeId,
      description: `${result.details}\n${result.title}\n${result.appearance}`,
    })
    expect(JSON.stringify({ ...store.sheet, runner: undefined, attributeRatings: undefined, skillRatings: undefined, expertises: undefined, augmentations: undefined })).toBe(otherFields)
    expect(card.get('#runner-alias').element).toHaveProperty('value', result.primary)
    expect(card.get('#runner-description').element).toHaveProperty('value', store.sheet.runner.description)
    await card.get('#runner-alias').setValue('Edited alias')
    expect(useCharacterStore(createPinia()).sheet.runner).toEqual(store.sheet.runner)
    wrapper.unmount()
  })

  it.each(cbrPnkCatalogue.archetypes)('populates $name ratings after choosing it and replaces prior ratings and expertise', async ({ id }) => {
    const source = JSON.stringify(cbrPnkCatalogue)
    vi.spyOn(probability, 'p').mockReturnValue(false)
    vi.spyOn(generators, 'generateNames').mockReturnValue([
      { primary: 'Handle', title: 'Role', archetypeId: id },
    ])
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    store.sheet.attributeRatings.forEach((row) => { row.value = 2 })
    store.sheet.skillRatings.forEach((row) => { row.value = 2 })
    store.sheet.expertises.forEach((row) => { row.values = ['Old expertise'] })
    const profile = cbrPnkCatalogue.archetypeSystemProfiles.find((item) => item.archetypeId === id)
    await wrapper.get('#runner-alias').setValue('Existing alias')
    await wrapper.get('#runner-description').setValue('Existing description')
    store.sheet.stress = 4
    store.sheet.glitches[0]!.marked = true
    store.sheet.harm[0]!.description = 'Bruised'
    store.sheet.augmentations.forEach((row) => { row.description = 'Old augmentation'; row.glitched = true })
    const otherFields = JSON.stringify({ ...store.sheet, runner: undefined, attributeRatings: undefined, skillRatings: undefined, expertises: undefined, augmentations: undefined })
    await chooseArchetype(wrapper, id)
    expect(vi.mocked(probability.p).mock.calls.filter(([chance]) => chance === 0.2)).toHaveLength(profile ? 2 : 0)
    const eligibleAugmentations = load(CONTENT.AUGMENTATIONS).filter((entry) => entry.archetypeIds.includes(id))
    const filledAugmentations = store.sheet.augmentations.filter((row) => row.description)
    expect(filledAugmentations).toHaveLength(eligibleAugmentations.length ? 1 : 0)
    expect(filledAugmentations.every((row) => eligibleAugmentations.some((entry) => row.description.startsWith(`${entry.value} · `)))).toBe(true)
    expect(filledAugmentations.every((row) => / · Manufacturer: .+$/.test(row.description))).toBe(true)
    expect(store.sheet.augmentations.slice(1)).toEqual([
      { description: '', glitched: false }, { description: '', glitched: false },
    ])
    expect(store.sheet.augmentations.every((row) => !row.glitched)).toBe(true)
    expect(wrapper.get('[aria-label="Augmentation 1"]').element).toHaveProperty('value', store.sheet.augmentations[0]!.description)
    expect(store.sheet.runner).toEqual({ alias: 'Handle', description: 'Role', archetypeId: id })
    expect(generators.generateNames).toHaveBeenCalledWith('runners', 1, { flavor: 'cyberpunk', runnerArchetypeId: id })
    expect(store.sheet.runner.archetypeId).toBe(id)
    expect(JSON.stringify({ ...store.sheet, runner: undefined, attributeRatings: undefined, skillRatings: undefined, expertises: undefined, augmentations: undefined })).toBe(otherFields)
    expect(store.sheet.attributeRatings).toEqual(store.attributes.map((item) => ({
      definitionId: item.id,
      value: profile?.attributeRatings.find((row) => row.definitionId === item.id)?.value ?? null,
    })))
    expect(store.sheet.skillRatings).toEqual(store.skills.map((item) => ({
      definitionId: item.id,
      value: profile ? Math.min(profile.skillRatings.find((row) => row.definitionId === item.id)!.value, 2) : null,
    })))
    const expectedExpertises: Record<string, string[]> = {
      hacker: ['Hack'], driver: ['Cars', 'Bikes'], face: ['Negotiate', 'Perform'],
      rigger: ['Electronics'], analyst: ['People', 'Situation'], marksman: ['Rifle'],
      scientist: ['Biotech'], shaman: ['Artifacts'], technomancer: ['Spirits'],
      'street-samurai': ['Weapon'],
    }
    const selections = store.sheet.expertises.flatMap((row) => row.values)
    expect(selections).toHaveLength(expectedExpertises[id] ? 1 : 0)
    expect(selections.every((value) => expectedExpertises[id]?.includes(value))).toBe(true)
    for (const skill of store.skills) {
      const rating = store.sheet.skillRatings.find((row) => row.definitionId === skill.id)!.value ?? 0
      expect(wrapper.get(`[aria-label="${skill.name} rating 1"]`).element).toHaveProperty('checked', rating >= 1)
      expect(wrapper.get(`[aria-label="${skill.name} rating 2"]`).element).toHaveProperty('checked', rating >= 2)
    }
    const selectedExpertise = wrapper.findAll('.expertises input').filter((input) => (input.element as HTMLInputElement).checked)
    expect(selectedExpertise).toHaveLength(selections.length)
    expect(useCharacterStore(createPinia()).sheet).toEqual(store.sheet)
    expect(JSON.stringify(cbrPnkCatalogue)).toBe(source)
    wrapper.unmount()
  })

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
    expect(wrapper.findAll('[data-choice]').map((option) => option.attributes('data-choice'))).toEqual(cbrPnkCatalogue.archetypes.map((item) => item.id))
    expect(wrapper.findAll('input[type="number"]')).toHaveLength(0)
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(109)
    expect(wrapper.findAll('input[type="text"]')).toHaveLength(7)
    for (const input of wrapper.findAll('input')) {
      expect(input.element).toHaveProperty(
        input.attributes('type') === 'text' ? 'value' : 'checked',
        input.attributes('type') === 'text' ? '' : input.attributes('type') === 'radio' && input.attributes('value') === 'medium',
      )
    }
    expect(store.sheet.systemId).toBe('cbr-pnk')
    expect(store.sheet.skillRatings.map((row) => row.definitionId)).toEqual(
      store.skills.map((row) => row.id),
    )
    expect(wrapper.findAll('h2').map((heading) => heading.text())).toEqual([
      'Runner',
      'Choose archetype',
      'Approaches',
      'Harm',
      'Stress',
      'Skills',
      'Load/Gear',
      'Augmentations',
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
