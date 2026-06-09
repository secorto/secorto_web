import { step } from '@tests/fixtures'
import type { UILanguages } from '@i18n/ui'
import { expect } from '@playwright/test'
import type { APIRequestContext, APIResponse } from '@playwright/test'

const localeCountry = {
  es: 'es-co',
  en: 'en-us'
} as const satisfies Record<UILanguages, string>

export class RSSApiResponse {
  constructor(
    public readonly response: APIResponse,
    public readonly body: string,
    private readonly locale: UILanguages
  ) {}

  shouldHaveXmlContentType() {
    return step('responds with XML content type', async () => {
      expect(this.response.status()).toBe(200)
      expect(this.response.headers()['content-type']).toContain('xml')
    })
  }

  shouldHaveChannelStructure() {
    return step('contains valid channel structure', async () => {
      expect(this.body).toContain('<rss')
      expect(this.body).toContain('<channel>')
      expect(this.body).toContain('<title>')
      expect(this.body).toContain('<description>')
      expect(this.body).toContain('<link>')
    })
  }

  shouldHaveAtLeastOneItem() {
    return step('contains at least one item', async () => {
      expect(this.body).toContain('<item>')
      expect(this.body).toContain('<title>')
      expect(this.body).toContain('<pubDate>')
    })
  }

  shouldIncludeLanguageTag() {
    return step('includes correct language tag', async () => {
      expect(this.body).toContain(`<language>${localeCountry[this.locale]}</language>`)
    })
  }
}

export const getRss = async (request: APIRequestContext, locale: UILanguages) => {
  const target = `/${locale}/rss.xml`

  return step(`request RSS ${target}`, async () => {
    const response = await request.get(target)
    const body = await response.text()

    return new RSSApiResponse(response, body, locale)
  })
}
