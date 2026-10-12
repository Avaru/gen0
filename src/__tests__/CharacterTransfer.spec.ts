// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestPinia } from './helpers/pinia'
import { mockDialog } from './helpers/dialog'
import { useCharacterStore } from '@/stores/character'
import UiCharacterTransfer from '@/components/ui/UiCharacterTransfer.vue'

mockDialog()
beforeEach(() => localStorage.clear())
afterEach(() => vi.unstubAllGlobals())

function setup() {
  const pinia = createTestPinia()
  const store = useCharacterStore(pinia)
  const wrapper = mount(UiCharacterTransfer, { attachTo: document.body, global: { plugins: [pinia] } })
  return { store, wrapper }
}

describe('character import/export', () => {
  it('reopens with the current character instead of the edited draft', async () => {
    const { store, wrapper } = setup()
    await wrapper.get('button').trigger('click')
    await wrapper.get('textarea').setValue('discarded draft')
    await wrapper.get('button[aria-label="Close import/export"]').trigger('click')
    store.sheet.runner.alias = 'Changed while closed'
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('textarea').element.value).toBe(JSON.stringify(store.sheet))
    wrapper.unmount()
  })

  it('focuses the shared Close button, wraps keyboard focus, and restores the trigger on close', async () => {
    const { wrapper } = setup()
    const trigger = wrapper.get('button')
    await trigger.trigger('click')
    const close = wrapper.get('button[aria-label="Close import/export"]')
    expect(document.activeElement).toBe(close.element)
    await close.trigger('keydown', { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(wrapper.findAll('.actions button')[1]!.element)
    await wrapper.findAll('.actions button')[1]!.trigger('keydown', { key: 'Tab' })
    expect(document.activeElement).toBe(close.element)
    await close.trigger('click')
    expect(wrapper.get('dialog').attributes('open')).toBeUndefined()
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })

  it('opens with compact current JSON and imports and saves a complete edited character', async () => {
    const { store, wrapper } = setup()
    store.sheet.runner.alias = 'Current'
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('dialog').attributes('open')).toBeDefined()
    expect(wrapper.get('textarea').element.value).toBe(JSON.stringify(store.sheet))
    const imported = JSON.parse(JSON.stringify(store.sheet))
    imported.runner.alias = 'Imported'
    imported.stress = 4
    imported.specialArmor = true
    imported.gear.selected = ['Armor']
    imported.augmentations[0].description = 'Edited augmentation'
    await wrapper.get('textarea').setValue(JSON.stringify(imported))
    await wrapper.get('.actions button').trigger('click')
    expect(store.sheet).toEqual(imported)
    expect(JSON.parse(localStorage.getItem('gen0.character')!)).toEqual(imported)
    expect(wrapper.get('dialog').attributes('open')).toBeUndefined()
    wrapper.unmount()
  })

  it.each(['broken JSON', '{}', 'null'])('keeps the sheet unchanged when importing %s', async (json) => {
    const { store, wrapper } = setup()
    const original = JSON.stringify(store.sheet)
    await wrapper.get('button').trigger('click')
    await wrapper.get('textarea').setValue(json)
    await wrapper.get('.actions button').trigger('click')
    expect(wrapper.get('[role="alert"]').text()).toContain('Import failed')
    expect(JSON.stringify(store.sheet)).toBe(original)
    expect(wrapper.get('dialog').attributes('open')).toBeDefined()
    wrapper.unmount()
  })

  it('exports current JSON to the clipboard instead of the pasted draft', async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const { store, wrapper } = setup()
    await wrapper.get('button').trigger('click')
    await wrapper.get('textarea').setValue('draft')
    await wrapper.findAll('.actions button')[1]!.trigger('click')
    expect(writeText).toHaveBeenCalledWith(JSON.stringify(store.sheet))
    expect(wrapper.get('[role="status"]').text()).toBe('Copied to clipboard.')
    wrapper.unmount()
  })

  it('selects current JSON for manual export if clipboard access fails', async () => {
    vi.stubGlobal('navigator', {})
    const { store, wrapper } = setup()
    await wrapper.get('button').trigger('click')
    await wrapper.get('textarea').setValue('draft')
    await wrapper.findAll('.actions button')[1]!.trigger('click')
    const textarea = wrapper.get('textarea').element
    expect(textarea.value).toBe(JSON.stringify(store.sheet))
    expect(textarea.selectionEnd).toBe(textarea.value.length)
    expect(wrapper.get('[role="status"]').text()).toContain('Copy the selected JSON')
    wrapper.unmount()
  })
})
