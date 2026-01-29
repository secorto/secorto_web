import { test, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'
import { ContentListPage } from '../../pages/ContentListPage'
import { ui } from '@i18n/ui'

const locales = ['es', 'en'] as const

const contentTranslations= {
  en: {
    tagTitle: 'Talks - containers',
    postTitle: 'Devcontainers on localhost'
  },
  es: {
    tagTitle: 'Charlas - containers',
    postTitle: 'Devcontainers en localhost'
  }
}

test.describe('A11y - Charlas', () => {
  locales.forEach((locale) => {
    test(`charla list / tag / detail a11y (${locale})`, async ({ page }) => {
      const postSlug = '2023-09-27-devcontainers'
      const {pattern, href} = new ContentListPage(page).getItemPath(locale, 'talk', postSlug)
      const {href: tagLink} = new ContentListPage(page).getItemPath(locale, 'talk', 'tags/containers')
      const list = new ContentListPage(page)
      await list.goto(locale, 'talk')
      // ensure the page is loaded
      await page.waitForURL(new RegExp(pattern))
      await expect(list.headerTitle()).toHaveText(ui[locale]['nav.talks'])

      // Run axe on listing page
      const listingResults = await new AxeBuilder({ page })
        .exclude('[data-netlify-deploy-id]')
        .analyze()
      expect(listingResults.violations).toEqual([])

      // Run axe after clicking a tag
      const containersTag = list.tagLink('containers')
      await containersTag.click()
      await page.waitForURL(new RegExp(tagLink))
      await expect(list.headerTitle()).toHaveText(contentTranslations[locale].tagTitle)

      const tagResults = await new AxeBuilder({ page })
        .exclude('[data-netlify-deploy-id]')
        .analyze()
      expect(tagResults.violations).toEqual([])

      // Run axe on a detail page
      await list.openItem(locale, 'talk', postSlug)
      await page.waitForURL(new RegExp(href))
      await expect(page.locator('header h1')).toHaveText(contentTranslations[locale].postTitle)
      const detailResults = await new AxeBuilder({ page })
        .exclude('[data-netlify-deploy-id]')
        .exclude('[data-testid="post-video"]')
        .exclude('[data-testid="comments-section"]')
        .analyze()
      expect(detailResults.violations).toEqual([])
    })
  })
})
