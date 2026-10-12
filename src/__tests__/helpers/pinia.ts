import { afterEach } from 'vitest'
import { createPinia, disposePinia, type Pinia } from 'pinia'

const instances: Pinia[] = []
export function createTestPinia() {
  const pinia = createPinia()
  instances.push(pinia)
  return pinia
}
afterEach(() => {
  for (const pinia of instances.splice(0)) disposePinia(pinia)
})
