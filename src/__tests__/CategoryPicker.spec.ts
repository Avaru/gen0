// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import UiCategoryPicker from '@/components/ui/UiCategoryPicker.vue'
import { mockDialog } from './helpers/dialog'
import { cyberpunkCategories } from '@/generator/definitions/cyberpunk'
import { mockMedia } from './helpers/media'

enableAutoUnmount(afterEach)
mockDialog()
const media = mockMedia()
const options = [
  { id: 'german', label: 'German', group: 'Names by nationality' },
  { id: 'japanese', label: 'Japanese', group: 'Names by nationality' },
  { id: 'corporations', label: 'Corporations', group: 'Organizations' },
  { id: 'runners', label: 'Runners', group: 'People' },
  ...cyberpunkCategories
    .filter(
      (option) =>
        option.group !== 'Names by nationality' && !['corporations', 'runners'].includes(option.id),
    )
    .slice(0, 6),
]

function setup() {
  return mount(UiCategoryPicker, {
    props: { modelValue: 'runners', options },
    attachTo: document.body,
  })
}

describe('category picker', () => {
  it.each([4, 9, 10])(
    'shows search only from ten available categories (%i options)',
    async (count) => {
      const wrapper = setup()
      await wrapper.setProps({ options: options.slice(0, count) })
      await wrapper.get('#category').trigger('click')
      await flushPromises()
      expect(wrapper.find('input[type=search]').exists()).toBe(count >= 10)
      expect(wrapper.find('.search').exists()).toBe(count >= 10)
      expect(document.activeElement).toBe(wrapper.get(count < 10 ? '.close' : 'input').element)
    },
  )

  it('keeps search unfocused on phones and touch devices until it is selected', async () => {
    media.clear()
    const wrapper = setup()
    await wrapper.get('#category').trigger('click')
    await flushPromises()
    expect(wrapper.get('input').attributes('autofocus')).toBeUndefined()
    expect(document.activeElement).toBe(wrapper.get('.close').element)
    ;(wrapper.get('input').element as HTMLInputElement).focus()
    await wrapper.get('input').setValue('japanese')
    expect(wrapper.findAll('[data-category]')).toHaveLength(1)
    await wrapper.get('.close').trigger('click')
    await wrapper.get('#category').trigger('click')
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.get('.close').element)
    wrapper.unmount()
  })

  it('searches names and group words together without changing the selection', async () => {
    const wrapper = setup()
    await wrapper.get('#category').trigger('click')
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.get('input').element)
    expect(wrapper.get('[aria-current]').attributes('data-category')).toBe('runners')
    await wrapper.get('input').setValue('  NATIONALITY   jap  ')
    expect(
      wrapper.findAll('[data-category]').map((button) => button.attributes('data-category')),
    ).toEqual(['japanese'])
    expect(wrapper.findAll('h3').map((heading) => heading.text())).toEqual(['Names by nationality'])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['japanese']])
    expect((wrapper.get('dialog').element as HTMLDialogElement).open).toBe(false)
    expect(document.activeElement).toBe(wrapper.get('#category').element)
    wrapper.unmount()
  })

  it('shows an empty search message and does not choose an ambiguous or empty result', async () => {
    const wrapper = setup()
    await wrapper.get('#category').trigger('click')
    await flushPromises()
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.get('input').setValue('nonexistent')
    expect(wrapper.findAll('[data-category]')).toHaveLength(0)
    expect(wrapper.get('[role="status"]').text()).toContain('No categories found')
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect((wrapper.get('dialog').element as HTMLDialogElement).open).toBe(true)
    wrapper.unmount()
  })

  it('cancels without changing category and starts a fresh search on reopening', async () => {
    const wrapper = setup()
    await wrapper.get('#category').trigger('click')
    await flushPromises()
    await wrapper.get('input').setValue('organization')
    await wrapper.get('.close').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('#category').attributes('aria-expanded')).toBe('false')
    await wrapper.get('#category').trigger('click')
    await flushPromises()
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('')
    await wrapper.get('[data-category="corporations"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['corporations']])
    wrapper.unmount()
  })

  it('wraps Tab at both ends of the dialog', async () => {
    const wrapper = setup()
    await wrapper.get('#category').trigger('click')
    await flushPromises()
    const first = wrapper.get('.close')
    const last = wrapper.findAll('[data-category]').slice(-1)[0]!
    ;(first.element as HTMLButtonElement).focus()
    await first.trigger('keydown', { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last.element)
    await last.trigger('keydown', { key: 'Tab' })
    expect(document.activeElement).toBe(first.element)
    wrapper.unmount()
  })

  it('hides search when flavor filtering leaves fewer than ten categories', async () => {
    const wrapper = setup()
    await wrapper.setProps({ options: options.filter((option) => option.id !== 'corporations') })
    await wrapper.get('#category').trigger('click')
    await flushPromises()
    expect(wrapper.find('input[type=search]').exists()).toBe(false)
    expect(wrapper.find('[data-category="corporations"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-category]')).toHaveLength(9)
    wrapper.unmount()
  })
})
