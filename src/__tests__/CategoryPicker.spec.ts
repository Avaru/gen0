import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiCategoryPicker from '@/components/ui/UiCategoryPicker.vue'
import { mockDialog } from './helpers/dialog'

mockDialog()
const options = [
  { id: 'german', label: 'German', group: 'Names by nationality' },
  { id: 'japanese', label: 'Japanese', group: 'Names by nationality' },
  { id: 'corporations', label: 'Corporations', group: 'Organizations' },
  { id: 'runners', label: 'Runners', group: 'People' },
]

function setup() {
  return mount(UiCategoryPicker, { props: { modelValue: 'runners', options }, attachTo: document.body })
}

describe('category picker', () => {
  it('searches names and group words together without changing the selection', async () => {
    const wrapper = setup()
    await wrapper.get('#category').trigger('click')
    expect(document.activeElement).toBe(wrapper.get('input').element)
    expect(wrapper.get('[aria-current]').attributes('data-category')).toBe('runners')
    await wrapper.get('input').setValue('  NATIONALITY   jap  ')
    expect(wrapper.findAll('[data-category]').map(button => button.attributes('data-category'))).toEqual(['japanese'])
    expect(wrapper.findAll('h3').map(heading => heading.text())).toEqual(['Names by nationality'])
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
    await wrapper.get('input').setValue('organization')
    await wrapper.get('.close').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('#category').attributes('aria-expanded')).toBe('false')
    await wrapper.get('#category').trigger('click')
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('')
    await wrapper.get('[data-category="corporations"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['corporations']])
    wrapper.unmount()
  })

  it('wraps Tab at both ends of the dialog', async () => {
    const wrapper = setup()
    await wrapper.get('#category').trigger('click')
    const first = wrapper.get('.close')
    const last = wrapper.get('[data-category="runners"]')
    ;(first.element as HTMLButtonElement).focus()
    await first.trigger('keydown', { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last.element)
    await last.trigger('keydown', { key: 'Tab' })
    expect(document.activeElement).toBe(first.element)
    wrapper.unmount()
  })

  it('searches only the options currently allowed by the flavor', async () => {
    const wrapper = setup()
    await wrapper.setProps({ options: options.filter(option => option.id !== 'corporations') })
    await wrapper.get('#category').trigger('click')
    await wrapper.get('input').setValue('corporation')
    expect(wrapper.findAll('[data-category]')).toHaveLength(0)
    wrapper.unmount()
  })
})
