import { test, expect } from '@playwright/test'
import { TagsPage } from '@tests/pages/TagsPage'
import { languageKeys, type UILanguages, ui } from '@i18n/ui'

const fixtures: { locale: UILanguages; expectedTitle: string; expectedDescription: string }[] = languageKeys.map((locale) => ({
  locale,
  expectedTitle: ui[locale]['tags.index_title'],
  expectedDescription: ui[locale]['tags.index_description']
}))

for (const f of fixtures) {
  test.describe(`Tags list (${f.locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${f.locale}/tags`)
    })

    test('shows page title and description', async ({ page }) => {
      const tags = new TagsPage(page)
      await expect(tags.pageTitle()).toHaveText(f.expectedTitle)
      await expect(tags.pageDescription()).toHaveText(f.expectedDescription)
    })

    test('displays tag groups with correct structure', async ({ page }) => {
      const tags = new TagsPage(page)
      await expect(tags.tagGroups()).toBeVisible()

      const groupCount = await tags.allTagGroups().count()
      expect(groupCount).toBeGreaterThan(0)
    })

    test('tag groups have localized names and links', async ({ page }) => {
      const tags = new TagsPage(page)

      const firstGroup = tags.firstTagGroup()
      await expect(firstGroup.locator('h2').first()).toBeVisible()

      const links = firstGroup.locator('a')
      const linkCount = await links.count()
      expect(linkCount).toBeGreaterThan(0)
    })

    test('tag links are valid and navigable', async ({ page }) => {
      const tags = new TagsPage(page)

      const firstLink = tags.firstTagLink()
      const href = await firstLink.getAttribute('href')

      expect(href).toBeTruthy()
      expect(href).toMatch(new RegExp(`^/${f.locale}/[a-z]+/tags/`))

      await Promise.all([
        page.waitForURL(new RegExp(`/${f.locale}/[a-z]+/tags/`)),
        firstLink.click()
      ])
      expect(page.url()).toContain(`/${f.locale}`)
      expect(page.url()).toContain('/tags/')
    })

    test('shows "Disponible en" / "Available in" text', async ({ page }) => {
      const tags = new TagsPage(page)
      const textContent = await tags.getPageBodyText()
      const expectedText = f.locale === 'es' ? 'Disponible en' : 'Available in'
      expect(textContent).toContain(expectedText)
    })

    test('renders tag groups with proper data-testid attributes', async ({ page }) => {
      const tags = new TagsPage(page)
      const groups = await tags.allTagGroups().all()

      expect(groups.length).toBeGreaterThan(0)
    })
  })
}

