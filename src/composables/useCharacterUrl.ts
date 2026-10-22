import { inject, onScopeDispose, ref, watch, nextTick } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'

export function useCharacterUrl<T>(options: {
  path: string
  sheet: () => T
  encode: (sheet: T) => string
  load: (token: string) => void
}) {
  const route = inject(routeLocationKey, undefined)
  const router = inject(routerKey, undefined)
  const error = ref('')
  if (!route || !router) return error

  let disposed = false
  const writtenTokens = new Set<string>()

  async function updateUrl() {
    if (disposed || route!.path !== options.path) return
    try {
      const token = options.encode(options.sheet())
      if (token === route!.query.char || writtenTokens.has(token)) return
      // Our own navigation must not reload an older sheet over newer typing.
      writtenTokens.add(token)
      try {
        await router!.replace({
          path: route!.path,
          query: { ...route!.query, char: token },
          hash: route!.hash,
        })
        error.value = ''
      } finally {
        writtenTokens.delete(token)
      }
    } catch {
      error.value = 'Could not update the character URL. Your current character has been kept.'
    }
  }
  watch(options.sheet, updateUrl, { deep: true, flush: 'post' })

  watch(
    () => [route.path, route.query.char],
    () => {
      if (route.path !== options.path) return
      const token = route.query.char
      if (typeof token === 'string' && writtenTokens.has(token)) return
      error.value = ''
      if (token === undefined) {
        void nextTick(updateUrl)
        return
      }
      try {
        if (typeof token !== 'string') throw new Error('Invalid character link')
        options.load(token)
      } catch {
        error.value = 'Could not load this character URL. Your current character has been kept.'
      }
    },
    { immediate: true, flush: 'sync' },
  )

  onScopeDispose(() => {
    disposed = true
  })
  return error
}
