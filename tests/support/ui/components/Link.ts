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

  linksMatchPattern(pattern: RegExp) {
    return step(`${this.name} all links match pattern`, async ({ expect }) => {
      const links = await this.locator.evaluateAll(nodes =>
        nodes.map(n => n.getAttribute('href'))
      )

      expect(links.length).toBeGreaterThan(0)

      links.forEach(async (href, i) => {
        await step(`link ${href} href matches pattern ${pattern}`, async () => {
          expect(href, `Item ${i} has no href`).toBeTruthy()
          expect(href!, `Item ${i} href mismatch`).toMatch(pattern)
        })
      })
    })
  }
}

export function link(name: string, locator: Locator) {
  return new Link(name, locator)
}
