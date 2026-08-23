import { test } from '@playwright/test'
import { robots, shouldBeLoaded } from '@tests/support/api/endpoints/robots'

test.describe('robots.txt endpoint', { tag: ['@robots', '@functional'] }, () => {
  test('robots.txt is loaded and valid', async ({ request }) => {
    const { raw: response, parsed: body } = await robots(request).detailed()

    await shouldBeLoaded(response, body).soft()
  })
})
