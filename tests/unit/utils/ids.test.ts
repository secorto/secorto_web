import { test, expect, describe } from 'vitest'
import { extractCleanId } from '@utils/ids'

describe('extractCleanId', () => {
  test('removes Spanish locale prefix from entry ID and returns locale', () => {
    const result = extractCleanId('es/2025-01-22-my-post')
    expect(result.id).toBe('2025-01-22-my-post')
    expect(result.locale).toBe('es')
  })

  test('removes English locale prefix from entry ID and returns locale', () => {
    const result = extractCleanId('en/2025-01-22-my-post')
    expect(result.id).toBe('2025-01-22-my-post')
    expect(result.locale).toBe('en')
  })

  test('handles entry IDs with nested paths and returns locale', () => {
    const result = extractCleanId('es/blog/category/2025-01-22-my-post')
    expect(result.id).toBe('blog/category/2025-01-22-my-post')
    expect(result.locale).toBe('es')
  })

  test('returns same ID if no locale prefix exists and no locale', () => {
    const result = extractCleanId('2025-01-22-my-post')
    expect(result.id).toBe('2025-01-22-my-post')
    expect(result.locale).toBeUndefined()
  })

  test('handles simple slug without date prefix', () => {
    const result = extractCleanId('es/simple-slug')
    expect(result.id).toBe('simple-slug')
    expect(result.locale).toBe('es')
  })

  test('handles entry ID with only locale (edge case)', () => {
    // Current implementation treats 'es' as no-prefix-without-slash
    const result = extractCleanId('es')
    expect(result.id).toBe('es')
    expect(result.locale).toBeUndefined()
  })

  test('handles entry ID with multiple locale-like prefixes (only removes first)', () => {
    // Edge case: if an entry is named "en/es/something", only first locale is removed
    const result = extractCleanId('es/en/something')
    expect(result.id).toBe('en/something')
    expect(result.locale).toBe('es')
  })

  test('throws when unknown locale prefix is present', () => {
    expect(() => extractCleanId('fr/2025-01-22-my-post' as string)).toThrow('Unknown locale prefix')
  })

  test('throws on empty string', () => {
    expect(() => extractCleanId('')).toThrow('entryId cannot be empty')
  })

  test('does not remove locale from middle of path', () => {
    const result = extractCleanId('category/es/2025-01-22-post')
    expect(result.id).toBe('category/es/2025-01-22-post')
    expect(result.locale).toBeUndefined()
  })

  test('handles locale prefix with trailing content', () => {
    const result = extractCleanId('es/talks/2023-09-27-devcontainers')
    expect(result.id).toBe('talks/2023-09-27-devcontainers')
    expect(result.locale).toBe('es')
  })
})
