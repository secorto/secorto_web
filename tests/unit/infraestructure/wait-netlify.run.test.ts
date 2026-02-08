import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('runAndExit helper', () => {
  const OLD_ENV = { ...process.env }
  type RunAndExit = typeof import('@github/scripts/wait-netlify.js')['runAndExit']
  let runAndExit: RunAndExit
  let exitCode: number | undefined
  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('@github/scripts/wait-netlify.js')
    runAndExit = mod.runAndExit
    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => { exitCode = code; }) as typeof process.exit)
  })
  afterEach(() => {
    process.env = { ...OLD_ENV }
    vi.restoreAllMocks()
  })

  it('exits with code 0 when main resolves 0', async () => {
    const mainMock = vi.fn().mockResolvedValue(0)
    await runAndExit(mainMock)
    expect(exitCode).toBe(0)
  })

  it('exits with code 1 when main throws', async () => {
    const mainMock = vi.fn().mockRejectedValue(new Error('boom'))
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    await runAndExit(mainMock)
    expect(exitCode).toBe(1)
    expect(errSpy).toHaveBeenCalled()
  })
})
