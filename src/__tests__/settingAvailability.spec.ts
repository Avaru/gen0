// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => vi.resetModules())

describe('Never Midnight build flag', () => {
  it.each([undefined, '', 'false', 'true'])(
    'registers the setting and its routes only when the flag is true (%s)',
    async (value) => {
      vi.stubEnv('VITE_ENABLE_NEVER_MIDNIGHT', value)
      vi.resetModules()
      const { settings, getSetting } = await import('@/generator/settingRegistry')
      const { routes } = await import('@/router')
      const enabled = value === 'true'
      expect(settings.some((setting) => setting.id === 'never-midnight')).toBe(enabled)
      expect(getSetting('never-midnight').id).toBe(enabled ? 'never-midnight' : 'cyberpunk')
      expect(routes.filter((route) => route.path.startsWith('/never-midnight'))).toHaveLength(
        enabled ? 2 : 0,
      )
    },
  )
})
