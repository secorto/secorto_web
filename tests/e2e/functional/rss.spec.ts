import { test, expect } from '@playwright/test'
import { languageKeys } from '@i18n/ui'

const localeCountry: Record<string, string> = {
  es: 'es-co',
  en: 'en-us',
}

for (const locale of languageKeys) {
  test.describe(`RSS feed (${locale})`, () => {
    const rssUrl = `/${locale}/rss.xml`

    test('responds with XML content type', async ({ request }) => {
      const response = await request.get(rssUrl)

      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('xml')
    })

    test('contains valid channel structure', async ({ request }) => {
      const response = await request.get(rssUrl)
      const body = await response.text()

      expect(body).toContain('<rss')
      expect(body).toContain('<channel>')
      expect(body).toContain('<title>')
      expect(body).toContain('<description>')
      expect(body).toContain('<link>')
    })

    test('contains at least one item', async ({ request }) => {
      const response = await request.get(rssUrl)
      const body = await response.text()

      expect(body).toContain('<item>')
      expect(body).toContain('<title>')
      expect(body).toContain('<pubDate>')
    })

    test('includes correct language tag', async ({ request }) => {
      const response = await request.get(rssUrl)
      const body = await response.text()

      expect(body).toContain(`<language>${localeCountry[locale]}</language>`)
    })
  })
}
