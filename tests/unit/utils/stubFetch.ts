import { vi } from 'vitest'

/**
 * Stub `globalThis.fetch` with the provided response-like value.
 * Example usages:
 * - `stubFetch({ ok: true, json: () => Promise.resolve(payload) })`
 * - `stubFetch({ ok: false, status: 500 })`
 */
export function stubFetch(response: unknown) {
  const fn = vi.fn().mockResolvedValue(response) as unknown as typeof globalThis.fetch
  vi.stubGlobal('fetch', fn)
  return fn
}
