import { test, expect } from '@playwright/test'
import { BlogPage } from '@tests/pages/BlogPage'
import { mockThirdParty } from '@tests/e2e/helpers/mockThirdParty'
import { openCollectionList, clickLinkItem } from '@tests/actions/ContentListActions'
import type { UILanguages } from '@i18n/ui'

type PostFixture = { locale: UILanguages, slug: string, postTitle: string }

const postFixtures: PostFixture[] = [
  {
    locale: 'es',
    slug: '2022-07-11-intro-python',
    postTitle: 'Introducción a python'
  },
  {
    locale: 'en',
    slug: '2022-07-11-intro-python',
    postTitle: 'Introduction to Python'
  }
]

for (const f of postFixtures) {
  test.describe(`Blog post (${f.locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await mockThirdParty(page)
      await page.setViewportSize({ width: 480, height: 800 })
      const blog = new BlogPage(page)
      await openCollectionList(page, f.locale, 'blog')
      await clickLinkItem(page, f.locale, 'blog', f.slug)
      await expect(blog.headerTitle()).toBeVisible()
    })

    test('shows post title', async ({ page }) => {
      const blog = new BlogPage(page)
      await expect(blog.headerTitle()).toHaveText(f.postTitle)
    })

    test('no horizontal scroll on mobile', async ({ page }, testInfo) => {
      const { assertNoHorizontalOverflow } = await import('@tests/utils/layout')
      await assertNoHorizontalOverflow(page, testInfo, f.locale)
    })
  })
}
