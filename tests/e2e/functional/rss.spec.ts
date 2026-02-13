import { test, expect } from '@playwright/test'

test.describe('RSS feed endpoint', () => {
  test('GET /rss.xml responds with XML content type', async ({ request }) => {
    const response = await request.get('/rss.xml')

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('xml')
  })

  test('RSS feed contains valid channel structure', async ({ request }) => {
    const response = await request.get('/rss.xml')
    const body = await response.text()

    expect(body).toContain('<rss')
    expect(body).toContain('<channel>')
    expect(body).toContain('<title>')
    expect(body).toContain('<description>')
    expect(body).toContain('<link>')
  })

  test('RSS feed contains at least one item', async ({ request }) => {
    const response = await request.get('/rss.xml')
    const body = await response.text()

    expect(body).toContain('<item>')
    expect(body).toContain('<title>')
    expect(body).toContain('<pubDate>')
  })

  test('RSS feed includes language customData', async ({ request }) => {
    const response = await request.get('/rss.xml')
    const body = await response.text()

    // Default lang is 'es', so /rss.xml produces es-co
    expect(body).toMatch(/<language>es-co<\/language>/)
  })
})
