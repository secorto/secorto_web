import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { listDeploys } from '../../.github/lib/wait-netlify-api.js'

describe('wait-netlify-api.listDeploys', () => {
  let originalFetch: any

  beforeEach(() => {
    originalFetch = (global as any).fetch
  })

  afterEach(() => {
    (global as any).fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await expect(listDeploys('site', 'token')).rejects.toThrow('Netlify API status 500')
  })

  it('returns parsed JSON on ok response', async () => {
    const payload = [{ id: 'd1' }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(payload) }))
    const res = await listDeploys('site', 'token')
    expect(res).toEqual(payload)
  })

  it('throws when JSON is not an array', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ foo: 'bar' }) }))
    await expect(listDeploys('site', 'token')).rejects.toThrow(/expected array/)
  })
})
