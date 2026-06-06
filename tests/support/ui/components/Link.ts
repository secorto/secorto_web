import type { Locator } from '@playwright/test'
import { step } from '@tests/fixtures'
import { Target } from '@tests/support/ui/components/Target'

export class Link extends Target {
  constructor(name: string, locator: Locator) {
    super(name, locator)
  }

  click() {
    return step(`click ${this.name}`, async ({ expect }) => {
      await expect(this.locator).toBeVisible()
      await this.locator.click()
    })
  }

  hrefMatches(locale: string, route: string) {
    return step(`${this.name} href matches route`, async ({ expect }) => {
      const el = this.locator
      await expect(el).toBeVisible()
      const href = await el.getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).toMatch(new RegExp(`^.*\\/${locale}\\/${route}\\/`))
    })
  }

  hrefMatchesPattern(pattern: RegExp) {
    return step(`${this.name} href matches pattern`, async ({ expect }) => {
      await expect(this.locator).toBeVisible()
      const href = await this.locator.getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).toMatch(pattern)
    })
  }
}

export function link(name: string, locator: Locator) {
  return new Link(name, locator)
}
