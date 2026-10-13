// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { defineComponent, nextTick } from 'vue'
import { useCharacterUrl } from '@/composables/useCharacterUrl'
import { deflateSync, strToU8 } from 'fflate'
import { decodeCharacter, encodeCharacter } from '@/helper/characterLink'
import { useCharacterStore } from '@/stores/character'
import CharacterView from '@/views/CharacterView.vue'
import { createTestPinia } from './helpers/pinia'
import { mockMedia } from './helpers/media'
import { mockDialog } from './helpers/dialog'

mockMedia()
mockDialog()
beforeEach(() => {
  localStorage.clear()
})

function packed(value: unknown) {
  return btoa(String.fromCharCode(...deflateSync(strToU8(JSON.stringify(value)))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

describe('compressed character links', () => {
  it('round-trips every field, Unicode and null/zero ratings through a URL query', () => {
    const store = useCharacterStore(createTestPinia())
    const sheet = store.sheet
    sheet.runner = { alias: 'Ä / 東京 🦾', description: 'First line\nSecond line', archetypeId: 'hacker', angle: 'Take a stand' }
    sheet.attributeRatings.forEach((row, i) => { row.value = ([null, 0, 1, 2] as const)[i]! })
    sheet.skillRatings.forEach((row, i) => { row.value = ([null, 0, 1, 2] as const)[i % 4]! })
    sheet.expertises.forEach((row, i) => { row.values = ['Selected']; row.custom = `Custom ${i}` })
    sheet.glitches.forEach((row, i) => { row.marked = i % 2 === 0 })
    sheet.harm.forEach((row) => { row.description = `Harm ${row.level}`; row.marks[0] = true })
    sheet.gear = { level: 'heavy', selected: ['Armor', '+Heavy'], extra: [true, false, true, false] }
    sheet.stress = 7
    sheet.specialArmor = true
    sheet.augmentations.forEach((row, i) => { row.description = `Augmentation ${i}`; row.glitched = true })
    const url = new URL('https://example.com/gen0/chars/cbrpnk')
    url.searchParams.set('character', encodeCharacter(sheet))
    const token = url.searchParams.get('character')!
    expect(url.pathname).toBe('/gen0/chars/cbrpnk')
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(decodeCharacter(token)).toEqual(sheet)
    store.loadCharacterToken(token)
    expect(store.sheet.runner.alias).toBe('Ä / 東京 🦾')
    expect(url.href.length).toBeLessThan(JSON.stringify(sheet).length)
    const reversed = { ...sheet, attributeRatings: [...sheet.attributeRatings].reverse(), skillRatings: [...sheet.skillRatings].reverse(), expertises: [...sheet.expertises].reverse(), glitches: [...sheet.glitches].reverse() }
    expect(encodeCharacter(reversed)).toBe(encodeCharacter(sheet))
  })

  it('validates decoded values and rejects malformed, unsupported and oversized links without saving', () => {
    const store = useCharacterStore(createTestPinia())
    const original = JSON.stringify(store.sheet)
    const invalid = { ...store.sheet, stress: 8 }
    const unknownVersion = [2, [], [], [], [], [], [], [], 0, false, []]
    for (const token of ['', 'broken', '$', encodeCharacter(invalid), packed(unknownVersion), packed([1]), packed('x'.repeat(262144))]) {
      expect(() => store.loadCharacterToken(token)).toThrow(Error)
      expect(JSON.stringify(store.sheet)).toBe(original)
      expect(localStorage.getItem('gen0.character')).toBeNull()
    }
  })

  it('prefers the URL over local storage, updates edits, and restores Back/Forward', async () => {
    const pinia = createTestPinia()
    const store = useCharacterStore(pinia)
    store.sheet.runner.alias = 'First'
    const first = encodeCharacter(store.sheet)
    store.sheet.runner.alias = 'Second'
    const second = encodeCharacter(store.sheet)
    store.sheet.runner.alias = 'Local'
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/chars/cbrpnk', component: CharacterView }] })
    await router.push(`/chars/cbrpnk?character=${first}`)
    const wrapper = mount(CharacterView, { global: { plugins: [pinia, router] } })
    expect(store.sheet.runner.alias).toBe('First')
    expect(JSON.parse(localStorage.getItem('gen0.character')!).runner.alias).toBe('First')
    store.sheet.runner.alias = 'Edited'
    await flushPromises()
    expect(store.sheet.runner.alias).toBe('Edited')
    expect(decodeCharacter(router.currentRoute.value.query.character as string)).toEqual(store.sheet)
    await router.push(`/chars/cbrpnk?character=${second}`)
    expect(store.sheet.runner.alias).toBe('Second')
    router.back()
    await flushPromises()
    expect(store.sheet.runner.alias).toBe('Edited')
    router.forward()
    await flushPromises()
    expect(store.sheet.runner.alias).toBe('Second')
    await router.push('/chars/cbrpnk?character=broken')
    expect(wrapper.get('[role="alert"]').text()).toContain('kept')
    expect(store.sheet.runner.alias).toBe('Second')
    await router.push('/chars/cbrpnk')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(store.sheet.runner.alias).toBe('Second')
    wrapper.unmount()
  })

  it('restores local storage without a query and batches edits into router.replace without a timer or reloading its own writes', async () => {
    const saved = useCharacterStore(createTestPinia()).sheet
    saved.runner.alias = 'Locally saved'
    localStorage.setItem('gen0.character', JSON.stringify(saved))
    const pinia = createTestPinia()
    const store = useCharacterStore(pinia)
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/chars/cbrpnk', component: CharacterView }] })
    await router.push('/chars/cbrpnk?flavor=shadowrun#sheet')
    const load = vi.spyOn(store, 'loadCharacterToken')
    const replace = vi.spyOn(router, 'replace')
    const wrapper = mount(defineComponent({ setup() { useCharacterUrl(); return () => null } }), { global: { plugins: [pinia, router] } })
    await flushPromises()
    expect(store.sheet.runner.alias).toBe('Locally saved')
    expect(decodeCharacter(router.currentRoute.value.query.character as string)).toEqual(store.sheet)
    replace.mockClear()
    store.sheet.runner.alias = 'Newest edit'
    store.sheet.stress = 3
    store.sheet.gear.extra[0] = true
    await nextTick()
    expect(replace).toHaveBeenCalledTimes(1)
    await flushPromises()
    expect(decodeCharacter(router.currentRoute.value.query.character as string)).toEqual(store.sheet)
    expect(router.currentRoute.value.query.flavor).toBe('shadowrun')
    expect(router.currentRoute.value.hash).toBe('#sheet')
    expect(load).not.toHaveBeenCalled()
    store.reset()
    await flushPromises()
    expect(decodeCharacter(router.currentRoute.value.query.character as string)).toEqual(store.sheet)
    wrapper.unmount()
  })

  it('keeps newer edits while earlier router replacements are waiting', async () => {
    const pinia = createTestPinia()
    const store = useCharacterStore(pinia)
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/chars/cbrpnk', component: CharacterView }] })
    await router.push(`/chars/cbrpnk?character=${encodeCharacter(store.sheet)}`)
    const wrapper = mount(defineComponent({ setup() { useCharacterUrl(); return () => null } }), { global: { plugins: [pinia, router] } })
    const releases: (() => void)[] = []
    const removeGuard = router.beforeEach(() => new Promise<void>((resolve) => releases.push(resolve)))
    store.sheet.runner.alias = 'Earlier'
    await flushPromises()
    store.sheet.runner.alias = 'Latest'
    await flushPromises()
    expect(releases).toHaveLength(2)
    releases[0]!()
    await flushPromises()
    expect(store.sheet.runner.alias).toBe('Latest')
    releases[1]!()
    await flushPromises()
    expect(store.sheet.runner.alias).toBe('Latest')
    expect(decodeCharacter(router.currentRoute.value.query.character as string)).toEqual(store.sheet)
    removeGuard()
    wrapper.unmount()
  })
})
