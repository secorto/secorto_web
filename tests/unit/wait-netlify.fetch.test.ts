import { describe, it, expect, vi, afterEach } from 'vitest'

describe('wait-netlify fetch guard', () => {
  const OLD_ENV = { ...process.env }
  afterEach(() => {
    process.env = { ...OLD_ENV }
    vi.restoreAllMocks()
  })

  it('main exits when global fetch is missing and does not call listDeploys', async () => {
    process.env.NETLIFY_AUTH_TOKEN = 'tok'
    process.env.NETLIFY_SITE_ID = 'site'
    process.env.PR_BRANCH = 'feat'

    // delete global.fetch
    // @ts-ignore
    delete global.fetch

    vi.mock('../../.github/lib/wait-netlify-api.js', () => ({ listDeploys: vi.fn().mockResolvedValue([]) }))

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit') })

    const mod = await import('../../.github/scripts/wait-netlify.js')
    await expect(mod.main()).rejects.toThrow('process.exit')

    const api = await import('../../.github/lib/wait-netlify-api.js')
    expect(api.listDeploys).not.toHaveBeenCalled()

    exitSpy.mockRestore()
  })
})
