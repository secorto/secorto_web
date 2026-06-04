import type { UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import type { SidebarPage } from '@tests/pages/sidebar/SidebarPage'
import { sidebarPage } from '@tests/pages/sidebar/SidebarPage'
import { target } from '@tests/pages/components/Target'
import type { Target as TargetComponent } from '@tests/pages/components/Target'
import { visit } from '@tests/pages/shared/UserJourneyFactory'
import { pageHelper } from '@tests/pages/components/PageHelper'
import type { PageHelper } from '@tests/pages/components/PageHelper'
import { homePath } from '../shared/NavigationPaths'

export class ThemeLocaleHomePage {
  constructor(
    readonly sidebar: SidebarPage,
    readonly themeElement: TargetComponent,
    readonly page: PageHelper,
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

  shouldHaveThemeStorage(theme: string) {
    return this.page.shouldHaveLocalStorage('theme', theme)
  }

  shouldHaveLang(expected: string) {
    return this.themeElement.shouldHaveAttribute('lang', expected)
  }
}

function themeLocaleHomePage(page: Page) {
  return new ThemeLocaleHomePage(
    sidebarPage(page),
    target('html root', page.locator('html')),
    pageHelper(page),
  )
}

export const userInHome = (
  page: Page,
  locale: UILanguages,
  options?: { theme?: string }
) =>
  visit(
    `a user opening home in ${locale} for theme/locale`,
    page,
    homePath(locale),
    themeLocaleHomePage,
    async (p) => {
      if (options?.theme !== undefined) {
        await pageHelper(p).injectStorageEntries({ theme: options.theme })
      }
    },
  )
