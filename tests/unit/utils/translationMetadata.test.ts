import { describe, it, expect } from 'vitest'
import { isTranslationDraft, getCanonicalMetadata, getPageMetadata } from '@utils/translationMetadata'

describe('isTranslationDraft', () => {
  it('returns true for draft status', () => {
    expect(isTranslationDraft('draft')).toBe(true)
  })

  it('returns true for partial status', () => {
    expect(isTranslationDraft('partial')).toBe(true)
  })

  it('returns true for pending status', () => {
    expect(isTranslationDraft('pending')).toBe(true)
  })

  it('returns false for translated status', () => {
    expect(isTranslationDraft('translated')).toBe(false)
  })

  it('returns false for original status', () => {
    expect(isTranslationDraft('original')).toBe(false)
  })

  it('returns false for undefined status', () => {
    expect(isTranslationDraft(undefined)).toBe(false)
  })
})

describe('getCanonicalMetadata', () => {
  it('returns current locale/id for original content', () => {
    const result = getCanonicalMetadata({
      translationStatus: 'original',
      currentLocale: 'es',
      currentCleanId: '2026-01-01-my-post'
    })

    expect(result).toEqual({
      isTranslationDraft: false,
      canonicalLocale: 'es',
      canonicalId: '2026-01-01-my-post',
      shouldNoindex: false
    })
  })

  it('returns current locale/id for complete translation', () => {
    const result = getCanonicalMetadata({
      translationStatus: 'translated',
      currentLocale: 'en',
      currentCleanId: '2026-01-01-my-post'
    })

    expect(result).toEqual({
      isTranslationDraft: false,
      canonicalLocale: 'en',
      canonicalId: '2026-01-01-my-post',
      shouldNoindex: false
    })
  })

  it('returns origin locale/id for draft translation', () => {
    const result = getCanonicalMetadata({
      translationStatus: 'draft',
      translationOrigin: { locale: 'es', id: '2026-01-01-original' },
      currentLocale: 'en',
      currentCleanId: '2026-01-01-original'
    })

    expect(result).toEqual({
      isTranslationDraft: true,
      canonicalLocale: 'es',
      canonicalId: '2026-01-01-original',
      shouldNoindex: true
    })
  })

  it('returns origin locale/id for partial translation', () => {
    const result = getCanonicalMetadata({
      translationStatus: 'partial',
      translationOrigin: { locale: 'es', id: 'some-post' },
      currentLocale: 'en',
      currentCleanId: 'some-post'
    })

    expect(result).toEqual({
      isTranslationDraft: true,
      canonicalLocale: 'es',
      canonicalId: 'some-post',
      shouldNoindex: true
    })
  })

  it('returns current locale/id when draft but no translation_origin provided', () => {
    const result = getCanonicalMetadata({
      translationStatus: 'draft',
      currentLocale: 'en',
      currentCleanId: '2026-01-01-post'
    })

    expect(result).toEqual({
      isTranslationDraft: true,
      canonicalLocale: 'en',
      canonicalId: '2026-01-01-post',
      shouldNoindex: true
    })
  })

  it('handles undefined translation_status', () => {
    const result = getCanonicalMetadata({
      currentLocale: 'es',
      currentCleanId: '2026-01-01-post'
    })

    expect(result).toEqual({
      isTranslationDraft: false,
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
