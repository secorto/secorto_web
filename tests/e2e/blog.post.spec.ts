import { test, expect } from '@playwright/test'
import { BlogPage } from '../../tests/pages/BlogPage'

const postFixtures = [
  {
    locale: 'es',
    listPath: '/es/blog',
    postHref: '/es/blog/2022-07-11-intro-python',
    postTitle: 'Introducción a python'
  },
  {
    locale: 'en',
    listPath: '/en/blog',
    postHref: '/en/blog/2022-07-11-intro-python',
    postTitle: 'Introduction to Python'
  }
]

for (const f of postFixtures) {
  test.describe(`Blog post (${f.locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 480, height: 800 })
      const blog = new BlogPage(page)
      await blog.gotoList(f.listPath)
      await blog.openPost(f.postHref, f.locale)
      await expect(blog.headerTitle()).toBeVisible()
    })

    test('shows post title', async ({ page }) => {
      const blog = new BlogPage(page)
      await expect(blog.headerTitle()).toHaveText(f.postTitle)
    })

    test('no horizontal scroll on mobile', async ({ page }, testInfo) => {
      const { assertNoHorizontalOverflow } = await import('../../tests/utils/layout')
      await assertNoHorizontalOverflow(page, testInfo, f.locale)
    })
  })
}
