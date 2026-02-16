import { describe, it, expect } from 'vitest'
import { parseFrontmatter, getNested } from '@utils/frontmatter'

describe('frontmatter util', () => {
  it('parses simple key-values and quoted strings', () => {
    const raw = `---\ntitle: "Hola"\ndraft: true\ncount: 5\n---\n`
    const fm = parseFrontmatter(raw)
    expect(fm.title).toBe('Hola')
    expect(fm.draft).toBe(true)
    expect(fm.count).toBe(5)
  })

  it('parses arrays and nested maps', () => {
    const raw = `---\ntags:\n  - a\n  - b\ntranslation_origin:\n  locale: 'es'\n  id: '2022-01-01-post'\n---\n`
    const fm = parseFrontmatter(raw)
    expect(Array.isArray(fm.tags)).toBe(true)
    expect((fm.tags as string[])).toEqual(['a', 'b'])
    const locale = getNested(fm, ['translation_origin', 'locale'])
    expect(locale).toBe('es')
    const id = getNested(fm, ['translation_origin', 'id'])
    expect(id).toBe('2022-01-01-post')
  })

  it('ignores files without frontmatter', () => {
    const raw = `# no frontmatter here\ncontent`
    const fm = parseFrontmatter(raw)
    expect(Object.keys(fm).length).toBe(0)
  })
})
