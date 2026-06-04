import type { UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import { targetSelector } from '@tests/pages/components/Target'
import { step } from '@tests/fixtures'
import { homePath, visit } from '../shared/NavigationPaths'

export class LangSwitchHomePage {
  constructor(
    readonly page: Page,
    readonly langLinks: ReturnType<typeof targetSelector<UILanguages>>,
  ) {}

  shouldHaveLanguageOption(locale: UILanguages) {
    return this.langLinks.get(locale).shouldBeVisible()
  }

  switchTo(locale: UILanguages) {
    return step(`switch language to ${locale}`, async () => {
      await this.langLinks.get(locale).locator.click()
    })
  }

  shouldBeInLocale(locale: UILanguages) {
    return step(`url should be in locale ${locale}`, async ({ expect }) => {
      await expect(this.page).toHaveURL(new RegExp(`/${locale}(/|$)`))
    })
  }
}

export const userInHome = (page: Page, locale: UILanguages) =>
  visit(
    `a user in ${locale} home for language switch`,
    page,
    homePath(locale),
    (p) => new LangSwitchHomePage(
      p,
      targetSelector('language link', (lang: UILanguages) => p.getByTestId(`lang-${lang}`)),
    ),
  )
