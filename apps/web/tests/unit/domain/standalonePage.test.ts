import { standalonePageIndex } from '@domain/standalonePage'
import { languages } from '@i18n/ui'
import { createStandalonePageLinks } from '@secorto/i18n'
import { expect, it } from 'vitest'

it('creates translated links for standalone pages', () => {
  const links = createStandalonePageLinks(
    'es/acerca-de',
    'about',
    standalonePageIndex,
    languages,
  )

  expect(
    links.find(l => l.locale === 'es')?.href
  ).toContain('/es/acerca-de')

  expect(
    links.find(l => l.locale === 'en')?.href
  ).toContain('/en/about')
})