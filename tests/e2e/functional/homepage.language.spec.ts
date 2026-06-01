import { test } from '@tests/fixtures'
import type { UILanguages } from '@i18n/ui'
import { userInHome } from '@tests/pages/home/HomeLanguageUserJourney'

type LocaleSwitchFixture = {
  from: UILanguages
  to: UILanguages
}

const fixtures: LocaleSwitchFixture[] = [
  { from: 'es', to: 'en' },
  { from: 'en', to: 'es' },
]

test.describe('Homepage language switch', { tag: ['@functional', '@i18n'] }, () => {
  for (const f of fixtures) {
    test(`switch from ${f.from} to ${f.to} via UI`, async ({ Given, When, Then, And, page }) => {
      const journey = await Given(userInHome(page, f.from))
      await And(journey.shouldHaveLanguageOption(f.to))
      await When(journey.switchTo(f.to))
      await Then(journey.shouldBeInLocale(f.to))
    })
  }
})

