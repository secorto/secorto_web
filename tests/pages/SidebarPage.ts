import type { Page, Locator } from '@playwright/test'
import { step } from '@tests/fixtures'

export class SidebarPage {
  constructor(
    readonly page: Page,
    readonly hamburger: Locator,
    readonly sidebar: Locator,
    readonly sidebarTitle: Locator,
    readonly themeToggle: Locator,
    readonly aboutLink: Locator,
  ) {}

  shouldHaveHamburgerButton() {
    return step('hamburger button is visible', async ({ expect }) => {
      await expect(this.hamburger).toBeVisible()
    })
  }

  toggleSidebar() {
    return step('toggle sidebar from hamburger', async () => {
      await this.hamburger.click()
    })
  }

  shouldHaveSidebarOpen() {
    return step('sidebar should be open', async ({ expect }) => {
      await expect(this.sidebar).toHaveClass(/sidebar-open/)
    })
  }

  shouldHaveSidebarClosed() {
    return step('sidebar should be closed', async ({ expect }) => {
      await expect(this.sidebar).not.toHaveClass(/sidebar-open/)
    })
  }

  shouldHaveHamburgerOpenState() {
    return step('hamburger should have open state class', async ({ expect }) => {
      await expect(this.hamburger).toHaveClass(/sidebar-open/)
    })
  }

  shouldHaveHamburgerClosedState() {
    return step('hamburger should not have open state class', async ({ expect }) => {
      await expect(this.hamburger).not.toHaveClass(/sidebar-open/)
    })
  }

  shouldShowNavigationLinks() {
    return step('sidebar shows navigation links', async ({ expect }) => {
      await expect(this.sidebarTitle).toBeVisible()
    })
  }

  shouldBeReady() {
    return step('sidebar should be ready', async ({ expect }) => {
      await expect(this.sidebarTitle).toBeVisible()
      await expect(this.hamburger).toBeVisible()
    })
  }

  shouldHaveAboutLink(i18n: Record<string, string>) {
    return step('sidebar shows about link text', async ({ expect }) => {
      await expect(this.aboutLink).toBeVisible()
      await expect(this.aboutLink).toHaveText(i18n['nav.about'])
    })
  }

  shouldHaveThemeToggle() {
    return step('sidebar has theme toggle', async ({ expect }) => {
      await expect(this.themeToggle).toBeVisible()
    })
  }

  toggleTheme() {
    return step('toggle theme', async () => {
      await this.themeToggle.click()
    })
  }

  getTransformOfThemeToggle() {
    return step('get transform of theme toggle circle', async () => {
      const themeCircle = this.themeToggle.locator('svg circle')
      return await themeCircle.evaluate((el: Element) => getComputedStyle(el).transform)
    })
  }

  themeToggleShouldBeDifferent(initialTransform: string) {
    return step('theme toggle icon transform should be changed', async ({ expect }) => {
      const themeCircle = this.themeToggle.locator('svg circle')
      await expect.poll(async () => {
        return await themeCircle.evaluate((el: Element) => getComputedStyle(el).transform)
      }, { timeout: 2000, intervals: [100] }).not.toBe(initialTransform)
    })
  }
}

export function sidebarPage(page: Page) {
  return new SidebarPage(
    page,
    page.getByTestId('hamburger'),
    page.locator('.sidebar-toggle'),
    page.getByTestId('sidebar-title'),
    page.getByTestId('theme-toggle'),
    page.getByTestId('sidebar-about'),
  )
}
