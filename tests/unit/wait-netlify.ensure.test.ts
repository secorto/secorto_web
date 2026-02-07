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
})
