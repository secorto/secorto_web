import { test } from '@tests/fixtures'
import type { GherkinStepDefinition } from '@tests/fixtures'
import { createRobotsUserJourney, type RobotsJourney } from '@tests/pages/functional/RobotsUserJourney'
import type { APIRequestContext } from '@playwright/test'

test.describe('robots.txt endpoint', () => {
  let userRequestRobots: (path?: string) => GherkinStepDefinition<RobotsJourney>

  test.beforeEach(async ({ request }) => {
    const req = request as APIRequestContext
    userRequestRobots = createRobotsUserJourney(req)
  })

  test('responds with plain text content type', async ({ Given, Then }) => {
    const r = await Given(userRequestRobots())
    await Then(r.shouldHavePlainText())
  })

  test('contains User-agent and Allow directives', async ({ Given, Then }) => {
    const r = await Given(userRequestRobots())
    await Then(r.shouldContainUserAgentAndAllow())
  })

  test('contains Sitemap URL', async ({ Given, Then }) => {
    const r = await Given(userRequestRobots())
    await Then(r.shouldContainSitemapUrl())
  })
})
