// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { nextTick } from 'vue'
import { disposePinia } from 'pinia'
import { createStudentSheet } from '@/data/characters/never-midnight'
import { useNeverMidnightCharacterStore, encodeStudent } from '@/stores/neverMidnightCharacter'
import { encodeSheetToken } from '@/helper/sheetToken'
import NeverMidnightCharacterView from '@/views/NeverMidnightCharacterView.vue'
import { createTestPinia } from './helpers/pinia'
import { mockMedia } from './helpers/media'
import { mockDialog } from './helpers/dialog'
import * as generators from '@/generator/categories'
import * as spells from '@/patterns/never-midnight/spells'
mockMedia()
mockDialog()

enableAutoUnmount(afterEach)
beforeEach(() => localStorage.clear())

async function page(token?: string) {
  const pinia = createTestPinia()
  const store = useNeverMidnightCharacterStore(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/chars/never-midnight', component: NeverMidnightCharacterView },
      { path: '/elsewhere', component: { template: '<p>Elsewhere</p>' } },
    ],
  })
  await router.push({ path: '/chars/never-midnight', query: token ? { char: token } : {} })
  const wrapper = mount(NeverMidnightCharacterView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, store, router }
}

describe('Never Midnight student sheet', () => {
  it('locks all fields and ratings, hides editing buttons, and unlocks without changing the sheet', async () => {
    const { wrapper, store } = await page()
    store.sheet.student.name = 'Saved student'
    store.sheet.spells = [{ description: 'Saved spell' }]
    store.sheet.sacrifices = [{ description: 'Saved sacrifice', value: 2 }]
    await nextTick()
    const before = JSON.stringify(store.sheet)
    await wrapper.get('[aria-label="Lock character sheet"]').trigger('click')
    const form = wrapper.get('form')
    expect(form.findAll('button')).toHaveLength(1)
    expect(form.get('button').attributes('aria-pressed')).toBe('true')
    expect(form.findAll('input[type="text"], textarea').length).toBeGreaterThan(0)
    expect(
      form
        .findAll('input[type="text"], textarea')
        .every((field) => field.element.matches(':disabled')),
    ).toBe(true)
    expect(
      form.findAll('input[type="radio"]').every((field) => field.element.matches(':disabled')),
    ).toBe(true)
    expect(JSON.stringify(store.sheet)).toBe(before)
    await wrapper.get('[aria-label="Unlock character sheet"]').trigger('click')
    expect(form.findAll('button').length).toBeGreaterThan(1)
    expect(
      form.findAll('input, textarea').every((field) => !field.element.matches(':disabled')),
    ).toBe(true)
    await wrapper.get('#student-name').setValue('Editable again')
    expect(store.sheet.student.name).toBe('Editable again')
  })

  it('starts every rating at 1, edits fields, adds/removes entries and confirms reset', async () => {
    const { wrapper, store } = await page()
    expect(wrapper.findAll('input[type=radio]:checked')).toHaveLength(9)
    expect(
      wrapper
        .findAll('input[type=radio]:checked')
        .every((input) => input.element.getAttribute('value') === '1'),
    ).toBe(true)
    expect(wrapper.findAll('.student-field')).toHaveLength(3)
    expect(
      wrapper
        .findAll('.sheet-card[aria-labelledby]')
        .map((card) => card.attributes('aria-labelledby')),
    ).toEqual([
      'student-file-heading',
      'means-heading',
      'disciplines-heading',
      'spells-heading',
      'sacrifices-heading',
    ])
    await wrapper.get('#student-description').setValue('Looks and occupation')
    await wrapper.get('#student-name').setValue('Änne')
    await wrapper.get('input[aria-label="Voice: 3"]').setValue()
    const addSpell = wrapper.findAll('button').find((button) => button.text() === 'Add spell')!
    await addSpell.trigger('click')
    expect(store.sheet.spells).toEqual([{ description: '' }])
    await wrapper.get('#spells-0').setValue('First line\nSecond line')
    expect(wrapper.find('[aria-label^="Spell 1 level"]').exists()).toBe(false)
    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Add sacrifice')!
      .trigger('click')
    expect(store.sheet.sacrifices[0]?.value).toBe(1)
    expect(wrapper.find('select').exists()).toBe(false)
    await wrapper.get('input[aria-label="Sacrifice 1 level: 3"]').setValue()
    expect(store.sheet.sacrifices[0]?.value).toBe(3)
    await wrapper.get('[aria-label="Remove sacrifice 1"]').trigger('click')
    expect(store.sheet.sacrifices).toEqual([])
    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Banish')!
      .trigger('click')
    expect(store.sheet.student.name).toBe('Änne')
    expect(wrapper.find('.reset-actions').text()).toBe('YesNo')
    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Yes')!
      .trigger('click')
    expect(store.sheet).toEqual(createStudentSheet())
  })

  it.each(['german', 'russian', 'polish'] as const)(
    'summons %s students and rerolls individual fields using the saved nationality',
    async (nationality) => {
      const generateSpell = vi
        .spyOn(spells, 'spell')
        .mockReturnValue({ primary: 'Generated spell' })
      const generate = vi.spyOn(generators, 'generateNames').mockReturnValue([
        {
          primary: 'Generated name',
          age: '37 years',
          appearance: 'Generated looks',
          secondary: 'Cook',
        },
      ])
      const { wrapper, store, router } = await page()
      store.sheet.means.Blood = 3
      store.sheet.spells.push({ description: 'Existing spell' })
      store.sheet.student.keepsake = 'Existing keepsake'
      await wrapper.get('#student-summon').trigger('click')
      await flushPromises()
      expect(
        wrapper.findAll('[data-choice]').map((choice) => choice.attributes('data-choice')),
      ).toEqual(['german', 'russian', 'polish'])
      await wrapper.get(`[data-choice="${nationality}"]`).trigger('click')
      await flushPromises()
      expect(generate).toHaveBeenCalledWith(nationality, 1, {
        setting: 'never-midnight',
        genders: ['m', 'f'],
      })
      expect(store.sheet.student).toEqual({
        name: 'Generated name',
        description: '37 years · Generated looks · Cook',
        keepsake: '',
      })
      expect(store.sheet.nationality).toBe(nationality)
      expect(Object.values(store.sheet.means).reduce((sum, value) => sum + value, 0)).toBe(6)
      expect(store.sheet.disciplines.Artifice).toBe(3)
      expect(store.sheet.disciplines.Science).toBe(2)
      expect(store.sheet.subdomains.Artifice).toBe('Cooking')
      const summonedMeans = { ...store.sheet.means }
      expect(generateSpell).toHaveBeenCalledTimes(3)
      expect(store.sheet.spells).toEqual([
        { description: 'Generated spell' },
        { description: 'Generated spell' },
        { description: 'Generated spell' },
      ])
      store.sheet.student.keepsake = 'Manual keepsake'
      generate.mockReturnValue([
        {
          primary: 'Rerolled name',
          appearance: 'Rerolled looks',
          secondary: 'Photographer',
        },
      ])
      await wrapper.get('[aria-label="Reroll name"]').trigger('click')
      expect(store.sheet.student).toEqual({
        name: 'Rerolled name',
        description: '37 years · Generated looks · Cook',
        keepsake: 'Manual keepsake',
      })
      expect(store.sheet.subdomains.Artifice).toBe('Cooking')
      await wrapper.get('[aria-label="Reroll looks / marks / occupation"]').trigger('click')
      expect(store.sheet.means).toEqual(summonedMeans)
      expect(store.sheet.disciplines).toEqual({
        Arms: 1,
        Artifice: 2,
        Espionage: 1,
        Science: 2,
        Society: 1,
        Culture: 2,
      })
      expect(store.sheet.subdomains.Artifice).toBe('')
      expect(store.sheet.subdomains.Culture).toBe('Arts')
      expect(store.sheet.student).toEqual({
        name: 'Rerolled name',
        description: 'Rerolled looks · Photographer',
        keepsake: 'Manual keepsake',
      })
      expect(generate).toHaveBeenLastCalledWith(nationality, 1, {
        setting: 'never-midnight',
        genders: ['m', 'f'],
      })
      expect(generateSpell).toHaveBeenCalledTimes(3)
      await flushPromises()
      const restored = useNeverMidnightCharacterStore(createTestPinia())
      restored.loadCharacterToken(router.currentRoute.value.query.char as string)
      expect(restored.sheet.nationality).toBe(nationality)
    },
  )

  it('rerolls only the selected spell and keeps editing, removal, and locking available', async () => {
    const { wrapper, store } = await page()
    store.sheet.spells = ['First', 'Second', 'Third'].map((description) => ({ description }))
    store.sheet.sacrifices = [{ description: 'Manual sacrifice', value: 2 }]
    await nextTick()
    const before = JSON.parse(JSON.stringify(store.sheet))
    const generate = vi.spyOn(spells, 'spell').mockReturnValue({ primary: 'Rerolled spell' })
    await wrapper.get('[aria-label="Reroll spell 2"]').trigger('click')
    expect(generate).toHaveBeenCalledTimes(1)
    expect(store.sheet).toEqual({
      ...before,
      spells: [
        { description: 'First' },
        { description: 'Rerolled spell' },
        { description: 'Third' },
      ],
    })
    expect(wrapper.find('[aria-label="Reroll sacrifice 1"]').exists()).toBe(false)
    await wrapper.get('#spells-1').setValue('Edited spell')
    expect(store.sheet.spells[1]?.description).toBe('Edited spell')
    await wrapper.get('[aria-label="Lock character sheet"]').trigger('click')
    expect(wrapper.find('[aria-label^="Reroll spell"]').exists()).toBe(false)
    await wrapper.get('[aria-label="Unlock character sheet"]').trigger('click')
    await wrapper.get('[aria-label="Remove spell 2"]').trigger('click')
    expect(store.sheet.spells).toEqual([{ description: 'First' }, { description: 'Third' }])
  })

  it.each(['m', 'f'] as const)(
    'uses the %s selection for summoning and rerolls and saves it in links',
    async (gender) => {
      const generate = vi
        .spyOn(generators, 'generateNames')
        .mockReturnValue([{ primary: 'Generated name', secondary: 'Cook' }])
      const { wrapper, store, router } = await page()
      await wrapper.get('#student-summon').trigger('click')
      await flushPromises()
      expect(wrapper.find('input[type=search]').exists()).toBe(false)
      expect(wrapper.findAll('input[name="student-genders"]:checked')).toHaveLength(2)
      await wrapper
        .get(`input[name="student-genders"][value="${gender === 'm' ? 'f' : 'm'}"]`)
        .setValue(false)
      await wrapper.get('[data-choice="polish"]').trigger('click')
      await flushPromises()
      expect(generate).toHaveBeenLastCalledWith('polish', 1, {
        setting: 'never-midnight',
        genders: [gender],
      })
      await wrapper.get('[aria-label="Reroll name"]').trigger('click')
      await flushPromises()
      expect(generate).toHaveBeenLastCalledWith('polish', 1, {
        setting: 'never-midnight',
        genders: [gender],
      })
      const restored = useNeverMidnightCharacterStore(createTestPinia())
      restored.loadCharacterToken(router.currentRoute.value.query.char as string)
      expect(restored.sheet.genders).toEqual([gender])
      expect(store.sheet.genders).toEqual([gender])
      await wrapper.get('#student-summon').trigger('click')
      await flushPromises()
      await wrapper.get(`input[name="student-genders"][value="${gender}"]`).setValue(false)
      expect(store.sheet.genders).toEqual([gender === 'm' ? 'f' : 'm'])
    },
  )

  it('cancels summoning without changing edits and preserves the file when generation fails', async () => {
    const generate = vi.spyOn(generators, 'generateNames').mockImplementation(() => {
      throw new Error('Unavailable')
    })
    const { wrapper, store } = await page()
    store.sheet.student.name = 'Existing name'
    const before = JSON.stringify(store.sheet)
    await wrapper.get('#student-summon').trigger('click')
    await flushPromises()
    await wrapper.get('[aria-label="Close category picker"]').trigger('click')
    await flushPromises()
    expect(generate).not.toHaveBeenCalled()
    expect(JSON.stringify(store.sheet)).toBe(before)
    await wrapper.get('[aria-label="Reroll name"]').trigger('click')
    expect(wrapper.get('[role="alert"]').text()).toContain('Could not summon')
    expect(JSON.stringify(store.sheet)).toBe(before)
  })

  it('round-trips Unicode, multiline fields and all ratings; URL overrides the local sheet', async () => {
    const sheet = createStudentSheet()
    sheet.student = {
      name: 'Łucja 東京',
      description: 'First\nSecond · Mark · Student',
      keepsake: 'Keepsake',
    }
    sheet.means.Voice = 3
    sheet.disciplines.Science = 2
    sheet.spells = [{ description: 'Spell\nText' }]
    sheet.sacrifices = [{ description: 'Sacrifice', value: 2 }]
    localStorage.setItem('gen0.character.never-midnight', JSON.stringify(createStudentSheet()))
    const { store, router } = await page(encodeStudent(sheet))
    expect(store.sheet).toEqual(sheet)
    store.sheet.student.keepsake = 'Changed'
    await nextTick()
    await flushPromises()
    const restored = useNeverMidnightCharacterStore(createTestPinia())
    restored.loadCharacterToken(router.currentRoute.value.query.char as string)
    expect(restored.sheet).toEqual(store.sheet)
    await router.push('/elsewhere')
    await flushPromises()
    store.sheet.student.name = 'Elsewhere edit'
    await nextTick()
    await flushPromises()
    expect(router.currentRoute.value.query.char).toBeUndefined()
    await router.back()
    await flushPromises()
    expect(store.sheet.student.name).toBe('Łucja 東京')
  })

  it('preserves edits for invalid tokens, versions, wrong systems and out-of-range ratings', async () => {
    const { store, router, wrapper } = await page()
    store.sheet.student.name = 'Kept'
    await flushPromises()
    const badRating = createStudentSheet()
    const tokens = [
      'invalid!',
      encodeSheetToken({ version: 2, sheet: createStudentSheet() }),
      encodeSheetToken({
        version: 1,
        sheet: { ...badRating, means: { ...badRating.means, Blood: 4 } },
      }),
      encodeSheetToken({ version: 1, sheet: { ...badRating, systemId: 'cbr-pnk' } }),
    ]
    for (const token of tokens) {
      await router.push({ path: '/chars/never-midnight', query: { char: token } })
      await flushPromises()
      expect(store.sheet.student.name).toBe('Kept')
      expect(wrapper.get('[role=alert]').text()).toContain('Could not load')
    }
  })

  it('batches student edits and flushes the last edit on store disposal without later writes', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    try {
      const pinia = createTestPinia()
      const store = useNeverMidnightCharacterStore(pinia)
      const writes = vi.spyOn(Storage.prototype, 'setItem')
      store.sheet.student.name = 'First'
      await nextTick()
      await vi.advanceTimersByTimeAsync(100)
      store.sheet.student.name = 'Second'
      await nextTick()
      await vi.advanceTimersByTimeAsync(199)
      expect(writes).not.toHaveBeenCalled()
      await vi.advanceTimersByTimeAsync(1)
      expect(writes).toHaveBeenCalledTimes(1)
      store.sheet.student.keepsake = 'Last edit'
      await nextTick()
      disposePinia(pinia)
      expect(JSON.parse(localStorage.getItem('gen0.character.never-midnight')!).student).toEqual({
        name: 'Second',
        description: '',
        keepsake: 'Last edit',
      })
      expect(writes).toHaveBeenCalledTimes(2)
      window.dispatchEvent(new Event('pagehide'))
      await vi.advanceTimersByTimeAsync(200)
      expect(writes).toHaveBeenCalledTimes(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('keeps the complete student file when spell generation fails during summoning', () => {
    const store = useNeverMidnightCharacterStore(createTestPinia())
    store.sheet.student.keepsake = 'Manual keepsake'
    store.sheet.means.Voice = 3
    const before = JSON.stringify(store.sheet)
    vi.spyOn(generators, 'generateNames').mockReturnValue([
      { primary: 'Generated name', secondary: 'Cook' },
    ])
    vi.spyOn(spells, 'spell').mockImplementation(() => {
      throw new Error('Unavailable')
    })
    store.generateStudent('german')
    expect(JSON.stringify(store.sheet)).toBe(before)
    expect(store.generationError).toContain('Could not summon')
    store.reset()
    expect(store.generationError).toBe('')
  })

  it('saves on pagehide, restores local content and keeps CBR+PNK storage separate', async () => {
    localStorage.setItem('gen0.character', 'existing runner data')
    const { store } = await page()
    store.sheet.student.name = 'Saved student'
    await nextTick()
    window.dispatchEvent(new Event('pagehide'))
    expect(useNeverMidnightCharacterStore(createTestPinia()).sheet.student.name).toBe(
      'Saved student',
    )
    expect(localStorage.getItem('gen0.character')).toBe('existing runner data')
  })

  it('preserves separate student fields from existing links and local storage', async () => {
    const legacy = {
      ...createStudentSheet(),
      student: {
        name: 'Existing student',
        looks: 'Appearance',
        distinguishingMarks: 'Marks',
        occupation: 'Occupation',
        keepsake: 'Keepsake',
      },
    }
    localStorage.setItem('gen0.character.never-midnight', JSON.stringify(legacy))
    const store = useNeverMidnightCharacterStore(createTestPinia())
    expect(store.sheet.student).toEqual({
      name: 'Existing student',
      description: 'Appearance · Marks · Occupation',
      keepsake: 'Keepsake',
    })
    const { store: imported } = await page(encodeSheetToken({ version: 1, sheet: legacy }))
    expect(imported.sheet.student).toEqual(store.sheet.student)
  })

  it('edits a separate subdomains string per discipline and persists it in links and local storage', async () => {
    const { wrapper, store, router } = await page()
    expect(Object.values(store.sheet.subdomains)).toEqual(['', '', '', '', '', ''])
    const names = ['Arms', 'Artifice', 'Espionage', 'Science', 'Society', 'Culture'] as const
    for (const name of names) {
      await wrapper.get(`[aria-label="${name} subdomains"]`).setValue(`${name} text`)
    }
    await flushPromises()
    const restored = useNeverMidnightCharacterStore(createTestPinia())
    restored.loadCharacterToken(router.currentRoute.value.query.char as string)
    expect(restored.sheet.subdomains).toEqual(store.sheet.subdomains)
    expect(restored.sheet.disciplines).toEqual(createStudentSheet().disciplines)
    window.dispatchEvent(new Event('pagehide'))
    expect(useNeverMidnightCharacterStore(createTestPinia()).sheet.subdomains).toEqual(
      store.sheet.subdomains,
    )
    store.reset()
    expect(Object.values(store.sheet.subdomains).every((text) => text === '')).toBe(true)
  })

  it('defaults older sheets to blank subdomains and rejects non-string subdomains', () => {
    const legacy: Record<string, unknown> = { ...createStudentSheet() }
    delete legacy.subdomains
    const store = useNeverMidnightCharacterStore(createTestPinia())
    store.loadCharacterToken(encodeStudent(legacy))
    expect(store.sheet.subdomains).toEqual(createStudentSheet().subdomains)
    const invalid = {
      ...createStudentSheet(),
      subdomains: { ...createStudentSheet().subdomains, Arms: 2 },
    }
    expect(() => store.loadCharacterToken(encodeStudent(invalid))).toThrow('Invalid character link')
    expect(store.sheet.subdomains.Arms).toBe('')
  })

  it('retains spell text from old saves and drops the retired levels', () => {
    const legacy = {
      ...createStudentSheet(),
      spells: [{ description: 'Existing spell', value: 3 }],
    }
    localStorage.setItem('gen0.character.never-midnight', JSON.stringify(legacy))
    const store = useNeverMidnightCharacterStore(createTestPinia())
    expect(store.sheet.spells).toEqual([{ description: 'Existing spell' }])
    store.reset()
    store.loadCharacterToken(encodeStudent(legacy))
    expect(store.sheet.spells).toEqual([{ description: 'Existing spell' }])
  })

  it('preserves ratings when restoring old discipline names from storage or links', () => {
    const { Arms, Espionage, ...unchanged } = createStudentSheet().disciplines
    const legacy = {
      ...createStudentSheet(),
      disciplines: { ...unchanged, Prowess: 3, Intrigue: 2 },
    }
    localStorage.setItem('gen0.character.never-midnight', JSON.stringify(legacy))
    const store = useNeverMidnightCharacterStore(createTestPinia())
    expect(store.sheet.disciplines).toEqual({ ...unchanged, Arms: 3, Espionage: 2 })
    store.reset()
    store.loadCharacterToken(encodeStudent(legacy))
    expect(store.sheet.disciplines).toEqual({ ...unchanged, Arms: 3, Espionage: 2 })
    expect(store.sheet.disciplines).not.toHaveProperty('Prowess')
    expect(store.sheet.disciplines).not.toHaveProperty('Intrigue')
    expect(Arms).toBe(1)
    expect(Espionage).toBe(1)
  })

  it('ignores invalid local data and works when storage is blocked', () => {
    localStorage.setItem('gen0.character.never-midnight', '{broken')
    expect(useNeverMidnightCharacterStore(createTestPinia()).sheet).toEqual(createStudentSheet())
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    const store = useNeverMidnightCharacterStore(createTestPinia())
    store.loadCharacterToken(encodeStudent(createStudentSheet()))
    store.reset()
    expect(store.sheet).toEqual(createStudentSheet())
  })
})
