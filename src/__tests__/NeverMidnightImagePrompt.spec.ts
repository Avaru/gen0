// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import GeneratorResults from '@/components/generator/GeneratorResults.vue'
import { neverMidnightImagePrompt } from '@/helper/neverMidnightImagePrompt'
import { usePreferencesStore } from '@/stores/preferences'
import { createTestPinia } from './helpers/pinia'
import { mockMedia } from './helpers/media'

mockMedia()
enableAutoUnmount(afterEach)
beforeEach(() => localStorage.clear())

const result = {
  primary: 'Anna-Lena Maria Schulze',
  age: '34 years',
  appearance: 'Curly hair, wool coat',
  secondary: 'Archivist',
}

function setup(
  category = 'german',
  enabled = true,
  showDetails = true,
  setting = 'never-midnight',
) {
  const pinia = createTestPinia()
  const preferences = usePreferencesStore(pinia)
  preferences.soullessCorpMode = enabled
  const wrapper = mount(GeneratorResults, {
    global: { plugins: [pinia] },
    props: {
      results: [result],
      category,
      setting,
      busy: false,
      label: 'Names',
      error: '',
      showDetails,
    },
  })
  return { wrapper, preferences }
}

describe('Never Midnight image prompts', () => {
  it.each(['german', 'russian', 'polish'])(
    'copies the %s character with only the first given name as image text',
    async (category) => {
      const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', { clipboard: { writeText } })
      const { wrapper } = setup(category)
      const button = wrapper.get('[title="Copy image prompt"]')
      await button.trigger('click')
      await flushPromises()
      const prompt = writeText.mock.calls[0]![0] as string
      expect(prompt).toBe(neverMidnightImagePrompt(result))
      expect(prompt).toContain('Given name to include in the image: "Anna-Lena"')
      expect(prompt).not.toContain('Maria')
      expect(prompt).not.toContain('Schulze')
      expect(prompt).toContain('Age: 34 years')
      expect(prompt).toContain('Appearance: Curly hair, wool coat')
      expect(prompt).toContain('Occupation: Archivist')
      expect(prompt).toContain('black-and-white')
      expect(prompt).toContain('East Berlin in 1986')
      expect(prompt).toContain('slightly blurry documentary print')
      expect(prompt).toContain('For this portrait, use this name treatment:')
      expect(prompt).toContain('expressive presence')
      expect(prompt).not.toContain('with a reserved expression')
      expect(button.classes()).toContain('pulse-a')
      expect(result.primary).toBe('Anna-Lena Maria Schulze')
      expect(wrapper.find('[title="Open in character sheet"]').exists()).toBe(false)
    },
  )

  it('varies name placement between characters and keeps repeat copies consistent', () => {
    const prompts = ['Ada', 'Eva', 'Olga', 'Marta'].map((primary) =>
      neverMidnightImagePrompt({ ...result, primary }),
    )
    expect(prompts.some((prompt) => prompt.includes('an incidental sign in the background'))).toBe(
      true,
    )
    for (const prompt of prompts) {
      expect(prompt).toContain('The person must not hold a sign, board, placard')
      expect(prompt).not.toContain('mugshot board held by the person')
      expect(prompt).not.toContain('hand-painted graffiti')
    }
    const tagPrompt = prompts.find((prompt) => prompt.includes('small paper or cloth name tag'))
    expect(tagPrompt).toContain('visibly handwritten in pen')
    expect(tagPrompt).toContain('mechanical typewriter')
    expect(tagPrompt).toContain('never a clean printed badge or digital font')
    expect(neverMidnightImagePrompt(result)).toBe(neverMidnightImagePrompt(result))
  })

  it('follows the existing mode and details controls', async () => {
    const { wrapper, preferences } = setup('german', false)
    expect(wrapper.find('[title="Copy image prompt"]').exists()).toBe(false)
    preferences.soullessCorpMode = true
    await flushPromises()
    expect(wrapper.find('[title="Copy image prompt"]').exists()).toBe(true)
    await wrapper.setProps({ showDetails: false })
    expect(wrapper.find('[title="Copy image prompt"]').exists()).toBe(false)
    await wrapper.setProps({ showDetails: true })
    expect(wrapper.find('[title="Copy image prompt"]').exists()).toBe(true)
    preferences.soullessCorpMode = false
    await flushPromises()
    expect(wrapper.find('[title="Copy image prompt"]').exists()).toBe(false)
  })

  it.each([
    ['spells', 'never-midnight'],
    ['german', 'cyberpunk'],
    ['unknown', 'never-midnight'],
  ])('omits the portrait action for %s in %s', (category, setting) => {
    const { wrapper } = setup(category, true, true, setting)
    expect(wrapper.find('[title="Copy image prompt"]').exists()).toBe(false)
  })

  it('reports clipboard failure and copies a replacement result without stale data', async () => {
    const writeText = vi
      .fn<(text: string) => Promise<void>>()
      .mockRejectedValueOnce(new Error('Denied'))
      .mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const { wrapper } = setup()
    await wrapper.get('[title="Copy image prompt"]').trigger('click')
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('Could not copy the image prompt')
    expect(wrapper.get('[title="Copy image prompt"]').classes()).not.toContain('pulse-a')
    await wrapper.setProps({
      results: [{ ...result, primary: 'Łukasz Kowalski', age: '51 years' }],
    })
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    await wrapper.get('[title="Copy image prompt"]').trigger('click')
    await flushPromises()
    expect(writeText.mock.calls[1]![0]).toContain('Given name to include in the image: "Łukasz"')
    expect(writeText.mock.calls[1]![0]).toContain('Age: 51 years')
    expect(writeText.mock.calls[1]![0]).not.toContain('Anna-Lena')
  })
})
