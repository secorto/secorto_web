import { test, expect } from '@playwright/test'
import { checkA11y } from '@tests/actions/A11yActions'
import { getURLForSection } from '@config/sections'
import { languageKeys } from '@i18n/ui'


test.describe('A11y - Charlas', () => {
  languageKeys.forEach((locale) => {
    test(`charla list a11y (${locale})`, async ({ page }) => {
      await page.goto(getURLForSection('talk', locale))
      const listingResults = await checkA11y()({page})
      expect(listingResults.violations).toEqual([])
    })

    test(`charla tag a11y (${locale})`, async ({ page }) => {
      const talksTagRoute = `${getURLForSection('talk', locale)}/tags/containers`
      await page.goto(talksTagRoute)

      const tagResults = await checkA11y()({page})
      expect(tagResults.violations).toEqual([])
    })

    test(`charla detail a11y (${locale})`, async ({ page }) => {
      const postSlug = '2023-09-27-devcontainers'
      const talksRoute = getURLForSection('talk', locale)
      const talksPostRoute = `${talksRoute}/${postSlug}`
      await page.goto(talksPostRoute)
      const detailResults = await checkA11y([
        '[data-testid="post-video"]',
        '[data-testid="post-slide"]',
        '[data-testid="comments-section"]'
      ])({page})
      expect(detailResults.violations).toEqual([])
    })
  })
})
