import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { listDeploys } from '@github/lib/wait-netlify-api.js'

describe('wait-netlify-api.listDeploys', () => {
  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }) as typeof fetch)
    await expect(listDeploys('site', 'token')).rejects.toThrow('Netlify API status 500')
  })

  it('returns parsed JSON on ok response', async () => {
    const payload = [{ id: 'd1', context: 'deploy-preview', created_at: '2020-01-01' }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(payload) }) as typeof fetch)
    const res = await listDeploys('site', 'token')
    expect(res).toEqual(payload)
  })

  it('throws when JSON is not an array', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ foo: 'bar' }) }) as typeof fetch)
    await expect(listDeploys('site', 'token')).rejects.toThrow(/expected array/)
  })

  it('throws when array contains invalid deploy objects', async () => {
    // element 0 is valid, element 1 is null, element 2 missing context
    const payload = [ { id: 'a', context: 'deploy-preview', created_at: '2020-01-01' }, null, { id: 'c' } ]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(payload) }) as typeof fetch)
    await expect(listDeploys('site', 'token')).rejects.toThrow(/invalid deploy at index 1|invalid deploy at index 2/)
  })
})
