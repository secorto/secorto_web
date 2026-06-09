import { step } from '@tests/fixtures'
import { expect } from '@playwright/test'
import type { APIRequestContext, APIResponse } from '@playwright/test'

export class RobotsApiResponse {
  constructor(
    public readonly response: APIResponse,
    public readonly body: string
  ) {}

  shouldHavePlainText() {
    return step('responds with plain text content type', async () => {
      expect(this.response.status()).toBe(200)
      expect(this.response.headers()['content-type']).toContain('text/plain')
    })
  }

  shouldContainUserAgentAndAllow() {
    return step('contains User-agent and Allow', async () => {
      expect(this.body).toContain('User-agent: *')
      expect(this.body).toContain('Allow: /')
    })
  }

  shouldContainSitemapUrl() {
    return step('contains Sitemap URL', async () => {
      expect(this.body).toMatch(/Sitemap:\s+https?:\/\/.+\/sitemap-index\.xml/)
    })
  }
}

export const getRobots = async (request: APIRequestContext) => {
  const target = '/robots.txt'

  return step(`request ${target}`, async () => {
    const response = await request.get(target)
    const body = await response.text()

    return new RobotsApiResponse(response, body)
  })
}
