import { test, step } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import type { GherkinStepDefinition } from '@tests/fixtures'

const localeCountry: Record<string, string> = {
  es: 'es-co',
  en: 'en-us',
}

for (const locale of languageKeys) {
  test.describe(`RSS feed (${locale})`, () => {
    const rssUrl = `/${locale}/rss.xml`

    let userRequestRss: (url?: string) => GherkinStepDefinition<any>

    test.beforeEach(async ({ request }) => {
      userRequestRss = (url = rssUrl) =>
        step(`request RSS ${url}`, async () => {
          const response = await request.get(url)
          const body = await response.text()

          return {
            response,
            body,
            shouldHaveXmlContentType: () =>
              step('responds with XML content type', async ({ expect }) => {
                expect(response.status()).toBe(200)
                expect(response.headers()['content-type']).toContain('xml')
              }),
            shouldHaveChannelStructure: () =>
              step('contains valid channel structure', async ({ expect }) => {
                expect(body).toContain('<rss')
                expect(body).toContain('<channel>')
                expect(body).toContain('<title>')
                expect(body).toContain('<description>')
                expect(body).toContain('<link>')
              }),
            shouldHaveAtLeastOneItem: () =>
              step('contains at least one item', async ({ expect }) => {
                expect(body).toContain('<item>')
                expect(body).toContain('<title>')
                expect(body).toContain('<pubDate>')
              }),
            shouldIncludeLanguageTag: () =>
              step('includes correct language tag', async ({ expect }) => {
                expect(body).toContain(`<language>${localeCountry[locale]}</language>`)
              })
          }
        })
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
