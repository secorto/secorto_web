import type { UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import type { SidebarPage } from '@tests/pages/SidebarPage'
import { sidebarPage } from '@tests/pages/SidebarPage'
import { target } from '@tests/pages/Target'
import type { Target as TargetComponent } from '@tests/pages/Target'
import { homeHighlights } from '@tests/pages/HomeHighlights'
import type { HomeHighlights as HomeHighlightsComponent } from '@tests/pages/HomeHighlights'
import { Act, step, Verify } from '@tests/fixtures'
import { mockThirdParty } from '@tests/e2e/helpers/mockThirdParty'
import { pageHelper } from '@tests/pages/Page'
import type { PageHelper } from '@tests/pages/Page'

export class HomePage {
  constructor(
    readonly pageHelper: PageHelper,
    readonly sidebar: SidebarPage,
    readonly headerTitle: TargetComponent,
    readonly avatar: TargetComponent,
    readonly bioText: TargetComponent,
    readonly homeHighlights: HomeHighlightsComponent,
    readonly themeElement: TargetComponent
  ) {}

  shouldHaveAvatar() {
    return this.avatar.shouldBeVisible()
  }

  shouldHaveBioText() {
    return this.bioText.shouldBeVisible()
  }

  shouldHavePyBAQ(i18n: Record<string, string>) {
    return this.homeHighlights.pybaq.shouldHavePyBAQ(i18n)
  }

  shouldHaveTitle() {
    return step('page and header have a title', async ({ expect }) => {
      await this.pageHelper.shouldHaveTitle()
      await expect(this.headerTitle.locator).toBeVisible()
      await expect(this.headerTitle.locator).toHaveText(/\S+/)
    })
  }

  blogHrefMatches(locale: string, blogRoute: string) {
    return this.homeHighlights.blog.hrefMatches(locale, blogRoute)
  }

  talkHrefMatches(locale: string, talkRoute: string) {
    return this.homeHighlights.talk.hrefMatches(locale, talkRoute)
  }

  shouldHaveAboutLink(i18n: Record<string, string>) {
    return this.sidebar.shouldHaveAboutLink(i18n)
  }

  toggleTheme() {
    return this.sidebar.toggleTheme()
  }

  shouldHaveTheme(theme: string) {
    const re = new RegExp(`\\b${String(theme)}\\b`)
    return this.themeElement.shouldHaveClass(re)
  }

  shouldHaveThemeStorage(theme: string) {
    return this.pageHelper.shouldHaveLocalStorage('theme', theme)
  }

  getTransformOfThemeToggle() {
    return this.sidebar.getTransformOfThemeToggle()
  }

  themeToggleShouldBeDifferent(initialTransform: string) {
    return this.sidebar.themeToggleShouldBeDifferent(initialTransform)
  }
}

export function homePage(page: Page) {
  return new HomePage(
    pageHelper(page),
    sidebarPage(page),
    target(page.getByRole('heading', { level: 1 })),
    target(page.locator('.home-avatar svg')),
    target(page.locator('.home-bio-text')),
    homeHighlights(page.locator('.highlights')),
    target(page.locator('html'))
  )
}

export const userInHome = (page: Page, locale: UILanguages) => step(`a user in ${locale}`, async () => {
  const home = homePage(page)
  await page.goto(`/${locale}/`)
  await mockThirdParty(page)
  return home
})

export const userInHomeWithStorageTheme = (page: Page, locale: UILanguages, theme: string) =>
  step(`a user in ${locale} with storage theme ${String(theme)}`, async () => {
    await Act(pageHelper(page).injectStorageEntries({ theme }))
    const home = await Act(userInHome(page, locale))
    await Verify(home.shouldHaveTheme(theme))
    return home
  })
