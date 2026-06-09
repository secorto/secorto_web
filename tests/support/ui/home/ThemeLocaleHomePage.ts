import type { UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import type { SidebarPage } from '@tests/support/ui/sidebar/SidebarPage'
import { sidebarPage } from '@tests/support/ui/sidebar/SidebarPage'
import { target } from '@tests/support/ui/components/Target'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'
import { homePath, visit } from '@tests/support/ui/shared/NavigationPaths'

export class ThemeLocaleHomePage {
  constructor(
    readonly sidebar: SidebarPage,
    readonly themeElement: TargetComponent,
  ) {}

  shouldHaveTheme(theme: string) {
    const re = new RegExp(`\\b${String(theme)}\\b`)
    return this.themeElement.shouldHaveClass(re)
  }

  toggleTheme() {
    return this.sidebar.toggleTheme()
  }

  getTransformOfThemeToggle() {
    return this.sidebar.getTransformOfThemeToggle()
  }

  themeToggleShouldBeDifferent(initialTransform: string) {
    return this.sidebar.themeToggleShouldBeDifferent(initialTransform)
  }

  shouldHaveLang(expected: string) {
    return this.themeElement.shouldHaveAttribute('lang', expected)
  }
}

function themeLocaleHomePage(page: Page) {
  return new ThemeLocaleHomePage(
    sidebarPage(page),
    target('html root', page.locator('html')),
  )
}

export const userInHome = (
  page: Page,
  locale: UILanguages,
  preAct?: (page: Page) => Promise<void> | void,
) =>
  visit(
    `a user opening home in ${locale} for theme/locale`,
    page,
    homePath(locale),
    themeLocaleHomePage,
    preAct
  )
