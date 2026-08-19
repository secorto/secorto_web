import { it, expect, describe } from 'vitest'

import { getStaticPathsSections } from '@secorto/astro-i18n'
import { sectionRoutes } from '@secorto/i18n-core'

describe('getStaticPathsSections', () => {
  const routes = sectionRoutes({
    blog: {
      es: 'blog',
      en: 'blog'
    },
    talk: {
      es: 'charla',
      en: 'talk'
    }
  })

  const allowedLocales = ['es', 'en'] as const

  it('generates the final localized listing shape for all sections', async () => {
    const result = await getStaticPathsSections(routes, allowedLocales)

    expect(result).toEqual([
      { params: { locale: 'es', section: 'blog' }, props: { section: 'blog' } },
      { params: { locale: 'en', section: 'blog' }, props: { section: 'blog' } },
      { params: { locale: 'es', section: 'charla' }, props: { section: 'talk' } },
      { params: { locale: 'en', section: 'talk' }, props: { section: 'talk' } }
    ])
  })
})
