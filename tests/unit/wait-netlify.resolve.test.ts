import fs from 'fs'
import path from 'path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const MOD_PATH = '../../.github/scripts/wait-netlify.js'
const TMP_EVENT = path.join(process.cwd(), 'tests', 'unit', 'tmp-github-event.json')

function resetEnvAndArgv() {
  // Clean env vars that resolveExpectedSha checks
  delete process.env.PR_HEAD_COMMIT_SHA
  delete process.env.GITHUB_EVENT_PATH
}

beforeEach(() => {
  resetEnvAndArgv()
})

afterEach(() => {
  try { fs.unlinkSync(TMP_EVENT) } catch (e) {}
})

describe('resolveExpectedSha', () => {
  it('prefers CLI --expected-sha argument', async () => {
    vi.resetModules()
    const oldArgv = process.argv.slice()
    process.argv = [...oldArgv, '--expected-sha=cli-sha-1']
    const mod = await import(MOD_PATH)
    expect(mod.resolveExpectedSha()).toBe('cli-sha-1')
    process.argv = oldArgv
  })

  it('uses PR_HEAD_COMMIT_SHA when present', async () => {
    vi.resetModules()
    const oldEnv = { ...process.env }
    process.env.PR_HEAD_COMMIT_SHA = 'env-sha-2'
    const mod = await import(MOD_PATH)
    expect(mod.resolveExpectedSha()).toBe('env-sha-2')
    process.env = oldEnv
  })

  it('returns null when GITHUB_EVENT_PATH lacks pull_request', async () => {
    vi.resetModules()
    const payload = { some: 'data' }
    fs.writeFileSync(TMP_EVENT, JSON.stringify(payload), 'utf8')
    const oldEnv = { ...process.env }
    process.env.GITHUB_EVENT_PATH = TMP_EVENT
    const mod = await import(MOD_PATH)
    expect(mod.resolveExpectedSha()).toBe(null)
    process.env = oldEnv
  })
})
