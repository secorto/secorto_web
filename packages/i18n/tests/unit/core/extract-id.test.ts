import { test, expect, describe } from 'vitest'
import { extractCleanId, createLocales } from '@secorto/i18n'
const allowedLocales = createLocales(['es', 'en'] as const)

describe('extractCleanId', () => {
  test('removes Spanish locale prefix from entry ID and returns locale', () => {
    const result = extractCleanId('es/2025-01-22-my-post', allowedLocales)
    expect(result.id).toBe('2025-01-22-my-post')
    expect(result.locale).toBe('es')
  })

  test('removes English locale prefix from entry ID and returns locale', () => {
    const result = extractCleanId('en/2025-01-22-my-post', allowedLocales)
    expect(result.id).toBe('2025-01-22-my-post')
    expect(result.locale).toBe('en')
  })

  test('handles entry IDs with nested paths and returns locale', () => {
    const result = extractCleanId('es/blog/category/2025-01-22-my-post', allowedLocales)
    expect(result.id).toBe('blog/category/2025-01-22-my-post')
    expect(result.locale).toBe('es')
  })

  test('throws when no locale prefix exists', () => {
    expect(() => extractCleanId('2025-01-22-my-post', allowedLocales)).toThrow('Invalid entryId "2025-01-22-my-post" — missing locale prefix')
  })

  test('handles simple slug without date prefix', () => {
    const result = extractCleanId('es/simple-slug', allowedLocales)
    expect(result.id).toBe('simple-slug')
    expect(result.locale).toBe('es')
  })

  test('throws when entry ID has only locale', () => {
    expect(() => extractCleanId('es', allowedLocales)).toThrow('Invalid entryId "es" — missing locale prefix')
  })

  test('handles entry ID with multiple locale-like prefixes (only removes first)', () => {
    const result = extractCleanId('es/en/something', allowedLocales)
    expect(result.id).toBe('en/something')
    expect(result.locale).toBe('es')
  })

  test('throws when unknown locale prefix is present', () => {
    expect(() => extractCleanId('fr/2025-01-22-my-post', allowedLocales)).toThrow('Invalid entryId "fr/2025-01-22-my-post". Unknown locale prefix "fr". Expected one of: es, en.')
  })

  test('throws on empty string', () => {
    expect(() => extractCleanId('', allowedLocales)).toThrow('entryId cannot be empty')
  })

  test('throws on locale from middle of path', () => {
    expect(() => extractCleanId('category/es/2025-01-22-post', allowedLocales)).toThrow('Invalid entryId "category/es/2025-01-22-post". Unknown locale prefix "category". Expected one of: es, en.')
  })

  test('handles locale prefix with trailing content', () => {
    const result = extractCleanId('es/talks/2023-09-27-devcontainers', allowedLocales)
    expect(result.id).toBe('talks/2023-09-27-devcontainers')
    expect(result.locale).toBe('es')
  })
})
