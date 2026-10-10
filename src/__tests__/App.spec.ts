import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'

describe('name generator interface', () => {
  it('generates and appends names, then clears results when settings change', async () => {
    const wrapper = mount(App)
    await wrapper.get('#count').setValue(2)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    await wrapper.get('button[type="button"]').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('li')).toHaveLength(4)
    await wrapper.get('#flavor').setValue('shadowrun')
    expect(wrapper.findAll('li')).toHaveLength(0)
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(0)
    await wrapper.get('#flavor').setValue('cyberpunk')
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(0)
  })

  it('offers one combined Cyberpunk setting and resets unavailable categories', async () => {
    const wrapper = mount(App)
    expect(wrapper.findAll('#flavor option').map(option => option.text())).toEqual(['Generic cyberpunk', 'Shadowrun', 'Cyberpunk 2020/2077'])
    expect(wrapper.find('option[value="known-corporations"]').exists()).toBe(false)
    await wrapper.get('#flavor').setValue('cyberpunk2020-2077')
    await wrapper.get('#category').setValue('known-corporations')
    await wrapper.get('#count').setValue(2)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.findAll('li')).toHaveLength(2)
    await wrapper.get('#flavor').setValue('cyberpunk')
    expect((wrapper.get('#category').element as HTMLSelectElement).value).toBe('corporations')
    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('exposes category options and reports invalid batch sizes', async () => {
    const wrapper = mount(App)
    await wrapper.get('#category').setValue('german')
    expect(wrapper.find('#gender').exists()).toBe(true)
    await wrapper.get('#category').setValue('corporations')
    expect(wrapper.find('#size').exists()).toBe(true)
    await wrapper.get('#count').setValue(0)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('between 1 and 100')
    expect(wrapper.findAll('li')).toHaveLength(0)
  })
})
