/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from 'vitest'
import { ZodError } from 'zod'
import {
  SectionTypeSchema,
  UILanguagesSchema,
  RelatedContentSchema,
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

  describe('RelatedContentSchema', () => {
    it('accepts valid related content with section and slug', () => {
      const relatedContent = RelatedContentSchema.parse({
        section: 'work',
        slug: 'perficient'
      })
      expect(relatedContent).toEqual({ section: 'work', slug: 'perficient' })
    })

    it('rejects related content section with empty slug', () => {
      expect(() =>
        RelatedContentSchema.parse({
          section: 'work',
          slug: ''
        })
      ).toThrow(ZodError)
    })

    it('rejects related content section with invalid section', () => {
      expect(() =>
        RelatedContentSchema.parse({
          section: 'invalid',
          slug: 'perficient'
        })
      ).toThrow(ZodError)
    })

    it('rejects related content section  without required fields', () => {
      expect(() => RelatedContentSchema.parse({})).toThrow(ZodError)
      expect(() => RelatedContentSchema.parse({ section: 'work' })).toThrow(ZodError)
    })
  })

  describe('HomeFrontmatterSchema', () => {
    const validFrontmatter: HomeFrontmatter = {
      title: 'Página de inicio',
      subTitle: 'Soy Sergio Carlos Orozco Torres',
      locale: 'es',
      relatedContent: [
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

    it('rejects frontmatter without related content', () => {
      const { relatedContent, ...rest } = validFrontmatter
      expect(() => HomeFrontmatterSchema.parse(rest)).toThrow(ZodError)
    })

    it('rejects frontmatter with empty relatedContent array', () => {
      expect(() =>
        HomeFrontmatterSchema.parse({
          ...validFrontmatter,
          relatedContent: []
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

    it('rejects frontmatter with invalid relatedContent section', () => {
      expect(() =>
        HomeFrontmatterSchema.parse({
          ...validFrontmatter,
          relatedContent: [{ section: 'invalid', slug: 'perficient' }]
        })
      ).toThrow(ZodError)
    })

    it('accepts draft as optional field', () => {
      const result = HomeFrontmatterSchema.parse(validFrontmatter)
      expect(result.draft).toBeUndefined()
    })
  })
})
