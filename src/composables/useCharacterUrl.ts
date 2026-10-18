import { inject, onScopeDispose, ref, watch, nextTick } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'
import { useCharacterStore } from '@/stores/character'
import { encodeCharacter } from '@/helper/characterLink'

export function useCharacterUrl() {
  const route = inject(routeLocationKey, undefined)
  const router = inject(routerKey, undefined)
  const character = useCharacterStore()
  const error = ref('')
  if (!route || !router) return error

  let disposed = false
  const writtenTokens = new Set<string>()

  async function updateUrl() {
    if (disposed || route!.path !== '/chars/cbrpnk') return
    try {
      const token = encodeCharacter(character.sheet)
      if (token === route!.query.character || writtenTokens.has(token)) return
      // Our own navigation must not reload an older sheet over newer typing.
      writtenTokens.add(token)
      try {
        await router!.replace({
          path: route!.path,
          query: { ...route!.query, character: token },
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
  watch(() => character.sheet, updateUrl, { deep: true, flush: 'post' })

  watch(
    () => [route.path, route.query.character],
    () => {
      if (route.path !== '/chars/cbrpnk') return
      const token = route.query.character
      if (typeof token === 'string' && writtenTokens.has(token)) return
      error.value = ''
      if (token === undefined) {
        void nextTick(updateUrl)
        return
      }
      try {
        if (typeof token !== 'string') throw new Error('Invalid character link')
        character.loadCharacterToken(token)
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
