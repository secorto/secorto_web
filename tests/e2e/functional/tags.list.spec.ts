import { test } from '@tests/fixtures'
import { userIsOnTags } from '@tests/pages/content/TagsUserJourney'
import { languageKeys, type UILanguages, ui } from '@i18n/ui'

const fixtures: { locale: UILanguages; expectedTitle: string; expectedDescription: string }[] = languageKeys.map((locale) => ({
  locale,
  expectedTitle: ui[locale]['tags.index_title'],
  expectedDescription: ui[locale]['tags.index_description']
}))

for (const f of fixtures) {
  test.describe(`Tags list (${f.locale})`, () => {
    test('shows page title and description', async ({ page, When, Then }) => {
      const tags = await When(userIsOnTags(page, f.locale))
      await Then(tags.shouldHavePageTitle(f.expectedTitle))
      await Then(tags.shouldHavePageDescription(f.expectedDescription))
    })

    test('displays tag groups with correct structure', async ({ page, When, Then }) => {
      const tags = await When(userIsOnTags(page, f.locale))
      await Then(tags.shouldShowTagGroups())
      await Then(tags.shouldHaveAtLeastOneTagGroup())
    })

    test('tag groups have localized names and links', async ({ page, When, Then }) => {
      const tags = await When(userIsOnTags(page, f.locale))
      await Then(tags.firstTagGroupHeadingShouldBeVisible())
      await Then(tags.shouldHaveAtLeastOneLinkInFirstTagGroup())
    })

    test('tag links are valid and navigable', async ({ page, Then, When }) => {
      const tags = await When(userIsOnTags(page, f.locale))
      await Then(tags.firstTagLinkHrefMatches(new RegExp(`^/${f.locale}/[a-z]+/tags/`)))

      await When(tags.clickFirstTagAndWaitForUrl(new RegExp(`/${f.locale}/[a-z]+/tags/`)))
      await Then(tags.shouldHaveUrlContaining(f.locale))
    })

    test('shows "Disponible en" / "Available in" text', async ({ page, When, Then }) => {
      const tags = await When(userIsOnTags(page, f.locale))
      const expectedText = f.locale === 'es' ? 'Disponible en' : 'Available in'
      await Then(tags.shouldContainAvailabilityText(expectedText))
    })

    test('renders tag groups with proper data-testid attributes', async ({ page, When, Then }) => {
      const tags = await When(userIsOnTags(page, f.locale))
      await Then(tags.shouldHaveAtLeastOneTagGroup())
    })
  })
}

