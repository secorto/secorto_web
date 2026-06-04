import { test } from '@playwright/test'
import { languageKeys } from '@i18n/ui'
import { getRss } from '@tests/pages/api/RssApiResponse'

for (const locale of languageKeys) {
  test.describe(`RSS feed (${locale})`, { tag: ['@api', '@functional', '@rss', `@${locale}`] }, () => {
    test('responds with XML content type', async ({ request }) => {
      const response = await getRss(request, locale)
      await response.shouldHaveXmlContentType()
    })

    test('contains valid channel structure', async ({ request }) => {
      const response = await getRss(request, locale)
      await response.shouldHaveChannelStructure()
    })

    test('contains at least one item', async ({ request }) => {
      const response = await getRss(request, locale)
      await response.shouldHaveAtLeastOneItem()
    })

    test('includes correct language tag', async ({ request }) => {
      const response = await getRss(request, locale)
      await response.shouldIncludeLanguageTag()
    })
  })
}
