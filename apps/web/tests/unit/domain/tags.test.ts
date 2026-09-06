import { describe, expect, it } from 'vitest'
import { tagRoutes } from '@domain/tags'

describe('tagRoutes value object', () => {
  it('resolves the localized slug for each allowed tag', () => {
    expect(tagRoutes.getTagRoute('dev', 'en')).toBe('dev')
    expect(tagRoutes.getTagRoute('dev', 'es')).toBe('desarrollo')

    expect(tagRoutes.getTagRoute('opensource', 'en')).toBe('opensource')
    expect(tagRoutes.getTagRoute('opensource', 'es')).toBe('codigo-abierto')

    expect(tagRoutes.getTagRoute('python', 'en')).toBe('python')
    expect(tagRoutes.getTagRoute('python', 'es')).toBe('python')
  })

  it('builds section-aware URLs with the configured tag index route', () => {
    expect(tagRoutes.getSectionTagURL('blog', 'es', 'python')).toBe(
      '/es/blog/tags/python',
    )

    expect(tagRoutes.getSectionTagURL('projects', 'en', 'testing')).toBe(
      '/en/project/tags/testing',
    )
  })

  it('keeps the route definitions immutable', () => {
    expect(Object.isFrozen(tagRoutes.routes)).toBe(true)
    expect(Object.isFrozen(tagRoutes.routes.dev)).toBe(true)
    expect(Object.isFrozen(tagRoutes.routes.python)).toBe(true)
  })
})
