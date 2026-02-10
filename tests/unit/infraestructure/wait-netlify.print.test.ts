import { describe, it, expect, vi } from 'vitest'

describe('printError helper (simple)', () => {
  it('logs base and message for Error', async () => {
    const mod = await import('@github/scripts/wait-netlify.js')
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mod.printError('fatal:', new Error('boom'))
    expect(spy).toHaveBeenCalledWith('fatal:', 'boom')
    spy.mockRestore()
  })

  it('logs base and raw value for non-Error', async () => {
    const mod = await import('@github/scripts/wait-netlify.js')
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const payload = { foo: 'bar' }
    mod.printError('error while polling:', payload)
    expect(spy).toHaveBeenCalled()
    // printError now formats non-Error objects; ensure the logged payload contains the object keys
    const logged = spy.mock.calls[0][1]
    expect(String(logged)).toContain('foo')
    spy.mockRestore()
  })
})
