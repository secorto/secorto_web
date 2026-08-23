import { contractStep, verifyStep } from '@tests/step'
import type { APIRequestContext, APIResponse } from '@playwright/test'
import { text } from '@tests/support/api/parsers'

export const robotsParser = async (response: APIResponse) => {
  const body = await text(response)

  return {
    raw: response,
    body: body,
    shouldBeLoaded: () => verifyStep('robots.txt is loaded', async ({ expect }) => {
      expect(body, 'robots.txt should contain origin').toContain('User-agent: *')
      expect(body, 'robots.txt should allow root').toContain('Allow: /')
      expect(body, 'robots.txt should declare sitemap').toMatch(/Sitemap:\s+https?:\/\/.+\/sitemap-index\.xml/)
    })
  }
}

export const robots = (request: APIRequestContext) =>
  contractStep(
    'fetch robots.txt',
    async () => request.get('/robots.txt'),
    robotsParser,
  )
