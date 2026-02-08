import { afterEach, beforeEach, vi } from 'vitest'

// Silence noisy console output in tests; spies are restored by the global afterEach
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

// Ensure any mocks/spies/stubs are restored after each test to avoid leaking state
afterEach(() => {
  vi.restoreAllMocks()
})

// Provide a default virtual mock for `astro:content` so tests that import
// modules depending on it don't fail during module resolution. Individual
// tests may override this with `vi.mock`/`vi.doMock` before dynamic import.
vi.mock('astro:content', () => ({
  getCollection: vi.fn(async () => [])
}))
