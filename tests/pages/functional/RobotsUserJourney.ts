import { step } from '@tests/fixtures'
import type { APIRequestContext, APIResponse } from '@playwright/test'

export type RobotsJourney = {
  response: APIResponse
  body: string
  shouldHavePlainText: () => ReturnType<typeof step>
  shouldContainUserAgentAndAllow: () => ReturnType<typeof step>
  shouldContainSitemapUrl: () => ReturnType<typeof step>
}

export const createRobotsUserJourney = (request: APIRequestContext) => {
  return (path = '/robots.txt') =>
    step(`a client requests ${path}`, async () => {
      const response = await request.get(path)
      const body = await response.text()

      return {
        response,
        body,
        shouldHavePlainText: () =>
          step('responds with plain text content type', async ({ expect }) => {
            expect(response.status()).toBe(200)
            expect(response.headers()['content-type']).toContain('text/plain')
          }),
        shouldContainUserAgentAndAllow: () =>
          step('contains User-agent and Allow', async ({ expect }) => {
            expect(body).toContain('User-agent: *')
            expect(body).toContain('Allow: /')
          }),
        shouldContainSitemapUrl: () =>
          step('contains Sitemap URL', async ({ expect }) => {
            expect(body).toMatch(/Sitemap:\s+https?:\/\/.+\/sitemap-index\.xml/)
          })
      }
    })
}
