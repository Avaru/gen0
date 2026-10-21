// @vitest-environment jsdom

import { afterEach, afterAll, beforeAll, beforeEach, describe, it, expect, vi } from 'vitest'
import { mockDialog } from './helpers/dialog'
import { mockMedia } from './helpers/media'
import { enableAutoUnmount, mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import { routes as appRoutes } from '../router'
import GeneratorView from '../views/GeneratorView.vue'
import AboutView from '../views/AboutView.vue'
import CharacterView from '../views/CharacterView.vue'
import { neverMidnightEnabled } from '@/generator/settingRegistry'
import { createTestPinia as createPinia } from './helpers/pinia'

enableAutoUnmount(afterEach)
mockDialog()
const media = mockMedia()
const scroll = vi.fn<(options?: ScrollIntoViewOptions) => void>()
const originalScroll = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView')
beforeAll(() =>
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: scroll,
  }),
)
let scrollTo: ReturnType<typeof vi.spyOn>
beforeEach(() => {
  localStorage.clear()
  scroll.mockClear()
  scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})
afterAll(() => {
  scrollTo.mockRestore()
  if (originalScroll) Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScroll)
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
})

async function chooseCategory(wrapper: ReturnType<typeof mount>, value: string) {
  await wrapper.get('#category').trigger('click')
  await wrapper.get(`[data-category="${value}"]`).trigger('click')
}

const routes = appRoutes.map((route) =>
  route.redirect
    ? route
    : {
        path: route.path,
        meta: route.meta,
        component: route.path.endsWith('/about')
          ? AboutView
          : route.path === '/chars/cbrpnk'
            ? CharacterView
            : GeneratorView,
      },
)

async function setup(url = '/', attachTo?: HTMLElement) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })
  await router.push(url)
  await router.isReady()
  const wrapper = mount(App, { attachTo, global: { plugins: [createPinia(), router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('name generator interface', () => {
  it.skipIf(neverMidnightEnabled)(
    'hides the setting picker when only Cyberpunk is registered',
    async () => {
      const { wrapper } = await setup('/cyberpunk/shadowrun/runners')
      expect(wrapper.find('nav button[aria-haspopup="dialog"]').exists()).toBe(false)
      expect(wrapper.find('nav dialog').exists()).toBe(false)
      expect(wrapper.find('nav a[href="/chars/cbrpnk"]').exists()).toBe(true)
      wrapper.unmount()
    },
  )

  it.runIf(neverMidnightEnabled)(
    'changes to Never Midnight and restores Cyberpunk with browser Back',
    async () => {
      const { wrapper, router } = await setup('/cyberpunk/shadowrun/runners', document.body)
      const trigger = wrapper.get('nav button[aria-haspopup="dialog"]')
      await trigger.trigger('click')
      const dialog = wrapper.get('nav dialog')
      expect((dialog.element as HTMLDialogElement).open).toBe(true)
      expect(document.activeElement).toBe(dialog.get('.close').element)
      await dialog.get('[data-setting="cyberpunk"]').trigger('click')
      await flushPromises()
      expect(document.activeElement).toBe(trigger.element)
      expect(router.currentRoute.value.path).toBe('/cyberpunk/shadowrun/runners')
      await trigger.trigger('click')
      await wrapper.get('[data-setting="never-midnight"]').trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/never-midnight/german')
      expect(wrapper.get('[data-theme]').attributes('data-theme')).toBe('never-midnight')
      expect(wrapper.find('nav a[href="/chars/cbrpnk"]').exists()).toBe(false)
      expect(wrapper.find('input[name="flavor"]').exists()).toBe(false)
      expect(wrapper.get('header .caption').text()).toBe('Never Midnight / Name generator')
      expect(wrapper.findAll('li')).toHaveLength(10)
      await chooseCategory(wrapper, 'polish')
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/never-midnight/polish')
      router.back()
      await flushPromises()
      router.back()
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/cyberpunk/shadowrun/runners')
      expect(wrapper.get('[data-theme]').attributes('data-theme')).toBe('cyberpunk')
      expect(wrapper.find('nav a[href="/chars/cbrpnk"]').exists()).toBe(true)
      wrapper.unmount()
    },
  )

  it.runIf(neverMidnightEnabled)(
    'restores Never Midnight country and name forms from a direct link',
    async () => {
      const { wrapper, router } = await setup('/never-midnight/russian?gender=f&flavor=shadowrun')
      expect(router.currentRoute.value.fullPath).toBe('/never-midnight/russian?gender=f')
      expect(wrapper.get('[data-theme]').attributes('data-theme')).toBe('never-midnight')
      expect(wrapper.get('#results-heading').text()).toBe('Russian')
      expect(wrapper.findAll('li')).toHaveLength(10)
      expect(wrapper.find('input[name="gender"][value="f"]').element).toHaveProperty(
        'checked',
        true,
      )
      wrapper.unmount()
    },
  )

  it.each(['generic', 'shadowrun', 'cp77'])(
    'restores the %s flavor from its short URL',
    async (flavor) => {
      const path = `/cyberpunk/${flavor}/german?gender=f`
      const { wrapper, router } = await setup(path)
      expect(router.currentRoute.value.fullPath).toBe(path)
      const value =
        flavor === 'generic' ? 'cyberpunk' : flavor === 'cp77' ? 'cyberpunk2020-2077' : flavor
      expect(wrapper.get(`input[name="flavor"][value="${value}"]`).element).toHaveProperty(
        'checked',
        true,
      )
      wrapper.unmount()
    },
  )

  it('scrolls to the top only for top-menu navigation, including the current page', async () => {
    const { wrapper, router } = await setup('/cyberpunk/generic/german', document.body)
    const focus = vi.spyOn(wrapper.get('main').element as HTMLElement, 'focus')
    try {
      expect(scrollTo).not.toHaveBeenCalled()
      await chooseCategory(wrapper, 'russian')
      await flushPromises()
      expect(scrollTo).not.toHaveBeenCalled()
      for (const label of ['About', 'CBR+PNK', 'CBR+PNK', 'About', 'Name generator']) {
        const link = wrapper.findAll('nav a').find((link) => link.text() === label)!
        await link.trigger('click')
        await flushPromises()
        expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: 'instant' })
      }
      expect(scrollTo).toHaveBeenCalledTimes(5)
      expect(focus).toHaveBeenLastCalledWith({ preventScroll: true })
      scrollTo.mockClear()
      router.back()
      await flushPromises()
      router.forward()
      await flushPromises()
      expect(scrollTo).not.toHaveBeenCalled()
      expect(focus).toHaveBeenLastCalledWith({ preventScroll: true })
      // Block jsdom's default document navigation after the app has handled the event.
      wrapper.element.addEventListener('click', (event: Event) => event.preventDefault(), {
        once: true,
      })
      await wrapper.get('nav a').trigger('click', { ctrlKey: true })
      await flushPromises()
      expect(scrollTo).not.toHaveBeenCalled()
    } finally {
      focus.mockRestore()
      wrapper.unmount()
    }
  })

  it.each([
    ['/cyberpunk/generic/german?gender=f', '/chars/cbrpnk'],
    ['/cyberpunk/shadowrun/corporations?size=a', '/chars/cbrpnk'],
    ['/cyberpunk/cp77/german?gender=f', '/chars/cbrpnk'],
  ])('switches to Generic from %s when opening the sheet', async (url, expected) => {
    const { wrapper, router } = await setup(url)
    const link = wrapper.findAll('nav a').find((item) => item.text() === 'CBR+PNK')!
    expect(link.attributes('href')).toBe(expected)
    await link.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe(expected)
    expect(typeof router.currentRoute.value.query.char).toBe('string')
    expect(wrapper.get('[data-theme]').attributes('data-theme')).toBe('cyberpunk')
    expect(wrapper.find('nav a[href="/cyberpunk/generic/runners"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('opens the character sheet in Generic, retains edits across navigation, and returns to Generic', async () => {
    const { wrapper, router } = await setup('/cyberpunk/cp77/german?gender=f', document.body)
    try {
      await wrapper.get('nav a[href="/chars/cbrpnk"]').trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/chars/cbrpnk')
      expect(wrapper.get('[data-theme]').attributes('data-theme')).toBe('cyberpunk')
      expect(document.activeElement).toBe(wrapper.get('main').element)
      const rating = '[aria-label="Aggressive rating 2"]'
      await wrapper.get(rating).setValue(true)
      await wrapper.get('nav a[href$="/runners/about"]').trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.query.char).toBeUndefined()
      await wrapper.get('nav a[href="/chars/cbrpnk"]').trigger('click')
      await flushPromises()
      expect(wrapper.get(rating).element).toHaveProperty('checked', true)
      expect(wrapper.get('[aria-label="Aggressive rating 1"]').element).toHaveProperty(
        'checked',
        true,
      )
      await wrapper.get('nav a').trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.fullPath).toBe('/cyberpunk/generic/runners')
    } finally {
      wrapper.unmount()
    }
  })
  it.each(['shadowrun', 'cyberpunk2020-2077'])(
    'keeps the sheet Generic when a direct link or query update requests %s',
    async (flavor) => {
      const { wrapper, router } = await setup(`/chars/cbrpnk?flavor=${flavor}`)
      expect(wrapper.get('[data-theme]').attributes('data-theme')).toBe('cyberpunk')
      expect(wrapper.find('nav a[href="/cyberpunk/generic/runners"]').exists()).toBe(true)
      await router.replace({ path: '/chars/cbrpnk', query: { flavor: 'cyberpunk2020-2077' } })
      await flushPromises()
      expect(wrapper.get('[data-theme]').attributes('data-theme')).toBe('cyberpunk')
      wrapper.unmount()
    },
  )
  it('supports an empty character sheet on a direct /chars/cbrpnk link', async () => {
    const { wrapper } = await setup('/chars/cbrpnk')
    expect(wrapper.get('h1').text()).toBe('CBR+PNK Runner sheet')
    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(wrapper.get('header .caption').text()).toBe('CBR+PNK Runner sheet')
    expect(wrapper.find('form h1').exists()).toBe(false)
    expect(wrapper.get('[aria-label="Aggressive rating 1"]').element).toHaveProperty(
      'checked',
      false,
    )
    expect(wrapper.get('[aria-label="Aggressive rating 2"]').element).toHaveProperty(
      'checked',
      false,
    )
    wrapper.unmount()
  })
  it.each(['/about', '/cyberpunk/shadowrun/german/about'])(
    'does not focus content when loading %s',
    async (url) => {
      const history = createMemoryHistory()
      history.push(url)
      const router = createRouter({
        history,
        routes,
      })
      // Mount before the initial navigation finishes, as in main.ts.
      const wrapper = mount(App, {
        attachTo: document.body,
        global: { plugins: [createPinia(), router] },
      })
      try {
        await router.isReady()
        await flushPromises()
        expect(wrapper.get('h1').text()).toBe('About gen 0')
        expect(document.activeElement).toBe(document.body)
      } finally {
        wrapper.unmount()
      }
    },
  )
  it('focuses new page content while keeping focus on controls for setting changes', async () => {
    const { wrapper, router } = await setup('/cyberpunk/generic/german', document.body)
    try {
      const flavor = wrapper.get('input[name="flavor"][value="cyberpunk"]')
        .element as HTMLInputElement
      flavor.focus()
      await router.push('/cyberpunk/generic/russian')
      await flushPromises()
      expect(document.activeElement).toBe(flavor)
      await wrapper.get('nav a').trigger('click')
      await flushPromises()
      expect(wrapper.get('h1').text()).toBe('About gen 0')
      expect(document.activeElement).toBe(wrapper.get('main').element)
      await wrapper.get('nav a').trigger('click')
      await flushPromises()
      expect(document.activeElement).toBe(wrapper.get('main').element)
      router.back()
      await flushPromises()
      expect(wrapper.get('h1').text()).toBe('About gen 0')
      expect(document.activeElement).toBe(wrapper.get('main').element)
    } finally {
      wrapper.unmount()
    }
  })
  it('restores path settings and query options on direct links and fresh app loads', async () => {
    const url = '/cyberpunk/shadowrun/german?gender=f&flavor=cyberpunk&category=corporations'
    const { wrapper, router } = await setup(url)
    expect(router.currentRoute.value.fullPath).toBe('/cyberpunk/shadowrun/german?gender=f')
    expect(wrapper.get('input[name="flavor"][value="shadowrun"]').element).toHaveProperty(
      'checked',
      true,
    )
    expect(wrapper.findAll('li')).toHaveLength(10)
    const saved = router.currentRoute.value.fullPath
    wrapper.unmount()
    const reloaded = await setup(saved)
    expect(reloaded.router.currentRoute.value.fullPath).toBe(saved)
    expect(reloaded.wrapper.get('input[name="gender"][value="f"]').element).toHaveProperty(
      'checked',
      true,
    )
    reloaded.wrapper.unmount()
  })

  it('normalizes incomplete and unsupported paths using existing fallbacks', async () => {
    for (const [url, expected] of [
      ['/cyberpunk/shadowrun', '/cyberpunk/shadowrun/runners'],
      ['/cyberpunk/generic/known-corporations', '/cyberpunk/generic/corporations'],
      ['/cyberpunk/generic/missing', '/cyberpunk/generic/runners'],
      ['/cyberpunk/generic/about', '/cyberpunk/generic/runners'],
    ]) {
      const { wrapper, router } = await setup(url)
      expect(router.currentRoute.value.fullPath).toBe(expected)
      expect(wrapper.findAll('li')).toHaveLength(10)
      wrapper.unmount()
    }
  })

  it('falls back to Generic runners for a saved Birka fashion link', async () => {
    const { wrapper, router } = await setup('/?flavor=birka&category=fashion-items')
    expect(router.currentRoute.value.path).toBe('/cyberpunk/generic/runners')
    expect(router.currentRoute.value.query).toEqual({})
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
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      expect(router.currentRoute.value.params.category).toBe(category)
      expect(wrapper.findAll('li')).toHaveLength(10)
      expect(scroll).not.toHaveBeenCalled()
    }
    wrapper.unmount()
  })

  it('keeps phone category choices in place, including choosing the current category', async () => {
    const { wrapper, router } = await setup('/cyberpunk/generic/german')
    await wrapper.get('#category').trigger('click')
    await wrapper.get('.close').trigger('click')
    expect(scroll).not.toHaveBeenCalled()
    for (const category of ['corporations', 'corporations', 'german']) {
      await chooseCategory(wrapper, category)
      await flushPromises()
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      expect(router.currentRoute.value.params.category).toBe(category)
      expect(wrapper.findAll('li')).toHaveLength(10)
      expect(scroll).not.toHaveBeenCalled()
    }
    router.back()
    await flushPromises()
    expect(scroll).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('adds twenty names at the bottom without moving the viewport or replacing existing names', async () => {
    const height = vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2000)
    const position = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)
    const { wrapper } = await setup('/cyberpunk/generic/german')
    try {
      expect(wrapper.text()).not.toContain('Generate more')
      const original = wrapper.findAll('li').map((item) => item.text())
      position.mockReturnValue(100)
      window.dispatchEvent(new Event('scroll'))
      await flushPromises()
      expect(wrapper.findAll('li')).toHaveLength(10)

      position.mockReturnValue(2000 - window.innerHeight)
      window.dispatchEvent(new Event('scroll'))
      window.dispatchEvent(new Event('scroll'))
      await flushPromises()
      expect(wrapper.findAll('li')).toHaveLength(30)
      expect(
        wrapper
          .findAll('li')
          .slice(0, 10)
          .map((item) => item.text()),
      ).toEqual(original)
      expect(scroll).not.toHaveBeenCalled()

      height.mockReturnValue(4000)
      position.mockReturnValue(2000 - window.innerHeight - 100)
      window.dispatchEvent(new Event('scroll'))
      await flushPromises()
      expect(wrapper.findAll('li')).toHaveLength(30)
      position.mockReturnValue(4000 - window.innerHeight)
      window.dispatchEvent(new Event('scroll'))
      await flushPromises()
      expect(wrapper.findAll('li')).toHaveLength(50)
      expect(scroll).not.toHaveBeenCalled()
      await chooseCategory(wrapper, 'corporations')
      await flushPromises()
      expect(wrapper.findAll('li')).toHaveLength(10)
    } finally {
      wrapper.unmount()
      height.mockRestore()
      position.mockRestore()
    }
  })

  it('opens About and returns with the selected settings and theme, including a direct link', async () => {
    const { wrapper, router } = await setup(
      '/?flavor=cyberpunk2020-2077&category=german&gender=f&details=false',
    )
    const query = { ...router.currentRoute.value.query }
    await wrapper.get('nav a').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/cyberpunk/cp77/german/about')
    expect(wrapper.get('h1').text()).toBe('About gen 0')
    expect(wrapper.text()).toContain('Anton Katzer')
    expect(wrapper.get('.shell').attributes('data-theme')).toBe('cyberpunk')
    expect(wrapper.find('#category').exists()).toBe(false)
    await wrapper.get('nav a').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/cyberpunk/cp77/german')
    expect(router.currentRoute.value.query).toEqual(query)
    expect(wrapper.findAll('li')).toHaveLength(10)
    wrapper.unmount()

    const direct = await setup('/about')
    expect(direct.wrapper.text()).toContain('Anton Katzer')
    expect(direct.wrapper.get('nav a').attributes('href')).toBe('/cyberpunk/generic/runners')
    direct.wrapper.unmount()
  })

  it('keeps the shared appearance while restoring flavors from links and Back/Forward', async () => {
    const { wrapper, router } = await setup('/?flavor=cyberpunk2020-2077&category=runners')
    const theme = () => wrapper.get('.shell').attributes('data-theme')
    expect(theme()).toBe('cyberpunk')
    await wrapper.get('input[name="flavor"][value="shadowrun"]').setValue(true)
    await flushPromises()
    expect(theme()).toBe('cyberpunk')
    router.back()
    await flushPromises()
    expect(theme()).toBe('cyberpunk')
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
    const groups = wrapper.findAll('h3').map((item) => item.text())
    expect(groups).toContain('Names by continent')
    expect(groups).not.toContain('Names by sovereignty')
    expect(groups[groups.length - 1]).toBe('Names by nationality')
    expect(
      wrapper
        .findAll('[data-category]')
        .filter(
          (item) =>
            item.attributes('data-category') === 'mixed' ||
            item.attributes('data-category') === 'us-american',
        )
        .map((item) => item.attributes('data-category')),
    ).toEqual(['mixed', 'us-american'])
    await wrapper.get('[aria-label="Close category picker"]').trigger('click')
    await wrapper.get('input[name="flavor"][value="shadowrun"]').setValue(true)
    await flushPromises()
    expect(router.currentRoute.value.params.category).toBe('runners')
    await wrapper.get('#category').trigger('click')
    expect(wrapper.find('[data-category="continent-oceania"]').exists()).toBe(false)
    expect(wrapper.find('[data-category="sovereignty-ucas"]').exists()).toBe(true)
    await wrapper.get('[aria-label="Close category picker"]').trigger('click')
    router.back()
    await flushPromises()
    expect(router.currentRoute.value.params.category).toBe('continent-oceania')
    expect(router.currentRoute.value.query.gender).toBe('f')
    expect(wrapper.findAll('li')).toHaveLength(10)
    wrapper.unmount()
  })

  it('changes the sovereignty list and selected labels with the flavor and restores history', async () => {
    const { wrapper, router } = await setup(
      '/?flavor=shadowrun&category=sovereignty-japan&gender=f',
    )
    expect(wrapper.get('#category').text()).toContain('Japanese Imperial State')
    expect(wrapper.findAll('li')).toHaveLength(10)
    await wrapper.get('#category').trigger('click')
    expect(wrapper.find('[data-category="sovereignty-ucas"]').exists()).toBe(true)
    expect(wrapper.find('[data-category="sovereignty-nusa"]').exists()).toBe(false)
    await wrapper.get('[aria-label="Close category picker"]').trigger('click')
    await wrapper.get('input[name="flavor"][value="cyberpunk2020-2077"]').setValue(true)
    await flushPromises()
    expect(wrapper.get('#category').text()).toContain('Japan')
    expect(router.currentRoute.value.params.category).toBe('sovereignty-japan')
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
    expect(router.currentRoute.value.params.category).toBe('runners')
    await wrapper.get('#category').trigger('click')
    expect(wrapper.text()).not.toContain('Names by sovereignty')
    wrapper.unmount()
  })

  it('explains missing pools and restores TODO entries from links', async () => {
    const { wrapper } = await setup(
      '/?flavor=shadowrun&category=sovereignty-native-american-nations',
    )
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
    expect(wrapper.get('#category').text()).toBe('Mixed')
    expect(
      (wrapper.get('input[name="gender"][value="f"]').element as HTMLInputElement).checked,
    ).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    await chooseCategory(wrapper, 'german')
    await flushPromises()
    router.back()
    await flushPromises()
    expect(router.currentRoute.value.params.category).toBe('mixed')
    expect(router.currentRoute.value.query.gender).toBe('f')
    expect(wrapper.findAll('li')).toHaveLength(10)
    wrapper.unmount()
  })

  it('generates ten names immediately and replaces them when settings change', async () => {
    const { wrapper, router } = await setup()
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(wrapper.find('#count').exists()).toBe(false)
    expect(router.currentRoute.value.query.count).toBeUndefined()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    await wrapper.get('input[name="flavor"][value="shadowrun"]').setValue(true)
    await flushPromises()
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(router.currentRoute.value.params.flavor).toBe('shadowrun')
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
    expect(router.currentRoute.value.params.category).toBe('corporations')
    expect(wrapper.findAll('select')).toHaveLength(0)
    wrapper.unmount()
  })

  it('checks every option by default and selects the other gender when clearing the last choice', async () => {
    const { wrapper, router } = await setup('/?category=german')
    expect(wrapper.findAll('input[name="gender"]')).toHaveLength(2)
    expect(
      wrapper
        .findAll('input[name="gender"]')
        .every((input) => (input.element as HTMLInputElement).checked),
    ).toBe(true)
    expect(wrapper.text()).not.toContain('Any')
    await wrapper.get('input[name="gender"][value="m"]').setValue(false)
    await flushPromises()
    expect(router.currentRoute.value.query.gender).toBe('f')
    expect(
      wrapper
        .findAll('input[name="gender"]')
        .every((input) => !(input.element as HTMLInputElement).disabled),
    ).toBe(true)
    await wrapper.get('input[name="gender"][value="f"]').setValue(false)
    await flushPromises()
    expect(router.currentRoute.value.query.gender).toBe('m')
    expect(
      (wrapper.get('input[name="gender"][value="f"]').element as HTMLInputElement).checked,
    ).toBe(false)
    expect(
      (wrapper.get('input[name="gender"][value="m"]').element as HTMLInputElement).checked,
    ).toBe(true)
    await wrapper.get('input[name="gender"][value="m"]').setValue(false)
    await flushPromises()
    expect(router.currentRoute.value.query.gender).toBe('f')
    expect(
      (wrapper.get('input[name="gender"][value="f"]').element as HTMLInputElement).checked,
    ).toBe(true)
    expect(
      (wrapper.get('input[name="gender"][value="m"]').element as HTMLInputElement).checked,
    ).toBe(false)
    await wrapper.get('input[name="gender"][value="m"]').setValue(true)
    await flushPromises()
    expect(router.currentRoute.value.query.gender).toBeUndefined()
    expect(
      (wrapper.get('input[name="gender"][value="f"]').element as HTMLInputElement).disabled,
    ).toBe(false)
    wrapper.unmount()
  })

  it('restores multiple sizes, normalizes duplicates and invalid values, and preserves history', async () => {
    const { wrapper, router } = await setup('/?category=corporations&size=aaa,a,a,invalid')
    expect(router.currentRoute.value.query.size).toBe('a,aaa')
    expect(
      (wrapper.get('input[name="size"][value="aa"]').element as HTMLInputElement).checked,
    ).toBe(false)
    await wrapper.get('input[name="size"][value="a"]').setValue(false)
    await flushPromises()
    expect(router.currentRoute.value.query.size).toBe('aaa')
    expect(
      wrapper
        .findAll('input[name="size"]')
        .every((input) => !(input.element as HTMLInputElement).disabled),
    ).toBe(true)
    await wrapper.get('input[name="size"][value="aaa"]').setValue(false)
    await flushPromises()
    expect(router.currentRoute.value.query.size).toBe('a,aa')
    expect(
      (wrapper.get('input[name="size"][value="aaa"]').element as HTMLInputElement).checked,
    ).toBe(false)
    expect((wrapper.get('input[name="size"][value="a"]').element as HTMLInputElement).checked).toBe(
      true,
    )
    expect(
      (wrapper.get('input[name="size"][value="aa"]').element as HTMLInputElement).checked,
    ).toBe(true)
    router.back()
    await flushPromises()
    expect(router.currentRoute.value.query.size).toBe('aaa')
    router.back()
    await flushPromises()
    expect(router.currentRoute.value.query.size).toBe('a,aaa')
    router.forward()
    await flushPromises()
    expect(router.currentRoute.value.query.size).toBe('aaa')
    router.forward()
    await flushPromises()
    expect(router.currentRoute.value.query.size).toBe('a,aa')
    wrapper.unmount()
    const restored = await setup('/?category=corporations&size=a,aa')
    expect(
      (restored.wrapper.get('input[name="size"][value="aaa"]').element as HTMLInputElement).checked,
    ).toBe(false)
    expect(
      (restored.wrapper.get('input[name="size"][value="a"]').element as HTMLInputElement).checked,
    ).toBe(true)
    expect(
      (restored.wrapper.get('input[name="size"][value="aa"]').element as HTMLInputElement).checked,
    ).toBe(true)
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
    expect(router.currentRoute.value.params.category).toBe('german')
    expect(
      (wrapper.get('input[name="gender"][value="f"]').element as HTMLInputElement).checked,
    ).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(10)
    router.forward()
    await flushPromises()
    expect(router.currentRoute.value.params.category).toBe('corporations')
    wrapper.unmount()
  })

  it('toggles details without changing names and keeps the choice across categories and history', async () => {
    const { wrapper, router } = await setup('/?category=german')
    const query = { ...router.currentRoute.value.query }
    const names = wrapper.findAll('strong').map((item) => item.text())
    expect(wrapper.findAll('.name div').length).toBeGreaterThan(0)
    await wrapper.get('input[type="checkbox"]:not([name])').setValue(false)
    await flushPromises()
    expect(wrapper.findAll('.name div')).toHaveLength(0)
    expect(wrapper.findAll('strong').map((item) => item.text())).toEqual(names)
    expect(router.currentRoute.value.query).toEqual(query)
    await chooseCategory(wrapper, 'corporations')
    await flushPromises()
    expect(wrapper.findAll('.name div')).toHaveLength(0)
    expect(
      (wrapper.get('input[type="checkbox"]:not([name])').element as HTMLInputElement).checked,
    ).toBe(false)
    const corporationNames = wrapper.findAll('strong').map((item) => item.text())
    await wrapper.get('input[type="checkbox"]:not([name])').setValue(true)
    await flushPromises()
    expect(wrapper.findAll('.name div').length).toBeGreaterThan(0)
    expect(wrapper.findAll('strong').map((item) => item.text())).toEqual(corporationNames)
    router.back()
    await flushPromises()
    expect(router.currentRoute.value.params.category).toBe('german')
    expect(wrapper.findAll('.name div').length).toBeGreaterThan(0)
    expect(
      (wrapper.get('input[type="checkbox"]:not([name])').element as HTMLInputElement).checked,
    ).toBe(true)
    await wrapper.get('input[type="checkbox"]:not([name])').setValue(false)
    await wrapper.get('nav a').trigger('click')
    await flushPromises()
    await wrapper.get('nav a').trigger('click')
    await flushPromises()
    expect(
      (wrapper.get('input[type="checkbox"]:not([name])').element as HTMLInputElement).checked,
    ).toBe(false)
    wrapper.unmount()
  })

  it('ignores old details links and starts each app with details visible', async () => {
    const { wrapper, router } = await setup('/?category=german&details=false')
    expect(wrapper.findAll('li')).toHaveLength(10)
    expect(router.currentRoute.value.query.details).toBeUndefined()
    expect(wrapper.findAll('.name div').length).toBeGreaterThan(0)
    expect(
      (wrapper.get('input[type="checkbox"]:not([name])').element as HTMLInputElement).checked,
    ).toBe(true)
    wrapper.unmount()
  })

  it('normalizes unsupported links and ignores legacy batch sizes', async () => {
    const { wrapper, router } = await setup(
      '/?flavor=unknown&category=known-corporations&size=invalid&count=1000',
    )
    expect(router.currentRoute.value.path).toBe('/cyberpunk/generic/corporations')
    expect(router.currentRoute.value.query).toEqual({})
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
