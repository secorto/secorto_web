import { standalonePageRoutes } from '@domain/standalonePage'
import { languages } from '@i18n/ui'
import { createStandalonePageLinks } from '@secorto/i18n'
import { expect, it } from 'vitest'

it('uses the standalone route value object to resolve localized page URLs', () => {
  expect(standalonePageRoutes.getPageRoute('about', 'es')).toBe('acerca-de')
  expect(standalonePageRoutes.getPageURL('about', 'en')).toBe('/en/about')
})

it('creates translated links for standalone pages', () => {
  const links = createStandalonePageLinks(
    'es/acerca-de',
    'about',
    standalonePageRoutes,
    languages,
  )

  expect(
    links.find(l => l.locale === 'es')?.href
  ).toContain('/es/acerca-de')

  expect(
    links.find(l => l.locale === 'en')?.href
  ).toContain('/en/about')
})
