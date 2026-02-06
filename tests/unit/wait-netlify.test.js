import { describe, it, expect } from 'vitest'
import { extractShaFromDeploy } from '../../.github/lib/wait-netlify-git.js'
import { previewDeploysForBranch, findMatchingDeploy, summarizeCandidates } from '../../.github/lib/wait-netlify-integrator.js'

describe('wait-netlify helpers', () => {
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

  it('findMatchingDeploy returns first ready when no expected sha', () => {
    const notReady = { id: 'n', state: 'building', commit_ref: 'b' }
    const ready = { id: 'r', state: 'ready', commit_ref: 'a', sha: 'aaaa1111' }
    const res = findMatchingDeploy([notReady, ready], null)
    expect(res).toBe(ready)
  })

  it('summarizeCandidates returns summaries with extracted sha', () => {
    const d = { id: 'x', state: 'ready', commit_ref: 'deadbeef' }
    const s = summarizeCandidates([d])
    expect(s[0].id).toBe('x')
    expect(s[0].sha).toBe('deadbeef')
  })
})
