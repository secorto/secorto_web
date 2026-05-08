import { test, expect } from '@playwright/test'
import { ui, languageKeys } from '@i18n/ui'
import { HomePage } from '@tests/pages/HomePage'
import { sectionsConfig } from '@domain/section'

for (const locale of languageKeys) {
  test.describe(`@homepage Homepage (${locale})`, () => {
    let home: HomePage

    test.beforeEach(async ({ page }) => {
      home = new HomePage(page)
      await page.goto(locale)
    })

    test('renders bio, avatar and highlights', async () => {
      await expect(home.avatar()).toBeVisible()
      await expect(home.bioText()).toBeVisible()

      const header = home.headerTitle()
      await expect(header).toBeVisible()
      await expect(header).toHaveText(/\S+/)

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

    test('blog highlight navigates to a blog post', async ({ page }) => {
      const blog = home.blogHighlight()
      await expect(blog).toBeVisible()
      const blogHref = await blog.getAttribute('href')
      expect(blogHref).toBeTruthy()
      await page.goto(blogHref!)
      const blogRoute = sectionsConfig.blog.routes[locale]
      await expect(page).toHaveURL(new RegExp(`^.*\\/${locale}\\\/${blogRoute}\\\/`))
    })

    test('talk highlight navigates to a talk post', async ({ page }) => {
      const talk = home.talkHighlight()
      await expect(talk).toBeVisible()
      const talkHref = await talk.getAttribute('href')
      expect(talkHref).toBeTruthy()
      await page.goto(talkHref!)
      const talkRoute = sectionsConfig.talk.routes[locale]
      await expect(page).toHaveURL(new RegExp(`^.*\\/${locale}\\\/${talkRoute}\\\/`))
    })
  })
}
