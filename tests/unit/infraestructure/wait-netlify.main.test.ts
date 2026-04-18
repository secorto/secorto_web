import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'

const OLD_ENV = { ...process.env }

// Hoisted mock: mirrors how the module is imported by the script
vi.mock('@github/lib/wait-netlify-api.js', () => ({
  listDeploys: vi.fn().mockResolvedValue([
    { id: 'd1', state: 'ready', commit_ref: 'abcd1234', links: { permalink: 'https://p.netlify.app' }, context: 'deploy-preview', branch: 'feat' }
  ])
}))

describe('wait-netlify main (cover main)', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = { ...OLD_ENV }
    vi.resetModules()
  })

  it('main writes NETLIFY_PREVIEW_URL and returns 0', async () => {
    process.env.NETLIFY_AUTH_TOKEN = 'tok'
    process.env.NETLIFY_SITE_ID = 'site'
    process.env.COMMIT_ID = 'abcd1234'
    process.env.PR_BRANCH = 'feat'
    process.env.GITHUB_ENV = path.join(os.tmpdir(), `gh_env_main_cover_${Date.now()}`)

    const mod = await import('@github/scripts/wait-netlify')
    const code = await mod.main()
    expect(code).toBe(0)
    const content = fs.readFileSync(process.env.GITHUB_ENV!, 'utf8')
    expect(content).toContain('NETLIFY_PREVIEW_URL=https://p.netlify.app')
    fs.rmSync(process.env.GITHUB_ENV!)
  })
})
