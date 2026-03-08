import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from '@utils/frontmatter'

describe('frontmatter util', () => {
  it('parses simple key-values and quoted strings', () => {
    const raw = `---\ntitle: "Hola"\ndraft: true\ncount: 5\n---\n`
    const fm = parseFrontmatter(raw)
    expect(typeof fm).toBe('object')
    expect(fm).not.toBeNull()
    expect(Array.isArray(fm)).toBe(false)
    const obj = fm as Record<string, unknown>
    expect(obj).toHaveProperty('title', 'Hola')
    expect(obj).toHaveProperty('draft', true)
    expect(obj).toHaveProperty('count', 5)
  })

  it('parses CRLF frontmatter', () => {
    const raw = `---\r\ntitle: "Hola"\r\ndraft: true\r\ncount: 5\r\n---\r\n`
    const fm = parseFrontmatter(raw)
    expect(typeof fm).toBe('object')
    expect(fm).not.toBeNull()
    expect(Array.isArray(fm)).toBe(false)
    const obj = fm as Record<string, unknown>
    expect(obj).toHaveProperty('title', 'Hola')
    expect(obj).toHaveProperty('draft', true)
    expect(obj).toHaveProperty('count', 5)
  })

  it('parses arrays and nested maps', () => {
    const raw = `---\ntags:\n  - a\n  - b\ntranslation_origin:\n  locale: 'es'\n  id: '2022-01-01-post'\n---\n`
    const fm = parseFrontmatter(raw)
    expect(typeof fm).toBe('object')
    expect(fm).not.toBeNull()
    expect(Array.isArray(fm)).toBe(false)
    const obj = fm as Record<string, unknown>
    expect(obj).toHaveProperty('tags')
    expect((obj.tags as string[])).toEqual(['a', 'b'])
    expect(obj).toHaveProperty('translation_origin.locale', 'es')
    expect(obj).toHaveProperty('translation_origin.id', '2022-01-01-post')
  })

  it('ignores files without frontmatter', () => {
    const raw = `# no frontmatter here\ncontent`
    const fm = parseFrontmatter(raw)
    expect(typeof fm).toBe('object')
    expect(fm).not.toBeNull()
    expect(Array.isArray(fm)).toBe(false)
    expect(Object.keys(fm as Record<string, unknown>).length).toBe(0)
  })
})
