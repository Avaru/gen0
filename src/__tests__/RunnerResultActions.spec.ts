// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import GeneratorResults from '@/components/generator/GeneratorResults.vue'
import AboutView from '@/views/AboutView.vue'
import CharacterView from '@/views/CharacterView.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { useCharacterStore } from '@/stores/character'
import { runnerImagePrompt } from '@/helper/runnerImagePrompt'
import { decodeCharacter } from '@/helper/characterLink'
import { flavors, type Flavor } from '@/generator/options'
import { createTestPinia } from './helpers/pinia'
import { mockMedia } from './helpers/media'
import { mockDialog } from './helpers/dialog'
import * as probability from '@/helper/prob'

mockMedia()
enableAutoUnmount(afterEach)
mockDialog()
beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

const result = {
  primary: 'Echo',
  secondary: 'Veteran Hacker',
  details: 'By day: Lee, Lawyer',
  appearance: '32 Years, grey hair, teal coat',
  archetypeId: 'hacker',
  angle: 'Learn the truth',
}
const runner = {
  alias: result.primary,
  description: `${result.details}\n${result.appearance}`,
  archetypeId: result.archetypeId,
  angle: result.angle,
}

async function setup(category = 'runners', showDetails = true, flavor: Flavor = 'cyberpunk') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/:flavor/:category',
        component: GeneratorResults,
        props: {
          results: [result],
          category,
          showDetails,
          busy: false,
          label: 'Results',
          error: '',
        },
      },
      { path: '/chars/cbrpnk', meta: { flavor: 'cyberpunk' }, component: CharacterView },
    ],
  })
  await router.push(`/${flavor}/${category}`)
  const pinia = createTestPinia()
  const wrapper = mount({ template: '<RouterView />' }, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router, pinia }
}

describe('runner result actions', () => {
  it('keeps prompt buttons hidden until the mode is enabled, on results and the sheet', async () => {
    const { wrapper, router, pinia } = await setup()
    const preferences = usePreferencesStore(pinia)
    expect(preferences.soullessCorpMode).toBe(false)
    expect(wrapper.find('[title="Copy image prompt"]').exists()).toBe(false)
    preferences.soullessCorpMode = true
    await flushPromises()
    expect(wrapper.find('[title="Copy image prompt"]').exists()).toBe(true)
    await wrapper.get('[aria-label="Open Echo in character sheet"]').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/chars/cbrpnk')
    expect(wrapper.find('[title="Copy image prompt"]').exists()).toBe(true)
    preferences.soullessCorpMode = false
    await flushPromises()
    expect(wrapper.find('[title="Copy image prompt"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('enables after three toggles within five seconds, saves it and disables immediately', async () => {
    const pinia = createTestPinia()
    const wrapper = mount(AboutView, { global: { plugins: [pinia] } })
    const toggle = wrapper.get('input[aria-label="soulless corp mode"]')
    expect(toggle.element).toHaveProperty('checked', false)
    const now = vi.spyOn(performance, 'now').mockReturnValue(0)
    await toggle.setValue(true)
    expect(toggle.element).toHaveProperty('checked', true)
    expect(usePreferencesStore(pinia).soullessCorpMode).toBe(false)
    now.mockReturnValue(2500)
    await toggle.setValue(false)
    expect(usePreferencesStore(pinia).soullessCorpMode).toBe(false)
    now.mockReturnValue(5000)
    await toggle.setValue(true)
    expect(localStorage.getItem('gen0.soullessCorpMode')).toBe('true')
    wrapper.unmount()
    const restored = mount(AboutView, { global: { plugins: [createTestPinia()] } })
    expect(restored.get('input').element).toHaveProperty('checked', true)
    await restored.get('input').setValue(false)
    expect(localStorage.getItem('gen0.soullessCorpMode')).toBe('false')
    restored.unmount()
    expect(usePreferencesStore(createTestPinia()).soullessCorpMode).toBe(false)
  })

  it('ignores toggles older than five seconds and requires the gesture again after disabling', async () => {
    const now = vi.spyOn(performance, 'now').mockReturnValue(0)
    const pinia = createTestPinia()
    const preferences = usePreferencesStore(pinia)
    const wrapper = mount(AboutView, { global: { plugins: [pinia] } })
    const toggle = wrapper.get('input[aria-label="soulless corp mode"]')
    await toggle.setValue(true)
    now.mockReturnValue(2500)
    await toggle.setValue(false)
    now.mockReturnValue(5001)
    await toggle.setValue(true)
    expect(preferences.soullessCorpMode).toBe(false)
    now.mockReturnValue(6000)
    await toggle.setValue(false)
    await toggle.setValue(true)
    expect(preferences.soullessCorpMode).toBe(true)
    await toggle.setValue(false)
    expect(preferences.soullessCorpMode).toBe(false)
    await toggle.setValue(true)
    expect(preferences.soullessCorpMode).toBe(false)
  })

  it('copies the same prompt as the sheet with a stable angle, without changing saved character data', async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const { wrapper, pinia } = await setup()
    usePreferencesStore(pinia).soullessCorpMode = true
    await flushPromises()
    const character = useCharacterStore(pinia)
    character.sheet.runner.alias = 'Existing runner'
    const before = JSON.stringify(character.sheet)
    const button = wrapper.get('[aria-label="Copy image prompt for Echo"]')
    await button.trigger('click')
    await flushPromises()
    expect(button.classes()).toContain('pulse-a')
    await button.trigger('click')
    await flushPromises()
    expect(button.classes()).toContain('pulse-b')
    expect(writeText).toHaveBeenCalledTimes(2)
    expect(writeText.mock.calls[0]![0]).toBe(runnerImagePrompt(runner))
    expect(writeText.mock.calls[1]![0]).toBe(writeText.mock.calls[0]![0])
    expect(JSON.stringify(character.sheet)).toBe(before)
    expect(wrapper.text()).not.toContain('Image prompt copied.')
    wrapper.unmount()
  })

  it.each(flavors)(
    'opens the $label runner with its identity, angle and matching profile in a fresh Generic sheet',
    async ({ id }) => {
      vi.spyOn(probability, 'p').mockReturnValue(false)
      const { wrapper, router, pinia } = await setup('runners', true, id)
      const character = useCharacterStore(pinia)
      character.sheet.runner.alias = 'Previous runner'
      character.sheet.stress = 5
      character.sheet.gear.selected = ['Sidearm']
      await wrapper.get('[aria-label="Open Echo in character sheet"]').trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/chars/cbrpnk')
      expect(Object.keys(router.currentRoute.value.query)).toEqual(['character'])
      expect(character.sheet.runner).toEqual(runner)
      expect(decodeCharacter(router.currentRoute.value.query.character as string)).toEqual(
        character.sheet,
      )
      expect(character.sheet.stress).toBe(0)
      expect(character.sheet.gear.selected).toEqual([])
      expect(character.sheet.attributeRatings.some((row) => (row.value ?? 0) > 0)).toBe(true)
      expect(
        character.sheet.skillRatings.find((row) => row.definitionId === 'cbr-pnk.skill.coding')
          ?.value,
      ).toBe(2)
      expect(character.sheet.augmentations[0]!.description).not.toBe('')
      expect(wrapper.get('#runner-alias').element).toHaveProperty('value', 'Echo')
      expect(wrapper.get('input[name="runner-angle"]:checked').attributes('value')).toBe(
        result.angle,
      )
      wrapper.unmount()
    },
  )

  it.each([
    ['runners', false],
    ['people', true],
  ])('omits runner actions for category %s with details %s', async (category, showDetails) => {
    const { wrapper } = await setup(category, showDetails)
    expect(wrapper.find('.runner-actions').exists()).toBe(false)
    wrapper.unmount()
  })
})
