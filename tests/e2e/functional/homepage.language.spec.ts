import { test } from '@tests/fixtures'
import type { UILanguages } from '@i18n/ui'
import { userInHome } from '@tests/support/ui/home/LangSwitchHomePage'

type LocaleSwitchFixture = {
  from: UILanguages
  to: UILanguages
}

const fixtures: LocaleSwitchFixture[] = [
  { from: 'es', to: 'en' },
  { from: 'en', to: 'es' },
]

test.describe('Homepage language switch', { tag: ['@functional', '@i18n', '@home'] }, () => {
  for (const f of fixtures) {
    test(`switch from ${f.from} to ${f.to} via UI`, { tag: [`@${f.from}`, `@${f.to}`] }, async ({ page }) => {
      const homePage = await userInHome(page, f.from)
      await homePage.shouldHaveLanguageOption(f.to)
      await homePage.switchTo(f.to)
      await homePage.shouldBeInLocale(f.to)
    })
  }
})

