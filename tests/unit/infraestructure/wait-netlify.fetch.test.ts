import { describe, it, expect, vi, afterEach } from 'vitest'

describe('wait-netlify fetch guard', () => {
  const OLD_ENV = { ...process.env }
  afterEach(() => {
    process.env = { ...OLD_ENV }
    vi.restoreAllMocks()
  })

  it('ensureFetch throws when global fetch is missing', async () => {
    // ensureFetch is exported from the script; call directly rather than exercising main
    const mod = await import('@github/scripts/wait-netlify.js')

    // delete global.fetch
    // @ts-ignore
    delete global.fetch

    expect(() => mod.ensureFetch()).toThrow('Global fetch not available')
  })
})
