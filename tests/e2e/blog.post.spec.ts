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
      const blog = new BlogPage(page)
      await blog.gotoList(f.listPath)
      await blog.openPost(f.postHref, f.locale)
      await expect(blog.headerTitle()).toBeVisible()
    })

    test('shows post title', async ({ page }) => {
      const blog = new BlogPage(page)
      await expect(blog.headerTitle()).toHaveText(f.postTitle)
    })

    test('no horizontal scroll on mobile', async ({ page }) => {
      const blog = new BlogPage(page)
      await page.setViewportSize({ width: 600, height: 800 })
      await page.evaluate(() => window.scrollTo(document.body.scrollWidth, 0))
      const scrollX = await page.evaluate(() => window.scrollX)
      expect(scrollX).toBe(0)
    })
  })
}
