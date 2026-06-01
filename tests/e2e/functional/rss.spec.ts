import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import type { GherkinStepDefinition } from '@tests/fixtures'
import { createRssUserJourney, type RSSJourney } from '@tests/pages/functional/RssUserJourney'

for (const locale of languageKeys) {
  test.describe(`RSS feed (${locale})`, { tag: ['@functional', '@rss', `@${locale}`] }, () => {
    let userRequestRss: (url?: string) => GherkinStepDefinition<RSSJourney>

    test.beforeEach(async ({ request }) => {
      userRequestRss = createRssUserJourney(request, locale)
    })

    test('responds with XML content type', async ({ Given, Then }) => {
      const r = await Given(userRequestRss())
      await Then(r.shouldHaveXmlContentType())
    })

    test('contains valid channel structure', async ({ Given, Then }) => {
      const r = await Given(userRequestRss())
      await Then(r.shouldHaveChannelStructure())
    })

    test('contains at least one item', async ({ Given, Then }) => {
      const r = await Given(userRequestRss())
      await Then(r.shouldHaveAtLeastOneItem())
    })

    test('includes correct language tag', async ({ Given, Then }) => {
      const r = await Given(userRequestRss())
      await Then(r.shouldIncludeLanguageTag())
    })
  })
}
