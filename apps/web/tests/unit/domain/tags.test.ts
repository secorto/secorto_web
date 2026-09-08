import { describe, expect, it } from 'vitest'
import { tagRoutes } from '@domain/tags'

describe('tagRoutes value object', () => {
  it('resolves the localized slug for each allowed tag', () => {
    expect(tagRoutes.getTagSlug('dev', 'en')).toBe('dev')
    expect(tagRoutes.getTagSlug('dev', 'es')).toBe('desarrollo')

    expect(tagRoutes.getTagSlug('opensource', 'en')).toBe('opensource')
    expect(tagRoutes.getTagSlug('opensource', 'es')).toBe('codigo-abierto')

    expect(tagRoutes.getTagSlug('python', 'en')).toBe('python')
    expect(tagRoutes.getTagSlug('python', 'es')).toBe('python')
  })

  it('builds localized section tag paths', () => {
    expect(tagRoutes.getSectionTagPath('blog', 'es', 'python')).toBe(
      '/es/blog/tags/python',
    )

    expect(tagRoutes.getSectionTagPath('projects', 'en', 'testing')).toBe(
      '/en/project/tags/testing',
    )
  })

  it('keeps the route definitions immutable', () => {
    expect(Object.isFrozen(tagRoutes.routes)).toBe(true)
    expect(Object.isFrozen(tagRoutes.routes.dev)).toBe(true)
    expect(Object.isFrozen(tagRoutes.routes.python)).toBe(true)
  })
})
