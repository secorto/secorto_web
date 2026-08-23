import { test } from '@playwright/test'
import { languageKeys } from '@i18n/ui'
import { rss, shouldBeLoaded } from '@tests/support/api/endpoints/rss'

const localeCountry = {
  en: 'en-us',
  es: 'es-co',
} as const


for (const locale of languageKeys) {
  test.describe(`RSS feed (${locale})`, { tag: ['@functional', '@rss', `@${locale}`] }, () => {
    test('responds with XML content type', async ({ request }) => {
      const response = await rss(request, locale)
      await shouldBeLoaded(response, localeCountry[locale]).soft()
    })
  })
}
