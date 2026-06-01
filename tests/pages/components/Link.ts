import type { Locator } from '@playwright/test'
import { step } from '@tests/fixtures'

export class Link {
  constructor(readonly locator: Locator) {}

  hrefMatches(locale: string, route: string) {
    return step('link href matches route', async ({ expect }) => {
      const el = this.locator
      await expect(el).toBeVisible()
      const href = await el.getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).toMatch(new RegExp(`^.*\\/${locale}\\/${route}\\/`))
    })
  }
}

export function link(locator: Locator) {
  return new Link(locator)
}
