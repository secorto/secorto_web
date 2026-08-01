/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from 'vitest'
import { ZodError } from 'zod'
import {
  SectionTypeSchema,
  UILanguagesSchema,
  HighlightSchema,
  HomeFrontmatterSchema,
  type HomeFrontmatter
} from '@domain/home'

describe('home domain schemas', () => {
  describe('SectionTypeSchema', () => {
    it('accepts valid section types', () => {
      expect(SectionTypeSchema.parse('blog')).toBe('blog')
      expect(SectionTypeSchema.parse('talk')).toBe('talk')
      expect(SectionTypeSchema.parse('work')).toBe('work')
      expect(SectionTypeSchema.parse('projects')).toBe('projects')
      expect(SectionTypeSchema.parse('community')).toBe('community')
    })

    it('rejects invalid section types', () => {
      expect(() => SectionTypeSchema.parse('invalid')).toThrow(ZodError)
      expect(() => SectionTypeSchema.parse('')).toThrow(ZodError)
      expect(() => SectionTypeSchema.parse(null)).toThrow(ZodError)
    })
  })

  describe('UILanguagesSchema', () => {
    it('accepts valid languages', () => {
      expect(UILanguagesSchema.parse('es')).toBe('es')
      expect(UILanguagesSchema.parse('en')).toBe('en')
    })

    it('rejects invalid languages', () => {
      expect(() => UILanguagesSchema.parse('fr')).toThrow(ZodError)
      expect(() => UILanguagesSchema.parse('pt')).toThrow(ZodError)
      expect(() => UILanguagesSchema.parse('')).toThrow(ZodError)
    })
  })

  describe('HighlightSchema', () => {
    it('accepts valid highlight with section and slug', () => {
      const highlight = HighlightSchema.parse({
        section: 'work',
        slug: 'perficient'
      })
      expect(highlight).toEqual({ section: 'work', slug: 'perficient' })
    })

    it('rejects highlight with empty slug', () => {
      expect(() =>
        HighlightSchema.parse({
          section: 'work',
          slug: ''
        })
      ).toThrow(ZodError)
    })

    it('rejects highlight with invalid section', () => {
      expect(() =>
        HighlightSchema.parse({
          section: 'invalid',
          slug: 'perficient'
        })
      ).toThrow(ZodError)
    })

    it('rejects highlight without required fields', () => {
      expect(() => HighlightSchema.parse({})).toThrow(ZodError)
      expect(() => HighlightSchema.parse({ section: 'work' })).toThrow(ZodError)
    })
  })

  describe('HomeFrontmatterSchema', () => {
    const validFrontmatter: HomeFrontmatter = {
      title: 'Página de inicio',
      subTitle: 'Soy Sergio Carlos Orozco Torres',
      locale: 'es',
      highlights: [
        { section: 'work', slug: 'perficient' },
        { section: 'community', slug: 'pybaq' }
      ]
    }

    it('accepts valid frontmatter', () => {
      const result = HomeFrontmatterSchema.parse(validFrontmatter)
      expect(result).toEqual(validFrontmatter)
    })

    it('accepts valid frontmatter with draft flag', () => {
      const frontmatter = {
        ...validFrontmatter,
        draft: true
      }
      const result = HomeFrontmatterSchema.parse(frontmatter)
      expect(result.draft).toBe(true)
    })

    it('rejects frontmatter without title', () => {
      const { title, ...rest } = validFrontmatter
      expect(() => HomeFrontmatterSchema.parse(rest)).toThrow(ZodError)
    })

    it('rejects frontmatter without subTitle', () => {
      const { subTitle, ...rest } = validFrontmatter
      expect(() => HomeFrontmatterSchema.parse(rest)).toThrow(ZodError)
    })

    it('rejects frontmatter without locale', () => {
      const { locale, ...rest } = validFrontmatter
      expect(() => HomeFrontmatterSchema.parse(rest)).toThrow(ZodError)
    })

    it('rejects frontmatter without highlights', () => {
      const { highlights, ...rest } = validFrontmatter
      expect(() => HomeFrontmatterSchema.parse(rest)).toThrow(ZodError)
    })

    it('rejects frontmatter with empty highlights array', () => {
      expect(() =>
        HomeFrontmatterSchema.parse({
          ...validFrontmatter,
          highlights: []
        })
      ).toThrow(ZodError)
    })

    it('rejects frontmatter with invalid locale', () => {
      expect(() =>
        HomeFrontmatterSchema.parse({
          ...validFrontmatter,
          locale: 'fr'
        })
      ).toThrow(ZodError)
    })

    it('rejects frontmatter with invalid highlight section', () => {
      expect(() =>
        HomeFrontmatterSchema.parse({
          ...validFrontmatter,
          highlights: [{ section: 'invalid', slug: 'perficient' }]
        })
      ).toThrow(ZodError)
    })

    it('accepts draft as optional field', () => {
      const result = HomeFrontmatterSchema.parse(validFrontmatter)
      expect(result.draft).toBeUndefined()
    })
  })
})
