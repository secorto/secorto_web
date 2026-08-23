import { contractStep, verifyStep } from '@tests/step'
import type { APIRequestContext, APIResponse } from '@playwright/test'

export const robots = (request: APIRequestContext) =>
  contractStep(
    'fetch robots.txt',
    async () => request.get('/robots.txt'),
    (response) => response.text(),
  )

export const shouldBeLoaded = (response: APIResponse, body: string) =>
  verifyStep('robots.txt is loaded', async ({ expect }) => {
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/plain')
    expect(body).toContain('User-agent: *')
    expect(body).toContain('Allow: /')
    expect(body).toMatch(/Sitemap:\s+https?:\/\/.+\/sitemap-index\.xml/)
  })
