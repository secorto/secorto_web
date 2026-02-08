import { describe, it, expect, vi, afterEach } from 'vitest'
import { withDeletedFetch } from '@tests/unit/utils/globalFetch'

describe('wait-netlify fetch guard', () => {
  const OLD_ENV = { ...process.env }
  afterEach(() => {
    process.env = { ...OLD_ENV }
    vi.restoreAllMocks()
  })

  it('ensureFetch throws when global fetch is missing', async () => {
    // ensureFetch is exported from the script; call directly rather than exercising main
    const mod = await import('@github/scripts/wait-netlify.js')

    await withDeletedFetch(async () => {
      expect(() => mod.ensureFetch()).toThrow('Global fetch not available')
    })
  })
})
