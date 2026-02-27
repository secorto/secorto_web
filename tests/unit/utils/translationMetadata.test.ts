import { describe, it, expect } from 'vitest'
import { getCanonicalMetadata, getPageMetadata } from '@utils/translationMetadata'

describe('getCanonicalMetadata', () => {
  it('prefers explicit `entryDraft` when provided', () => {
    const result = getCanonicalMetadata({
      entryDraft: true,
      translationOrigin: { locale: 'es', id: '2026-01-01-original' },
      currentLocale: 'en',
      currentCleanId: '2026-01-01-original'
    })

    expect(result).toEqual({
      canonicalLocale: 'es',
      canonicalId: '2026-01-01-original',
      shouldNoindex: true
    })
  })

  it('respects explicit `entryDraft: false`', () => {
    const result = getCanonicalMetadata({
      entryDraft: false,
      translationOrigin: { locale: 'es', id: '2026-01-01-original' },
      currentLocale: 'en',
      currentCleanId: '2026-01-01-original'
    })

    expect(result).toEqual({
      canonicalLocale: 'en',
      canonicalId: '2026-01-01-original',
      shouldNoindex: false
    })
  })

  it('defaults to non-draft when `entryDraft` is undefined', () => {
    const result = getCanonicalMetadata({
      translationOrigin: { locale: 'es', id: '2026-01-01-original' },
      currentLocale: 'en',
      currentCleanId: '2026-01-01-original'
    })

    expect(result).toEqual({
      canonicalLocale: 'en',
      canonicalId: '2026-01-01-original',
      shouldNoindex: false
    })
  })

  it('returns current locale/id for original content when entryDraft is false', () => {
    const result = getCanonicalMetadata({
      entryDraft: false,
      currentLocale: 'es',
      currentCleanId: '2026-01-01-my-post'
    })

    expect(result).toEqual({
      canonicalLocale: 'es',
      canonicalId: '2026-01-01-my-post',
      shouldNoindex: false
    })
  })

  it('handles undefined draft/status (defaults to non-draft)', () => {
    const result = getCanonicalMetadata({
      currentLocale: 'es',
      currentCleanId: '2026-01-01-post'
    })

    expect(result).toEqual({
      canonicalLocale: 'es',
      canonicalId: '2026-01-01-post',
      shouldNoindex: false
    })
  })
})

describe('getPageMetadata', () => {
  it('extracts title and excerpt from entry data', () => {
    const entry = {
      data: {
        title: 'My Awesome Post',
        excerpt: 'This is an excerpt'
      }
    }

    const result = getPageMetadata(entry, 'Fallback Title')

    expect(result).toEqual({
      pageTitle: 'My Awesome Post',
      pageDescription: 'This is an excerpt'
    })
  })

  it('uses description when excerpt is not available', () => {
    const entry = {
      data: {
        title: 'My Post',
        description: 'This is a description'
      }
    }

    const result = getPageMetadata(entry, 'Fallback')

    expect(result).toEqual({
      pageTitle: 'My Post',
      pageDescription: 'This is a description'
    })
  })

  it('uses fallback title when title is not set', () => {
    const entry = {
      data: {
        excerpt: 'Some excerpt'
      }
    }

    const result = getPageMetadata(entry, 'Blog')

    expect(result).toEqual({
      pageTitle: 'Blog',
      pageDescription: 'Some excerpt'
    })
  })

  it('returns empty description when neither excerpt nor description available', () => {
    const entry = {
      data: {
        title: 'Test Post'
      }
    }

    const result = getPageMetadata(entry, 'Fallback')

    expect(result).toEqual({
      pageTitle: 'Test Post',
      pageDescription: ''
    })
  })

  it('prefers excerpt over description when both present', () => {
    const entry = {
      data: {
        title: 'Post',
        excerpt: 'Excerpt here',
        description: 'Description here'
      }
    }

    const result = getPageMetadata(entry, 'Fallback')

    expect(result.pageDescription).toBe('Excerpt here')
  })
})
