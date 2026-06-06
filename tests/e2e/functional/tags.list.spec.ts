import { test } from '@tests/fixtures'
import { userIsOnTags } from '@tests/support/ui/content/TagsPage'
import { languageKeys, type UILanguages, ui } from '@i18n/ui'
import { pageHelper } from '@tests/support/ui/components/PageHelper'

const fixtures: { locale: UILanguages; expectedTitle: string; expectedDescription: string }[] = languageKeys.map((locale) => ({
  locale,
  expectedTitle: ui[locale]['tags.index_title'],
  expectedDescription: ui[locale]['tags.index_description']
}))

for (const f of fixtures) {
  test.describe(`Tags list (${f.locale})`, { tag: ['@functional', '@tags', `@${f.locale}`] }, () => {
    test('shows page title and description', async ({ page }) => {
      const tagsPage = await userIsOnTags(page, f.locale)
      await tagsPage.shouldHavePageTitle(f.expectedTitle)
      await tagsPage.shouldHavePageDescription(f.expectedDescription)
    })

    test('displays tag groups with correct structure', async ({ page }) => {
      const tagsPage = await userIsOnTags(page, f.locale)
      await tagsPage.shouldShowTagGroups()
      await tagsPage.shouldHaveAtLeastOneTagGroup()
    })

    test('tag groups have localized names and links', async ({ page }) => {
      const tagsPage = await userIsOnTags(page, f.locale)
      await tagsPage.firstTagGroupHeadingShouldBeVisible()
      await tagsPage.shouldHaveAtLeastOneLinkInFirstTagGroup()
    })

    test('tag links are valid and navigable', async ({ page }) => {
      const tagsPage = await userIsOnTags(page, f.locale)
      await tagsPage.firstTagLinkHrefMatches(new RegExp(`^/${f.locale}/[a-z]+/tags/`))

      await tagsPage.clickFirstTagAndWaitForUrl(new RegExp(`/${f.locale}/[a-z]+/tags/`))
      await pageHelper(page).shouldHaveURL(new RegExp(`/${f.locale}/.+/tags/`))
    })

    test('shows "Disponible en" / "Available in" text', async ({ page }) => {
      const tagsPage = await userIsOnTags(page, f.locale)
      const expectedText = f.locale === 'es' ? 'Disponible en' : 'Available in'
      await tagsPage.shouldContainAvailabilityText(expectedText)
    })

    test('renders tag groups with proper data-testid attributes', async ({ page }) => {
      const tagsPage = await userIsOnTags(page, f.locale)
      await tagsPage.shouldHaveAtLeastOneTagGroup()
    })
  })
}

