import { format } from 'node:util'
import { beforeEach, onTestFinished, vi } from 'vitest'

// Keep unexpected diagnostics visible and fail the test that produced them.
// Tests of intentional warnings can install their own spy and assert its calls.
beforeEach(() => {
  const diagnostics: string[] = []
  for (const method of ['warn', 'error'] as const) {
    const original = console[method].bind(console)
    vi.spyOn(console, method).mockImplementation((...args: unknown[]) => {
      diagnostics.push(`console.${method}: ${format(...args)}`)
      original(...args)
    })
  }
  onTestFinished(() => {
    if (diagnostics.length) {
      throw new Error(`Unexpected console output:\n${diagnostics.join('\n')}`)
    }
  })
})
