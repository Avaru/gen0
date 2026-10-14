// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestPinia as createPinia } from './helpers/pinia'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import CharacterView from '@/views/CharacterView.vue'
import { useCharacterStore } from '@/stores/character'
import { mockMedia } from './helpers/media'

enableAutoUnmount(afterEach)
mockMedia()

beforeEach(() => localStorage.clear())

describe('gear load', () => {
  it('tracks weighted gear, extra load, and load-level changes without clearing selections', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const card = wrapper.get('.gear-card')
    expect(card.get('input[value="medium"]').element).toHaveProperty('checked', true)
    expect(card.get('output').text()).toBe('0 / 5')
    await card.get('input[value="light"]').setValue()
    await card.get('[aria-label="Armor"]').setValue(true)
    expect(card.get('output').text()).toBe('1 / 3')
    expect(card.attributes('data-state')).toBe('empty')
    await card.get('[aria-label="+Heavy"]').setValue(true)
    expect(card.get('output').text()).toBe('3 / 3')
    expect(card.attributes('data-state')).toBe('yellow')
    await card.get('[aria-label="Extra load 4"]').setValue(true)
    expect(card.get('output').text()).toBe('4 / 3')
    expect(card.attributes('data-state')).toBe('red')
    await card.get('input[value="medium"]').setValue()
    expect(card.attributes('data-state')).toBe('empty')
    await card.get('[aria-label="Sidearm"]').setValue(true)
    expect(card.attributes('data-state')).toBe('yellow')
    await card.get('input[value="heavy"]').setValue()
    await card.get('[aria-label="Medium drone"]').setValue(true)
    expect(card.get('output').text()).toBe('7 / 7')
    expect(card.attributes('data-state')).toBe('yellow')
    await card.get('[aria-label="Armor"]').setValue(false)
    expect(store.sheet.gear.selected).not.toContain('+Heavy')
    expect(card.get('output').text()).toBe('4 / 7')
    expect(card.attributes('data-state')).toBe('empty')
    const saved = JSON.parse(JSON.stringify(store.sheet.gear))
    wrapper.unmount()
    const restoredPinia = createPinia()
    const remounted = mount(CharacterView, { global: { plugins: [restoredPinia] } })
    expect(useCharacterStore(restoredPinia).sheet.gear).toEqual(saved)
    expect(remounted.get('.gear-card output').text()).toBe('4 / 7')
    remounted.unmount()
  })

  it.each(['Large/heavy weapon', 'Medium drone', 'Demolition tools'])(
    'toggles both load diamonds together for %s', async (name) => {
      const wrapper = mount(CharacterView, { global: { plugins: [createPinia()] } })
      const input = wrapper.get(`.gear-card [aria-label="${name}"]`)
      const label = input.element.closest('label')!
      expect(label.querySelectorAll('input')).toHaveLength(1)
      expect(label.querySelectorAll('.diamonds > span')).toHaveLength(2)
      await input.setValue(true)
      expect(wrapper.get('.gear-card output').text()).toBe('2 / 5')
      await input.setValue(false)
      expect(wrapper.get('.gear-card output').text()).toBe('0 / 5')
      wrapper.unmount()
    },
  )

  it('requires Armor for +Heavy and keeps Armor when only +Heavy is cleared', async () => {
    const wrapper = mount(CharacterView, { global: { plugins: [createPinia()] } })
    const card = wrapper.get('.gear-card')
    const armor = card.get('[aria-label="Armor"]')
    const heavy = card.get('[aria-label="+Heavy"]')
    expect(heavy.element.closest('label')!.querySelectorAll('.diamonds > span')).toHaveLength(2)
    await heavy.setValue(true)
    expect(armor.element).toHaveProperty('checked', true)
    expect(card.get('output').text()).toBe('3 / 5')
    await heavy.setValue(false)
    expect(armor.element).toHaveProperty('checked', true)
    expect(card.get('output').text()).toBe('1 / 5')
    await heavy.setValue(true)
    expect(card.get('output').text()).toBe('3 / 5')
    await armor.setValue(false)
    expect(heavy.element).toHaveProperty('checked', false)
    expect(card.get('output').text()).toBe('0 / 5')
    await armor.setValue(true)
    expect(heavy.element).toHaveProperty('checked', false)
    expect(card.get('output').text()).toBe('1 / 5')
    wrapper.unmount()
  })
})
