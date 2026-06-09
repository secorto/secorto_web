import { describe, it, expect, beforeEach } from 'vitest'
import { extractShaFromDeploy } from '@github/lib/wait-netlify-git.js'
import { previewDeploysForBranch, findMatchingDeploy, choosePreviewUrl, summarizeCandidates } from '@github/lib/wait-netlify-integrator.js'
import { resolveExpectedSha } from '@github/scripts/wait-netlify'

describe('wait-netlify helpers (TS)', () => {
  it('extracts sha from common fields', () => {
    const d = { commit_ref: 'abcd1234' }
    const r = extractShaFromDeploy(d)
    expect(r.sha).toBe('abcd1234')
    expect(r.field).toBe('commit_ref')
  })

  it('previewDeploysForBranch filters by branch and context and sorts', () => {
    const a = { id: 1, context: 'deploy-preview', branch: 'feat', created_at: '2020-01-01' }
    const b = { id: 2, context: 'deploy-preview', branch: 'feat', created_at: '2020-01-02' }
    const c = { id: 3, context: 'production', branch: 'main', created_at: '2020-01-03' }
    const res = previewDeploysForBranch([a, b, c], 'feat')
    expect(res.length).toBe(2)
    expect(res[0].id).toBe(2)
  })

  it('accepts production deploy with no branch when running on main', () => {
    const prodNoBranch = { id: 10, context: 'production', created_at: '2020-02-01' }
    const res = previewDeploysForBranch([prodNoBranch], 'main')
    expect(res.length).toBe(1)
    expect(res[0].id).toBe(10)
  })

  it('accepts production deploy with matching branch when running on master', () => {
    const prodWithBranch = { id: 11, context: 'production', branch: 'master', created_at: '2020-02-02' }
    const res = previewDeploysForBranch([prodWithBranch], 'master')
    expect(res.length).toBe(1)
    expect(res[0].id).toBe(11)
  })

  it('does not treat production deploys as previews for non-main branches', () => {
    const prod = { id: 12, context: 'production', created_at: '2020-02-03' }
    const res = previewDeploysForBranch([prod], 'feat')
    expect(res.length).toBe(0)
  })

  it('findMatchingDeploy returns null when no expected sha', () => {
    const notReady = { id: 'n', state: 'building', commit_ref: 'b' }
    const ready = { id: 'r', state: 'ready', commit_ref: 'a', sha: 'aaaa1111' }
    // Policy: require expected SHA to match; when none provided, result is null
    const res = findMatchingDeploy([notReady, ready], null)
    expect(res).toBeNull()
  })

  it('findMatchingDeploy ignores ready deploys without sha when no expected provided (integrator unit)', () => {
    const d = { id: 'r', state: 'ready', links: { alias: 'https://alias.netlify.app' }, context: 'deploy-preview', branch: 'feat' }
    const res = findMatchingDeploy([d], null)
    expect(res).toBeNull()
  })

  it('summarizeCandidates returns summaries with extracted sha', () => {
    const d = { id: 'x', state: 'ready', commit_ref: 'deadbeef' }
    const s = summarizeCandidates([d])
    expect(s[0].id).toBe('x')
    expect(s[0].sha).toBe('deadbeef')
  })

  it('choosePreviewUrl picks permalink/alias/ssl_url/url', () => {
    const m1 = { links: { permalink: 'https://p.netlify.app' } }
    const m2 = { links: { alias: 'https://alias.netlify.app' } }
    const m3 = { ssl_url: 'https://ssl.netlify.app' }
    const m4 = { url: 'https://url.netlify.app' }
    const m5 = {}
    const valid = {deploy_url: 'https://deploy.netlify.app'}
    expect(() => choosePreviewUrl(m1)).toThrow('no preview url available')
    expect(() => choosePreviewUrl(m2)).toThrow('no preview url available')
    expect(() => choosePreviewUrl(m3)).toThrow('no preview url available')
    expect(() => choosePreviewUrl(m4)).toThrow('no preview url available')
    expect(() => choosePreviewUrl(m5)).toThrow('no preview url available')
    expect(choosePreviewUrl(valid).url).toBe('https://deploy.netlify.app')
  })

  it('defensive: when match returns null, returns field value as field', () => {
    const fieldValue = 'deadbeef'
    const originalMatch = String.prototype.match
    try {
      // force String.prototype.match to return null to exercise defensive branch
      ;(String.prototype as { match: (this: string, regexp?: string | RegExp) => RegExpMatchArray | null }).match = function () { return null }
      const d = { commit_ref: fieldValue }
      const r = extractShaFromDeploy(d)
      expect(r.sha).toBeNull()
      expect(r.field).toBe(fieldValue)
    } finally {
      String.prototype.match = originalMatch
    }
  })

  describe('resolveExpectedSha', () => {
    beforeEach(() => {
      delete process.env.COMMIT_ID
    })

    it('returns normalized lowercase full sha when COMMIT_ID is full hex', () => {
      process.env.COMMIT_ID = 'DEADBEEF0123456789abcdef0123456789abcdef'
      const r = resolveExpectedSha()
      expect(r).toBe('deadbeef0123456789abcdef0123456789abcdef')
    })

    it('accepts short 7-char hex prefix and normalizes', () => {
      process.env.COMMIT_ID = 'AbC1234'
      const r = resolveExpectedSha()
      expect(r).toBe('abc1234')
    })

    it('rejects non-hex values and returns null', () => {
      process.env.COMMIT_ID = 'not-a-sha!!!'
      const r = resolveExpectedSha()
      expect(r).toBeNull()
    })

    it('returns null when COMMIT_ID is absent', () => {
      const r = resolveExpectedSha()
      expect(r).toBeNull()
    })
  })
})
