import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getBaseUrl, getBaseUrlEnv } from '../../src/config/baseUrl'

describe('getBaseUrl', () => {
  const OLD_ENV = { ...process.env }

  beforeEach(() => {
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = { ...OLD_ENV }
  })

  it('prefers NETLIFY_PREVIEW_URL when set', () => {
    process.env.NETLIFY_PREVIEW_URL = 'https://preview.example.com'
    process.env.BASE_URL = 'https://base.example.com'
    expect(getBaseUrlEnv()).toBe('https://preview.example.com')
    expect(getBaseUrl()).toBe('https://preview.example.com')
  })

  it('falls back to BASE_URL when NETLIFY_PREVIEW_URL is not set', () => {
    delete process.env.NETLIFY_PREVIEW_URL
    process.env.BASE_URL = 'https://base.example.com'
    expect(getBaseUrlEnv()).toBe('https://base.example.com')
    expect(getBaseUrl()).toBe('https://base.example.com')
  })

  it('returns local fallback when no env vars set', () => {
    delete process.env.NETLIFY_PREVIEW_URL
    delete process.env.BASE_URL
    expect(getBaseUrlEnv()).toBe(undefined)
    expect(getBaseUrl()).toBe('http://localhost:4321')
  })

  it('treats empty env var as unset (falls back to localhost)', () => {
    process.env.NETLIFY_PREVIEW_URL = ''
    delete process.env.BASE_URL
    expect(getBaseUrlEnv()).toBe(undefined)
    expect(getBaseUrl()).toBe('http://localhost:4321')
  })

  it('empty NETLIFY_PREVIEW_URL + BASE_URL set → fall back to BASE_URL', () => {
    process.env.NETLIFY_PREVIEW_URL = ''
    process.env.BASE_URL = 'https://base.example.com'
    expect(getBaseUrlEnv()).toBe('https://base.example.com')
    expect(getBaseUrl()).toBe('https://base.example.com')
  })

  it('treats whitespace-only NETLIFY_PREVIEW_URL as unset and uses BASE_URL', () => {
    process.env.NETLIFY_PREVIEW_URL = '   '
    process.env.BASE_URL = 'https://base.example.com'
    expect(getBaseUrlEnv()).toBe('https://base.example.com')
    expect(getBaseUrl()).toBe('https://base.example.com')
  })

  it('treats empty BASE_URL as unset and falls back to localhost', () => {
    delete process.env.NETLIFY_PREVIEW_URL
    process.env.BASE_URL = ''
    expect(getBaseUrlEnv()).toBe(undefined)
    expect(getBaseUrl()).toBe('http://localhost:4321')
  })
})
