import { test } from '@playwright/test'
import { getRobots } from '@tests/pages/api/RobotsApiResponse'

test.describe('robots.txt endpoint', { tag: ['@api', '@robots', '@functional'] }, () => {
  test('responds with plain text content type', async ({ request }) => {
    const response = await getRobots(request)
    await response.shouldHavePlainText()
  })

  test('contains User-agent and Allow directives', async ({ request }) => {
    const response = await getRobots(request)
    await response.shouldContainUserAgentAndAllow()
  })

  test('contains Sitemap URL', async ({ request }) => {
    const response = await getRobots(request)
    await response.shouldContainSitemapUrl()
  })
})
