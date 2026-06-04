import { test } from '@tests/fixtures'
import { ui, languageKeys } from '@i18n/ui'
import { HomeUserJourney, userInHome } from '@tests/pages/home/HomeUserJourney'
import { sectionsConfig } from '@domain/section'

for (const locale of languageKeys) {
  test.describe(`Homepage (${locale})`,
    { tag: ['@home', '@smoke', `@${locale}`] },
    () => {
      let userInHomeForLocale: () => Promise<HomeUserJourney>

      test.beforeEach(async ({ page }) => {
        userInHomeForLocale = () => userInHome(page, locale)
      })

      test('renders bio, avatar and highlights', async () => {
        const home = await userInHomeForLocale()
        await home.shouldHaveAvatar()
        await home.shouldHaveBioText()
      })

      test('PyBAQ callout uses i18n strings', async () => {
        const home = await userInHomeForLocale()
        await home.shouldHavePyBAQ(ui[locale])
      })

      test('highlights hrefs match routes', async () => {
        const home = await userInHomeForLocale()
        const blogRoute = sectionsConfig.blog.routes[locale]
        const talkRoute = sectionsConfig.talk.routes[locale]
        await home.blogHrefMatches(locale, blogRoute)
        await home.talkHrefMatches(locale, talkRoute)
      })

      test('title and about link are correct (smoke)', async () => {
        const home = await userInHomeForLocale()
        await home.shouldHaveTitle()
        await home.shouldHaveAboutLink(ui[locale])
      })
    })
}
