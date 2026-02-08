import { describe, it, expect, vi } from 'vitest'
import { pollForPreview } from '@github/scripts/wait-netlify.js'

describe('pollForPreview', () => {
  it('returns match immediately when deploy matches expected sha', async () => {
    const deploy = { id: 'd1', state: 'ready', sha: 'aaaa1111', links: { permalink: 'https://p.netlify.app' }, context: 'deploy-preview', branch: 'feat' }
    const listDeploysFn = vi.fn().mockResolvedValue([deploy])
    const writeUrlFn = vi.fn()

    const res = await pollForPreview({
      listDeploysFn,
      site: 's',
      token: 't',
      branch: 'feat',
      expectedSha: 'aaaa1111',
      attempts: 1,
      delayMs: 0,
      writeUrlFn
    })

    expect(res.code).toBe(0)
    expect(res.url).toBe('https://p.netlify.app')
    expect(writeUrlFn).toHaveBeenCalledWith('https://p.netlify.app')
  })

  it('accepts first ready when commit_ref matches expected sha', async () => {
    const notReady = { id: 'n', state: 'building', context: 'deploy-preview', branch: 'feat' }
    const ready = { id: 'r', state: 'ready', commit_ref: 'abcd1234', links: { alias: 'https://a.netlify.app' }, context: 'deploy-preview', branch: 'feat' }
    const listDeploysFn = vi.fn().mockResolvedValue([notReady, ready])
    const writeUrlFn = vi.fn()

    const res = await pollForPreview({
      listDeploysFn,
      site: 's',
      token: 't',
      branch: 'feat',
      expectedSha: 'abcd1234',
      attempts: 1,
      delayMs: 0,
      writeUrlFn
    })

    expect(res.code).toBe(0)
    expect(res.url).toBe('https://a.netlify.app')
    expect(writeUrlFn).toHaveBeenCalled()
  })

  it('retries until match appears', async () => {
    let calls = 0
    const listDeploysFn = vi.fn().mockImplementation(() => {
      calls++
      if (calls === 1) return Promise.resolve([])
      const deploy = { id: 'r', state: 'ready', sha: 'bbb2222', links: { permalink: 'https://p2.netlify.app' }, context: 'deploy-preview', branch: 'feat' }
      return Promise.resolve([deploy])
    })
    const writeUrlFn = vi.fn()

    const res = await pollForPreview({
      listDeploysFn,
      site: 's',
      token: 't',
      branch: 'feat',
      expectedSha: 'bbb2222',
      attempts: 3,
      delayMs: 0,
      writeUrlFn
    })

    expect(res.code).toBe(0)
    expect(res.url).toBe('https://p2.netlify.app')
    expect(listDeploysFn.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(writeUrlFn).toHaveBeenCalled()
  })

  it('recovers from a transient network error and finds deploy', async () => {
    let calls = 0
    const listDeploysFn = vi.fn().mockImplementation(() => {
      calls++
      if (calls === 1) return Promise.reject(new Error('network error'))
      const deploy = { id: 'r', state: 'ready', sha: 'dead1111', links: { permalink: 'https://p-net.netlify.app' }, context: 'deploy-preview', branch: 'feat' }
      return Promise.resolve([deploy])
    })
    const writeUrlFn = vi.fn()

    const res = await pollForPreview({
      listDeploysFn,
      site: 's',
      token: 't',
      branch: 'feat',
      expectedSha: 'dead1111',
      attempts: 3,
      delayMs: 0,
      writeUrlFn
    })

    expect(res.code).toBe(0)
    expect(res.url).toBe('https://p-net.netlify.app')
    expect(listDeploysFn.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(writeUrlFn).toHaveBeenCalled()
  })

  it('returns code 1 when listDeploys consistently errors', async () => {
    const listDeploysFn = vi.fn().mockRejectedValue(new Error('network down'))
    const writeUrlFn = vi.fn()

    const res = await pollForPreview({
      listDeploysFn,
      site: 's',
      token: 't',
      branch: 'feat',
      expectedSha: 'doesnotmatter',
      attempts: 2,
      delayMs: 0,
      writeUrlFn
    })

    expect(res.code).toBe(1)
    expect(res.url).toBeNull()
    expect(writeUrlFn).not.toHaveBeenCalled()
    expect(listDeploysFn.mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('returns code 1 when no match after attempts', async () => {
    const listDeploysFn = vi.fn().mockResolvedValue([])
    const writeUrlFn = vi.fn()

    const res = await pollForPreview({
      listDeploysFn,
      site: 's',
      token: 't',
      branch: 'feat',
      expectedSha: 'nomatch',
      attempts: 2,
      delayMs: 0,
      writeUrlFn
    })

    expect(res.code).toBe(1)
    expect(res.url).toBeNull()
    expect(writeUrlFn).not.toHaveBeenCalled()
  })

  it('accepts a deploy with abbreviated SHA when expected is full SHA', async () => {
    const shortSha = 'abcd123'
    const fullExpected = 'abcd12300000000000000000000000000000000' // starts with shortSha
    const deploy = { id: 'd1', state: 'ready', commit_ref: shortSha, links: { permalink: 'https://p.netlify.app' }, context: 'deploy-preview', branch: 'feat' }
    const listDeploysFn = vi.fn().mockResolvedValue([deploy])
    const writeUrlFn = vi.fn()

    const res = await pollForPreview({
      listDeploysFn,
      site: 's',
      token: 't',
      branch: 'feat',
      expectedSha: fullExpected,
      attempts: 1,
      delayMs: 0,
      writeUrlFn
    })

    expect(res.code).toBe(0)
    expect(res.url).toBe('https://p.netlify.app')
    expect(writeUrlFn).toHaveBeenCalled()
  })

  it('matches exact full SHA when both deploy and expected are full SHAs', async () => {
    const fullSha = 'abcd1234abcd1234abcd1234abcd1234abcd1234' // 40 chars
    const deploy = { id: 'd-full', state: 'ready', commit_ref: fullSha, links: { permalink: 'https://p-full.netlify.app' }, context: 'deploy-preview', branch: 'feat' }
    const listDeploysFn = vi.fn().mockResolvedValue([deploy])
    const writeUrlFn = vi.fn()

    const res = await pollForPreview({
      listDeploysFn,
      site: 's',
      token: 't',
      branch: 'feat',
      expectedSha: fullSha,
      attempts: 1,
      delayMs: 0,
      writeUrlFn
    })

    expect(res.code).toBe(0)
    expect(res.url).toBe('https://p-full.netlify.app')
    expect(writeUrlFn).toHaveBeenCalled()
  })

  it('does not accept ready deploy without SHA when expected SHA is provided', async () => {
    const deploy = { id: 'r1', state: 'ready', links: { alias: 'https://alias.netlify.app' }, context: 'deploy-preview', branch: 'feat' }
    const listDeploysFn = vi.fn().mockResolvedValue([deploy])
    const writeUrlFn = vi.fn()

    const res = await pollForPreview({
      listDeploysFn,
      site: 's',
      token: 't',
      branch: 'feat',
      expectedSha: 'nomatch2',
      attempts: 1,
      delayMs: 0,
      writeUrlFn
    })

    // Now configured to ignore deploys without SHA: should not match
    expect(res.code).toBe(1)
    expect(res.url).toBeNull()
    expect(writeUrlFn).not.toHaveBeenCalled()
  })

  it('returns code 1 when expected commit never appears', async () => {
    const listDeploysFn = vi.fn().mockResolvedValue([
      { id: 'a', state: 'ready', commit_ref: 'deadbeef', links: {}, context: 'deploy-preview', branch: 'feat' }
    ])
    const writeUrlFn = vi.fn()

    const res = await pollForPreview({
      listDeploysFn,
      site: 's',
      token: 't',
      branch: 'feat',
      expectedSha: 'ffffffff', // SHA that will never match
      attempts: 3,
      delayMs: 0,
      writeUrlFn
    })

    expect(res.code).toBe(1)
    expect(res.url).toBeNull()
    expect(writeUrlFn).not.toHaveBeenCalled()
  })
})
