import { test } from '@tests/fixtures'
import { userIsOnTags } from '@tests/pages/content/TagsUserJourney'
import { languageKeys, type UILanguages, ui } from '@i18n/ui'
import { pageHelper } from '@tests/pages/components/PageHelper'

const fixtures: { locale: UILanguages; expectedTitle: string; expectedDescription: string }[] = languageKeys.map((locale) => ({
  locale,
  expectedTitle: ui[locale]['tags.index_title'],
  expectedDescription: ui[locale]['tags.index_description']
}))

for (const f of fixtures) {
  test.describe(`Tags list (${f.locale})`, { tag: ['@functional', '@tags', `@${f.locale}`] }, () => {
    test('shows page title and description', async ({ page }) => {
      const tags = await userIsOnTags(page, f.locale)
      await tags.shouldHavePageTitle(f.expectedTitle)
      await tags.shouldHavePageDescription(f.expectedDescription)
    })

    test('displays tag groups with correct structure', async ({ page }) => {
      const tags = await userIsOnTags(page, f.locale)
      await tags.shouldShowTagGroups()
      await tags.shouldHaveAtLeastOneTagGroup()
    })

    test('tag groups have localized names and links', async ({ page }) => {
      const tags = await userIsOnTags(page, f.locale)
      await tags.firstTagGroupHeadingShouldBeVisible()
      await tags.shouldHaveAtLeastOneLinkInFirstTagGroup()
    })

    test('tag links are valid and navigable', async ({ page }) => {
      const tags = await userIsOnTags(page, f.locale)
      await tags.firstTagLinkHrefMatches(new RegExp(`^/${f.locale}/[a-z]+/tags/`))

      await tags.clickFirstTagAndWaitForUrl(new RegExp(`/${f.locale}/[a-z]+/tags/`))
      await pageHelper(page).shouldHaveURL(new RegExp(`/${f.locale}/.+/tags/`))
    })

    test('shows "Disponible en" / "Available in" text', async ({ page }) => {
      const tags = await userIsOnTags(page, f.locale)
      const expectedText = f.locale === 'es' ? 'Disponible en' : 'Available in'
      await tags.shouldContainAvailabilityText(expectedText)
    })

    test('renders tag groups with proper data-testid attributes', async ({ page }) => {
      const tags = await userIsOnTags(page, f.locale)
      await tags.shouldHaveAtLeastOneTagGroup()
    })
  })
}

