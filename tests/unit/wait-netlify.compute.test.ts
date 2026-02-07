import { describe, it, expect, vi } from 'vitest'

const MOD = '../../.github/scripts/wait-netlify.js'

describe('computeExpectedSha', () => {
  it('falls back to GITHUB_SHA for default branch when no other SHA', async () => {
    vi.resetModules()
    const oldEnv = { ...process.env }
    delete process.env.PR_HEAD_COMMIT_SHA
    delete process.env.GITHUB_EVENT_PATH
    process.env.GITHUB_SHA = 'ghsha-123'
    process.env.GIT_DEFAULT_BRANCH = 'develop'
    const mod = await import(MOD)
    const sha = mod.computeExpectedSha('develop')
    expect(sha).toBe('ghsha-123')
    process.env = oldEnv
  })

  it('does not use GITHUB_SHA for non-default branch', async () => {
    vi.resetModules()
    const oldEnv = { ...process.env }
    delete process.env.PR_HEAD_COMMIT_SHA
    delete process.env.GITHUB_EVENT_PATH
    process.env.GITHUB_SHA = 'ghsha-456'
    process.env.GIT_DEFAULT_BRANCH = 'main'
    const mod = await import(MOD)
    const sha = mod.computeExpectedSha('feature/foo')
    expect(sha).toBe(null)
    process.env = oldEnv
  })

  it('prefers resolveExpectedSha over GITHUB_SHA', async () => {
    vi.resetModules()
    const oldEnv = { ...process.env }
    process.argv.push('--expected-sha=cli-sha-99')
    process.env.GITHUB_SHA = 'ghsha-789'
    const mod = await import(MOD)
    const sha = mod.computeExpectedSha('main')
    expect(sha).toBe('cli-sha-99')
    process.argv = process.argv.filter(a => a !== '--expected-sha=cli-sha-99')
    process.env = oldEnv
  })
})
