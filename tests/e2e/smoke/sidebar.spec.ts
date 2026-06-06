import { test } from '@tests/fixtures'
import { languageKeys, ui } from '@i18n/ui'
import { userInHome } from '@tests/support/pages/sidebar/SidebarPage'


test.describe(`Homepage (sidebar)`,
  { tag: ['@home', '@smoke', '@sidebar'] },
  () => {
    test('smoke: sidebar muestra logo', { tag: ['@es'] }, async ({ page }) => {
      const home = await userInHome(page, 'es')
      await home.shouldHaveLogo()
    })

    for (const locale of languageKeys) {
      test(`title and about link are correct (smoke) - ${locale}`,
        { tag: [`@${locale}`] },
        async ({ page }) => {
          const home = await userInHome(page, locale)
          await home.shouldHaveAboutLink(ui[locale])
        })
    }
  })
