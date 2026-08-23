import { contractStep, verifyStep } from '@tests/step'
import type { APIRequestContext } from '@playwright/test'
import { text } from '@tests/support/api/parsers'

export const robots = (request: APIRequestContext) =>
  contractStep(
    'fetch robots.txt',
    async () => request.get('/robots.txt'),
    async (response) => text(['text/plain'])(response),
  )

export const shouldBeLoaded = (body: string) =>
  verifyStep('robots.txt is loaded', async ({ expect }) => {
    expect(body).toContain('User-agent: *')
    expect(body).toContain('Allow: /')
    expect(body).toMatch(/Sitemap:\s+https?:\/\/.+\/sitemap-index\.xml/)
  })
