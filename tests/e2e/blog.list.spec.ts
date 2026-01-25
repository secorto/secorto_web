import { test, expect } from '@playwright/test'
import { BlogPage } from '../../tests/pages/BlogPage'

const listFixtures = [
  { locale: 'es', path: '/es/blog', pythonTag: 'python' },
  { locale: 'en', path: '/en/blog', pythonTag: 'python' }
]

for (const f of listFixtures) {
  test.describe(`Blog list (${f.locale})`, () => {
    test.beforeEach(async ({ page }) => {
      const blog = new BlogPage(page)
      await blog.gotoList(f.path)
    })

    test('shows page title and header', async ({ page }) => {
      const blog = new BlogPage(page)
      await expect(page).toHaveTitle('Blog | SeCOrTo')
      await expect(blog.headerTitle()).toHaveText('Blog')
    })

    test('category navigation toggles active and updates header', async ({ page }) => {
      const blog = new BlogPage(page)
      const tag = blog.tagLink(f.pythonTag)
      await expect(tag).not.toHaveClass(/active/)
      await tag.click()
      await page.waitForURL(new RegExp(`${f.locale}/blog/tags/${f.pythonTag}`));
      await expect(blog.tagLink(f.pythonTag)).toHaveClass(/active/)
      await expect(blog.headerTitle()).toHaveText('Blog - python')
    })
  })
}
