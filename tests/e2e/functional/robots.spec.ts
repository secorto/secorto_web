import { test, expect } from '@playwright/test'

test.describe('robots.txt endpoint', () => {
  test('responds with plain text content type', async ({ request }) => {
    const response = await request.get('/robots.txt')

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/plain')
  })

  test('contains User-agent and Allow directives', async ({ request }) => {
    const response = await request.get('/robots.txt')
    const body = await response.text()

    expect(body).toContain('User-agent: *')
    expect(body).toContain('Allow: /')
  })

  test('contains Sitemap URL', async ({ request }) => {
    const response = await request.get('/robots.txt')
    const body = await response.text()

    expect(body).toMatch(/Sitemap:\s+https?:\/\/.+\/sitemap-index\.xml/)
  })
})
