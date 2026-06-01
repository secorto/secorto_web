import { test } from '@tests/fixtures'
import { userInBlogPost } from '@tests/pages/content/BlogUserJourney'
import type { UILanguages } from '@i18n/ui'
import type { TestInfo } from '@playwright/test'

type PostFixture = { locale: UILanguages, slug: string, postTitle: string }

const postFixtures: PostFixture[] = [
  {
    locale: 'es',
    slug: '2022-07-11-intro-python',
    postTitle: 'Introducción a Python'
  },
  {
    locale: 'en',
    slug: '2022-07-11-intro-python',
    postTitle: 'Introduction to Python'
  }
]

for (const f of postFixtures) {
  test.describe(`Blog post (${f.locale})`, () => {
    test('shows post title', async ({ When, Then, page }) => {
      const journey = await When(userInBlogPost(page, f.locale, f.slug))
      await Then(journey.shouldHaveTitle(f.postTitle))
    })

    test('no horizontal scroll on mobile', async ({ When, Then, page }, testInfo: TestInfo) => {
      const journey = await When(userInBlogPost(page, f.locale, f.slug, { width: 480, height: 800 }))
      await Then(journey.assertNoHorizontalOverflow(testInfo, f.locale))
    })
  })
}
