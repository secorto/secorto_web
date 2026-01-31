import { test, expect } from '@playwright/test'
import { checkA11y } from '@tests/actions/A11yActions'
import { getSectionRoute } from '@config/sections'

const locales = ['es', 'en'] as const

test.describe('A11y - Charlas', () => {
  locales.forEach((locale) => {
    test(`charla list a11y (${locale})`, async ({ page }) => {
      const route = getSectionRoute('talk', locale)
      await page.goto(`/${route}`)
      const listingResults = await checkA11y(page)
      expect(listingResults.violations).toEqual([])
    })

    test(`charla tag a11y (${locale})`, async ({ page }) => {
      const talksRoute = getSectionRoute('talk', locale)
      const talksTagRoute = `${talksRoute}/tags/containers`
      await page.goto(talksTagRoute)

      const tagResults = await checkA11y(page)
      expect(tagResults.violations).toEqual([])
    })

    test(`charla detail a11y (${locale})`, async ({ page }) => {
      const postSlug = '2023-09-27-devcontainers'
      const talksRoute = getSectionRoute('talk', locale)
      const talksPostRoute = `${talksRoute}/${postSlug}`
      await page.goto(talksPostRoute)
      const detailResults = await checkA11y(page, [
        '[data-testid="post-video"]',
        '[data-testid="post-slide"]',
        '[data-testid="comments-section"]'
      ])
      expect(detailResults.violations).toEqual([])
    })
  })
})
