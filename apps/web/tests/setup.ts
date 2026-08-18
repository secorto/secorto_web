import { afterEach, beforeEach, vi } from 'vitest'

// Silence noisy console output in tests; spies are restored by the global afterEach
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

// Ensure any mocks/spies/stubs are restored after each test to avoid leaking state
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
