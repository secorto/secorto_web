import type { UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import type { SidebarPage } from '@tests/pages/SidebarPage'
import { sidebarPage } from '@tests/pages/SidebarPage'
import { target } from '@tests/pages/Target'
import type { Target as TargetComponent } from '@tests/pages/Target'
import { Act } from '@tests/fixtures'
import { visit } from '@tests/pages/UserJourneyFactory'
import { pageHelper } from '@tests/pages/Page'
import type { PageHelper } from '@tests/pages/Page'

export class ColorSwitchUserJourney {
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
}

function colorSwitchJourney(page: Page) {
  return new ColorSwitchUserJourney(
    sidebarPage(page),
    target(page.locator('html')),
    pageHelper(page),
  )
}

export const userInHome = (page: Page, locale: UILanguages) =>
  visit(`a user opening home in ${locale} for color switch`, page, `/${locale}/`, colorSwitchJourney)

export const userInHomeWithStorageTheme = (page: Page, locale: UILanguages, theme: string) =>
  visit(
    `a user in ${locale} with storage theme ${String(theme)}`,
    page,
    `/${locale}/`,
    colorSwitchJourney,
    async (p) => await Act(pageHelper(p).injectStorageEntries({ theme })),
  )
