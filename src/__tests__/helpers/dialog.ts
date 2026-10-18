import { beforeAll, afterAll } from 'vitest'

// jsdom has no native dialog lifecycle; browser checks cover focus trapping and Escape.
export function mockDialog() {
  const prototype = HTMLDialogElement.prototype
  const showModal = Object.getOwnPropertyDescriptor(prototype, 'showModal')
  const close = Object.getOwnPropertyDescriptor(prototype, 'close')
  beforeAll(() => {
    Object.defineProperty(prototype, 'showModal', {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.open = true
      },
    })
    Object.defineProperty(prototype, 'close', {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.open = false
        this.dispatchEvent(new Event('close'))
      },
    })
  })
  afterAll(() => {
    if (showModal) Object.defineProperty(prototype, 'showModal', showModal)
    else Reflect.deleteProperty(prototype, 'showModal')
    if (close) Object.defineProperty(prototype, 'close', close)
    else Reflect.deleteProperty(prototype, 'close')
  })
}
