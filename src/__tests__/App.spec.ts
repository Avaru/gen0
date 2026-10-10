import { afterAll, beforeAll, beforeEach, describe, it, expect, vi } from 'vitest'
import { mockDialog } from './helpers/dialog'
import { mockMedia } from './helpers/media'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import GeneratorView from '../views/GeneratorView.vue'
import AboutView from '../views/AboutView.vue'

mockDialog()
const media = mockMedia()
const scroll = vi.fn<(options?: ScrollIntoViewOptions) => void>()
const originalScroll = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView')
beforeAll(() => Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: scroll,
}))
beforeEach(() => scroll.mockClear())
afterAll(() => {
  if (originalScroll) Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScroll)
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
})

async function chooseCategory(wrapper: ReturnType<typeof mount>, value: string) {
  await wrapper.get('#category').trigger('click')
  await wrapper.get(`[data-category="${value}"]`).trigger('click')
}

async function setup(url = '/') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: GeneratorView },
      { path: '/about', component: AboutView },
    ],
  })
  await router.push(url)
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('name generator interface', () => {
  it('falls back to Generic runners for a saved Birka fashion link', async () => {
    const { wrapper, router } = await setup('/?flavor=birka&category=fashion-items')
    expect(router.currentRoute.value.query).toEqual({ flavor: 'cyberpunk', category: 'runners' })
    expect(wrapper.find('input[name="flavor"][value="birka"]').exists()).toBe(false)
    expect(wrapper.find('[data-category="fashion-items"]').exists()).toBe(false)
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('reveals the first name on manual generation only when it is outside the viewport', async () => {
    const { wrapper } = await setup('/?category=german')
    expect(scroll).not.toHaveBeenCalled()
    const name = wrapper.get('li strong').element
    const bounds = vi.spyOn(name, 'getBoundingClientRect')
    try {
      bounds.mockReturnValue(new DOMRect(0, 100, 200, 30))
      await wrapper.get('form').trigger('submit')
      await flushPromises()
      expect(scroll).not.toHaveBeenCalled()

      bounds.mockReturnValue(new DOMRect(0, window.innerHeight - 10, 200, 30))
      await wrapper.get('form').trigger('submit')
      await flushPromises()
      expect(scroll.mock.contexts[scroll.mock.contexts.length - 1]).toBe(name)
      expect(scroll).toHaveBeenLastCalledWith({ block: 'nearest', behavior: 'smooth' })

      media.add('(prefers-reduced-motion: reduce)')
      bounds.mockReturnValue(new DOMRect(0, -40, 200, 30))
      await wrapper.get('form').trigger('submit')
      await flushPromises()
      expect(scroll).toHaveBeenLastCalledWith({ block: 'nearest', behavior: 'instant' })
    } finally {
      bounds.mockRestore()
      wrapper.unmount()
    }
  })

  it('keeps desktop category choices in place, including choosing the current category', async () => {
    media.add('(min-width: 56rem)')
    const { wrapper, router } = await setup('/?category=german')
    for (const category of ['corporations', 'corporations', 'german']) {
      await chooseCategory(wrapper, category)
      await flushPromises()
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
      expect(router.currentRoute.value.query.category).toBe(category)
      expect(wrapper.findAll('li')).toHaveLength(10)
      expect(scroll).not.toHaveBeenCalled()
    }
    wrapper.unmount()
  })

  it('scrolls to Generate on smaller screens after a category choice, including choosing the current category', async () => {
    const { wrapper, router } = await setup('/?category=german')
    expect(scroll).not.toHaveBeenCalled()
    await wrapper.get('#category').trigger('click')
    await wrapper.get('.close').trigger('click')
    expect(scroll).not.toHaveBeenCalled()
    await chooseCategory(wrapper, 'corporations')
    await flushPromises()
    await vi.waitFor(() => expect(scroll).toHaveBeenCalled())
    expect(router.currentRoute.value.query.category).toBe('corporations')
    expect(wrapper.find('input[name="size"]').exists()).toBe(true)
    expect(scroll.mock.contexts[scroll.mock.contexts.length - 1]).toBe(wrapper.get('button[type="submit"]').element)
    expect(scroll).toHaveBeenLastCalledWith({ block: 'start', behavior: 'smooth' })
    scroll.mockClear()
    router.back()
    await flushPromises()
    expect(scroll).not.toHaveBeenCalled()
    media.add('(prefers-reduced-motion: reduce)')
    await chooseCategory(wrapper, 'german')
    await flushPromises()
    await vi.waitFor(() => expect(scroll).toHaveBeenLastCalledWith({ block: 'start', behavior: 'instant' }))
    wrapper.unmount()
  })

  it('scrolls to the first new name after each appended batch', async () => {
    const { wrapper } = await setup('/?category=german&details=false')
    const original = wrapper.findAll('li').map(item => item.text())
    await wrapper.get('button.secondary').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('li').slice(0, 10).map(item => item.text())).toEqual(original)
    expect(scroll.mock.contexts[scroll.mock.contexts.length - 1]).toBe(wrapper.findAll('li')[10]!.element)
    expect(scroll).toHaveBeenLastCalledWith({ block: 'start', behavior: 'smooth' })
    await wrapper.get('button.secondary').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('li')).toHaveLength(30)
    expect(scroll.mock.contexts[scroll.mock.contexts.length - 1]).toBe(wrapper.findAll('li')[20]!.element)
    wrapper.unmount()
  })

  it('opens About and returns with the selected settings and theme, including a direct link', async () => {
    const { wrapper, router } = await setup('/?flavor=cyberpunk2020-2077&category=german&gender=f&details=false')
    const query = { ...router.currentRoute.value.query }
    await wrapper.get('nav a').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/about')
    expect(wrapper.get('h1').text()).toBe('About gen 0')
    expect(wrapper.text()).toContain('Anton Katzer')
    expect(wrapper.get('.shell').attributes('data-theme')).toBe('cyberpunk2077')
    expect(wrapper.find('#category').exists()).toBe(false)
    await wrapper.get('nav a').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/')
    expect(router.currentRoute.value.query).toEqual(query)
    expect(wrapper.findAll('li')).toHaveLength(10)
    wrapper.unmount()

    const direct = await setup('/about')
    expect(direct.wrapper.text()).toContain('Anton Katzer')
    expect(direct.wrapper.get('nav a').attributes('href')).toBe('/')
    direct.wrapper.unmount()
  })

  it('restores flavor themes from links, selection changes, and Back/Forward', async () => {
    const { wrapper, router } = await setup('/?flavor=cyberpunk2020-2077&category=runners')
    const theme = () => wrapper.get('.shell').attributes('data-theme')
    expect(theme()).toBe('cyberpunk2077')
    await wrapper.get('input[name="flavor"][value="shadowrun"]').setValue(true)
    await flushPromises()
    expect(theme()).toBe('cyberpunk')
    router.back()
    await flushPromises()
    expect(theme()).toBe('cyberpunk2077')
    router.forward()
    await flushPromises()
    expect(theme()).toBe('cyberpunk')
    await wrapper.get('input[name="flavor"][value="cyberpunk"]').setValue(true)
    await flushPromises()
    expect(theme()).toBe('cyberpunk')
    wrapper.unmount()

    const restored = await setup('/?flavor=unknown&category=runners')
    expect(restored.wrapper.get('.shell').attributes('data-theme')).toBe('cyberpunk')
    restored.wrapper.unmount()
  })

  it('restores a continent link, switches its group with the flavor, and returns through history', async () => {
    const { wrapper, router } = await setup('/?category=continent-oceania&gender=f')
    expect(wrapper.get('#category').text()).toContain('Oceania')
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(wrapper.text()).toContain('Some name pools are still TODO: Māori, Aboriginal Australian')
    await wrapper.get('#category').trigger('click')
    const groups = wrapper.findAll('h3').map(item => item.text())
    expect(groups).toContain('Names by continent')
    expect(groups).not.toContain('Names by sovereignty')
    expect(groups[groups.length - 1]).toBe('Names by nationality')
    expect(wrapper.findAll('[data-category]').filter(item =>
      item.attributes('data-category') === 'mixed' || item.attributes('data-category') === 'us-american',
    ).map(item => item.attributes('data-category'))).toEqual(['mixed', 'us-american'])
    await wrapper.get('[aria-label="Close category picker"]').trigger('click')
    await wrapper.get('input[name="flavor"][value="shadowrun"]').setValue(true)
    await flushPromises()
    expect(router.currentRoute.value.query.category).toBe('runners')
    await wrapper.get('#category').trigger('click')
    expect(wrapper.find('[data-category="continent-oceania"]').exists()).toBe(false)
    expect(wrapper.find('[data-category="sovereignty-ucas"]').exists()).toBe(true)
    await wrapper.get('[aria-label="Close category picker"]').trigger('click')
    router.back()
    await flushPromises()
    expect(router.currentRoute.value.query.category).toBe('continent-oceania')
    expect(router.currentRoute.value.query.gender).toBe('f')
    expect(wrapper.findAll('li')).toHaveLength(10)
    wrapper.unmount()
  })

  it('changes the sovereignty list and selected labels with the flavor and restores history', async () => {
    const { wrapper, router } = await setup('/?flavor=shadowrun&category=sovereignty-japan&gender=f')
    expect(wrapper.get('#category').text()).toContain('Japanese Imperial State')
    expect(wrapper.findAll('li')).toHaveLength(10)
    await wrapper.get('#category').trigger('click')
    expect(wrapper.find('[data-category="sovereignty-ucas"]').exists()).toBe(true)
    expect(wrapper.find('[data-category="sovereignty-nusa"]').exists()).toBe(false)
    await wrapper.get('[aria-label="Close category picker"]').trigger('click')
    await wrapper.get('input[name="flavor"][value="cyberpunk2020-2077"]').setValue(true)
    await flushPromises()
    expect(wrapper.get('#category').text()).toContain('Japan')
    expect(router.currentRoute.value.query.category).toBe('sovereignty-japan')
    await wrapper.get('#category').trigger('click')
    expect(wrapper.find('[data-category="sovereignty-nusa"]').exists()).toBe(true)
    expect(wrapper.find('[data-category="sovereignty-ucas"]').exists()).toBe(false)
    await wrapper.get('[data-category="sovereignty-nusa"]').trigger('click')
    await flushPromises()
    router.back()
    await flushPromises()
    router.back()
    await flushPromises()
    expect(wrapper.get('#category').text()).toContain('Japanese Imperial State')
    await wrapper.get('input[name="flavor"][value="cyberpunk"]').setValue(true)
    await flushPromises()
    expect(router.currentRoute.value.query.category).toBe('runners')
    await wrapper.get('#category').trigger('click')
    expect(wrapper.text()).not.toContain('Names by sovereignty')
    wrapper.unmount()
  })

  it('explains missing pools and restores TODO entries from links', async () => {
    const { wrapper } = await setup('/?flavor=shadowrun&category=sovereignty-native-american-nations')
    expect(wrapper.text()).toContain('Some name pools are still TODO: Salish')
    expect(wrapper.findAll('li')).toHaveLength(10)
    await chooseCategory(wrapper, 'salish')
    await flushPromises()
    expect(wrapper.get('#category').text()).toContain('Salish TODO')
    expect(wrapper.get('[role="alert"]').text()).toContain('pool is empty')
    expect(wrapper.findAll('li')).toHaveLength(0)
    wrapper.unmount()
  })

  it('restores the Mixed category and its gender selection from the URL', async () => {
    const { wrapper, router } = await setup('/?category=mixed&gender=f')
    expect(wrapper.get('#category').attributes('data-value')).toBe('mixed')
    expect(wrapper.get('button[data-category="mixed"] > span').text()).toBe('Mixed')
    expect((wrapper.get('input[name="gender"][value="f"]').element as HTMLInputElement).checked).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    await chooseCategory(wrapper, 'german')
    await flushPromises()
    router.back()
    await flushPromises()
    expect(router.currentRoute.value.query.category).toBe('mixed')
    expect(router.currentRoute.value.query.gender).toBe('f')
    expect(wrapper.findAll('li')).toHaveLength(10)
    wrapper.unmount()
  })

  it('generates ten names immediately, appends ten, and replaces them when settings change', async () => {
    const { wrapper, router } = await setup()
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(wrapper.find('#count').exists()).toBe(false)
    expect(router.currentRoute.value.query.count).toBeUndefined()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    await wrapper.get('button.secondary').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('li')).toHaveLength(20)
    await wrapper.get('input[name="flavor"][value="shadowrun"]').setValue(true)
    await flushPromises()
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(router.currentRoute.value.query.flavor).toBe('shadowrun')
    wrapper.unmount()
  })

  it('offers one combined Cyberpunk setting and resets unavailable categories', async () => {
    const { wrapper, router } = await setup()
    expect(
      wrapper.findAll('input[name="flavor"]').map((input) => input.attributes('value')),
    ).toEqual(['cyberpunk', 'shadowrun', 'cyberpunk2020-2077'])
    expect(wrapper.find('button[data-category="known-corporations"]').exists()).toBe(false)
    await wrapper.get('input[name="flavor"][value="cyberpunk2020-2077"]').setValue(true)
    await flushPromises()
    await chooseCategory(wrapper, 'known-corporations')
    await flushPromises()
    await wrapper.get('input[name="flavor"][value="cyberpunk"]').setValue(true)
    await flushPromises()
    expect(wrapper.get('#category').attributes('data-value')).toBe('corporations')
    expect(router.currentRoute.value.query.category).toBe('corporations')
    expect(wrapper.findAll('select')).toHaveLength(0)
    wrapper.unmount()
  })

  it('checks every option by default, removes Any, and prevents clearing the last choice', async () => {
    const { wrapper, router } = await setup('/?category=german')
    expect(wrapper.findAll('input[name="gender"]')).toHaveLength(2)
    expect(wrapper.findAll('input[name="gender"]').every(input =>
      (input.element as HTMLInputElement).checked)).toBe(true)
    expect(wrapper.text()).not.toContain('Any')
    await wrapper.get('input[name="gender"][value="m"]').setValue(false)
    await flushPromises()
    expect(router.currentRoute.value.query.gender).toBe('f')
    expect((wrapper.get('input[name="gender"][value="f"]').element as HTMLInputElement).disabled).toBe(true)
    await wrapper.get('input[name="gender"][value="f"]').trigger('click')
    await flushPromises()
    expect((wrapper.get('input[name="gender"][value="f"]').element as HTMLInputElement).checked).toBe(true)
    await wrapper.get('input[name="gender"][value="m"]').setValue(true)
    await flushPromises()
    expect(router.currentRoute.value.query.gender).toBeUndefined()
    expect((wrapper.get('input[name="gender"][value="f"]').element as HTMLInputElement).disabled).toBe(false)
    wrapper.unmount()
  })

  it('restores multiple sizes, normalizes duplicates and invalid values, and preserves history', async () => {
    const { wrapper, router } = await setup('/?category=corporations&size=aaa,a,a,invalid')
    expect(router.currentRoute.value.query.size).toBe('a,aaa')
    expect((wrapper.get('input[name="size"][value="aa"]').element as HTMLInputElement).checked).toBe(false)
    await wrapper.get('input[name="size"][value="a"]').setValue(false)
    await flushPromises()
    expect(router.currentRoute.value.query.size).toBe('aaa')
    expect((wrapper.get('input[name="size"][value="aaa"]').element as HTMLInputElement).disabled).toBe(true)
    router.back()
    await flushPromises()
    expect(router.currentRoute.value.query.size).toBe('a,aaa')
    router.forward()
    await flushPromises()
    expect(router.currentRoute.value.query.size).toBe('aaa')
    wrapper.unmount()
    const restored = await setup('/?category=corporations&size=aaa')
    expect((restored.wrapper.get('input[name="size"][value="aaa"]').element as HTMLInputElement).checked).toBe(true)
    expect((restored.wrapper.get('input[name="size"][value="a"]').element as HTMLInputElement).checked).toBe(false)
    restored.wrapper.unmount()
  })

  it('restores links and history, and removes irrelevant options', async () => {
    const { wrapper, router } = await setup('/?flavor=shadowrun&category=german&gender=f&count=3')
    expect(
      (wrapper.get('input[name="gender"][value="f"]').element as HTMLInputElement).checked,
    ).toBe(true)
    expect(router.currentRoute.value.query.count).toBeUndefined()
    expect(wrapper.findAll('li')).toHaveLength(10)
    await chooseCategory(wrapper, 'corporations')
    await flushPromises()
    expect(wrapper.find('input[name="gender"]').exists()).toBe(false)
    expect(wrapper.find('input[name="size"]').exists()).toBe(true)
    expect(router.currentRoute.value.query.gender).toBeUndefined()
    router.back()
    await flushPromises()
    expect(router.currentRoute.value.query.category).toBe('german')
    expect(
      (wrapper.get('input[name="gender"][value="f"]').element as HTMLInputElement).checked,
    ).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(10)
    router.forward()
    await flushPromises()
    expect(router.currentRoute.value.query.category).toBe('corporations')
    wrapper.unmount()
  })

  it('toggles details without changing names and keeps the choice across categories and history', async () => {
    const { wrapper, router } = await setup('/?category=german')
    const names = wrapper.findAll('strong').map((item) => item.text())
    expect(wrapper.findAll('.name div').length).toBeGreaterThan(0)
    await wrapper.get('input[type="checkbox"]:not([name])').setValue(false)
    await flushPromises()
    expect(wrapper.findAll('.name div')).toHaveLength(0)
    expect(wrapper.findAll('strong').map((item) => item.text())).toEqual(names)
    expect(router.currentRoute.value.query.details).toBe('false')
    await chooseCategory(wrapper, 'corporations')
    await flushPromises()
    expect(wrapper.findAll('.name div')).toHaveLength(0)
    expect((wrapper.get('input[type="checkbox"]:not([name])').element as HTMLInputElement).checked).toBe(false)
    const corporationNames = wrapper.findAll('strong').map((item) => item.text())
    await wrapper.get('input[type="checkbox"]:not([name])').setValue(true)
    await flushPromises()
    expect(wrapper.findAll('.name div').length).toBeGreaterThan(0)
    expect(wrapper.findAll('strong').map((item) => item.text())).toEqual(corporationNames)
    router.back()
    await flushPromises()
    expect(wrapper.findAll('.name div')).toHaveLength(0)
    expect(wrapper.findAll('strong').map((item) => item.text())).toEqual(corporationNames)
    wrapper.unmount()
  })

  it('restores hidden details from a link', async () => {
    const { wrapper } = await setup('/?category=german&details=false')
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(wrapper.findAll('.name div')).toHaveLength(0)
    expect((wrapper.get('input[type="checkbox"]:not([name])').element as HTMLInputElement).checked).toBe(false)
    wrapper.unmount()
  })

  it('normalizes unsupported links and ignores legacy batch sizes', async () => {
    const { wrapper, router } = await setup(
      '/?flavor=unknown&category=known-corporations&size=invalid&count=1000',
    )
    expect(router.currentRoute.value.query).toEqual({
      flavor: 'cyberpunk',
      category: 'corporations',
    })
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(wrapper.find('#count').exists()).toBe(false)
    wrapper.unmount()
  })

  it('regenerates when gender or size changes and keeps status announcements out of the visible layout', async () => {
    const { wrapper, router } = await setup('/?category=german')
    expect(wrapper.get('fieldset legend').text()).toBe('Flavor')
    expect(wrapper.get('a[href="#main"]').text()).toBe('Skip to generator')
    await wrapper.get('input[name="gender"][value="m"]').setValue(false)
    await flushPromises()
    expect(router.currentRoute.value.query.gender).toBe('f')
    expect(wrapper.findAll('li')).toHaveLength(10)
    await chooseCategory(wrapper, 'corporations')
    await flushPromises()
    await wrapper.get('input[name="size"][value="a"]').setValue(false)
    await flushPromises()
    await wrapper.get('input[name="size"][value="aa"]').setValue(false)
    await flushPromises()
    expect(router.currentRoute.value.query.size).toBe('aaa')
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(wrapper.get('.status').text()).toBe('Names updated.')
    expect(wrapper.text()).not.toMatch(/\d+ names(?: ready)?/)
    expect(wrapper.find('.number').exists()).toBe(false)
    wrapper.unmount()
  })
})
