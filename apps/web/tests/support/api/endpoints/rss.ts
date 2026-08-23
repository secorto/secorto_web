import { z } from 'zod'
import { xml } from '../parsers'
import { contractStep, verifyStep } from '@tests/step'
import type { APIRequestContext, APIResponse } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'

export const rssSchema = z.object({
  rss: z.object({
    channel: z.object({
      title: z.string(),
      description: z.string(),
      link: z.string(),
      language: z.string(),
      item: z.array(
        z.object({
          title: z.string(),
          pubDate: z.string(),
        })
      ),
    }),
  }),
})

export type RSS = z.infer<typeof rssSchema>

export const rssParser = async (response: APIResponse) => {
  const body = await xml(rssSchema)(response)

  return {
    raw: response,
    body: body,
    shouldBeLoaded: (localeCountry: string) => verifyStep(`rss.xml is loaded in ${localeCountry}`, async ({ expect }) => {
      expect(body.rss.channel.language, `Expected language to be ${localeCountry}`).toBe(localeCountry)
      expect(body.rss.channel.item.length, `Expected at least one item in the RSS feed`).toBeGreaterThan(0)
    })
  }
}

export const rss = (request: APIRequestContext, locale: UILanguages) =>
  contractStep(
    `fetch rss.xml (${locale})`,
    async () => request.get(`/${locale}/rss.xml`),
    rssParser,
  )
