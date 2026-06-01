import { test, step } from '@tests/fixtures'
import type { GherkinStepDefinition } from '@tests/fixtures'

test.describe('robots.txt endpoint', () => {
  let userRequestRobots: (path?: string) => GherkinStepDefinition<any>

  test.beforeEach(async ({ request }) => {
    userRequestRobots = (path = '/robots.txt') =>
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
