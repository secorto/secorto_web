import { step } from '@tests/fixtures'
import type { UILanguages } from '@i18n/ui'
import type { APIRequestContext, APIResponse } from '@playwright/test'

const localeCountry = {
  es: 'es-co',
  en: 'en-us'
} as const satisfies Record<UILanguages, string>

export class RSSJourney {
  constructor(
    public readonly response: APIResponse,
    public readonly body: string,
    private readonly locale: UILanguages
  ) {}

  shouldHaveXmlContentType() {
    return step('responds with XML content type', async ({ expect }) => {
      expect(this.response.status()).toBe(200)
      expect(this.response.headers()['content-type']).toContain('xml')
    })
  }

  shouldHaveChannelStructure() {
    return step('contains valid channel structure', async ({ expect }) => {
      expect(this.body).toContain('<rss')
      expect(this.body).toContain('<channel>')
      expect(this.body).toContain('<title>')
      expect(this.body).toContain('<description>')
      expect(this.body).toContain('<link>')
    })
  }

  shouldHaveAtLeastOneItem() {
    return step('contains at least one item', async ({ expect }) => {
      expect(this.body).toContain('<item>')
      expect(this.body).toContain('<title>')
      expect(this.body).toContain('<pubDate>')
    })
  }

  shouldIncludeLanguageTag() {
    return step('includes correct language tag', async ({ expect }) => {
      expect(this.body).toContain(`<language>${localeCountry[this.locale]}</language>`)
    })
  }
}

export const createRssUserJourney = (request: APIRequestContext, locale: UILanguages) => {
  return (url?: string) =>
    step(`request RSS ${url ?? ''}`, async () => {
      const target = url ?? `/${locale}/rss.xml`
      const response = await request.get(target)
      const body = await response.text()

      return new RSSJourney(response, body, locale)
    })
}

export const userReadsRss = createRssUserJourney
