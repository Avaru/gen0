// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import UiModal from '@/components/ui/UiModal.vue'
import { mockDialog } from './helpers/dialog'

enableAutoUnmount(afterEach)
mockDialog()

describe('modal contents', () => {
  it('waits for first opening before running child setup and keeps edits on reopening', async () => {
    const setup = vi.fn<() => void>()
    const Content = defineComponent({
      setup() {
        setup()
        const value = ref('')
        return () =>
          h('input', {
            value: value.value,
            onInput: (event: Event) => {
              value.value = (event.target as HTMLInputElement).value
            },
          })
      },
    })
    const wrapper = mount(UiModal, {
      props: { id: 'test-modal', title: 'Test', closeLabel: 'Close' },
      slots: { default: () => h(Content), actions: () => h(Content) },
      attachTo: document.body,
    })
    expect(setup).not.toHaveBeenCalled()
    expect(wrapper.find('input').exists()).toBe(false)
    await wrapper.vm.showModal()
    expect(setup).toHaveBeenCalledTimes(2)
    await wrapper.findAll('input')[1]!.setValue('Keep this edit')
    wrapper.vm.close()
    await wrapper.vm.showModal()
    expect(setup).toHaveBeenCalledTimes(2)
    expect(wrapper.findAll('input')[1]!.element.value).toBe('Keep this edit')
  })
})
