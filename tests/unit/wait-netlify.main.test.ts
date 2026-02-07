import { describe, it, expect, vi, afterEach } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'

const OLD_ENV = { ...process.env }
const OLD_ARGV = [...process.argv]

describe('wait-netlify main integration', () => {
  afterEach(() => {
    process.env = { ...OLD_ENV }
    process.argv = [...OLD_ARGV]
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('main writes NETLIFY_PREVIEW_URL when matching deploy exists', async () => {
    // prepare environment
    process.env.NETLIFY_AUTH_TOKEN = 'tok'
    process.env.NETLIFY_SITE_ID = 'site'
    process.env.GITHUB_ENV = path.join(os.tmpdir(), `gh_env_main_${Date.now()}`)
    process.env.PR_HEAD_COMMIT_SHA = 'abcd1234'
    process.env.PR_BRANCH = 'feat'

    // mock listDeploys to return a ready deploy matching the expected sha
    vi.resetModules()
    vi.mock('../../.github/lib/wait-netlify-api.js', () => ({
      listDeploys: vi.fn().mockResolvedValue([
        { id: 'd1', state: 'ready', commit_ref: 'abcd1234', links: { permalink: 'https://p.netlify.app' }, context: 'deploy-preview', branch: 'feat' }
      ])
    }))

    const mod = await import('../../.github/scripts/wait-netlify.js')
    try {
      if (fs.existsSync(process.env.GITHUB_ENV)) fs.unlinkSync(process.env.GITHUB_ENV)
      const code = await mod.main()
      expect(code).toBe(0)
      const content = fs.readFileSync(process.env.GITHUB_ENV, 'utf8')
      expect(content).toContain('NETLIFY_PREVIEW_URL=https://p.netlify.app')
    } finally {
      if (fs.existsSync(process.env.GITHUB_ENV)) fs.unlinkSync(process.env.GITHUB_ENV)
    }
  })
})
