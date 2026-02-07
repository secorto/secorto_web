import { describe, it, expect, vi } from 'vitest'

const MOD = '../../.github/scripts/wait-netlify.js'

describe('getEffectiveExpectedSha', () => {
  it('returns GITHUB_SHA for default branch main when no other SHA present', async () => {
    vi.resetModules()
    const oldEnv = { ...process.env }
    process.env.GITHUB_SHA = 'commit-sha-abc'
    process.env.GIT_DEFAULT_BRANCH = 'main'
    const mod = await import(MOD)
    const sha = mod.getEffectiveExpectedSha('main')
    expect(sha).toBe('commit-sha-abc')
    process.env = oldEnv
  })

  it('returns null for non-default branches even if GITHUB_SHA present', async () => {
    vi.resetModules()
    const oldEnv = { ...process.env }
    process.env.GITHUB_SHA = 'commit-sha-xyz'
    process.env.GIT_DEFAULT_BRANCH = 'main'
    const mod = await import(MOD)
    const sha = mod.getEffectiveExpectedSha('feature-branch')
    expect(sha).toBe(null)
    process.env = oldEnv
  })
})
