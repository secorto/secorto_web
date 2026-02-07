import { describe, it, expect, vi, afterEach } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'

describe('wait-netlify helpers (env & write)', () => {
  const OLD_ENV = { ...process.env }
  const OLD_ARGV = [...process.argv]

  afterEach(() => {
    process.env = { ...OLD_ENV }
    process.argv = [...OLD_ARGV]
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('ensureEnv succeeds when required env present', async () => {
    process.env.NETLIFY_AUTH_TOKEN = 't'
    process.env.NETLIFY_SITE_ID = 's'
    process.env.PR_BRANCH = 'feat'
    const mod = await import('../../.github/scripts/wait-netlify.js')
    expect(() => mod.ensureEnv()).not.toThrow()
  })

  it('ensureEnv throws when missing vars', async () => {
    process.env.NETLIFY_AUTH_TOKEN = 't'
    process.env.NETLIFY_SITE_ID = 's'
    delete process.env.PR_BRANCH
    delete process.env.GITHUB_REF_NAME
    const mod = await import('../../.github/scripts/wait-netlify.js')
    expect(() => mod.ensureEnv()).toThrow(/Missing env:/)
  })

  it('ensureEnv throws when NETLIFY_AUTH_TOKEN missing', async () => {
    delete process.env.NETLIFY_AUTH_TOKEN
    process.env.NETLIFY_SITE_ID = 's'
    process.env.PR_BRANCH = 'feat'
    const mod = await import('../../.github/scripts/wait-netlify.js')
    expect(() => mod.ensureEnv()).toThrow(/Missing env:/)
  })

  it('ensureEnv throws when NETLIFY_SITE_ID missing', async () => {
    process.env.NETLIFY_AUTH_TOKEN = 't'
    delete process.env.NETLIFY_SITE_ID
    process.env.PR_BRANCH = 'feat'
    const mod = await import('../../.github/scripts/wait-netlify.js')
    expect(() => mod.ensureEnv()).toThrow(/Missing env:/)
  })

  it('writePreviewUrl prints when --print-only present', async () => {
    process.argv.push('--print-only')
    const mod = await import('../../.github/scripts/wait-netlify.js')
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    mod.writePreviewUrl('https://test.example')
    expect(log).toHaveBeenCalledWith('https://test.example')
  })

  it('writePreviewUrl appends to GITHUB_ENV file when present', async () => {
    const tmp = path.join(os.tmpdir(), `gh_env_test_${Date.now()}`)
    process.env.GITHUB_ENV = tmp
    // ensure not in print-only mode
    process.argv = [...OLD_ARGV]
    const mod = await import('../../.github/scripts/wait-netlify.js')
    try {
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
      mod.writePreviewUrl('https://file.example')
      const content = fs.readFileSync(tmp, 'utf8')
      expect(content).toContain('NETLIFY_PREVIEW_URL=https://file.example')
    } finally {
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
    }
  })
})
