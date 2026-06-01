import { test, expect } from '@tests/fixtures'
import { tagsPage } from '@tests/pages/content/TagsPage'
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

    test('shows page title and description', async ({ page, Then }) => {
      const tags = tagsPage(page)
      await Then(tags.shouldHavePageTitle(f.expectedTitle))
      await Then(tags.shouldHavePageDescription(f.expectedDescription))
    })

    test('displays tag groups with correct structure', async ({ page, Then }) => {
      const tags = tagsPage(page)
      await Then(tags.shouldShowTagGroups())
      await Then(tags.shouldHaveAtLeastOneTagGroup())
    })

    test('tag groups have localized names and links', async ({ page, Then }) => {
      const tags = tagsPage(page)
      await Then(tags.firstTagGroupHeadingShouldBeVisible())
      await Then(tags.shouldHaveAtLeastOneLinkInFirstTagGroup())
    })

    test('tag links are valid and navigable', async ({ page, Then, When }) => {
      const tags = tagsPage(page)
      const href = await When(tags.firstTagHref())

      expect(href).toBeTruthy()
      expect(href).toMatch(new RegExp(`^/${f.locale}/[a-z]+/tags/`))

      await When(tags.clickFirstTagAndWaitForUrl(new RegExp(`/${f.locale}/[a-z]+/tags/`)))
      await Then(tags.shouldHaveUrlContaining(f.locale))
    })

    test('shows "Disponible en" / "Available in" text', async ({ page, Then }) => {
      const tags = tagsPage(page)
      const expectedText = f.locale === 'es' ? 'Disponible en' : 'Available in'
      await Then(tags.shouldContainAvailabilityText(expectedText))
    })

    test('renders tag groups with proper data-testid attributes', async ({ page, Then }) => {
      const tags = tagsPage(page)
      await Then(tags.shouldHaveAtLeastOneTagGroup())
    })
  })
}

