import { step } from '@tests/fixtures'
import type { APIRequestContext, APIResponse } from '@playwright/test'

export class RobotsJourney {
  constructor(
    public readonly response: APIResponse,
    public readonly body: string
  ) {}

  shouldHavePlainText() {
    return step('responds with plain text content type', async ({ expect }) => {
      expect(this.response.status()).toBe(200)
      expect(this.response.headers()['content-type']).toContain('text/plain')
    })
  }

  shouldContainUserAgentAndAllow() {
    return step('contains User-agent and Allow', async ({ expect }) => {
      expect(this.body).toContain('User-agent: *')
      expect(this.body).toContain('Allow: /')
    })
  }

  shouldContainSitemapUrl() {
    return step('contains Sitemap URL', async ({ expect }) => {
      expect(this.body).toMatch(/Sitemap:\s+https?:\/\/.+\/sitemap-index\.xml/)
    })
  }
}

export const createRobotsUserJourney = (request: APIRequestContext) => {
  return (path = '/robots.txt') =>
    step(`a client requests ${path}`, async () => {
      const response = await request.get(path)
      const body = await response.text()

      return new RobotsJourney(response, body)
    })
}

export const userReadsRobots = createRobotsUserJourney
