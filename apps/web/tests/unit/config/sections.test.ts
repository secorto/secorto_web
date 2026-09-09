import { describe, it, expect } from 'vitest'
import * as sectionModule from '@domain/section'
import { sectionRoutes } from '@domain/section'

describe('sectionRoutes value object', () => {
  it('does not expose the legacy section config', () => {
    expect('sectionsConfig' in sectionModule).toBe(false)
  })

  it('resolves localized route data through the value object API', () => {
    expect(sectionRoutes.getSectionSlug('blog', 'es')).toBe('blog')
    expect(sectionRoutes.getSectionSlug('talk', 'en')).toBe('talk')
    expect(sectionRoutes.getSectionSlug('work', 'es')).toBe('trabajo')

    expect(sectionRoutes.getSectionPath('projects', 'en')).toBe('/en/project')
    expect(sectionRoutes.getSectionPath('community', 'es')).toBe('/es/comunidad')

    expect(sectionRoutes.getEntryPath('blog', 'es', 'mi-post')).toBe('/es/blog/mi-post')
    expect(sectionRoutes.getEntryPath('work', 'en', 'design-sprint')).toBe('/en/work/design-sprint')
  })

  it('keeps the route dictionary immutable as part of the value object contract', () => {
    expect(Object.isFrozen(sectionRoutes.routes)).toBe(true)
    expect(Object.isFrozen(sectionRoutes.routes.blog)).toBe(true)
    expect(Object.isFrozen(sectionRoutes.routes.projects)).toBe(true)
  })
})
