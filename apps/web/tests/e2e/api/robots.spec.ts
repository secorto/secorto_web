import { test } from '@playwright/test'
import { robots } from '@tests/support/api/endpoints/robots'

test.describe('robots.txt endpoint', { tag: ['@robots', '@functional'] }, () => {
  test('robots.txt is loaded and valid', async ({ request }) => {
    const robotsTxt = await robots(request)

    await robotsTxt.shouldBeLoaded().soft()
  })
})
