import { test, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'
import { ContentListPage } from '../../pages/ContentListPage'

const locales = ['es', 'en'] as const

test.describe('A11y - Charlas', () => {
  locales.forEach((locale) => {
    test(`charla list / tag / detail a11y (${locale})`, async ({ page }) => {
      const list = new ContentListPage(page)
      await list.goto(locale, 'talk')

      // Run axe on listing page
      const listingResults = await new AxeBuilder({ page }).analyze()
      expect(listingResults.violations).toEqual([])

      // Run axe after clicking a tag
      const containersTag = list.tagLink('containers')
      await containersTag.click()
      const tagResults = await new AxeBuilder({ page }).analyze()
      expect(tagResults.violations).toEqual([])

      // Run axe on a detail page
      await list.openItem(locale, 'talk', '2023-09-27-devcontainers')
      const detailResults = await new AxeBuilder({ page }).analyze()
      expect(detailResults.violations).toEqual([])
    })
  })
})
