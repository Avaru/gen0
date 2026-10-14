// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import UiRunnerCard from '@/components/ui/UiRunnerCard.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { createTestPinia } from './helpers/pinia'
import { mockMedia } from './helpers/media'

mockMedia()

afterEach(() => vi.unstubAllGlobals())

function promptPinia() {
  const pinia = createTestPinia()
  usePreferencesStore(pinia).soullessCorpMode = true
  return pinia
}

describe('runner image prompt', () => {
  it('copies the current editable name and description with square portrait and lettering instructions', async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const wrapper = mount(UiRunnerCard, {
      global: { plugins: [promptPinia()] },
      props: {
        flavor: 'cyberpunk',
        canReset: false,
        modelValue: { alias: 'Old handle', description: 'Old description' },
      },
    })
    await wrapper.setProps({
      modelValue: { alias: 'Écho "9"', description: 'Grey hair, teal coat.\nBy day: a lawyer.' },
    })
    const button = wrapper.get('[aria-label="Copy image prompt"]')
    expect(button.element.previousElementSibling?.getAttribute('aria-label')).toBe(
      'Regenerate details and looks',
    )
    await button.trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledOnce()
    expect(button.classes()).toContain('pulse-a')
    const prompt = writeText.mock.calls[0]![0] as string
    expect(prompt).toContain('square (1:1)')
    expect(prompt).toContain('punk screen-printed poster')
    expect(prompt).toContain('Character name / handle: "Écho \\"9\\""')
    expect(prompt).toContain('Grey hair, teal coat.\nBy day: a lawyer.')
    expect(prompt).toContain('Write the character name / handle exactly as provided')
    expect(prompt).not.toContain('Old handle')
    expect(prompt).not.toContain('Character archetype:')
    expect(prompt).not.toContain('Character angle / motivation:')
    expect(wrapper.text()).not.toContain('Image prompt copied.')
  })

  it('uses the selected archetype name and angle to guide the portrait', async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const runner = {
      alias: 'Echo',
      description: 'Grey hair',
      archetypeId: 'hacker',
      angle: 'Learn the truth',
    }
    const wrapper = mount(UiRunnerCard, {
      global: { plugins: [promptPinia()] },
      props: { flavor: 'cyberpunk', canReset: false, modelValue: runner },
    })
    await wrapper.get('[aria-label="Copy image prompt"]').trigger('click')
    await flushPromises()
    const prompt = writeText.mock.calls[0]![0] as string
    expect(prompt).toContain('Character archetype: Hacker.')
    expect(prompt).toContain('Character angle / motivation: Learn the truth.')
    expect(prompt).toContain('expression, posture and mood')
    await wrapper.setProps({ modelValue: { ...runner, angle: 'Get out' } })
    await wrapper.get('[aria-label="Copy image prompt"]').trigger('click')
    await flushPromises()
    expect(writeText.mock.calls[1]![0]).toContain('Character angle / motivation: Get out.')
  })

  it.each(['', '  \n '])('hides the copy button for an empty description %j', (description) => {
    const wrapper = mount(UiRunnerCard, {
      global: { plugins: [promptPinia()] },
      props: {
        flavor: 'cyberpunk',
        canReset: false,
        modelValue: { alias: 'Echo', description },
      },
    })
    expect(wrapper.find('[aria-label="Copy image prompt"]').exists()).toBe(false)
    expect(wrapper.find('[aria-label="Regenerate details and looks"]').exists()).toBe(true)
  })

  it('reports clipboard failure without claiming success or changing the runner', async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn<(text: string) => Promise<void>>().mockRejectedValue(new Error('Denied')),
      },
    })
    const runner = { alias: 'Echo', description: 'Grey hair' }
    const wrapper = mount(UiRunnerCard, {
      global: { plugins: [promptPinia()] },
      props: { flavor: 'cyberpunk', canReset: false, modelValue: runner },
    })
    await wrapper.get('[aria-label="Copy image prompt"]').trigger('click')
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('Could not copy the image prompt')
    expect(runner).toEqual({ alias: 'Echo', description: 'Grey hair' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('[aria-label="Copy image prompt"]').classes()).not.toContain('pulse-a')
  })
})
