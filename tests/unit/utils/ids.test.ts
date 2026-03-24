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

  test('throws when no locale prefix exists', () => {
    expect(() => extractCleanId('2025-01-22-my-post')).toThrow('Unknown locale prefix in entryId "2025-01-22-my-post"')
  })

  test('handles simple slug without date prefix', () => {
    const result = extractCleanId('es/simple-slug')
    expect(result.id).toBe('simple-slug')
    expect(result.locale).toBe('es')
  })

  test('throws when entry ID has only locale', () => {
    expect(() => extractCleanId('es')).toThrow('Unknown locale prefix in entryId "es"')
  })

  test('handles entry ID with multiple locale-like prefixes (only removes first)', () => {
    const result = extractCleanId('es/en/something')
    expect(result.id).toBe('en/something')
    expect(result.locale).toBe('es')
  })

  test('throws when unknown locale prefix is present', () => {
    expect(() => extractCleanId('fr/2025-01-22-my-post' as string)).toThrow('Unknown locale prefix "fr" in entryId "fr/2025-01-22-my-post"')
  })

  test('throws on empty string', () => {
    expect(() => extractCleanId('')).toThrow('entryId cannot be empty')
  })

  test('throws on locale from middle of path', () => {
    expect(() => extractCleanId('category/es/2025-01-22-post')).toThrow('Unknown locale prefix "category" in entryId "category/es/2025-01-22-post"')
  })

  test('handles locale prefix with trailing content', () => {
    const result = extractCleanId('es/talks/2023-09-27-devcontainers')
    expect(result.id).toBe('talks/2023-09-27-devcontainers')
    expect(result.locale).toBe('es')
  })
})
