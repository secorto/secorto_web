import { test, expect } from '@playwright/test'
import { BlogPage } from '@tests/pages/BlogPage'
import { getURLForSection } from '@config/sections'
import { type UILanguages } from '@i18n/ui'

const listFixtures = [
  { locale: 'es', pythonTag: 'python' },
  { locale: 'en', pythonTag: 'python' }
]

for (const f of listFixtures) {
  test.describe(`Blog list (${f.locale})`, () => {
    test.beforeEach(async ({ page }) => {
      const blog = new BlogPage(page)
      await page.goto(getURLForSection('blog', f.locale as UILanguages))
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
