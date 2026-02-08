import { describe, it, expect, afterEach } from 'vitest'

describe('wait-netlify fetch guard', () => {
  const ORIGINAL_FETCH = globalThis.fetch
  afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH
  })

  it('ensureFetch throws when global fetch is missing', async () => {
    // @ts-expect-error - test simulates environment where fetch is unavailable
    globalThis.fetch = undefined
    const mod = await import('@github/scripts/wait-netlify.js')

    expect(() => mod.ensureFetch()).toThrow('Global fetch not available')
  })
})
