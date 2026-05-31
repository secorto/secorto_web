import { test } from '@tests/fixtures'
import type { StepDefinition } from '@tests/fixtures'
import { ui, languageKeys } from '@i18n/ui'
import { HomePage, userInHome } from '@tests/pages/HomePage'
import { sectionsConfig } from '@domain/section'

for (const locale of languageKeys) {
  test.describe(`Homepage (${locale})`,
    { tag: ['@homepage', '@smoke'] },
    () => {
      let userInHomeForLocale: () => StepDefinition<HomePage>

      test.beforeEach(async ({ page }) => {
        userInHomeForLocale = () => userInHome(page, locale)
      })

      test('renders bio, avatar and highlights', async ({ When, Then, And }) => {
        const home = await When(userInHomeForLocale())
        await Then(home.shouldHaveAvatar())
        await And(home.shouldHaveBioText())
      })

      test('PyBAQ callout uses i18n strings', async ({ When, Then }) => {
        const home = await When(userInHomeForLocale())
        await Then(home.shouldHavePyBAQ(ui[locale]))
      })

      test('highlights hrefs match routes', async ({ When, Then, And }) => {
        const home = await When(userInHomeForLocale())
        const blogRoute = sectionsConfig.blog.routes[locale]
        const talkRoute = sectionsConfig.talk.routes[locale]
        await Then(home.blogHrefMatches(locale, blogRoute))
        await And(home.talkHrefMatches(locale, talkRoute))
      })

      test('title and about link are correct (smoke)', async ({ When, Then, And }) => {
        const home = await When(userInHomeForLocale())
        await Then(home.shouldHaveTitle())
        await And(home.shouldHaveAboutLink(ui[locale]))
      })
    })
}
