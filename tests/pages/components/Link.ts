import type { Locator } from '@playwright/test'
import { step } from '@tests/fixtures'

export class Link {
  constructor(readonly locator: Locator) {}

  click() {
    return step('click link', async ({ expect }) => {
      await expect(this.locator).toBeVisible()
      await this.locator.click()
    })
  }

  hrefMatches(locale: string, route: string) {
    return step('link href matches route', async ({ expect }) => {
      const el = this.locator
      await expect(el).toBeVisible()
      const href = await el.getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).toMatch(new RegExp(`^.*\\/${locale}\\/${route}\\/`))
    })
  }

  hrefMatchesPattern(pattern: RegExp) {
    return step('link href matches pattern', async ({ expect }) => {
      await expect(this.locator).toBeVisible()
      const href = await this.locator.getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).toMatch(pattern)
    })
  }
}

export function link(locator: Locator) {
  return new Link(locator)
}
