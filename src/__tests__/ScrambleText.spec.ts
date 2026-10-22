// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { themeKey, type Theme } from '@/styles/themes'
import { createMemoryHistory, createRouter } from 'vue-router'
import UiScrambleText from '@/components/ui/UiScrambleText.vue'
import UiSymbolText from '@/components/ui/UiSymbolText.vue'
import UiBrandTitle from '@/components/ui/UiBrandTitle.vue'
import UiButton from '@/components/ui/UiButton.vue'
import { createTestPinia } from './helpers/pinia'
import GeneratorResults from '@/components/generator/GeneratorResults.vue'
import GeneratorControls from '@/components/generator/GeneratorControls.vue'
import { normalizeGeneratorSettings } from '@/generator/settings'

enableAutoUnmount(afterEach)
let reduced: boolean
let listeners: Set<() => void>
let frames: Map<number, FrameRequestCallback>
let frameId: number
const requestFrame = vi.fn<(callback: FrameRequestCallback) => number>()

beforeEach(() => {
  reduced = false
  listeners = new Set()
  frames = new Map()
  frameId = 0
  vi.spyOn(performance, 'now').mockReturnValue(0)
  vi.spyOn(Math, 'random').mockReturnValue(0)
  requestFrame.mockReset().mockImplementation((callback) => {
    frames.set(++frameId, callback)
    return frameId
  })
  vi.stubGlobal('requestAnimationFrame', requestFrame)
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reduced
    },
    addEventListener: (_event: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_event: string, listener: () => void) => listeners.delete(listener),
  }))
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

async function advance(time: number) {
  const pending = [...frames.values()]
  frames.clear()
  pending.forEach((callback) => callback(time))
  await nextTick()
}

describe('scrambled name reveal', () => {
  it('keeps the Generate names label steady and replays background feedback without delaying generation', async () => {
    const wrapper = mount(GeneratorControls, {
      attachTo: document.body,
      props: { settings: normalizeGeneratorSettings({}), busy: false },
    })
    await nextTick()
    const button = wrapper.get('button[type="submit"]')
    expect(button.text()).toBe('Generate names')
    expect(button.find('.overlay').exists()).toBe(false)
    await button.trigger('click')
    expect(wrapper.emitted('generate')).toHaveLength(1)
    expect(button.find('.overlay').exists()).toBe(false)
    expect(button.classes()).toContain('pulse-a')
    expect(button.text()).toBe('Generate names')
    await wrapper.setProps({ busy: true })
    expect(button.attributes('aria-busy')).toBe('true')
    expect(button.attributes('disabled')).toBeDefined()
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('generate')).toHaveLength(1)
    await wrapper.setProps({ busy: false })
    await advance(320)
    expect(button.find('.overlay').exists()).toBe(false)
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('generate')).toHaveLength(2)
    expect(button.find('.overlay').exists()).toBe(false)
    expect(button.classes()).toContain('pulse-b')
  })

  it('generates without scrambling the button when reduced motion is enabled', async () => {
    reduced = true
    const wrapper = mount(GeneratorControls, {
      props: { settings: normalizeGeneratorSettings({}), busy: false },
    })
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('generate')).toHaveLength(1)
    expect(wrapper.get('button[type="submit"]').text()).toBe('Generate names')
    expect(wrapper.find('.overlay').exists()).toBe(false)
    expect(requestFrame).not.toHaveBeenCalled()
  })

  it('reveals every detail field with its name and keeps finished detail text available throughout', async () => {
    const result = {
      primary: 'Neon Fox',
      secondary: 'Decker',
      age: 'Age: 28',
      appearance: 'Chrome eyes',
      details: 'Works alone',
      rating: 0,
    }
    const wrapper = mount(GeneratorResults, {
      global: { plugins: [createTestPinia()] },
      props: {
        results: [result, { ...result }],
        busy: false,
        label: 'Names',
        error: '',
        showDetails: true,
      },
    })
    await nextTick()
    const rows = wrapper.findAll('li')
    const expected = [
      'Neon Fox',
      'Decker',
      'Age: 28',
      'Chrome eyes',
      'Works alone',
      'Rating: 0.0 / 5',
    ]
    for (const row of rows) {
      expect(row.findAll('.source').map((source) => source.text())).toEqual(expected)
      expect(row.findAll('.overlay')).toHaveLength(6)
    }
    await advance(140)
    expect(rows[0]!.findAll('.overlay')).toHaveLength(0)
    expect(rows[1]!.findAll('.overlay')).toHaveLength(6)
    await advance(300)
    expect(wrapper.find('.overlay').exists()).toBe(false)
    await wrapper.setProps({ showDetails: false })
    expect(wrapper.findAllComponents(UiScrambleText)).toHaveLength(2)
    await wrapper.setProps({ showDetails: true })
    expect(wrapper.findAll('strong .overlay')).toHaveLength(0)
    expect(wrapper.findAll('.name div .overlay')).toHaveLength(10)
  })

  it('keeps the runner archetype in the secondary row regardless of the details toggle', async () => {
    reduced = true
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div />' } }],
    })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(GeneratorResults, {
      global: { plugins: [createTestPinia(), router] },
      props: {
        results: [
          {
            primary: 'Neon Fox',
            secondary: 'Martial Artist',
            appearance: 'Chrome eyes',
            details: 'Works alone',
          },
        ],
        category: 'runners',
        busy: false,
        label: 'Runners',
        error: '',
        showDetails: true,
      },
    })
    await wrapper.setProps({ showDetails: false })
    expect(wrapper.findAll('.source').map((source) => source.text())).toEqual([
      'Neon Fox',
      'Martial Artist',
    ])
    expect(wrapper.get('.secondary').text()).toBe('Martial Artist')
    await wrapper.setProps({ showDetails: true })
    expect(wrapper.findAll('.source').map((source) => source.text())).toEqual([
      'Neon Fox',
      'Martial Artist',
      'Chrome eyes',
      'Works alone',
    ])
    expect(wrapper.get('.secondary').text()).toBe('Martial Artist')
  })

  it('shows all detail fields immediately without animation under reduced motion', async () => {
    reduced = true
    const wrapper = mount(GeneratorResults, {
      global: { plugins: [createTestPinia()] },
      props: {
        results: [
          {
            primary: 'Neon Fox',
            secondary: 'Decker',
            age: 'Age: 28',
            appearance: 'Chrome eyes',
            details: 'Works alone',
            rating: 4,
          },
        ],
        busy: false,
        label: 'Names',
        error: '',
        showDetails: true,
      },
    })
    await nextTick()
    expect(wrapper.findAll('.source')).toHaveLength(6)
    expect(wrapper.find('.overlay').exists()).toBe(false)
    await wrapper.setProps({ showDetails: false })
    await wrapper.setProps({ showDetails: true })
    expect(wrapper.find('.overlay').exists()).toBe(false)
    expect(requestFrame).not.toHaveBeenCalled()
  })

  it('resolves letters while keeping the real, selectable name separate from hidden decoration', async () => {
    const wrapper = mount(UiScrambleText, { props: { text: 'Neon Fox', duration: 500 } })
    await nextTick()
    expect(wrapper.get('.source').text()).toBe('Neon Fox')
    expect(wrapper.get('.overlay').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('.overlay').attributes('data-garbled')).toBe('AAAA AAA')
    expect(wrapper.text()).toBe('Neon Fox')
    await advance(250)
    expect(wrapper.get('.overlay').attributes('data-resolved')).toBe('Neon')
    expect(wrapper.get('.overlay').attributes('data-garbled')).toBe(' AAA')
    await advance(500)
    expect(wrapper.find('.overlay').exists()).toBe(false)
    expect(wrapper.text()).toBe('Neon Fox')
    expect(frames.size).toBe(0)
  })

  it('never starts or restarts an animation when reduced motion is enabled', async () => {
    reduced = true
    const wrapper = mount(UiScrambleText, { props: { text: 'Neon Fox', delay: 200 } })
    await nextTick()
    expect(wrapper.find('.overlay').exists()).toBe(false)
    expect(wrapper.text()).toBe('Neon Fox')
    await wrapper.setProps({ text: 'Chrome Ghost', replayKey: {} })
    expect(wrapper.text()).toBe('Chrome Ghost')
    expect(wrapper.find('.overlay').exists()).toBe(false)
    expect(requestFrame).not.toHaveBeenCalled()
  })

  it('stops immediately when reduced motion is enabled during a reveal', async () => {
    const wrapper = mount(UiScrambleText, { props: { text: 'Neon Fox' } })
    await nextTick()
    expect(wrapper.find('.overlay').exists()).toBe(true)
    reduced = true
    listeners.forEach((listener) => listener())
    await nextTick()
    expect(wrapper.find('.overlay').exists()).toBe(false)
    expect(wrapper.text()).toBe('Neon Fox')
    expect(frames.size).toBe(0)
    reduced = false
    listeners.forEach((listener) => listener())
    await nextTick()
    expect(wrapper.find('.overlay').exists()).toBe(false)
  })

  it('cancels earlier frames on replacement and cleans up on unmount', async () => {
    const wrapper = mount(UiScrambleText, { props: { text: 'Neon Fox' } })
    await nextTick()
    await advance(250)
    await wrapper.setProps({ text: 'Chrome Ghost' })
    expect(frames.size).toBe(1)
    expect(wrapper.text()).toBe('Chrome Ghost')
    await advance(550)
    expect(wrapper.find('.overlay').exists()).toBe(false)
    await wrapper.setProps({ replayKey: {} })
    expect(frames.size).toBe(1)
    wrapper.unmount()
    expect(frames.size).toBe(0)
    expect(listeners.size).toBe(0)
  })

  it('animates appended names without replaying existing names, and replays rerolls even with the same spelling', async () => {
    const original = { primary: 'Neon Fox' }
    const wrapper = mount(GeneratorResults, {
      global: { plugins: [createTestPinia()] },
      props: { results: [original], busy: false, label: 'Names', error: '', showDetails: false },
    })
    await advance(700)
    await wrapper.setProps({ results: [original, { primary: 'Chrome Ghost' }] })
    const names = wrapper.findAllComponents(UiScrambleText)
    expect(names[0]!.find('.overlay').exists()).toBe(false)
    expect(names[1]!.find('.overlay').exists()).toBe(true)
    await wrapper.setProps({ results: [{ primary: 'Neon Fox' }] })
    expect(wrapper.getComponent(UiScrambleText).find('.overlay').exists()).toBe(true)
  })

  it('resolves the first name quickly, then later names in order, restarting the timing for each batch', async () => {
    const wrapper = mount(GeneratorResults, {
      global: { plugins: [createTestPinia()] },
      props: {
        results: Array.from({ length: 12 }, () => ({ primary: 'Neon Fox' })),
        busy: false,
        label: 'Names',
        error: '',
        showDetails: false,
      },
    })
    await nextTick()
    const names = wrapper.findAllComponents(UiScrambleText)
    await advance(140)
    expect(names[0]!.find('.overlay').exists()).toBe(false)
    expect(names[10]!.find('.overlay').exists()).toBe(false)
    expect(names[1]!.find('.overlay').exists()).toBe(true)
    expect(names[9]!.get('.overlay').attributes('data-garbled')).toBe('AAAA AAA')
    await advance(300)
    expect(names[1]!.find('.overlay').exists()).toBe(false)
    expect(names[11]!.find('.overlay').exists()).toBe(false)
    expect(names[2]!.find('.overlay').exists()).toBe(true)
    await advance(340)
    expect(names[2]!.find('.overlay').exists()).toBe(false)
    await advance(620)
    expect(wrapper.find('.overlay').exists()).toBe(false)
  })
})

describe('Never Midnight typing reveal', () => {
  it('types real letters without garbling, holds the cursor, and finishes', async () => {
    const wrapper = mount(UiScrambleText, {
      props: { text: 'Anna Wolf', duration: 320 },
      global: { provide: { [themeKey as symbol]: ref<Theme>('never-midnight') } },
    })
    await nextTick()
    expect(wrapper.get('.source').text()).toBe('Anna Wolf')
    expect(wrapper.get('.overlay').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('.overlay').classes()).toContain('typing')
    await advance(112)
    expect(wrapper.get('.overlay').attributes('data-resolved')).toBe('Anna')
    expect(wrapper.get('.overlay').attributes('data-garbled')).toBe('')
    await advance(224)
    expect(wrapper.get('.overlay').attributes('data-resolved')).toBe('Anna Wolf')
    await advance(474)
    expect(wrapper.find('.overlay').exists()).toBe(false)
  })

  it('updates the animation when the theme changes and stops for reduced motion', async () => {
    const theme = ref<Theme>('cyberpunk')
    const wrapper = mount(UiScrambleText, {
      props: { text: 'Anna Wolf' },
      global: { provide: { [themeKey as symbol]: theme } },
    })
    await nextTick()
    expect(wrapper.get('.overlay').classes()).not.toContain('typing')
    theme.value = 'never-midnight'
    await nextTick()
    expect(wrapper.get('.overlay').classes()).toContain('typing')
    expect(wrapper.get('.overlay').attributes('data-garbled')).toBe('')
    reduced = true
    listeners.forEach((listener) => listener())
    await nextTick()
    expect(wrapper.find('.overlay').exists()).toBe(false)
    expect(wrapper.get('.source').text()).toBe('Anna Wolf')
    expect(frames.size).toBe(0)
  })
})

describe('Never Midnight symbol animation', () => {
  it('supports the shared button prop, updated labels, and disabled buttons', async () => {
    const label = ref('Add spell')
    const button = mount(UiButton, {
      props: { garble: true },
      slots: { default: () => label.value },
    })
    await button.trigger('mouseenter')
    expect(button.get('.symbol-source').text()).toBe('Add spell')
    expect(button.find('.symbol-overlay').exists()).toBe(true)
    label.value = 'Add sacrifice'
    await nextTick()
    expect(button.get('.symbol-source').text()).toBe('Add sacrifice')
    await button.setProps({ disabled: true })
    await button.trigger('mouseenter')
    expect(button.find('.symbol-overlay').exists()).toBe(false)
    expect(button.text()).toBe('Add sacrifice')
    await button.setProps({ disabled: false, garble: false })
    await button.trigger('focus')
    expect(button.findComponent(UiSymbolText).exists()).toBe(false)
  })

  it('preserves icon button content and allows opting out in Never Midnight', async () => {
    const global = { provide: { [themeKey as symbol]: ref<Theme>('never-midnight') } }
    const icon = mount(UiButton, {
      global,
      slots: { default: '<svg aria-hidden="true"><path d="M0 0h1" /></svg>' },
    })
    await icon.trigger('mouseenter')
    expect(icon.find('svg path').exists()).toBe(true)
    expect(icon.findComponent(UiSymbolText).exists()).toBe(false)
    const plain = mount(UiButton, {
      global,
      props: { garble: false },
      slots: { default: 'Banish' },
    })
    await plain.trigger('mouseenter')
    expect(plain.text()).toBe('Banish')
    expect(plain.findComponent(UiSymbolText).exists()).toBe(false)
  })

  it('keeps the accessible source, changes glyphs, finishes and replays', async () => {
    const wrapper = mount(UiSymbolText, { props: { text: 'gen 0', autoplay: true } })
    await nextTick()
    expect(wrapper.get('.symbol-source').text()).toBe('gen 0')
    expect(wrapper.get('.symbol-overlay').attributes('aria-hidden')).toBe('true')
    expect(wrapper.findAll('.glyph').map((glyph) => glyph.text())).toEqual(['Ж', 'e', 'n', '', '0'])
    vi.mocked(Math.random).mockReturnValue(0.6)
    await advance(100)
    expect(wrapper.findAll('.glyph')[0]!.text()).not.toBe('Ж')
    await advance(420)
    expect(wrapper.find('.symbol-overlay').exists()).toBe(false)
    await wrapper.setProps({ replayKey: 1 })
    expect(wrapper.find('.symbol-overlay').exists()).toBe(true)
  })

  it.each([0, 0.5, 0.999])(
    'replaces only two letters with Cyrillic for random value %s',
    async (random) => {
      vi.mocked(Math.random).mockReturnValue(random)
      const text = 'Generate names'
      const wrapper = mount(UiSymbolText, { props: { text, autoplay: true } })
      await nextTick()
      const selected = wrapper.findAll('.replaced')
      expect(selected).toHaveLength(2)
      for (const cell of selected) expect(cell.get('.glyph').text()).toMatch(/^[А-Я]$/u)
      const initialPositions = wrapper
        .findAll('.cell')
        .map((cell) => cell.classes().includes('replaced'))
      await advance(100)
      expect(wrapper.findAll('.cell').map((cell) => cell.classes().includes('replaced'))).toEqual(
        initialPositions,
      )
      const unchanged = wrapper
        .findAll('.cell')
        .filter((cell) => !cell.classes().includes('replaced'))
      for (const cell of unchanged)
        expect(cell.get('.glyph').text()).toBe(cell.get('.measure').text())
      expect(wrapper.get('.symbol-source').text()).toBe(text)
    },
  )

  it('animates the Never Midnight brand and button interactions only', async () => {
    const theme = ref<Theme>('never-midnight')
    const global = { provide: { [themeKey as symbol]: theme } }
    const brand = mount(UiBrandTitle, { global })
    const button = mount(UiButton, {
      global,
      slots: { default: 'Generate names' },
    })
    await nextTick()
    expect(brand.find('.symbol-overlay').exists()).toBe(true)
    expect(button.find('.symbol-overlay').exists()).toBe(false)
    await button.trigger('mouseenter')
    expect(button.find('.symbol-overlay').exists()).toBe(true)
    await advance(420)
    await button.trigger('focus')
    expect(button.find('.symbol-overlay').exists()).toBe(true)
    await advance(420)
    await button.setProps({ activation: 1 })
    expect(button.find('.symbol-overlay').exists()).toBe(true)
    await advance(420)
    await brand.trigger('pointerdown')
    expect(brand.find('.symbol-overlay').exists()).toBe(true)
    theme.value = 'cyberpunk'
    await nextTick()
    expect(brand.findComponent(UiSymbolText).exists()).toBe(false)
    expect(button.findComponent(UiSymbolText).exists()).toBe(false)
    expect(button.text()).toBe('Generate names')
  })

  it('skips symbol animation for reduced motion', async () => {
    reduced = true
    const wrapper = mount(UiSymbolText, { props: { text: 'gen 0', autoplay: true } })
    await nextTick()
    await wrapper.setProps({ replayKey: 1 })
    expect(wrapper.find('.symbol-overlay').exists()).toBe(false)
    expect(wrapper.text()).toBe('gen 0')
    expect(requestFrame).not.toHaveBeenCalled()
  })
})
