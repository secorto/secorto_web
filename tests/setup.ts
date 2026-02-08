import { afterEach, vi } from 'vitest'

// Ensure any mocks/spies/stubs are restored after each test to avoid leaking state
afterEach(() => {
  vi.restoreAllMocks()
})
