import { step } from '@tests/fixtures'
import type { UILanguages } from '@i18n/ui'
import type { APIRequestContext, APIResponse } from '@playwright/test'

const localeCountry = {
  es: 'es-co',
  en: 'en-us'
} as const satisfies Record<UILanguages, string>

export type RSSJourney = {
  response: APIResponse
  body: string
  shouldHaveXmlContentType: () => ReturnType<typeof step>
  shouldHaveChannelStructure: () => ReturnType<typeof step>
  shouldHaveAtLeastOneItem: () => ReturnType<typeof step>
  shouldIncludeLanguageTag: () => ReturnType<typeof step>
}

export const createRssUserJourney = (request: APIRequestContext, locale: UILanguages) => {
  return (url?: string) =>
    step(`request RSS ${url ?? ''}`, async () => {
      const target = url ?? `/${locale}/rss.xml`
      const response = await request.get(target)
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
}
