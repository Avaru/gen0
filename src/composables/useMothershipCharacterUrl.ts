import { ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  decodeMothershipCharacter,
  encodeMothershipCharacter,
  type MothershipSheet,
} from '@/helper/mothershipCharacterLink'

export function useMothershipCharacterUrl(sheet: Ref<MothershipSheet | undefined>) {
  const route = useRoute()
  const router = useRouter()
  const error = ref('')
  const writtenTokens = new Set<string>()
  const active = () => route.meta.setting === 'mothership' && route.params.category === 'generic'

  watch(
    () => [route.path, route.query.char],
    () => {
      error.value = ''
      if (!active()) return
      const token = route.query.char
      if (typeof token === 'string' && writtenTokens.has(token)) return
      if (token === undefined) {
        sheet.value = undefined
        return
      }
      try {
        if (typeof token !== 'string') throw new Error('Invalid character link')
        sheet.value = decodeMothershipCharacter(token)
      } catch {
        error.value = 'Could not load this character URL. Your current character has been kept.'
      }
    },
    { immediate: true, flush: 'sync' },
  )

  watch(
    sheet,
    async (value) => {
      if (!active()) return
      try {
        const token = value ? encodeMothershipCharacter(value) : undefined
        if (token === route.query.char) return
        const query = { ...route.query }
        if (token === undefined) delete query.char
        else {
          query.char = token
          writtenTokens.add(token)
        }
        try {
          await router.replace({ path: route.path, query, hash: route.hash })
          error.value = ''
        } finally {
          if (token) writtenTokens.delete(token)
        }
      } catch {
        error.value = 'Could not update the character URL. Your current character has been kept.'
      }
    },
    { deep: true, flush: 'post' },
  )

  return error
}
