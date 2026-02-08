import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { resolveEnvBranch } from '@github/scripts/wait-netlify.js'

const OLD_ENV = { ...process.env }

describe('resolveEnvBranch env detection', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV }
  })
  afterEach(() => {
    process.env = { ...OLD_ENV }
  })

  it('prefers PR_BRANCH when present', () => {
    process.env.PR_BRANCH = 'feature/pr-123'
    delete process.env.GITHUB_REF_NAME
    delete process.env.GITHUB_REF
    expect(resolveEnvBranch()).toBe('feature/pr-123')
  })

  it('falls back to GITHUB_REF_NAME when PR_BRANCH absent', () => {
    delete process.env.PR_BRANCH
    process.env.GITHUB_REF_NAME = 'feature/ref-name'
    expect(resolveEnvBranch()).toBe('feature/ref-name')
  })

  it('parses GITHUB_REF when others absent', () => {
    delete process.env.PR_BRANCH
    delete process.env.GITHUB_REF_NAME
    process.env.GITHUB_REF = 'refs/heads/feature/branch-x'
    expect(resolveEnvBranch()).toBe('feature/branch-x')
  })

  it('returns null when no branch env present', () => {
    delete process.env.PR_BRANCH
    delete process.env.GITHUB_REF_NAME
    delete process.env.GITHUB_REF
    expect(resolveEnvBranch()).toBeNull()
  })
})
