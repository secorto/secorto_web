import { test } from '@playwright/test'
import { sitemap } from '@tests/support/api/endpoints/sitemap'

test.describe('Sitemap XML with hreflang', () => {
  test('should include locale paths', async ({ request }) => {
    const result = await sitemap(request)

    await result.shouldIncludeLocales()
  })

  test('should include section listing pages with hreflang alternates', async ({ request }) => {
    const result = await sitemap(request)

    await result.shouldHaveHreflangAlternates([
      {
        paths: ['/en/blog', '/es/blog'],
        locales: ['en', 'es', 'x-default'],
      },
      {
        paths: ['/en/talk', '/es/charla'],
        locales: ['en', 'es', 'x-default'],
      },
    ])
  })
})
