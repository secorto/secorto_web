import { describe, it, expect } from 'vitest'
import { validateDeploys } from '../../.github/lib/wait-netlify-api.js'

describe('validateDeploys', () => {
  it('accepts valid array of deploys', () => {
    const payload = [ { id: 'a', context: 'deploy-preview', created_at: '2020-01-01' } ]
    expect(() => validateDeploys(payload)).not.toThrow()
  })

  it('rejects non-array input', () => {
    expect(() => validateDeploys({})).toThrow(/expected array/)
  })

  it('rejects null entry in array', () => {
    const payload = [ { id: 'a', context: 'deploy-preview' }, null ]
    expect(() => validateDeploys(payload)).toThrow(/invalid deploy at index 1/)
  })

  it('rejects missing context', () => {
    const payload = [ { id: 'a' } ]
    expect(() => validateDeploys(payload)).toThrow(/missing or invalid context/)
  })

  it('rejects missing id', () => {
    const payload = [ { context: 'deploy-preview' } ]
    expect(() => validateDeploys(payload)).toThrow(/missing id/)
  })

  it('rejects invalid created_at', () => {
    const payload = [ { id: 'a', context: 'deploy-preview', created_at: 'not-a-date' } ]
    expect(() => validateDeploys(payload)).toThrow(/invalid created_at/)
  })
})
