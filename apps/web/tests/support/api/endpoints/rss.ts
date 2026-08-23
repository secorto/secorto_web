import { z } from 'zod'
import { xml } from '../parsers'
import { contractStep, verifyStep } from '@tests/step'
import type { APIRequestContext } from '@playwright/test'
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

export const rss = (request: APIRequestContext, locale: UILanguages) =>
  contractStep(
    `fetch rss.xml (${locale})`,
    async () => request.get(`/${locale}/rss.xml`),
    xml(rssSchema),
  )

export const shouldBeLoaded = (rss: RSS, locale: string) =>
  verifyStep('rss.xml is loaded', async ({ expect }) => {
    expect(rss.rss.channel.language, `Expected language to be ${locale}`).toBe(locale)
    expect(rss.rss.channel.item.length, `Expected at least one item in the RSS feed`).toBeGreaterThan(0)
  })
