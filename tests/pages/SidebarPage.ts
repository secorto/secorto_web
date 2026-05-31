import type { Page, Locator } from '@playwright/test'
import { step } from '@tests/fixtures'

export class SidebarPage {
  constructor(
    readonly page: Page,
    readonly hamburger: Locator,
    readonly sidebarTitle: Locator,
    readonly themeToggle: Locator,
    readonly aboutLink: Locator,
  ) {}

  shouldBeReady() {
    return step('sidebar should be ready', async (expect) => {
      await expect(this.sidebarTitle).toBeVisible()
      await expect(this.hamburger).toBeVisible()
    })
  }

  shouldHaveAboutLink(i18n: Record<string, string>) {
    return step('sidebar shows about link text', async (expect) => {
      await expect(this.aboutLink).toBeVisible()
      await expect(this.aboutLink).toHaveText(i18n['nav.about'])
    })
  }

  shouldHaveThemeToggle() {
    return step('sidebar has theme toggle', async (expect) => {
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
    return step('theme toggle icon transform should be changed', async (expect) => {
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
    page.getByTestId('sidebar-title'),
    page.getByTestId('theme-toggle'),
    page.getByTestId('sidebar-about'),
  )
}
