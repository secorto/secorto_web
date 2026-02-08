import { test, expect } from '@playwright/test'
import { ContentListPage } from '@tests/pages/ContentListPage'
import { languageKeys, ui, type UILanguages } from '@i18n/ui'
import { openItem } from '@tests/actions/ContentListActions'
import { getURLForSection } from '@config/sections'
import { mockGiscus } from '@tests/e2e/helpers/mockGiscus'

const expectedTitles: Record<UILanguages, string> = {
  es: 'Devcontainers en localhost',
  en: 'Devcontainers on localhost'
}

const expectedTags: Record<UILanguages, string> = {
  es: `
    - link "python":
      - /url: /es/charla/tags/python
      - paragraph: python
    - link "containers":
      - /url: /es/charla/tags/containers
      - paragraph: containers
    `,
  en: `
    - link "python":
      - /url: /en/talk/tags/python
      - paragraph: python
    - link "containers":
      - /url: /en/talk/tags/containers
      - paragraph: containers
    `
}


test.describe('Charlas', () => {
  for (const locale of languageKeys) {
    test(`Permite navegar por categorías y ver una charla (${locale})`, async ({ page }) => {
      const list = new ContentListPage(page)
      await mockGiscus(page)

      await page.goto(getURLForSection('talk', locale))

      // Verifica título y encabezado principal (i18n)
      await expect(page).toHaveTitle(`${ui[locale]['nav.talks']} | SeCOrTo`)
      await expect(list.headerTitle()).toHaveText(ui[locale]['nav.talks'])

      // Interactúa con la categoría "containers"
      const containersTag = list.tagLink('containers')
      await expect(containersTag).not.toHaveClass(/active/)
      await containersTag.click()
      await expect(containersTag).toHaveClass(/active/)
      await expect(list.headerTitle()).toHaveText(`${ui[locale]['nav.talks']} - containers`)

      // Accede a la charla de Devcontainers
      await openItem(list, locale, 'talk', '2023-09-27-devcontainers')
      await expect(list.headerTitle()).toHaveText(expectedTitles[locale])
      await expect(list.tags()).toMatchAriaSnapshot(expectedTags[locale])

      // Espera que el <script> inyectado exista y luego verifica atributos
      await expect(list.commentsScript()).toHaveCount(1)
      await expect(list.commentsScript()).toHaveAttribute('data-lang', locale)
      await expect(list.commentsScript()).toHaveAttribute('data-repo', 'secorto/secorto_web')

      // Confirma que el iframe mock (o real) está visible
      await expect(list.commentsFrame()).toBeVisible({ timeout: 30000 })
    })
  }
})
