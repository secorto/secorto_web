import { test, expect } from '@playwright/test'
import { ui, languageKeys } from '@i18n/ui'
import { HomePage } from '../pages/HomePage'

for (const locale of languageKeys) {
  test.describe(`@homepage Homepage (${locale})`, () => {
    let home: HomePage

    test.beforeEach(async ({ page }) => {
      home = new HomePage(page)
      await home.goto(locale)
    })

    test('renders bio, avatar and highlights', async () => {
      await expect(home.avatar()).toBeVisible()
      await expect(home.bioText()).toBeVisible()

      const blog = home.blogHighlight()
      const talk = home.talkHighlight()

      await expect(blog).toBeVisible()
      await expect(talk).toBeVisible()
    })

    test('PyBAQ callout uses i18n strings', async () => {
      const callout = home.pybaq()
      await expect(callout).toBeVisible()
      await expect(callout.getByText(ui[locale]['home.pybaq_role'])).toBeVisible()
      await expect(callout.getByText(ui[locale]['home.pybaq_since'])).toBeVisible()
      await expect(callout.getByText(ui[locale]['home.pybaq_cta'])).toBeVisible()
    })

    test('first highlight link navigates to content', async ({ page }) => {
      const blog = home.blogHighlight()
      const talk = home.talkHighlight()

      if ((await blog.count()) > 0) {
        await expect(blog).toBeVisible()
        const href = await blog.getAttribute('href')
        expect(href).toBeTruthy()
        await page.goto(href || '/')
        await expect(page).not.toHaveURL(`/${locale}/`)
        return
      }

      if ((await talk.count()) > 0) {
        await expect(talk).toBeVisible()
        const href = await talk.getAttribute('href')
        expect(href).toBeTruthy()
        await page.goto(href || '/')
        await expect(page).not.toHaveURL(`/${locale}/`)
        return
      }

      throw new Error('No highlight cards found to navigate')
    })
  })
}
