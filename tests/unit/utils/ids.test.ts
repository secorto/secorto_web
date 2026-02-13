import { test, expect, describe } from 'vitest'
import { extractCleanId } from '@utils/ids'

describe('extractCleanId', () => {
  test('removes Spanish locale prefix from entry ID', () => {
    const result = extractCleanId('es/2025-01-22-my-post')
    expect(result).toBe('2025-01-22-my-post')
  })

  test('removes English locale prefix from entry ID', () => {
    const result = extractCleanId('en/2025-01-22-my-post')
    expect(result).toBe('2025-01-22-my-post')
  })

  test('handles entry IDs with nested paths', () => {
    const result = extractCleanId('es/blog/category/2025-01-22-my-post')
    expect(result).toBe('blog/category/2025-01-22-my-post')
  })

  test('returns same ID if no locale prefix exists', () => {
    const result = extractCleanId('2025-01-22-my-post')
    expect(result).toBe('2025-01-22-my-post')
  })

  test('handles simple slug without date prefix', () => {
    const result = extractCleanId('es/simple-slug')
    expect(result).toBe('simple-slug')
  })

  test('handles entry ID with only locale (edge case)', () => {
    // Current implementation doesn't remove standalone locale without trailing slash
    const result = extractCleanId('es')
    expect(result).toBe('es')
  })

  test('handles entry ID with multiple locale-like prefixes (only removes first)', () => {
    // Edge case: if an entry is named "en/es/something", only first locale is removed
    const result = extractCleanId('es/en/something')
    expect(result).toBe('en/something')
  })

  test('handles empty string', () => {
    const result = extractCleanId('')
    expect(result).toBe('')
  })

  test('does not remove locale from middle of path', () => {
    const result = extractCleanId('category/es/2025-01-22-post')
    expect(result).toBe('category/es/2025-01-22-post')
  })

  test('handles locale prefix with trailing content', () => {
    const result = extractCleanId('es/talks/2023-09-27-devcontainers')
    expect(result).toBe('talks/2023-09-27-devcontainers')
  })
})
